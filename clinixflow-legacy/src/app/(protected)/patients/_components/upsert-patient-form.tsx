"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { getPatientUser } from "@/src/actions/get-patient-user";
import { upsertPatient } from "@/src/actions/upsert-patient";
import { patientsTable } from "@/src/db/schema";

import { AccessTab } from "./tabs/access-tab";
import { AddressTab } from "./tabs/address-tab";
import { DocumentsTab } from "./tabs/documents-tab";
import { PersonalDataTab } from "./tabs/personal-data-tab";

const createFormSchema = (t: ReturnType<typeof useTranslations<"patients">>) =>
  z
    .object({
      name: z.string().trim().min(1, {
        message: t("validation.nameRequired"),
      }),
      email: z
        .string()
        .email({
          message: t("validation.emailInvalid"),
        })
        .optional(),
      password: z
        .string()
        .min(6, {
          message: t("validation.passwordMinLength"),
        })
        .optional(),
      // Acesso
      accessType: z.enum(["code", "email"]).optional(),
      createAccount: z.boolean().optional(),
      loginCode: z.string().trim().optional(),
      // Campos opcionais (exceto nome, birthDate, cpf que são obrigatórios)
      phoneNumber: z.string().trim().optional(),
      sex: z.enum(["male", "female"]).optional(),
      birthDate: z.string().min(1, {
        message: t("validation.birthDateRequired"),
      }),
      motherName: z.string().trim().optional(),
      fatherName: z.string().trim().optional(),
      responsibleName: z.string().trim().optional(),
      responsibleContact: z.string().trim().optional(),
      accompaniantName: z.string().trim().optional(),
      accompaniantRelationship: z.string().trim().optional(),
      showResponsible: z.boolean().optional(),
      susCard: z.string().trim().optional(),
      susRegion: z.string().trim().optional(),
      insurancePlan: z.string().trim().optional(),
      insuranceId: z.string().uuid().optional(),
      insurance: z
        .enum([
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
        ])
        .optional(),
      insuranceCard: z.string().trim().optional(),
      rg: z.string().trim().optional(),
      cpf: z.string().trim().min(1, {
        message: t("validation.cpfRequired"),
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
      // Validar campos de acompanhante para pacientes menores de 18 anos
      if (data.birthDate) {
        const birthDate = new Date(data.birthDate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Calcular idade corretamente considerando mês e dia
        const isUnder18 =
          age < 18 ||
          (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

        if (isUnder18) {
          // Nome do acompanhante é obrigatório para menores de 18
          if (!data.accompaniantName || data.accompaniantName.trim() === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("validation.accompaniantNameRequired"),
              path: ["accompaniantName"],
            });
          }

          // Grau de parentesco é obrigatório para menores de 18
          if (
            !data.accompaniantRelationship ||
            data.accompaniantRelationship.trim() === ""
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("validation.accompaniantRelationshipRequired"),
              path: ["accompaniantRelationship"],
            });
          }
        }
      }
    });

interface UpsertPatientFormProps {
  isOpen: boolean;
  patient?: typeof patientsTable.$inferSelect;
  onSuccess?: () => void;
}

const steps = ["personal", "documents", "address", "access"] as const;
type Step = (typeof steps)[number];

