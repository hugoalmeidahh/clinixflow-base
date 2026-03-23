import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import { toast } from "@/components/ui/sonner";
import { Plus, Trash2, CalendarOff } from "lucide-react";

interface Holiday {
  id: string;
  date: string;
  name: string;
  is_recurring: boolean;
}

const HolidaysTab = () => {
  const { tenantId } = useAuth();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ date: "", name: "", isRecurring: false });
  const [saving, setSaving] = useState(false);

  const fetchHolidays = async () => {
    if (!tenantId) return;
    const { data } = await supabase
      .from("tenant_holidays")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("date");
    setHolidays((data as Holiday[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchHolidays(); }, [tenantId]);

  const handleCreate = async () => {
    if (!tenantId || !form.date || !form.name) return;
    setSaving(true);
    const { error } = await supabase.from("tenant_holidays").insert({
      tenant_id: tenantId,
      date: form.date,
      name: form.name,
      is_recurring: form.isRecurring,
    });
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Este feriado já está cadastrado." : error.message);
    } else {
      toast.success("Feriado adicionado!");
      setDialog(false);
      setForm({ date: "", name: "", isRecurring: false });
      fetchHolidays();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tenant_holidays").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Feriado removido!");
      fetchHolidays();
    }
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading">Feriados</CardTitle>
        <Dialog open={dialog} onOpenChange={setDialog}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo Feriado</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Feriado</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Natal" />
              </div>
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="recurring" checked={form.isRecurring} onCheckedChange={c => setForm(p => ({ ...p, isRecurring: !!c }))} />
                <Label htmlFor="recurring" className="text-sm font-normal cursor-pointer">
                  Repete todo ano (mesmo dia/mês)
                </Label>
              </div>
              <Button onClick={handleCreate} disabled={saving || !form.name || !form.date} className="w-full">
                {saving ? "Salvando..." : "Adicionar Feriado"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
        ) : holidays.length === 0 ? (
          <EmptyState icon={CalendarOff} title="Nenhum feriado" description="Adicione feriados para bloquear agendamentos nessas datas." actionLabel="+ Novo Feriado" onAction={() => setDialog(true)} />
        ) : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Data</TableHead><TableHead>Nome</TableHead><TableHead>Recorrente</TableHead><TableHead className="w-12"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {holidays.map(h => (
                <TableRow key={h.id}>
                  <TableCell className="font-mono text-sm">{formatDate(h.date)}</TableCell>
                  <TableCell className="font-medium">{h.name}</TableCell>
                  <TableCell>{h.is_recurring ? "Sim" : "Não"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(h.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default HolidaysTab;
