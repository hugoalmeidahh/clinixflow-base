import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDoctorAvailability } from "@/src/actions/get-doctor-availability";
import { getDoctorSpecialties } from "@/src/actions/get-doctor-specialties";
import { getDoctorUser } from "@/src/actions/get-doctor-user";
import { upsertDoctor } from "@/src/actions/upsert-doctor";
import { doctorsTable } from "@/src/db/schema";
import { utcTimeToLocal } from "@/src/lib/timezone";

import { AccessTab } from "./tabs/access-tab";
import { AddressTab } from "./tabs/address-tab";
import { PersonalDataTab } from "./tabs/personal-data-tab";
import { ProfessionalTab } from "./tabs/professional-tab";
import { ProfileTab } from "./tabs/profile-tab";
import { SpecialtiesTab } from "./tabs/specialties-tab";
import { createDoctorFormSchema,type DoctorFormData } from "./types";

type DoctorWithOptionalFields = typeof doctorsTable.$inferSelect & {
  cpf?: string | null;
  cnpj?: string | null;
  rg?: string | null;
  role?: string | null; // Role vem do user, não do doctor
  compensationType?: string | null;
  compensationPercentage?: number | null;
  compensationFixedAmountInCents?: number | null;
  zipCode?: string | null;
  address?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  birthDate?: string | null;
  openingDate?: string | null;
  stateRegistration?: string | null;
};

interface UpsertDoctorFormProps {
  doctor?: DoctorWithOptionalFields;
  avatarUrl?: string;
  onSuccess?: () => void;
}

const steps = [
  "personal",
  "address",
  "profile",
  "specialties",
  "professional",
  "access",
] as const;
type Step = (typeof steps)[number];