const UpsertPatientForm = ({
  patient,
  onSuccess,
  isOpen,
}: UpsertPatientFormProps) => {
  const t = useTranslations("patients");
  const [currentStep, setCurrentStep] = useState<Step>("personal");
  const formSchema = createFormSchema(t);
  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success(
        patient ? t("updatedSuccess") : t("addedSuccess"),
      );
      onSuccess?.();
    },
    onError: ({ error }) => {
      console.error("=== ERRO NO FORMULÁRIO ===");
      console.error("Erro completo:", error);
      console.error("serverError:", error.serverError);
      console.error("validationErrors:", error.validationErrors);

      let errorMessage = t("saveError");

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

  // Buscar usuário relacionado ao paciente para determinar se tem conta
  const { data: patientUser } = useQuery({
    queryKey: ["patient-user", patient?.id],
    queryFn: () => getPatientUser(patient!.id),
    enabled: !!patient?.id,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: false, // Manter valores ao navegar entre steps
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient?.name ?? "",
      email: patient?.email ?? "",
      phoneNumber: patient?.phoneNumber ?? "",
      sex: patient?.sex ?? undefined,
      birthDate: patient?.birthDate
        ? new Date(patient.birthDate).toISOString().split("T")[0]
        : "",
      motherName: patient?.motherName ?? "",
      fatherName: patient?.fatherName ?? "",
      responsibleName: patient?.responsibleName ?? "",
      responsibleContact: patient?.responsibleContact ?? "",
      accompaniantName: patient?.accompaniantName ?? "",
      accompaniantRelationship: patient?.accompaniantRelationship ?? "",
      showResponsible: !!(
        patient?.responsibleName || patient?.accompaniantName
      ),
      susCard: "",
      susRegion: "",
      insurancePlan: "",
      insurance: patient?.insurance ?? undefined,
      insuranceCard: patient?.insuranceCard ?? "",
      rg: patient?.rg ?? "",
      cpf: patient?.cpf ?? "",
      zipCode: patient?.zipCode ?? "",
      address: patient?.address ?? "",
      number: patient?.number ?? "",
      complement: patient?.complement ?? "",
      neighborhood: patient?.neighborhood ?? "",
      city: patient?.city ?? "",
      state: patient?.state ?? "",
      accessType: "code",
      createAccount: false,
      loginCode: "",
      password: undefined,
    },
  });

  useEffect(() => {
    if (isOpen && patient) {
      setCurrentStep("personal"); // Resetar para o primeiro step quando abrir o modal

      // Determinar dados de acesso baseado no usuário relacionado
      let createAccount = false;
      let accessType: "code" | "email" = "code";
      let loginCode = "";

      if (patientUser) {
        createAccount = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userEmail = (patientUser as any).email;

        // Inferir do email se accessType não estiver definido
        if (userEmail.endsWith("@clinixflow.local")) {
          accessType = "code";
          loginCode = userEmail.replace("@clinixflow.local", "");
        } else {
          accessType = "email";
        }
      }

      form.reset({
        name: patient.name ?? "",
        email: patient.email ?? "",
        phoneNumber: patient.phoneNumber ?? "",
        sex: patient.sex ?? undefined,
        birthDate: patient.birthDate
          ? new Date(patient.birthDate).toISOString().split("T")[0]
          : "",
        motherName: patient.motherName ?? "",
        fatherName: patient.fatherName ?? "",
        responsibleName: patient.responsibleName ?? "",
        responsibleContact: patient.responsibleContact ?? "",
        accompaniantName: patient.accompaniantName ?? "",
        accompaniantRelationship: patient.accompaniantRelationship ?? "",
        showResponsible: !!(
          patient.responsibleName || patient.accompaniantName
        ),
        susCard: patient.susCard ?? "",
        susRegion: patient.susRegion ?? "",
        insurancePlan: patient.insurancePlan ?? "",
        insuranceId: patient.insuranceId ?? undefined,
        insurance: patient.insurance ?? undefined,
        insuranceCard: patient.insuranceCard ?? "",
        rg: patient.rg ?? "",
        cpf: patient.cpf ?? "",
        zipCode: patient.zipCode ?? "",
        address: patient.address ?? "",
        number: patient.number ?? "",
        complement: patient.complement ?? "",
        neighborhood: patient.neighborhood ?? "",
        city: patient.city ?? "",
        state: patient.state ?? "",
        accessType,
        createAccount,
        loginCode,
        password: undefined,
      });
    } else if (isOpen && !patient) {
      // Se for novo paciente, resetar para valores padrão
      setCurrentStep("personal");
      form.reset({
        name: "",
        email: "",
        phoneNumber: "",
        sex: undefined,
        birthDate: "",
        motherName: "",
        fatherName: "",
        responsibleName: "",
        responsibleContact: "",
        accompaniantName: "",
        accompaniantRelationship: "",
        showResponsible: false,
        susCard: "",
        susRegion: "",
        insurancePlan: "",
        insuranceId: undefined,
        insurance: undefined,
        insuranceCard: "",
        rg: "",
        cpf: "",
        zipCode: "",
        address: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        accessType: "code",
        createAccount: false,
        loginCode: "",
        password: undefined,
      });
    }
  }, [isOpen, form, patient, patientUser]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Proteção extra: verificar se está realmente no último step
    const currentStepIndexCheck = steps.indexOf(currentStep);
    const isLastStepCheck = currentStepIndexCheck === steps.length - 1;

    if (!isLastStepCheck) {
      console.warn(
        "Tentativa de submit antes do último step. Step atual:",
        currentStep,
      );
      toast.error(t("completeAllSteps"));
      return;
    }

    upsertPatientAction.execute({
      ...values,
      id: patient?.id,
      password: values.createAccount ? values.password || undefined : undefined,
      createAccount: values.createAccount || false,
      loginCode:
        values.createAccount && values.accessType === "code"
          ? values.loginCode
          : undefined,
    });
  };

  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const goToNextStep = async () => {
    // Sempre prevenir qualquer submit acidental
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      // Só avançar se não estiver no último step
      // NUNCA submeter aqui - o submit só acontece quando o botão "Salvar" é clicado no último step
      if (currentStepIndex < steps.length - 1) {
        setCurrentStep(steps[currentStepIndex + 1]);
      }
      // Se estiver no último step, não fazer nada - o usuário deve clicar em "Salvar"
    } else {
      toast.error(t("fillRequiredFields"));
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const getFieldsForStep = (
    step: Step,
  ): Array<keyof z.infer<typeof formSchema>> => {
    // Verificar se paciente é menor de 18 anos
    const birthDate = form.getValues("birthDate");
    let isUnder18 = false;

    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();
      isUnder18 =
        age < 18 ||
        (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));
    }

    switch (step) {
      case "personal":
        // Se menor de 18, incluir campos de acompanhante
        return isUnder18
          ? [
              "name",
              "birthDate",
              "accompaniantName",
              "accompaniantRelationship",
            ]
          : ["name", "birthDate"];
      case "documents":
        return ["cpf"]; // Apenas CPF obrigatório
      case "address":
        return []; // Todos opcionais
      case "access":
        return []; // Validação condicional via superRefine
      default:
        return [];
    }
  };

  return (
    <DialogContent className="flex h-[85vh] w-full max-w-[90vw] flex-col overflow-hidden p-0 sm:h-[80vh] xl:h-[75vh] xl:max-w-6xl">
      <DialogHeader className="shrink-0 px-4 pt-4 pb-2 sm:px-6 sm:pt-6">
        <DialogTitle className="text-base sm:text-lg">
          {patient ? patient.name : t("dialog.addTitle")}
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm">
          {patient
            ? t("dialog.editDescription")
            : t("dialog.addDescription")}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Só permitir submit se estiver no último step
            if (isLastStep) {
              form.handleSubmit(onSubmit)(e);
            } else {
              // Se não estiver no último step, apenas ir para o próximo (não submeter)
              goToNextStep();
            }
          }}
          onKeyDown={(e) => {
            // Prevenir submit com Enter se não estiver no último step
            if (e.key === "Enter" && !isLastStep) {
              e.preventDefault();
              goToNextStep();
            }
          }}
          className="flex flex-1 flex-col overflow-hidden"
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
                  <span className="hidden sm:inline">{t("tabs.personal")}</span>
                  <span className="sm:hidden">{t("tabs.personalShort")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="min-w-fit flex-shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
                >
                  <span className="hidden sm:inline">{t("tabs.documents")}</span>
                  <span className="sm:hidden">{t("tabs.documentsShort")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="address"
                  className="min-w-fit flex-shrink-0 px-2 text-xs sm:px-4 sm:text-sm"
                >
                  {t("tabs.address")}
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

            {currentStep === "documents" && <DocumentsTab form={form} />}

            {currentStep === "address" && <AddressTab form={form} />}

            {currentStep === "access" && (
              <AccessTab
                form={form}
                patient={
                  patient ? { id: patient.id, email: patient.email } : undefined
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
                disabled={isFirstStep || upsertPatientAction.isPending}
                className="px-3 text-xs sm:px-4 sm:text-sm"
              >
                <ArrowLeft className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{t("previous")}</span>
                <span className="sm:hidden">{t("previousShort")}</span>
              </Button>

              <div className="flex flex-1 justify-end gap-2">
                {/* Botão Salvar sempre visível quando for edição */}
                {patient && (
                  <Button
                    type="button"
                    onClick={async () => {
                      // Validar todos os campos antes de submeter
                      const allFieldsValid = await form.trigger();
                      if (allFieldsValid) {
                        form.handleSubmit(onSubmit)();
                      } else {
                        toast.error(t("fillRequiredFields"));
                      }
                    }}
                    disabled={upsertPatientAction.isPending}
                  >
                    {upsertPatientAction.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("saving")}
                      </>
                    ) : (
                      t("save")
                    )}
                  </Button>
                )}

                {isLastStep ? (
                  !patient && (
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
                      disabled={upsertPatientAction.isPending}
                      className="flex-1 px-3 text-xs sm:px-4 sm:text-sm"
                    >
                      {upsertPatientAction.isPending ? (
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
                    disabled={upsertPatientAction.isPending}
                    className={`${patient ? "" : "flex-1"} px-3 text-xs sm:px-4 sm:text-sm`}
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

export default UpsertPatientForm;
