import { Card, CardContent } from "@/components/ui/card";
import { ShieldOff } from "lucide-react";

const FeatureDisabled = () => (
  <Card className="mx-auto max-w-md mt-12">
    <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
      <ShieldOff className="h-10 w-10 text-muted-foreground" />
      <h2 className="text-lg font-semibold">Funcionalidade indisponível</h2>
      <p className="text-sm text-muted-foreground">
        Esta funcionalidade não está habilitada para o seu portal. Entre em contato com a clínica para mais informações.
      </p>
    </CardContent>
  </Card>
);

export default FeatureDisabled;
