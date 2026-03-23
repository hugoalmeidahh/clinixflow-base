"use client";

import { Eye, EyeOff, Info, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateAlphanumericPassword } from "@/src/lib/password";

import { type DoctorFormData } from "../types";

interface AccessTabProps {
  form: UseFormReturn<DoctorFormData>;
  doctor?: {
    id: string;
    email: string;
  };
}

export function AccessTab({ form, doctor }: AccessTabProps) {
  const t = useTranslations("doctors.access");
  const accessType = form.watch("accessType");
  const createAccount = form.watch("createAccount");
  const formLoginCode = form.watch("loginCode");
  const [showPassword, setShowPassword] = useState(false);
  const [loginCode, setLoginCode] = useState("");

  // Inicializar loginCode do form quando o componente montar ou formLoginCode mudar (para edição)
  useEffect(() => {
    if (formLoginCode && formLoginCode.trim() !== "") {
      setLoginCode(formLoginCode);
    } else if (!formLoginCode || formLoginCode.trim() === "") {
      setLoginCode("");
    }
  }, [formLoginCode]);

  // Se accessType mudar para "email", marcar createAccount como true
  useEffect(() => {
    if (accessType === "email" && !createAccount) {
      form.setValue("createAccount", true);
    }
  }, [accessType, createAccount, form]);

  // Gerar nome de usuário quando necessário (apenas se não tiver loginCode do form)
  useEffect(() => {
    if (createAccount && accessType === "code" && !loginCode && (!formLoginCode || formLoginCode.trim() === "")) {
      const code = generateAlphanumericPassword(8);
      setLoginCode(code);
      form.setValue("loginCode", code);
    }
  }, [createAccount, accessType, loginCode, formLoginCode, form]);

  // Sincronizar loginCode com o form
  useEffect(() => {
    if (loginCode) {
      form.setValue("loginCode", loginCode);
    }
  }, [loginCode, form]);

  const handleGeneratePassword = () => {
    const newPassword = generateAlphanumericPassword(8);
    form.setValue("password", newPassword);
    setShowPassword(true);
  };

  const handleGenerateCode = () => {
    const code = generateAlphanumericPassword(8);
    setLoginCode(code);
    form.setValue("loginCode", code);
  };

  return (
    <div className="space-y-4">
      {!doctor && (
        <>
          <FormField
            control={form.control}
            name="createAccount"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(checked) => {
                      const newValue = checked === true;
                      field.onChange(newValue);
                      if (!newValue) {
                        // Limpar campos quando desmarcar
                        form.setValue("accessType", "code");
                        setLoginCode("");
                        form.setValue("loginCode", undefined);
                        form.setValue("password", undefined);
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none flex-1">
                  <FormLabel
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const newValue = !(field.value === true);
                      field.onChange(newValue);
                      if (!newValue) {
                        form.setValue("accessType", "code");
                        setLoginCode("");
                        form.setValue("loginCode", undefined);
                        form.setValue("password", undefined);
                      }
                    }}
                  >
                    {t("createAccountLabel")}
                  </FormLabel>
                  <FormDescription>
                    {t("createAccountDescription")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {createAccount && (
            <>
              <FormField
                control={form.control}
                name="accessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("accessTypeLabel")}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === "code" && !loginCode) {
                          const code = generateAlphanumericPassword(8);
                          setLoginCode(code);
                          form.setValue("loginCode", code);
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("accessTypePlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="code">{t("accessTypes.code")}</SelectItem>
                        <SelectItem value="email">{t("accessTypes.email")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {accessType === "code" && (
                <>
                  <div className="bg-muted border-border flex gap-3 rounded-lg border p-4">
                    <Info className="text-muted-foreground h-4 w-4 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{t("usernameInfoTitle")}</h4>
                      <p className="text-muted-foreground text-sm">
                        {t("usernameInfoDescription")}
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="loginCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("usernameLabel")}</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder={t("usernamePlaceholder")}
                              value={loginCode}
                              onChange={(e) => {
                                const value = e.target.value;
                                setLoginCode(value);
                                field.onChange(value);
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGenerateCode}
                              className="shrink-0"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          {doctor ? t("usernameDescriptionEdit") : t("usernameDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("passwordLabel")}</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={t("passwordPlaceholder")}
                                {...field}
                                value={field.value || ""}
                                className="pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGeneratePassword}
                              className="shrink-0"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          A senha será gerada automaticamente (8 caracteres alfanuméricos) se deixada em branco.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {accessType === "email" && (
                <>
                  <div className="bg-muted border-border flex gap-3 rounded-lg border p-4">
                    <Info className="text-muted-foreground h-4 w-4 shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{t("accountInfoTitle")}</h4>
                      <p className="text-muted-foreground text-sm">
                        {t("accountInfoDescriptionNew")}
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("emailAccessLabel")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder={t("emailAccessPlaceholder")}
                            {...field}
                            readOnly
                          />
                        </FormControl>
                        <FormDescription>
                          {t("emailAccessDescriptionNew")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("passwordLabel")}</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={t("passwordPlaceholder")}
                                {...field}
                                value={field.value || ""}
                                className="pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGeneratePassword}
                              className="shrink-0"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          A senha será gerada automaticamente (8 caracteres alfanuméricos) se deixada em branco.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </>
          )}
        </>
      )}

      {doctor && (
        <>
          <FormField
            control={form.control}
            name="accessType"
            render={({ field }) => {
              // Determinar o tipo atual baseado no email do usuário
              const currentEmail = form.watch("email") || doctor.email;
              const isCurrentlyCode = currentEmail?.endsWith("@clinixflow.local");
              const currentAccessType = isCurrentlyCode ? "code" : "email";
              
              // Inicializar accessType se não estiver definido
              if (!field.value) {
                field.onChange(currentAccessType);
              }

              return (
                <FormItem>
                  <FormLabel>Tipo de acesso</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Se mudou para code e não tem loginCode, gerar um
                      if (value === "code" && !loginCode) {
                        const code = generateAlphanumericPassword(8);
                        setLoginCode(code);
                        form.setValue("loginCode", code);
                      }
                    }}
                    value={field.value || currentAccessType}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo de acesso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="code">Usuário</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Você pode alterar o tipo de login entre nome de usuário e email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {form.watch("accessType") === "code" && (
            <>
              <div className="bg-muted border-border flex gap-3 rounded-lg border p-4">
                <Info className="text-muted-foreground h-4 w-4 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Nome de Usuário</h4>
                  <p className="text-muted-foreground text-sm">
                    Defina um nome de usuário único para login do profissional.
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="loginCode"
                render={({ field }) => {
                  // Se não tem loginCode e o email atual é código, extrair
                  if (!loginCode && form.watch("email")?.endsWith("@clinixflow.local")) {
                    const extractedCode = form.watch("email")?.replace("@clinixflow.local", "");
                    if (extractedCode) {
                      setLoginCode(extractedCode);
                      field.onChange(extractedCode);
                    }
                  }

                  return (
                    <FormItem>
                      <FormLabel>Nome de usuário</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Digite um nome de usuário (ex: hugo.almeida) ou use o gerado"
                            value={loginCode}
                            onChange={(e) => {
                              const value = e.target.value;
                              setLoginCode(value);
                              field.onChange(value);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGenerateCode}
                            className="shrink-0"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Este nome de usuário será usado junto com a senha para fazer login.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </>
          )}

          {form.watch("accessType") === "email" && (
            <>
              <div className="bg-muted border-border flex gap-3 rounded-lg border p-4">
                <Info className="text-muted-foreground h-4 w-4 shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Conta de Acesso</h4>
                  <p className="text-muted-foreground text-sm">
                    O email do profissional será usado para login.
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email para acesso</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="exemplo@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Este email será usado para fazer login.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova senha</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Deixe em branco para manter a senha atual"
                        {...field}
                        value={field.value || ""}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGeneratePassword}
                      className="shrink-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Digite uma nova senha para alterar ou deixe em branco para manter a atual.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}

