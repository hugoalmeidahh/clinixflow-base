import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }).optional().or(z.literal("")),
  password: z
    .string()
    .min(6, {
      message: "A senha deve ter no mínimo 6 caracteres.",
    })
    .optional(),
  // Acesso
  accessType: z.enum(["code", "email"]).optional(),
  createAccount: z.boolean().default(false),
  loginCode: z.string().trim().optional(),
  // Campos opcionais (exceto nome, birthDate, cpf que são obrigatórios)
  phoneNumber: z.string().trim().optional(),
  sex: z.enum(["male", "female"]).optional(),
  birthDate: z.string().min(1, {
    message: "Data de nascimento é obrigatória.",
  }),
  motherName: z.string().trim().optional(),
  fatherName: z.string().trim().optional(),
  responsibleName: z.string().trim().optional(),
  responsibleContact: z.string().trim().optional(),
  accompaniantName: z.string().trim().optional(),
  accompaniantRelationship: z.string().trim().optional(),
  showResponsible: z.boolean().default(false),
  susCard: z.string().trim().optional(),
  susRegion: z.string().trim().optional(),
  insurancePlan: z.string().trim().optional(),
  insuranceId: z.string().uuid().optional(),
  insurance: z.enum(
    [
      "unimed",
      "amil",
      "sulamerica",
      "bradesco_saude",
      "porto_seguro",
      "allianz",
      "hapvida",
      "cassems",
      "santa_casa_saude",
      "particular",
      "outros",
    ],
  ).optional(),
  insuranceCard: z.string().trim().optional(),
  rg: z.string().trim().optional(),
  cpf: z.string().trim().min(1, {
    message: "CPF é obrigatório.",
  }),
  zipCode: z.string().trim().optional(),
  address: z.string().trim().optional(),
  number: z.string().trim().optional(),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
})
  .superRefine((data, ctx) => {
    // Validar senha quando createAccount é true
    if (data.createAccount && (!data.password || data.password.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Senha é obrigatória quando criar conta está marcado.",
        path: ["password"],
      });
    }
    
    // Validar tamanho mínimo da senha se fornecida
    if (data.password && data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A senha deve ter no mínimo 6 caracteres.",
        path: ["password"],
      });
    }

    // Validar email quando createAccount é true e accessType é email
    if (data.createAccount && data.accessType === "email") {
      if (!data.email || data.email.trim() === "" || data.email === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email é obrigatório quando o tipo de acesso é email.",
          path: ["email"],
        });
      } else {
        // Validar formato do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email inválido.",
            path: ["email"],
          });
        }
      }
    }

    // Validar loginCode quando createAccount é true e accessType é code
    if (data.createAccount && data.accessType === "code" && (!data.loginCode || data.loginCode.trim() === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nome de usuário é obrigatório quando o tipo de acesso é usuário.",
        path: ["loginCode"],
      });
    }

    // Validar campos de acompanhante para pacientes menores de 18 anos
    if (data.birthDate) {
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      
      // Calcular idade corretamente considerando mês e dia
      const isUnder18 = age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

      if (isUnder18) {
        // Nome do acompanhante é obrigatório para menores de 18
        if (!data.accompaniantName || data.accompaniantName.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Nome do acompanhante é obrigatório para pacientes menores de 18 anos.",
            path: ["accompaniantName"],
          });
        }

        // Grau de parentesco é obrigatório para menores de 18
        if (!data.accompaniantRelationship || data.accompaniantRelationship.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Grau de parentesco do acompanhante é obrigatório para pacientes menores de 18 anos.",
            path: ["accompaniantRelationship"],
          });
        }
      }
    }
  });

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
