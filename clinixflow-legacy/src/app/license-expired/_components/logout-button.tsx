"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Você saiu da sua conta!");
          router.push("/authentication");
        },
      },
    });
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Fazer Logout
    </Button>
  );
}
