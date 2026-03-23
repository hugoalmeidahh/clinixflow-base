"use server";

import { v2 as cloudinary } from "cloudinary";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";
import { db } from "@/src/db";
import {
  accountsTable,
  doctorAvailabilityTable,
  doctorSpecialtiesTable,
  doctorsTable,
  doctorsToUsersTable,
  specialtiesTable,
  usersTable,
} from "@/src/db/schema";
import { getNextSequentialCode } from "@/src/lib/codes";
import { sendWelcomeEmail } from "@/src/lib/email";
import { generateAlphanumericPassword } from "@/src/lib/password";
import { localTimeToUTC } from "@/src/lib/timezone";

import { upsertDoctorSchema } from "./schema";

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para upload de imagem para o Cloudinary
async function uploadImageToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "doctor-avatars",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Upload failed"));
          }
          resolve(result.secure_url);
        },
      )
      .end(buffer);
  });
}

export const upsertDoctor = actionClient
  .schema(upsertDoctorSchema)
  .action(async ({ parsedInput }) => {
    // Extrair campos que não vão para a tabela doctors
    const avatarUrl = parsedInput.avatarUrl;
    const specialties = parsedInput.specialties;
    const availability = parsedInput.availability;
    
    // Resto dos campos (sem specialties, availability, avatarUrl)
    // Manter createAccount, loginCode e password em rest para usar na criação de usuário
    const {
      avatarUrl: _,
      specialties: __,
      availability: ___,
      ...rest
    } = parsedInput;
    // Suprimir warning de variáveis não usadas (são extraídas para não irem para o banco)
    void _; void __; void ___;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (!session?.user.clinic?.id) {
      throw new Error("Clinic not found");
    }

    let imageUrl: string | undefined;

    // Se avatarUrl for um File (nova imagem), faz upload para o Cloudinary
    if (avatarUrl instanceof File) {
      imageUrl = await uploadImageToCloudinary(avatarUrl);
    } else if (typeof avatarUrl === "string") {
      // Se for string (URL existente), mantém a URL
      imageUrl = avatarUrl;
    }

    // Gerar ou buscar doctorCode
    let doctorCode: string;
    const clinicId = session.user.clinic?.id;
    
    if (!clinicId) {
      throw new Error("Clinic not found");
    }

    if (rest.id) {
      // Se for atualização, buscar o código existente
      const doctorId = rest.id;
      const existingDoctor = await db.query.doctorsTable.findFirst({
        where: (doctors, { eq }) => eq(doctors.id, doctorId),
        columns: { doctorCode: true },
      });
      
      if (!existingDoctor?.doctorCode) {
        throw new Error("Doctor code not found");
      }
      
      doctorCode = existingDoctor.doctorCode;
    } else {
      // Se for novo médico, gerar código sequencial
      const existingDoctors = await db.query.doctorsTable.findMany({
        where: (doctors, { eq }) => eq(doctors.clinicId, clinicId),
        columns: { doctorCode: true },
      });

      // Encontrar o maior número
      const maxCode = existingDoctors.reduce((max, doctor) => {
        const num = parseInt(doctor.doctorCode, 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);

      doctorCode = getNextSequentialCode(maxCode);
    }

    const userId = session.user.id;
    const isUpdate = !!rest.id;

    // Criar objeto limpo apenas com campos válidos da tabela doctors
    // Garantir que accessType sempre tenha um valor (banco exige NOT NULL)
    // Nota: specialty é deprecated mas ainda tem constraint NOT NULL no banco
    const doctorData = {
      // Campos obrigatórios
      name: rest.name,
      personType: rest.personType || "physical",
      phoneNumber: rest.phoneNumber,
      email: rest.email,
      doctorCode,
      compensationType: rest.compensationType,
      clinicId: clinicId,
      accessType: rest.accessType || "code", // Sempre ter um valor, padrão é "code"
      // Campos deprecated são nullable após migration 0020 - não precisam ser enviados
      // Campos opcionais (apenas se fornecidos)
      ...(rest.id && { id: rest.id }),
      ...(imageUrl && { avatarImageUrl: imageUrl }),
      ...(rest.document && { document: rest.document }),
      ...(rest.cpf && { cpf: rest.cpf }),
      ...(rest.rg && { rg: rest.rg }),
      ...(rest.birthDate && { birthDate: rest.birthDate }),
      ...(rest.openingDate && { openingDate: rest.openingDate }),
      ...(rest.stateRegistration && { stateRegistration: rest.stateRegistration }),
      ...(rest.zipCode && { zipCode: rest.zipCode }),
      ...(rest.address && { address: rest.address }),
      ...(rest.number && { number: rest.number }),
      ...(rest.complement && { complement: rest.complement }),
      ...(rest.neighborhood && { neighborhood: rest.neighborhood }),
      ...(rest.city && { city: rest.city }),
      ...(rest.state && { state: rest.state }),
      ...(rest.compensationPercentage !== undefined && { compensationPercentage: rest.compensationPercentage }),
      ...(rest.compensationFixedAmountInCents !== undefined && { compensationFixedAmountInCents: rest.compensationFixedAmountInCents }),
      // Adicionar createdBy apenas se for criação (não update)
      ...(isUpdate ? {} : { createdBy: userId }),
      // Sempre adicionar updatedBy em updates
      ...(isUpdate ? { updatedBy: userId } : {}),
    };

    // Criar ou atualizar o profissional
    let result;
    try {
      result = await db
        .insert(doctorsTable)
        .values(doctorData)
        .onConflictDoUpdate({
          target: [doctorsTable.id],
          set: {
            ...doctorData,
            updatedBy: userId, // Sempre atualizar updatedBy em conflitos
          },
        })
        .returning();
    } catch (error) {
      console.error("=== ERRO AO INSERIR/ATUALIZAR PROFISSIONAL ===");
      console.error("Erro completo:", error);
      console.error("DoctorData:", JSON.stringify(doctorData, null, 2));
      
      // Extrair mensagem de erro do PostgreSQL
      let errorMessage = "Erro ao salvar profissional. Por favor, tente novamente.";
      if (error && typeof error === "object") {
        if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        } else if ("code" in error) {
          // Códigos de erro do PostgreSQL
          const code = String(error.code);
          if (code === "23505") {
            errorMessage = "Já existe um profissional com este documento ou email.";
          } else if (code === "23502") {
            errorMessage = "Campos obrigatórios não foram preenchidos.";
          } else if (code === "23503") {
            errorMessage = "Referência inválida (clínica não encontrada).";
          }
        }
      }
      throw new Error(errorMessage);
    }

    const doctor = result[0];

    // Salvar especialidades (apenas se role for "doctor" e houver especialidades)
    if (doctor && rest.role === "doctor" && specialties && specialties.length > 0) {
      // Se for update, remover especialidades antigas
      if (isUpdate) {
        await db
          .delete(doctorSpecialtiesTable)
          .where(eq(doctorSpecialtiesTable.doctorId, doctor.id));
      }

      // Buscar IDs das especialidades pelo nome
      const specialtyNames = specialties.map((s) => s.specialty);
      const foundSpecialties = await db
        .select()
        .from(specialtiesTable)
        .where(inArray(specialtiesTable.name, specialtyNames));

      // Criar um mapa de nome para ID
      const specialtyMap = new Map(
        foundSpecialties.map((s) => [s.name, s.id])
      );

      // Inserir novas especialidades
      await db.insert(doctorSpecialtiesTable).values(
        specialties.map((specialty) => {
          const specialtyId = specialtyMap.get(specialty.specialty);
          
          if (!specialtyId) {
            throw new Error(`Especialidade "${specialty.specialty}" não encontrada no banco de dados`);
          }

          return {
            doctorId: doctor.id,
            specialtyId: specialtyId,
            specialty: specialty.specialty, // Manter para compatibilidade durante migração
            classNumberType: specialty.classNumberType,
            classNumberRegister: specialty.classNumberRegister,
          };
        })
      );
    } else if (doctor && isUpdate && rest.role !== "doctor") {
      // Se mudou de "doctor" para outro role, remover especialidades
      await db
        .delete(doctorSpecialtiesTable)
        .where(eq(doctorSpecialtiesTable.doctorId, doctor.id));
    }

    // Salvar disponibilidade por dia da semana
    if (doctor && availability && availability.length === 7) {
      // Se for update, remover disponibilidade antiga
      if (isUpdate) {
        await db
          .delete(doctorAvailabilityTable)
          .where(eq(doctorAvailabilityTable.doctorId, doctor.id));
      }

      // Inserir nova disponibilidade
      await db.insert(doctorAvailabilityTable).values(
        availability.map((day) => ({
          doctorId: doctor.id,
          dayOfWeek: day.dayOfWeek,
          isAvailable: day.isAvailable,
          startTime: day.isAvailable && day.startTime ? localTimeToUTC(day.startTime) : null,
          endTime: day.isAvailable && day.endTime ? localTimeToUTC(day.endTime) : null,
        }))
      );
    }

    // Criar usuário para o profissional se createAccount estiver marcado
    if (rest.createAccount && doctor) {
      // Determinar email para verificação/criação
      let emailForAuth: string;
      
      // Validar que accessType está definido quando createAccount é true
      if (!rest.accessType) {
        throw new Error("Tipo de acesso é obrigatório quando criar conta está marcado.");
      }
      
      if (rest.accessType === "code" && rest.loginCode && rest.loginCode.trim() !== "") {
        // Usar loginCode como email (adicionar domínio fictício para compatibilidade com Better Auth)
        emailForAuth = `${rest.loginCode.trim()}@clinixflow.local`;
      } else if (rest.accessType === "email" && rest.email && rest.email.trim() !== "") {
        emailForAuth = rest.email.trim();
      } else if (rest.email && rest.email.trim() !== "") {
        // Fallback para email se não especificado
        emailForAuth = rest.email.trim();
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
        console.log("=== USUÁRIO JÁ EXISTE ===");
        console.log("User ID:", userId);
        console.log("Email:", emailForAuth);
        
        // Se senha foi fornecida, atualizar senha na conta
        if (rest.password && rest.password.trim() !== "") {
          console.log("=== ATUALIZANDO SENHA ===");
          
          try {
            // Buscar conta existente
            const existingAccount = await db.query.accountsTable.findFirst({
              where: (accounts, { eq, and }) =>
                and(
                  eq(accounts.userId, userId),
                  eq(accounts.providerId, "credential")
                ),
            });

            if (existingAccount) {
              // Para atualizar a senha, precisamos criar um usuário temporário
              // para obter o hash correto do Better Auth, depois deletar o temporário
              // e atualizar a conta existente
              const tempEmail = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}@clinixflow.temp`;
              
              try {
                // Criar usuário temporário para obter o hash da senha
                const tempUserResponse = await auth.api.signUpEmail({
                  body: {
                    email: tempEmail,
                    password: rest.password,
                    name: "temp",
                  },
                });

                if (tempUserResponse && tempUserResponse.user) {
                  // Buscar a conta temporária para pegar o hash da senha
                  const tempAccount = await db.query.accountsTable.findFirst({
                    where: (accounts, { eq, and }) =>
                      and(
                        eq(accounts.userId, tempUserResponse.user.id),
                        eq(accounts.providerId, "credential")
                      ),
                  });

                  if (tempAccount && tempAccount.password) {
                    // Atualizar a conta existente com o novo hash
                    await db
                      .update(accountsTable)
                      .set({
                        password: tempAccount.password,
                        updatedAt: new Date(),
                      })
                      .where(eq(accountsTable.id, existingAccount.id));

                    console.log("✅ Senha atualizada com sucesso!");
                    
                    // Deletar usuário temporário e sua conta
                    await db
                      .delete(accountsTable)
                      .where(eq(accountsTable.userId, tempUserResponse.user.id));
                    await db
                      .delete(usersTable)
                      .where(eq(usersTable.id, tempUserResponse.user.id));
                  } else {
                    throw new Error("Não foi possível obter o hash da senha do usuário temporário");
                  }
                } else {
                  throw new Error("Não foi possível criar usuário temporário para hash da senha");
                }
              } catch (tempError) {
                console.error("Erro ao criar usuário temporário para hash:", tempError);
                throw new Error("Não foi possível atualizar a senha. Por favor, tente novamente.");
              }
            } else {
              // Conta não existe, criar uma nova
              console.log("=== CRIANDO CONTA PARA USUÁRIO EXISTENTE ===");
              
              // Criar usuário temporário para obter o hash
              const tempEmail = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}@clinixflow.temp`;
              const tempUserResponse = await auth.api.signUpEmail({
                body: {
                  email: tempEmail,
                  password: rest.password,
                  name: "temp",
                },
              });

              if (tempUserResponse && tempUserResponse.user) {
                const tempAccount = await db.query.accountsTable.findFirst({
                  where: (accounts, { eq, and }) =>
                    and(
                      eq(accounts.userId, tempUserResponse.user.id),
                      eq(accounts.providerId, "credential")
                    ),
                });

                if (tempAccount && tempAccount.password) {
                  // Criar conta para o usuário existente usando o hash obtido
                  // O ID deve seguir o formato do Better Auth: providerId:accountId
                  await db.insert(accountsTable).values({
                    id: `credential:${emailForAuth}`,
                    accountId: emailForAuth,
                    providerId: "credential",
                    userId: userId,
                    password: tempAccount.password,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  });

                  console.log("✅ Conta criada para usuário existente!");
                  
                  // Deletar usuário temporário
                  await db
                    .delete(accountsTable)
                    .where(eq(accountsTable.userId, tempUserResponse.user.id));
                  await db
                    .delete(usersTable)
                    .where(eq(usersTable.id, tempUserResponse.user.id));
                } else {
                  throw new Error("Não foi possível obter o hash da senha");
                }
              } else {
                throw new Error("Não foi possível criar usuário temporário");
              }
            }
          } catch (error) {
            console.error("Erro ao atualizar senha:", error);
            throw new Error(
              `Não foi possível atualizar a senha: ${error instanceof Error ? error.message : "Erro desconhecido"}`
            );
          }
        } else {
          console.log("⚠️  Nenhuma senha fornecida, mantendo senha existente");
        }
        
        // Atualizar role e outras informações do usuário existente
        await db
          .update(usersTable)
          .set({
            role: rest.role || "doctor",
            name: rest.name, // Atualizar nome caso tenha mudado
            emailVerified: true, // Garantir que email está verificado
            updatedAt: new Date(),
          })
          .where(eq(usersTable.id, userId));
        
        console.log("=== USUÁRIO EXISTENTE ATUALIZADO ===");
        console.log("User ID:", userId);
        console.log("Role atualizado para:", rest.role || "doctor");
      } else {
        // Usar senha fornecida ou gerar senha alfanumérica de 8 caracteres
        const password = rest.password || generateAlphanumericPassword(8);

        // Criar novo usuário
        try {
          console.log("=== CRIANDO USUÁRIO ===");
          console.log("Email:", emailForAuth);
          console.log("Nome:", rest.name);
          console.log("Senha fornecida:", password ? "Sim" : "Não");
          console.log("AccessType:", rest.accessType);
          console.log("LoginCode:", rest.loginCode);
          
          const response = await auth.api.signUpEmail({
            body: {
              email: emailForAuth,
              password: password,
              name: rest.name,
            },
          });

          console.log("=== RESPOSTA DO SIGNUP ===");
          console.log("Response:", JSON.stringify(response, null, 2));

          // Verificar se houve erro na resposta (Better Auth pode retornar erro no objeto)
          if (response && "error" in response && response.error) {
            const errorData = response.error;
            console.error("=== ERRO NA RESPOSTA ===");
            console.error("Error data:", errorData);
            
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
            console.error("=== ERRO: RESPOSTA SEM USUÁRIO ===");
            console.error("Response completa:", response);
            throw new Error("Erro ao criar usuário. Por favor, tente novamente.");
          }

          userId = response.user.id;
          console.log("=== USUÁRIO CRIADO COM SUCESSO ===");
          console.log("User ID:", userId);
        } catch (error: unknown) {
          // Tratar erro de email já existente
          console.error("=== ERRO AO CRIAR USUÁRIO ===");
          console.error("Erro completo:", error);
          console.error("Tipo do erro:", typeof error);
          
          if (error && typeof error === "object") {
            console.error("Propriedades do erro:", Object.keys(error));
            if ("message" in error) {
              console.error("Mensagem do erro:", error.message);
            }
            if ("code" in error) {
              console.error("Código do erro:", error.code);
            }
            if ("data" in error) {
              console.error("Data do erro:", error.data);
            }
          }
          
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

        // Atualizar role e verificar email automaticamente
        await db
          .update(usersTable)
          .set({ 
            role: rest.role || "doctor",
            emailVerified: true, // Verificar email automaticamente
          })
          .where(eq(usersTable.id, userId));

        console.log("=== USUÁRIO ATUALIZADO ===");
        console.log("User ID:", userId);
        console.log("Role atualizado para: doctor");
        console.log("Email verificado: true");

        // Verificar se o usuário foi criado corretamente
        const createdUser = await db.query.usersTable.findFirst({
          where: eq(usersTable.id, userId),
        });
        
        console.log("=== VERIFICAÇÃO DO USUÁRIO CRIADO ===");
        console.log("Usuário encontrado no banco:", createdUser ? "Sim" : "Não");
        if (createdUser) {
          console.log("Email:", createdUser.email);
          console.log("Role:", createdUser.role);
          console.log("Email verificado:", createdUser.emailVerified);
        }

        // Aguardar um pouco mais para garantir que o Better Auth processou tudo
        // O Better Auth pode precisar de mais tempo para criar a conta no banco
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Verificar se a conta (com senha) foi criada corretamente
        // O Better Auth usa "credential" como providerId para email/password
        const account = await db.query.accountsTable.findFirst({
          where: (accounts, { eq, and }) => 
            and(
              eq(accounts.userId, userId),
              eq(accounts.providerId, "credential")
            ),
        });

        console.log("=== VERIFICAÇÃO DA CONTA (SENHA) ===");
        console.log("Conta encontrada:", account ? "Sim" : "Não");
        
        // Se a conta não foi criada após aguardar, há um problema
        if (!account) {
          console.error("⚠️ ERRO: Conta não foi criada automaticamente pelo Better Auth!");
          console.error("Isso pode acontecer em casos raros. Verificando todas as contas do usuário...");
          
          // Verificar todas as contas do usuário para debug
          const allAccounts = await db.query.accountsTable.findMany({
            where: (accounts, { eq }) => eq(accounts.userId, userId),
          });
          
          console.error("Total de contas encontradas:", allAccounts.length);
          if (allAccounts.length > 0) {
            allAccounts.forEach((acc, index) => {
              console.error(`Conta ${index + 1}:`, {
                id: acc.id,
                providerId: acc.providerId,
                accountId: acc.accountId,
                hasPassword: !!acc.password,
              });
            });
          }
          
          // Lançar erro claro para o usuário
          throw new Error(
            "A conta de acesso não foi criada corretamente. " +
            "Por favor, recrie o profissional com 'Criar conta' marcado, " +
            "ou entre em contato com o suporte. " +
            "Email do usuário criado: " + emailForAuth
          );
        }
        
        // Verificar se a conta tem senha
        if (!account.password) {
          console.error("⚠️ ATENÇÃO: Conta existe mas não tem senha armazenada!");
          throw new Error(
            "A conta foi criada mas a senha não foi armazenada. " +
            "Por favor, recrie o profissional com 'Criar conta' marcado e uma senha válida."
          );
        }
        
        console.log("✅ Conta verificada com sucesso:");
        console.log("   Account ID:", account.id);
        console.log("   Provider ID:", account.providerId);
        console.log("   Account ID (accountId):", account.accountId);
        console.log("   Senha: Hash armazenado corretamente");

        // Enviar email de boas-vindas (apenas se senha foi gerada automaticamente)
        if (!rest.password) {
          try {
            await sendWelcomeEmail({
              to: rest.email,
              password: password,
              clinicName: session.user.clinic?.name || "Clínica",
              name: rest.name,
            });
          } catch (error) {
            console.error("Erro ao enviar email:", error);
            // Não bloquear criação do profissional se email falhar
          }
        }
      }

      // Vincular profissional ao usuário nesta clínica
      await db.insert(doctorsToUsersTable).values({
        doctorId: doctor.id,
        userId: userId,
        clinicId: session.user.clinic.id,
      });
    }

    revalidatePath("/doctors");
  });
