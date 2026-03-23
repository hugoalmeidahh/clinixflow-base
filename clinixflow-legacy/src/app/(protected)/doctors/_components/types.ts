import { z } from "zod";

// Factory function to create schemas with translations
export const createDoctorSchemas = (t: (key: string) => string) => {
  // Schema para uma especialidade
  const specialtySchema = z.object({
    specialty: z.string().trim().min(1, {
      message: t("validation.specialtyRequired"),
    }),
    classNumberType: z.string().trim().min(1, {
      message: t("validation.councilTypeRequired"),
    }),
    classNumberRegister: z.string().trim().min(1, {
      message: t("validation.classNumberRequired"),
    }),
  });

  // Schema para disponibilidade de um dia da semana
  const dayAvailabilitySchema = z.object({
    dayOfWeek: z.number().min(1).max(7),
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }).refine((data) => {
    // Se estiver disponível, horários são obrigatórios
    if (data.isAvailable) {
      return data.startTime && data.endTime && data.startTime < data.endTime;
    }
    return true;
  }, {
    message: t("validation.timesRequiredWhenAvailable"),
  });

  return { specialtySchema, dayAvailabilitySchema };
};

export const createDoctorFormSchema = (t: (key: string) => string, isEditing?: boolean) => {
  const { specialtySchema, dayAvailabilitySchema } = createDoctorSchemas(t);

  return z
    .object({
      name: z.string().trim().min(1, {
        message: t("validation.nameRequired"),
      }),
      avatarImageUrl: z.instanceof(File).optional(),
      // Dados pessoais
      personType: z.enum(["physical", "legal"], {
        required_error: t("validation.personTypeRequired"),
      }),
      document: z.string().trim().min(1, {
        message: t("validation.documentRequired"),
      }),
      cpf: z.string().trim().optional(), // CPF separado (mesmo para pessoa jurídica)
      rg: z.string().trim().optional(), // RG para PF, Inscrição Estadual para PJ
      birthDate: z.string().optional(), // Data de nascimento (PF)
      openingDate: z.string().optional(), // Data de abertura empresa (PJ)
      stateRegistration: z.string().trim().optional(), // Inscrição Estadual (deprecated, usar rg)
      // Endereço
      zipCode: z.string().trim().optional(),
      address: z.string().trim().optional(),
      number: z.string().trim().optional(),
      complement: z.string().trim().optional(),
      neighborhood: z.string().trim().optional(),
      city: z.string().trim().optional(),
      state: z.string().trim().optional(),
      // Contatos
      phoneNumber: z.string().trim().min(1, {
        message: t("validation.phoneRequired"),
      }),
      email: z.string().email({
        message: t("validation.emailInvalid"),
      }),
      // Perfil do usuário
      role: z.enum(["clinic_admin", "clinic_gestor", "clinic_recepcionist", "doctor"], {
        required_error: t("validation.roleRequired"),
      }),
      // Especialidades (múltiplas) - obrigatório apenas se role for "doctor"
      specialties: z.array(specialtySchema).optional(),
      // Profissional
      compensationType: z.enum(["percentage", "fixed", "percentage_plus_fixed"], {
        required_error: t("validation.compensationTypeRequired"),
      }),
      compensationPercentage: z.number().min(0).max(100).optional(),
      compensationFixedAmount: z.number().min(0).optional(),
      // Disponibilidade por dia da semana
      availability: z.array(dayAvailabilitySchema).length(7, {
        message: t("validation.availabilityRequired"),
      }),
      // Acesso
      accessType: z.enum(["code", "email"], {
        required_error: t("validation.accessTypeRequired"),
      }),
      createAccount: z.boolean(),
      loginCode: z.string().trim().optional(),
      password: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // Validar campos específicos por tipo de pessoa
      if (data.personType === "physical") {
        // Para pessoa física: document é CPF, rg é RG
        // Validações opcionais podem ser adicionadas aqui
      } else if (data.personType === "legal") {
        // Para pessoa jurídica: document é CNPJ, rg é Inscrição Estadual
        // name é Razão Social (já validado como obrigatório acima)
      }

      // Validar especialidades se role for "doctor"
      if (data.role === "doctor" && (!data.specialties || data.specialties.length === 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.specialtiesRequiredForDoctor"),
          path: ["specialties"],
        });
      }

      // Validar senha quando createAccount é true (apenas ao criar, não ao editar)
      if (!isEditing && data.createAccount && (!data.password || data.password.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.passwordRequiredWhenCreatingAccount"),
          path: ["password"],
        });
      }
      if (data.password && data.password.length > 0 && data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.passwordMinLength"),
          path: ["password"],
        });
      }

      // Validar campos de compensação baseado no tipo
      if (data.compensationType === "percentage" && (!data.compensationPercentage || data.compensationPercentage <= 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.percentageRequiredWhenType"),
          path: ["compensationPercentage"],
        });
      }
      if (data.compensationType === "fixed" && (!data.compensationFixedAmount || data.compensationFixedAmount <= 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.fixedAmountRequiredWhenType"),
          path: ["compensationFixedAmount"],
        });
      }
      if (data.compensationType === "percentage_plus_fixed") {
        if (!data.compensationPercentage || data.compensationPercentage <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.percentageRequiredWhenTypePlus"),
            path: ["compensationPercentage"],
          });
        }
        if (!data.compensationFixedAmount || data.compensationFixedAmount <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("validation.fixedAmountRequiredWhenTypePlus"),
            path: ["compensationFixedAmount"],
          });
        }
      }
    })
    .superRefine((data, ctx) => {
      // Validar que pelo menos um dia está disponível
      const hasAvailableDay = data.availability?.some((day) => day.isAvailable);
      if (!hasAvailableDay) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.atLeastOneDayAvailable"),
          path: ["availability"],
        });
      }

      // Validar cada dia individualmente
      data.availability?.forEach((day, index) => {
        if (day.isAvailable) {
          if (!day.startTime || !day.endTime) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("validation.timesRequiredWhenDayAvailable"),
              path: ["availability", index, "startTime"],
            });
          } else if (day.startTime >= day.endTime) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("validation.endTimeMustBeAfterStart"),
              path: ["availability", index, "endTime"],
            });
          }
        }
      });
    });
};

// Export type based on the schema factory
export type DoctorFormData = z.infer<ReturnType<typeof createDoctorFormSchema>>;

