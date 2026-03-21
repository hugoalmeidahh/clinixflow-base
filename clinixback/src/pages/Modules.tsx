import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Pencil, Package } from "lucide-react";

interface Module {
  id: string;
  key: string;
  name: string;
  description: string | null;
  price_monthly: number;
  is_available_as_addon: boolean;
  is_active: boolean;
}

interface ModuleForm {
  id?: string;
  key: string;
  name: string;
  description: string;
  price_monthly: number;
  is_available_as_addon: boolean;
  is_active: boolean;
}

const fmt = (c: number) =>
  c === 0
    ? "Grátis"
    : `R$ ${(c / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês`;

const emptyForm: ModuleForm = {
  key: "",
  name: "",
  description: "",
  price_monthly: 0,
  is_available_as_addon: false,
  is_active: true,
};

export default function Modules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ModuleForm>(emptyForm);

  const fetchModules = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("modules")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Erro ao carregar módulos: " + error.message);
    } else {
      setModules(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (mod: Module) => {
    setForm({
      id: mod.id,
      key: mod.key,
      name: mod.name,
      description: mod.description || "",
      price_monthly: mod.price_monthly,
      is_available_as_addon: mod.is_available_as_addon,
      is_active: mod.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.key.trim() || !form.name.trim()) {
      toast.error("Chave e nome são obrigatórios.");
      return;
    }

    setSaving(true);
    const payload: Record<string, unknown> = {
      key: form.key.trim(),
      name: form.name.trim(),
      description: form.description.trim() || null,
      price_monthly: form.price_monthly,
      is_available_as_addon: form.is_available_as_addon,
      is_active: form.is_active,
    };

    if (form.id) {
      payload.id = form.id;
    }

    const { error } = await (supabase as any)
      .from("modules")
      .upsert(payload);

    if (error) {
      toast.error("Erro ao salvar módulo: " + error.message);
    } else {
      toast.success(form.id ? "Módulo atualizado." : "Módulo criado.");
      setDialogOpen(false);
      fetchModules();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="font-heading text-2xl font-bold">Módulos</h1>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Módulo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Catálogo de Módulos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : modules.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Nenhum módulo cadastrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chave</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Add-on</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((mod) => (
                  <TableRow key={mod.id}>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                        {mod.key}
                      </code>
                    </TableCell>
                    <TableCell className="font-medium">{mod.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                      {mod.description || "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {fmt(mod.price_monthly)}
                    </TableCell>
                    <TableCell>
                      {mod.is_available_as_addon ? (
                        <Badge variant="secondary">Sim</Badge>
                      ) : (
                        <Badge variant="outline">Não</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {mod.is_active ? (
                        <Badge className="bg-green-500 text-white hover:bg-green-600">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(mod)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {form.id ? "Editar Módulo" : "Novo Módulo"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="mod-key">
                Chave <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mod-key"
                placeholder="ex: FINANCIAL"
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mod-name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mod-name"
                placeholder="ex: Módulo Financeiro"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mod-description">Descrição</Label>
              <Textarea
                id="mod-description"
                placeholder="Descrição opcional do módulo"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mod-price">Preço add-on (centavos)</Label>
              <Input
                id="mod-price"
                type="number"
                min={0}
                placeholder="0"
                value={form.price_monthly}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price_monthly: parseInt(e.target.value, 10) || 0,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Valor formatado: {fmt(form.price_monthly)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="mod-addon"
                checked={form.is_available_as_addon}
                onCheckedChange={(v) =>
                  setForm({ ...form, is_available_as_addon: !!v })
                }
              />
              <Label htmlFor="mod-addon" className="cursor-pointer">
                Disponível como add-on
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="mod-active"
                checked={form.is_active}
                onCheckedChange={(v) =>
                  setForm({ ...form, is_active: !!v })
                }
              />
              <Label htmlFor="mod-active" className="cursor-pointer">
                Módulo ativo
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
