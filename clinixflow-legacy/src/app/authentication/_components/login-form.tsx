"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  emailOrLoginCode: z
    .string()
    .trim()
    .min(1, { message: "Email ou usuário é obrigatório" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
});

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrLoginCode: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    // Se não contém "@", é loginCode - adicionar domínio fictício
    // Se contém "@", é email real - usar diretamente
    const emailForAuth = values.emailOrLoginCode.includes("@")
      ? values.emailOrLoginCode.trim()
      : `${values.emailOrLoginCode.trim()}@clinixflow.local`;

    await authClient.signIn.email(
      {
        email: emailForAuth,
        password: values.password,
      },
      {
        onSuccess: () => {
          toast.success("Login realizado com sucesso!");
          router.push("/dashboard");
        },
        onError: () => {
          toast.error("Email/usuário ou senha inválidos!");
        },
      },
    );
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle>Faça Login</CardTitle>
            <CardDescription>
              Faça login para acessar o sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="emailOrLoginCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email ou Usuário</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite seu email ou nome de usuário" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
            <Button className="w-full">
              <Link href="/">Voltar</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