const UpsertDoctorForm = ({
  doctor,
  avatarUrl,
  onSuccess,
}: UpsertDoctorFormProps) => {
  const t = useTranslations("doctors");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _fileInputRef = React.useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_avatarPreview] = useState<string | null>(avatarUrl || null);
  const [selectedFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const isLoading = useAction(upsertDoctor).isPending;

  // Create schema with translations
  const doctorFormSchema = React.useMemo(
    () => createDoctorFormSchema((key: string) => t(key), !!doctor),
    [t, doctor]
  );

  // Buscar disponibilidade e especialidades quando editar
  const { data: doctorAvailability } = useQuery({
    queryKey: ["doctor-availability", doctor?.id],
    queryFn: () => getDoctorAvailability(doctor!.id),
    enabled: !!doctor?.id,
  });

  const { data: doctorSpecialties } = useQuery({
    queryKey: ["doctor-specialties", doctor?.id],
    queryFn: () => getDoctorSpecialties(doctor!.id),
    enabled: !!doctor?.id,
  });

  // Buscar usuário relacionado ao profissional para determinar se tem conta
  const { data: doctorUser } = useQuery({
    queryKey: ["doctor-user", doctor?.id],
    queryFn: () => getDoctorUser(doctor!.id),
    enabled: !!doctor?.id,
  });
  const form = useForm<DoctorFormData>({
    shouldUnregister: false, // Manter valores ao navegar entre steps
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: doctor?.name ?? "",
      avatarImageUrl: doctor?.avatarImageUrl
        ? new File([], doctor.avatarImageUrl)
        : undefined,
      // Dados pessoais
      personType: (doctor?.personType as "physical" | "legal") ?? "physical",
      document: doctor?.document ?? doctor?.cpf ?? doctor?.cnpj ?? "",
      cpf: doctor?.cpf ?? "",
      rg: doctor?.rg ?? "",
      birthDate: (doctor as DoctorWithOptionalFields)?.birthDate ?? "",
      openingDate: (doctor as DoctorWithOptionalFields)?.openingDate ?? "",
      stateRegistration:
        (doctor as DoctorWithOptionalFields)?.stateRegistration ?? "",
      // Endereço
      zipCode: doctor?.zipCode ?? "",
      address: doctor?.address ?? "",
      number: doctor?.number ?? "",
      complement: doctor?.complement ?? "",
      neighborhood: doctor?.neighborhood ?? "",
      city: doctor?.city ?? "",
      state: doctor?.state ?? "",
      // Contatos
      phoneNumber: doctor?.phoneNumber ?? "",
      email: doctor?.email ?? "",
      // Perfil
      role:
        (doctor?.role as
          | "clinic_admin"
          | "clinic_gestor"
          | "clinic_recepcionist"
          | "doctor") ?? "doctor",
      // Especialidades (será carregado via query)
      specialties: [],
      // Profissional
      compensationType:
        (doctor?.compensationType as
          | "percentage"
          | "fixed"
          | "percentage_plus_fixed") ?? "percentage",
      compensationPercentage: doctor?.compensationPercentage ?? undefined,
      compensationFixedAmount: doctor?.compensationFixedAmountInCents
        ? doctor.compensationFixedAmountInCents / 100
        : undefined,
      // Disponibilidade por dia da semana (será carregado via query)
      availability: [
        {
          dayOfWeek: 1,
          isAvailable: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          dayOfWeek: 2,
          isAvailable: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          dayOfWeek: 3,
          isAvailable: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          dayOfWeek: 4,
          isAvailable: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          dayOfWeek: 5,
          isAvailable: true,
          startTime: "08:00",
          endTime: "18:00",
        },
        {
          dayOfWeek: 6,
          isAvailable: false,
          startTime: undefined,
          endTime: undefined,
        },
        {
          dayOfWeek: 7,
          isAvailable: false,
          startTime: undefined,
          endTime: undefined,
        },
      ],
      // Acesso
      accessType: (doctor?.accessType as "code" | "email") ?? "code",
      createAccount: false,
      loginCode: "",
      password: undefined,
    },
  });

  // Resetar step quando o modal abrir (quando doctor mudar ou for novo)
  useEffect(() => {
    setCurrentStep("personal");

    // Resetar formulário com valores padrão ou do doctor
    if (doctor) {
      // Carregar especialidades e disponibilidade quando os dados estiverem disponíveis
      const defaultAvailability: {
        dayOfWeek: number;
        isAvailable: boolean;
        startTime: string | undefined;
        endTime: string | undefined;
      }[] = [
        {
          dayOfWeek: 1,
          isAvailable: false,
          startTime: undefined,
          endTime: undefined,
        },
        {
          dayOfWeek: 2,
          isAvailable: false,
          startTime: undefined,
          endTime: undefined,
        },
        {
          dayOfWeek: 3,
          isAvailable: false,
          startTime: undefined,
          endTime: undefined,
        },
        {
          dayOfWeek: 4,
          isAvailable: false,
          startTime: undefined,
          endTime: undefined,
        },
        {
          dayOfWeek: 5,
          isAvailable: false,
          startTime: undefined,
          endTime: undefined,
        },
        {
          dayOfWeek: 6,
          isAvailable: false,
          startTime: undefined,
          endTime: undefined,
        },
        {
          dayOfWeek: 7,
          isAvailable: false,
          startTime: undefined,
          endTime: undefined,
        },
      ];

      // Preencher disponibilidade se os dados estiverem carregados
      if (doctorAvailability && doctorAvailability.length > 0) {
        doctorAvailability.forEach((avail) => {
          const index = avail.dayOfWeek - 1;
          if (index >= 0 && index < 7) {
            defaultAvailability[index] = {
              dayOfWeek: avail.dayOfWeek,
              isAvailable: avail.isAvailable,
              startTime: avail.startTime
                ? utcTimeToLocal(avail.startTime)
                : undefined,
              endTime: avail.endTime
                ? utcTimeToLocal(avail.endTime)
                : undefined,
            };
          }
        });
      }

      // Carregar especialidades se os dados estiverem carregados
      const specialtiesData =
        doctorSpecialties && doctorSpecialties.length > 0
          ? doctorSpecialties.map((spec) => ({
              specialty: spec.specialty,
              classNumberType: spec.classNumberType,
              classNumberRegister: spec.classNumberRegister,
            }))
          : [{ specialty: "", classNumberType: "", classNumberRegister: "" }];

      // Determinar dados de acesso baseado no usuário relacionado
      let createAccount = false;
      let accessType: "code" | "email" =
        (doctor.accessType as "code" | "email") ?? "code";
      let loginCode = "";

      if (doctorUser) {
        createAccount = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userEmail = (doctorUser as any).email;

        // Usar accessType do doctor se disponível, senão inferir do email
        if (doctor.accessType) {
          accessType = doctor.accessType as "code" | "email";
        } else {
          // Inferir do email se accessType não estiver definido
          if (userEmail.endsWith("@clinixflow.local")) {
            accessType = "code";
          } else {
            accessType = "email";
          }
        }

        // Se for código, extrair loginCode do email
        if (accessType === "code" && userEmail.endsWith("@clinixflow.local")) {
          loginCode = userEmail.replace("@clinixflow.local", "");
        }
      }

      form.reset({
        name: doctor.name ?? "",
        avatarImageUrl: doctor.avatarImageUrl
          ? new File([], doctor.avatarImageUrl)
          : undefined,
        personType: (doctor.personType as "physical" | "legal") ?? "physical",
        document: doctor.document ?? doctor.cpf ?? doctor.cnpj ?? "",
        cpf: doctor.cpf ?? "",
        rg: doctor.rg ?? "",
        birthDate: (doctor as DoctorWithOptionalFields).birthDate ?? "",
        openingDate: (doctor as DoctorWithOptionalFields).openingDate ?? "",
        stateRegistration:
          (doctor as DoctorWithOptionalFields).stateRegistration ?? "",
        zipCode: (doctor as DoctorWithOptionalFields).zipCode ?? "",
        address: (doctor as DoctorWithOptionalFields).address ?? "",
        number: (doctor as DoctorWithOptionalFields).number ?? "",
        complement: (doctor as DoctorWithOptionalFields).complement ?? "",
        neighborhood: (doctor as DoctorWithOptionalFields).neighborhood ?? "",
        city: (doctor as DoctorWithOptionalFields).city ?? "",
        state: (doctor as DoctorWithOptionalFields).state ?? "",
        phoneNumber: doctor.phoneNumber ?? "",
        email: doctor.email ?? "",
        role:
          (doctor.role as
            | "clinic_admin"
            | "clinic_gestor"
            | "clinic_recepcionist"
            | "doctor") ?? "doctor",
        specialties: specialtiesData,
        compensationType:
          (doctor.compensationType as
            | "percentage"
            | "fixed"
            | "percentage_plus_fixed") ?? "percentage",
        compensationPercentage: doctor.compensationPercentage ?? undefined,
        compensationFixedAmount: doctor.compensationFixedAmountInCents
          ? doctor.compensationFixedAmountInCents / 100
          : undefined,
        availability: defaultAvailability,
        accessType,
        createAccount,
        loginCode,
        password: undefined,
      });
    } else {
      // Resetar para valores padrão quando for novo profissional
      form.reset({
        name: "",
        avatarImageUrl: undefined,
        personType: "physical",
        document: "",
        cpf: "",
        rg: "",
        birthDate: "",
        openingDate: "",
        stateRegistration: "",
        zipCode: "",
        address: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        phoneNumber: "",
        email: "",
        role: "doctor",
        specialties: [
          { specialty: "", classNumberType: "", classNumberRegister: "" },
        ],
        compensationType: "percentage",
        compensationPercentage: undefined,
        compensationFixedAmount: undefined,
        availability: [
          {
            dayOfWeek: 1,
            isAvailable: true,
            startTime: "08:00",
            endTime: "18:00",
          },
          {
            dayOfWeek: 2,
            isAvailable: true,
            startTime: "08:00",
            endTime: "18:00",
          },
          {
            dayOfWeek: 3,
            isAvailable: true,
            startTime: "08:00",
            endTime: "18:00",
          },
          {
            dayOfWeek: 4,
            isAvailable: true,
            startTime: "08:00",
            endTime: "18:00",
          },
          {
            dayOfWeek: 5,
            isAvailable: true,
            startTime: "08:00",
            endTime: "18:00",
          },
          {
            dayOfWeek: 6,
            isAvailable: false,
            startTime: undefined,
            endTime: undefined,
          },
          {
            dayOfWeek: 7,
            isAvailable: false,
            startTime: undefined,
            endTime: undefined,
          },
        ],
        accessType: "code",
        createAccount: false,
        loginCode: "",
        password: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor?.id, doctorAvailability, doctorSpecialties, doctorUser]);

  // Atualizar campos de acesso quando doctorUser for carregado (edição)
  useEffect(() => {
    if (doctor && doctorUser) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userEmail = (doctorUser as any).email;

      // Usar accessType do doctor se disponível
      const accessType: "code" | "email" =
        (doctor.accessType as "code" | "email") ||
        (userEmail.endsWith("@clinixflow.local") ? "code" : "email");

      // Se for código, extrair loginCode do email
      let loginCode = "";
      if (accessType === "code" && userEmail.endsWith("@clinixflow.local")) {
        loginCode = userEmail.replace("@clinixflow.local", "");
      }

      // Atualizar campos de acesso
      form.setValue("createAccount", true);
      form.setValue("accessType", accessType);
      if (accessType === "code" && loginCode) {
        form.setValue("loginCode", loginCode);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor?.id, doctorUser, doctor?.accessType]);

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success(
        doctor
          ? t("toast.professionalUpdated")
          : t("toast.professionalAdded"),
      );
      onSuccess?.();
    },
    onError: ({ error }) => {
      console.error("=== ERRO NO FORMULÁRIO ===");
      console.error("Erro completo:", error);
      console.error("serverError:", error.serverError);
      console.error("validationErrors:", error.validationErrors);

      let errorMessage = t("toast.errorSaving");

      if (error.serverError) {
        const serverError = error.serverError;
        if (typeof serverError === "string") {
          errorMessage = serverError;
        } else {
          // Tentar extrair mensagem de diferentes formatos
          try {
            const errorObj = serverError as Record<string, unknown>;
            if (errorObj?.message && typeof errorObj.message === "string") {
              errorMessage = errorObj.message;
            } else if (errorObj?.error) {
              errorMessage = String(errorObj.error);
            } else {
              errorMessage = JSON.stringify(serverError);
            }
          } catch {
            errorMessage = String(serverError);
          }
        }
      } else if (error.validationErrors?._errors?.[0]) {
        errorMessage = error.validationErrors._errors[0];
      }

      console.log("Mensagem final a exibir:", errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
      });
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleAvatarSelect = () => {
    // event: React.ChangeEvent<HTMLInputElement>
    alert(t("toast.featureDisabled"));
    // const file = event.target.files?.[0];
    // if (file) {
    //   // Validar tipo de arquivo
    //   if (!file.type.startsWith("image/")) {
    //     alert({
    //       title: "Erro",
    //       description: "Por favor, selecione apenas arquivos de imagem",
    //       variant: "destructive",
    //     });
    //     return;
    //   }

    //   // Validar tamanho (5MB máximo)
    //   if (file.size > 5 * 1024 * 1024) {
    //     alert("O arquivo deve ter no máximo 5MB");
    //     setAvatarPreview(null);
    //     return;
    //   }

    //   setSelectedFile(file);

    //   // Criar preview
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     setAvatarPreview(e.target?.result as string);
    //   };
    //   reader.readAsDataURL(file);
    // }
  };
  const onSubmit = (values: DoctorFormData) => {
    // Proteção extra: verificar se está realmente no último step
    const currentStepIndexCheck = steps.indexOf(currentStep);
    const isLastStepCheck = currentStepIndexCheck === steps.length - 1;

    if (!isLastStepCheck) {
      console.warn(
        "Tentativa de submit antes do último step. Step atual:",
        currentStep,
      );
      toast.error(t("toast.completeAllSteps"));
      return;
    }

    const { compensationFixedAmount, ...restValues } = values;

    // name já é a razão social para pessoa jurídica ou nome completo para pessoa física
    const formData = {
      ...restValues,
      name: values.name,
      id: doctor?.id,
      avatarUrl: selectedFile || undefined,
      compensationFixedAmountInCents: compensationFixedAmount
        ? compensationFixedAmount * 100
        : null,
      password: values.createAccount ? values.password : undefined,
      createAccount: values.createAccount || false,
      // Sempre enviar accessType (banco exige NOT NULL com default "code")
      // Se não estiver criando conta, usar "code" como padrão
      accessType: values.createAccount ? values.accessType : "code",
      loginCode:
        values.createAccount && values.accessType === "code"
          ? values.loginCode
          : undefined,
    };

    upsertDoctorAction.execute(formData);
  };

  const getAvailableSteps = (): Step[] => {
    const role = form.watch("role");
    if (role === "doctor") {
      return [...steps];
    }
    // Remover "specialties" se role não for "doctor"
    return steps.filter((step) => step !== "specialties");
  };

  const availableSteps = getAvailableSteps();
  const currentStepIndex = availableSteps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === availableSteps.length - 1;

  const goToNextStep = async () => {
    // Sempre prevenir qualquer submit acidental
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      const availableSteps = getAvailableSteps();
      const currentIndex = availableSteps.indexOf(currentStep);

      // Só avançar se não estiver no último step
      if (currentIndex < availableSteps.length - 1) {
        setCurrentStep(availableSteps[currentIndex + 1]);
      }
      // NUNCA submeter aqui - o submit só acontece quando o botão "Salvar" é clicado no último step
    } else {
      toast.error(t("toast.fillRequiredFields"));
    }
  };

  const goToPreviousStep = () => {
    const availableSteps = getAvailableSteps();
    const currentIndex = availableSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(availableSteps[currentIndex - 1]);
    }
  };

  const getFieldsForStep = (step: Step): Array<keyof DoctorFormData> => {
    switch (step) {
      case "personal":
        return [
          "name",
          "personType",
          "document",
          "cpf",
          "rg",
          "birthDate",
          "openingDate",
          "stateRegistration",
          "phoneNumber",
          "email",
        ];
      case "address":
        return [
          "zipCode",
          "address",
          "number",
          "complement",
          "neighborhood",
          "city",
          "state",
        ];
      case "profile":
        return ["role"];
      case "specialties":
        return ["specialties"];
      case "professional":
        return [
          "compensationType",
          "compensationPercentage",
          "compensationFixedAmount",
          "availability",
        ];
      case "access":
        return ["accessType", "createAccount", "password"];
      default:
        return [];
    }
  };

  return (
    <DialogContent className="flex h-[85vh] w-full max-w-[90vw] flex-col overflow-hidden p-0 sm:h-[80vh] xl:h-[75vh] xl:max-w-6xl">
      <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
        <DialogTitle className="text-base sm:text-lg">
          {doctor ? t("dialog.editTitle", { name: doctor.name }) : t("dialog.addTitle")}
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm">
          {doctor
            ? t("dialog.editDescription")
            : t("dialog.addDescription")}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Só permitir submit se estiver no último step
            const currentStepIndexCheck = steps.indexOf(currentStep);
            const isLastStepCheck = currentStepIndexCheck === steps.length - 1;

            if (isLastStepCheck) {
              // Validar todos os campos antes de submeter
              form.handleSubmit(onSubmit)(e);
            } else {
              // Se não estiver no último step, apenas ir para o próximo (não submeter)
              goToNextStep();
            }
          }}
          onKeyDown={(e) => {
            // Prevenir submit com Enter se não estiver no último step
            const availableStepsCheck = getAvailableSteps();
            const currentStepIndexCheck =
              availableStepsCheck.indexOf(currentStep);
            const isLastStepCheck =
              currentStepIndexCheck === availableStepsCheck.length - 1;

            if (e.key === "Enter" && !isLastStepCheck) {
              e.preventDefault();
              e.stopPropagation();
              goToNextStep();
            }
          }}
          className="flex w-full flex-1 flex-col overflow-hidden"
        >
          <div className="w-full min-w-0 shrink-0 border-b px-4 sm:px-6">
            <Tabs
              value={currentStep}
              onValueChange={(value) => setCurrentStep(value as Step)}
              className="w-full"
            >
              <TabsList className="flex h-auto min-h-[2.5rem] w-full justify-start overflow-x-auto">
                <TabsTrigger
                  value="personal"
                  className="min-w-fit flex-shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
                >
                  <span className="hidden sm:inline">{t("tabs.personalData")}</span>
                  <span className="sm:hidden">{t("tabs.personalDataShort")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="address"
                  className="min-w-fit flex-shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
                >
                  {t("tabs.address")}
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="min-w-fit flex-shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
                >
                  {t("tabs.profile")}
                </TabsTrigger>
                {form.watch("role") === "doctor" && (
                  <TabsTrigger
                    value="specialties"
                    className="min-w-fit flex-shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
                  >
                    <span className="hidden sm:inline">{t("tabs.specialty")}</span>
                    <span className="sm:hidden">{t("tabs.specialtyShort")}</span>
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="professional"
                  className="min-w-fit flex-shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
                >
                  <span className="hidden sm:inline">{t("tabs.professional")}</span>
                  <span className="sm:hidden">{t("tabs.professionalShort")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="access"
                  className="min-w-fit flex-shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
                >
                  {t("tabs.access")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {currentStep === "personal" && <PersonalDataTab form={form} />}

            {currentStep === "address" && <AddressTab form={form} />}

            {currentStep === "profile" && <ProfileTab form={form} />}

            {currentStep === "specialties" && (
              <SpecialtiesTab
                form={form}
                isRequired={form.watch("role") === "doctor"}
              />
            )}

            {currentStep === "professional" && <ProfessionalTab form={form} />}

            {currentStep === "access" && (
              <AccessTab
                form={form}
                doctor={
                  doctor ? { id: doctor.id, email: doctor.email } : undefined
                }
              />
            )}
          </div>

          <DialogFooter className="shrink-0 border-t px-4 pt-3 pb-4 sm:px-6 sm:pt-4 sm:pb-6">
            <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={isFirstStep || isLoading}
                className="px-3 text-xs sm:px-4 sm:text-sm"
              >
                <ArrowLeft className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t("buttons.previous")}</span>
                <span className="sm:hidden">{t("buttons.previousShort")}</span>
              </Button>

              <div className="flex flex-1 justify-end gap-2">
                {/* Botão Salvar sempre visível quando for edição */}
                {doctor && (
                  <Button
                    type="button"
                    onClick={async () => {
                      // Validar todos os campos antes de submeter
                      const allFieldsValid = await form.trigger();
                      if (allFieldsValid) {
                        form.handleSubmit(onSubmit)();
                      } else {
                        toast.error(
                          t("toast.fillRequiredFields"),
                        );
                      }
                    }}
                    disabled={isLoading}
                    className="px-3 text-xs sm:px-4 sm:text-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">{t("buttons.saving")}</span>
                        <span className="sm:hidden">{t("buttons.savingShort")}</span>
                      </>
                    ) : (
                      t("buttons.save")
                    )}
                  </Button>
                )}

                {isLastStep ? (
                  !doctor && (
                    <Button
                      type="button"
                      onClick={async () => {
                        // Validar todos os campos antes de submeter
                        const allFieldsValid = await form.trigger();
                        if (allFieldsValid) {
                          form.handleSubmit(onSubmit)();
                        } else {
                          toast.error(
                            "Por favor, preencha todos os campos obrigatórios.",
                          );
                        }
                      }}
                      disabled={isLoading}
                      className="flex-1 px-3 text-xs sm:px-4 sm:text-sm"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Salvando...</span>
                          <span className="sm:hidden">Salvando</span>
                        </>
                      ) : (
                        "Salvar"
                      )}
                    </Button>
                  )
                ) : (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    disabled={isLoading}
                    className={`${doctor ? "" : "flex-1"} px-3 text-xs sm:px-4 sm:text-sm`}
                  >
                    <span className="hidden sm:inline">Próximo</span>
                    <span className="sm:hidden">Próx.</span>
                    <ArrowRight className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
