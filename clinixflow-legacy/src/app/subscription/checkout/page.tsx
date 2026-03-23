import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { CheckoutForm } from "./_components/checkout-form";

export const metadata: Metadata = {
  title: "Checkout - Solicitar Licença",
  description: "Solicite sua licença para usar o sistema",
};

export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (session.user.role === "doctor" || session.user.role === "patient") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <CheckoutForm />
    </div>
  );
}

