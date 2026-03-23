"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  patientsTable,
  patientsToUsersTable,
  usersTable,
} from "@/src/db/schema";
import { getNextSequentialCode } from "@/src/lib/codes";
import { sendWelcomeEmail } from "@/src/lib/email";
import { generateAlphanumericPassword } from "@/src/lib/password";

import { upsertPatientSchema } from "./schema";

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (!session?.user.clinic?.id) {
      throw new Error("Clinic not found");
    }

    // Gerar ou buscar patientCode
    let patientCode: string;
    const clinicId = session.user.clinic?.id;
    
    if (!clinicId) {
      throw new Error("Clinic not found");
    }

    if (parsedInput.id) {
      // Se for atualização, buscar o código existente
      const patientId = parsedInput.id;
      const existingPatient = await db.query.patientsTable.findFirst({
        where: (patients, { eq }) => eq(patients.id, patientId),
        columns: { patientCode: true },
      });
      
      if (!existingPatient?.patientCode) {
        throw new Error("Patient code not found");
      }
      
      patientCode = existingPatient.patientCode;
    } else {
      // Se for novo paciente, gerar código sequencial
      const existingPatients = await db.query.patientsTable.findMany({
        where: (patients, { eq }) => eq(patients.clinicId, clinicId),
        columns: { patientCode: true },
      });

      // Encontrar o maior número
      const maxCode = existingPatients.reduce((max, patient) => {
        const num = parseInt(patient.patientCode, 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);

      patientCode = getNextSequentialCode(maxCode);
    }

    // Gerar patient_record_number se for novo paciente
    let patientRecordNumber: number | undefined;
    if (!parsedInput.id) {
      // Buscar o maior número de prontuário da clínica
      const existingPatients = await db.query.patientsTable.findMany({
        where: (patients, { eq }) => eq(patients.clinicId, clinicId),
        columns: { patientRecordNumber: true },
      });

      // Encontrar o maior número
      const maxRecordNumber = existingPatients.reduce((max, patient) => {
        const num = patient.patientRecordNumber;
        return num && num > max ? num : max;
      }, 0);

      // Próximo número sequencial
      patientRecordNumber = maxRecordNumber + 1;
    }

    const userId = session.user.id;
    const isUpdate = !!parsedInput.id;

    // Criar ou atualizar o paciente
    // Preparar dados com valores padrão para campos notNull que podem vir undefined
    const patientData = {
        ...parsedInput,
        id: parsedInput.id,
        clinicId: clinicId,
        patientCode,
        patientRecordNumber: patientRecordNumber,
      // Campos obrigatórios no banco que podem vir undefined do formulário
      email: parsedInput.email || "",
      phoneNumber: parsedInput.phoneNumber || "",
      sex: parsedInput.sex || "male",
      motherName: parsedInput.motherName || "",
      fatherName: parsedInput.fatherName || "",
      responsibleName: parsedInput.responsibleName || "",
      responsibleContact: parsedInput.responsibleContact || "",
      insuranceCard: parsedInput.insuranceCard || "",
      rg: parsedInput.rg || "",
      zipCode: parsedInput.zipCode || "",
      address: parsedInput.address || "",
      number: parsedInput.number || "",
      complement: parsedInput.complement || "",
      neighborhood: parsedInput.neighborhood || "",
      city: parsedInput.city || "",
      state: parsedInput.state || "",
        // Adicionar createdBy apenas se for criação (não update)
        ...(isUpdate ? {} : { createdBy: userId }),
        // Sempre adicionar updatedBy em updates
        ...(isUpdate ? { updatedBy: userId } : {}),
    };

    const result = await db
      .insert(patientsTable)
      .values(patientData)
      .onConflictDoUpdate({
        target: [patientsTable.id],
        set: {
          ...patientData,
          updatedBy: userId, // Sempre atualizar updatedBy em conflitos
          // Não atualizar patientRecordNumber em edições
        },
      })
      .returning();

    const patient = result[0];

    // Criar usuário para o paciente se createAccount estiver marcado
    if (parsedInput.createAccount && patient) {
      // Determinar email para verificação
      let emailForAuth: string;
      if (parsedInput.accessType === "code" && parsedInput.loginCode) {
        emailForAuth = `${parsedInput.loginCode}@clinixflow.local`;
      } else if (parsedInput.accessType === "email" && parsedInput.email) {
        emailForAuth = parsedInput.email;
      } else if (parsedInput.email) {
        emailForAuth = parsedInput.email;
      } else {
        throw new Error("Email ou nome de usuário é obrigatório para criar conta de acesso.");
      }

      // Verifica se já existe usuário com esse email/loginCode
      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, emailForAuth),
      });

      let userId: string;

      if (existingUser) {
        userId = existingUser.id;
        
        // Se senha foi fornecida e é edição, atualizar senha
        if (parsedInput.password && parsedInput.password.trim() !== "") {
          // Better Auth não tem API direta para atualizar senha
          // A senha deve ser alterada pelo usuário via reset de senha
          // Por enquanto, vamos apenas logar que a senha foi alterada
          console.log("Senha deve ser alterada pelo usuário via reset de senha");
        }
      } else {
        // Usar senha fornecida ou gerar senha alfanumérica de 8 caracteres
        const password = parsedInput.password || generateAlphanumericPassword(8);

        // Determinar email para criação do usuário
        // Se accessType é "code" e tem loginCode customizado, usar loginCode como parte do email
        // Se accessType é "email", usar email diretamente
        let emailForAuth: string;
        if (parsedInput.accessType === "code" && parsedInput.loginCode) {
          // Usar loginCode como email (adicionar domínio fictício para compatibilidade com Better Auth)
          emailForAuth = `${parsedInput.loginCode}@clinixflow.local`;
        } else if (parsedInput.accessType === "email" && parsedInput.email) {
          emailForAuth = parsedInput.email;
        } else if (parsedInput.email) {
          // Fallback para email se não especificado
          emailForAuth = parsedInput.email;
        } else {
          throw new Error("Email ou nome de usuário é obrigatório para criar conta de acesso.");
        }

        // Criar novo usuário
        try {
          const response = await auth.api.signUpEmail({
            body: {
              email: emailForAuth,
              password: password,
              name: parsedInput.name,
            },
          });

          // Verificar se houve erro na resposta (Better Auth pode retornar erro no objeto)
          if (response && "error" in response && response.error) {
            const errorData = response.error;
            if (
              errorData &&
              typeof errorData === "object" &&
              "code" in errorData &&
              errorData.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
            ) {
              throw new Error("Este email já está em uso. Por favor, use outro email.");
            }
            const errorMessage =
              typeof errorData === "string"
                ? errorData
                : errorData &&
                    typeof errorData === "object" &&
                    "message" in errorData &&
                    typeof errorData.message === "string"
                  ? errorData.message
                  : "Erro ao criar usuário. Por favor, tente novamente.";
            throw new Error(errorMessage);
          }

          if (!response || !response.user) {
            throw new Error("Erro ao criar usuário. Por favor, tente novamente.");
          }

          userId = response.user.id;
        } catch (error: unknown) {
          // Tratar erro de email já existente
          console.error("Erro ao criar usuário:", error);
          
          // Verificar diferentes formatos de erro do Better Auth
          if (error && typeof error === "object") {
            // Formato 1: error.code
            if ("code" in error && error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
              throw new Error("Este email já está em uso. Por favor, use outro email.");
            }
            
            // Formato 2: error.message pode conter o código
            if ("message" in error && typeof error.message === "string") {
              if (error.message.includes("USER_ALREADY_EXISTS") || error.message.includes("already exists")) {
                throw new Error("Este email já está em uso. Por favor, use outro email.");
              }
            }
            
            // Formato 3: Verificar se é um objeto com data/cause
            if ("data" in error && error.data && typeof error.data === "object") {
              if ("code" in error.data && error.data.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
                throw new Error("Este email já está em uso. Por favor, use outro email.");
              }
            }
          }
          
          // Se não for um erro conhecido, relançar
          throw error;
        }

        // Atualizar role para patient e verificar email automaticamente
        await db
          .update(usersTable)
          .set({ 
            role: "patient",
            emailVerified: true, // Verificar email automaticamente
          })
          .where(eq(usersTable.id, userId));

        console.log("=== USUÁRIO (PACIENTE) ATUALIZADO ===");
        console.log("User ID:", userId);
        console.log("Role atualizado para: patient");
        console.log("Email verificado: true");

        // Enviar email de boas-vindas (apenas se usar email real e senha foi gerada automaticamente)
        if (!parsedInput.password && parsedInput.accessType === "email" && parsedInput.email) {
          try {
            await sendWelcomeEmail({
              to: parsedInput.email,
              password: password,
              clinicName: session.user.clinic?.name || "Clínica",
              name: parsedInput.name,
            });
          } catch (error) {
            console.error("Erro ao enviar email:", error);
            // Não bloquear criação do paciente se email falhar
          }
        }
      }

      // Vincular paciente ao usuário nesta clínica
      await db.insert(patientsToUsersTable).values({
        patientId: patient.id,
        userId: userId,
        clinicId: session.user.clinic.id,
      });
    }

    revalidatePath("/patients");
  });
