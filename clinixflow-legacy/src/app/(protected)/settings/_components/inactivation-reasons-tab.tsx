"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

interface InactivationReason {
  id: string;
  name: string;
  description?: string;
}

// Default reasons pre-populated
const defaultReasons: InactivationReason[] = [
  {
    id: "1",
    name: "Mudança de cidade",
    description: "Paciente mudou de cidade ou região",
  },
  {
    id: "2",
    name: "Insatisfação com o atendimento",
    description: "Paciente insatisfeito com o serviço prestado",
  },
  {
    id: "3",
    name: "Plano de saúde não aceito",
    description: "Convênio do paciente não é aceito pela clínica",
  },
  {
    id: "4",
    name: "Falecimento",
    description: "Paciente faleceu",
  },
  {
    id: "5",
    name: "Outros",
    description: "Outro motivo não listado",
  },
];

export function InactivationReasonsTab() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");

  // TODO: Replace with real data from server actions
  const [reasons, setReasons] = useState<InactivationReason[]>(defaultReasons);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<InactivationReason | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleAdd = () => {
    // TODO: Implement server action to add reason
    const newReason: InactivationReason = {
      id: String(Date.now()),
      name: formData.name,
      description: formData.description,
    };
    setReasons([...reasons, newReason]);
    setFormData({ name: "", description: "" });
    setIsAddDialogOpen(false);
  };

  const handleEdit = () => {
    if (!selectedReason) return;
    // TODO: Implement server action to update reason
    setReasons(
      reasons.map((r) =>
        r.id === selectedReason.id
          ? { ...r, name: formData.name, description: formData.description }
          : r
      )
    );
    setFormData({ name: "", description: "" });
    setSelectedReason(null);
    setIsEditDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement server action to delete reason
    if (confirm(t("deleteConfirmMessage"))) {
      setReasons(reasons.filter((r) => r.id !== id));
    }
  };

  const openEditDialog = (reason: InactivationReason) => {
    setSelectedReason(reason);
    setFormData({ name: reason.name, description: reason.description || "" });
    setIsEditDialogOpen(true);
  };

  const openAddDialog = () => {
    setFormData({ name: "", description: "" });
    setIsAddDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("inactivationReasons")}</CardTitle>
            <CardDescription>
              {t("inactivationReasonsDescription")}
            </CardDescription>
          </div>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addReason")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reasons.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            {t("noReasonsFound")}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("reasonName")}</TableHead>
                <TableHead>{t("reasonDescription")}</TableHead>
                <TableHead className="w-[100px]">{tCommon("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reasons.map((reason) => (
                <TableRow key={reason.id}>
                  <TableCell className="font-medium">{reason.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {reason.description || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(reason)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(reason.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addReason")}</DialogTitle>
            <DialogDescription>
              Adicione um novo motivo de inativação de pacientes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add-name">{t("reasonName")}</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Mudança de cidade"
              />
            </div>
            <div>
              <Label htmlFor="add-description">{t("reasonDescription")}</Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição opcional do motivo"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleAdd} disabled={!formData.name.trim()}>
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editReason")}</DialogTitle>
            <DialogDescription>
              Edite o motivo de inativação de pacientes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">{t("reasonName")}</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">{t("reasonDescription")}</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              {tCommon("cancel")}
            </Button>
            <Button onClick={handleEdit} disabled={!formData.name.trim()}>
              {tCommon("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}