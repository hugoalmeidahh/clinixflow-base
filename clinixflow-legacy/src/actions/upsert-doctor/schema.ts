import { z } from "zod";

// Schema para uma especialidade
const specialtySchema = z.object({
  specialty: z.string().trim().min(1, {
    message: "Especialidade é obrigatória.",
  }),
  classNumberType: z.string().trim().min(1, {
    message: "Tipo do conselho é obrigatório.",
  }),
  classNumberRegister: z.string().trim().min(1, {
    message: "Número do registro é obrigatório.",
  }),
});

// Schema para disponibilidade de um dia da semana
const dayAvailabilitySchema = z.object({
  dayOfWeek: z.number().min(1).max(7),
  isAvailable: z.boolean(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
});

export const upsertDoctorSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório.",
    }),
    avatarUrl: z.instanceof(File).optional().nullable(),
    // Dados pessoais
    personType: z.enum(["physical", "legal"], {
      required_error: "Tipo de pessoa é obrigatório.",
    }),
    document: z.string().trim().min(1, {
      message: "Documento é obrigatório.",
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
      message: "Telefone é obrigatório",
    }),
    email: z.string().email({
      message: "Email inválido.",
    }),
    // Perfil do usuário
    role: z.enum(["clinic_admin", "clinic_gestor", "clinic_recepcionist", "doctor"], {
      required_error: "Perfil do usuário é obrigatório.",
    }),
    // Especialidades (múltiplas) - obrigatório apenas se role for "doctor"
    specialties: z.array(specialtySchema).optional(),
    // Profissional
    compensationType: z.enum(["percentage", "fixed", "percentage_plus_fixed"], {
      required_error: "Tipo de compensação é obrigatório.",
    }),
    compensationPercentage: z.number().min(0).max(100).optional().nullable(),
    compensationFixedAmountInCents: z.number().min(0).optional().nullable(),
    // Disponibilidade por dia da semana
    availability: z.array(dayAvailabilitySchema).length(7, {
      message: "Deve haver disponibilidade configurada para todos os 7 dias da semana.",
    }),
    // Acesso
    accessType: z.enum(["code", "email"]).optional(),
    createAccount: z.boolean().default(false),
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
        message: "Pelo menos uma especialidade é obrigatória para profissionais com perfil Profissional da Saúde.",
        path: ["specialties"],
      });
    }
    
    // Validar accessType quando createAccount é true
    if (data.createAccount && !data.accessType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Tipo de acesso é obrigatório quando criar conta está marcado.",
        path: ["accessType"],
      });
    }

    // Validar loginCode quando createAccount é true e accessType é code
    if (data.createAccount && data.accessType === "code" && (!data.loginCode || data.loginCode.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nome de usuário é obrigatório quando o tipo de acesso é usuário.",
        path: ["loginCode"],
      });
    }

    // Validar email quando createAccount é true e accessType é email
    if (data.createAccount && data.accessType === "email" && (!data.email || data.email.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email é obrigatório quando o tipo de acesso é email.",
        path: ["email"],
      });
    }
    
    // Validar senha quando createAccount é true (apenas ao criar, não ao editar)
    if (!data.id && data.createAccount && (!data.password || data.password.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Senha é obrigatória quando criar conta está marcado.",
        path: ["password"],
      });
    }

    // Validar tamanho mínimo da senha se fornecida
    if (data.password && data.password.length > 0 && data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A senha deve ter no mínimo 6 caracteres.",
        path: ["password"],
      });
    }
    
    // Validar disponibilidade
    const hasAvailableDay = data.availability?.some((day) => day.isAvailable);
    if (!hasAvailableDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pelo menos um dia da semana deve estar disponível.",
        path: ["availability"],
      });
    }
    
    // Validar cada dia individualmente
    data.availability?.forEach((day, index) => {
      if (day.isAvailable) {
        if (!day.startTime || !day.endTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Horários são obrigatórios quando o dia está disponível.",
            path: ["availability", index, "startTime"],
          });
        } else if (day.startTime >= day.endTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "O horário de término deve ser posterior ao de início.",
            path: ["availability", index, "endTime"],
          });
        }
      }
    });
    
    // Validar campos de compensação baseado no tipo
    if (data.compensationType === "percentage" && (!data.compensationPercentage || data.compensationPercentage <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Porcentagem é obrigatória quando o tipo é porcentagem.",
        path: ["compensationPercentage"],
      });
    }
    if (data.compensationType === "fixed" && (!data.compensationFixedAmountInCents || data.compensationFixedAmountInCents <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valor fixo é obrigatório quando o tipo é valor fixo.",
        path: ["compensationFixedAmountInCents"],
      });
    }
    if (data.compensationType === "percentage_plus_fixed") {
      if (!data.compensationPercentage || data.compensationPercentage <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Porcentagem é obrigatória quando o tipo é porcentagem + fixo.",
          path: ["compensationPercentage"],
        });
      }
      if (!data.compensationFixedAmountInCents || data.compensationFixedAmountInCents <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Valor fixo é obrigatório quando o tipo é porcentagem + fixo.",
          path: ["compensationFixedAmountInCents"],
        });
      }
    }
  });

export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>;
