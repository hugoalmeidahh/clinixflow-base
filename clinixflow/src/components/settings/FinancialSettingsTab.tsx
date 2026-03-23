import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/EmptyState";
import { toast } from "sonner";
import { Plus, ChevronRight, Tag, Building2, Loader2, Pencil, PowerOff } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface FinancialCategory {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
  parent_id: string | null;
  is_active: boolean;
  children?: FinancialCategory[];
}

interface CostCenter {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const buildTree = (cats: FinancialCategory[]): FinancialCategory[] => {
  const map = new Map(cats.map(c => [c.id, { ...c, children: [] as FinancialCategory[] }]));
  const roots: FinancialCategory[] = [];
  map.forEach(cat => {
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children!.push(cat);
    } else {
      roots.push(cat);
    }
  });
  return roots;
};

// ── CategoryRow (recursive) ───────────────────────────────────────────────────

const CategoryRow = ({
  cat,
  depth,
  onEdit,
  onToggle,
  onAddChild,
}: {
  cat: FinancialCategory;
  depth: number;
  onEdit: (cat: FinancialCategory) => void;
  onToggle: (cat: FinancialCategory) => void;
  onAddChild: (parent: FinancialCategory) => void;
}) => (
  <>
    <TableRow className={!cat.is_active ? "opacity-50" : undefined}>
      <TableCell style={{ paddingLeft: `${16 + depth * 20}px` }} className="flex items-center gap-2">
        {depth > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
        <span className="font-medium text-sm">{cat.name}</span>
      </TableCell>
      <TableCell>
        <Badge variant={cat.type === "INCOME" ? "default" : "secondary"} className="text-xs">
          {cat.type === "INCOME" ? "Receita" : "Despesa"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={cat.is_active ? "outline" : "secondary"} className="text-xs">
          {cat.is_active ? "Ativo" : "Inativo"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button size="icon" variant="ghost" className="h-7 w-7" title="Adicionar subcategoria" onClick={() => onAddChild(cat)}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(cat)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onToggle(cat)} title={cat.is_active ? "Inativar" : "Ativar"}>
            <PowerOff className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
    {cat.children?.map(child => (
      <CategoryRow key={child.id} cat={child} depth={depth + 1} onEdit={onEdit} onToggle={onToggle} onAddChild={onAddChild} />
    ))}
  </>
);

// ── Main Component ────────────────────────────────────────────────────────────

const FinancialSettingsTab = () => {
  const { tenantId } = useAuth();

  // Categories
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catDialog, setCatDialog] = useState(false);
  const [catSaving, setCatSaving] = useState(false);
  const [editingCat, setEditingCat] = useState<FinancialCategory | null>(null);
  const [catForm, setCatForm] = useState({ name: "", type: "INCOME" as "INCOME" | "EXPENSE", parent_id: "" });

  // Cost Centers
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [ccLoading, setCcLoading] = useState(true);
  const [ccDialog, setCcDialog] = useState(false);
  const [ccSaving, setCcSaving] = useState(false);
  const [editingCc, setEditingCc] = useState<CostCenter | null>(null);
  const [ccForm, setCcForm] = useState({ code: "", name: "" });

  const fetchCategories = async () => {
    if (!tenantId) return;
    const { data } = await (supabase as any).from("financial_categories").select("*").eq("tenant_id", tenantId).order("name");
    setCategories(data || []);
    setCatLoading(false);
  };

  const fetchCostCenters = async () => {
    if (!tenantId) return;
    const { data } = await (supabase as any).from("cost_centers").select("*").eq("tenant_id", tenantId).order("code");
    setCostCenters(data || []);
    setCcLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchCostCenters();
  }, [tenantId]);

  // ── Category handlers ─────────────────────────────────────────────────────

  const openNewCategory = (parent?: FinancialCategory) => {
    setEditingCat(null);
    setCatForm({ name: "", type: parent?.type || "INCOME", parent_id: parent?.id || "" });
    setCatDialog(true);
  };

  const openEditCategory = (cat: FinancialCategory) => {
    setEditingCat(cat);
    setCatForm({ name: cat.name, type: cat.type, parent_id: cat.parent_id || "" });
    setCatDialog(true);
  };

  const handleSaveCategory = async () => {
    if (!tenantId || !catForm.name) return;
    setCatSaving(true);
    const payload = {
      tenant_id: tenantId,
      name: catForm.name,
      type: catForm.type,
      parent_id: catForm.parent_id || null,
    };
    const { error } = editingCat
      ? await (supabase as any).from("financial_categories").update(payload).eq("id", editingCat.id)
      : await (supabase as any).from("financial_categories").insert(payload);
    if (error) toast.error(error.message);
    else {
      toast.success(editingCat ? "Categoria atualizada!" : "Categoria criada!");
      setCatDialog(false);
      fetchCategories();
    }
    setCatSaving(false);
  };

  const handleToggleCategory = async (cat: FinancialCategory) => {
    const { error } = await (supabase as any)
      .from("financial_categories")
      .update({ is_active: !cat.is_active })
      .eq("id", cat.id);
    if (error) toast.error(error.message);
    else fetchCategories();
  };

  // ── Cost center handlers ──────────────────────────────────────────────────

  const openNewCostCenter = () => {
    setEditingCc(null);
    setCcForm({ code: "", name: "" });
    setCcDialog(true);
  };

  const openEditCostCenter = (cc: CostCenter) => {
    setEditingCc(cc);
    setCcForm({ code: cc.code, name: cc.name });
    setCcDialog(true);
  };

  const handleSaveCostCenter = async () => {
    if (!tenantId || !ccForm.code || !ccForm.name) return;
    setCcSaving(true);
    const payload = { tenant_id: tenantId, code: ccForm.code.toUpperCase(), name: ccForm.name };
    const { error } = editingCc
      ? await (supabase as any).from("cost_centers").update(payload).eq("id", editingCc.id)
      : await (supabase as any).from("cost_centers").insert(payload);
    if (error) toast.error(error.code === "23505" ? "Código já existe neste tenant." : error.message);
    else {
      toast.success(editingCc ? "Centro atualizado!" : "Centro de custo criado!");
      setCcDialog(false);
      fetchCostCenters();
    }
    setCcSaving(false);
  };

  const handleToggleCostCenter = async (cc: CostCenter) => {
    const { error } = await (supabase as any).from("cost_centers").update({ is_active: !cc.is_active }).eq("id", cc.id);
    if (error) toast.error(error.message);
    else fetchCostCenters();
  };

  const incomeTree = buildTree(categories.filter(c => c.type === "INCOME"));
  const expenseTree = buildTree(categories.filter(c => c.type === "EXPENSE"));

  return (
    <div className="space-y-6">
      {/* ── Financial Categories ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            Plano de Contas
          </CardTitle>
          <Button size="sm" onClick={() => openNewCategory()}>
            <Plus className="h-4 w-4 mr-1" />
            Nova Categoria
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {catLoading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : categories.length === 0 ? (
            <EmptyState icon={Tag} title="Nenhuma categoria" description="Crie categorias de receita e despesa." actionLabel="Nova Categoria" onAction={() => openNewCategory()} />
          ) : (
            <>
              {incomeTree.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Receitas</p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incomeTree.map(cat => (
                        <CategoryRow key={cat.id} cat={cat} depth={0} onEdit={openEditCategory} onToggle={handleToggleCategory} onAddChild={openNewCategory} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {expenseTree.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Despesas</p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseTree.map(cat => (
                        <CategoryRow key={cat.id} cat={cat} depth={0} onEdit={openEditCategory} onToggle={handleToggleCategory} onAddChild={openNewCategory} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Cost Centers ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Centros de Custo
          </CardTitle>
          <Button size="sm" onClick={openNewCostCenter}>
            <Plus className="h-4 w-4 mr-1" />
            Novo Centro
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {ccLoading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
          ) : costCenters.length === 0 ? (
            <EmptyState icon={Building2} title="Nenhum centro de custo" description="Crie centros de custo para classificar os lançamentos." actionLabel="Novo Centro" onAction={openNewCostCenter} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {costCenters.map(cc => (
                  <TableRow key={cc.id} className={!cc.is_active ? "opacity-50" : undefined}>
                    <TableCell className="font-mono text-sm font-semibold">{cc.code}</TableCell>
                    <TableCell className="font-medium text-sm">{cc.name}</TableCell>
                    <TableCell>
                      <Badge variant={cc.is_active ? "outline" : "secondary"} className="text-xs">
                        {cc.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEditCostCenter(cc)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleToggleCostCenter(cc)}>
                          <PowerOff className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── Category Dialog ───────────────────────────────────────────────── */}
      <Dialog open={catDialog} onOpenChange={setCatDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingCat ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={catForm.type}
                onChange={e => setCatForm(p => ({ ...p, type: e.target.value as any }))}
                disabled={!!catForm.parent_id}
              >
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
              </select>
            </div>
            {catForm.parent_id && (
              <div className="space-y-2">
                <Label>Categoria Pai</Label>
                <p className="text-sm text-muted-foreground">
                  {categories.find(c => c.id === catForm.parent_id)?.name}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={catForm.name} onChange={e => setCatForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Consultas, Aluguel..." />
            </div>
            <Button onClick={handleSaveCategory} disabled={catSaving || !catForm.name} className="w-full">
              {catSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCat ? "Salvar" : "Criar Categoria"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Cost Center Dialog ────────────────────────────────────────────── */}
      <Dialog open={ccDialog} onOpenChange={setCcDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingCc ? "Editar Centro de Custo" : "Novo Centro de Custo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Código *</Label>
              <Input
                value={ccForm.code}
                onChange={e => setCcForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="Ex: ADM, CLIN, MKT"
                className="font-mono"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">Código alfanumérico único por clínica.</p>
            </div>
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={ccForm.name} onChange={e => setCcForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Administrativo, Clínico" />
            </div>
            <Button onClick={handleSaveCostCenter} disabled={ccSaving || !ccForm.code || !ccForm.name} className="w-full">
              {ccSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCc ? "Salvar" : "Criar Centro de Custo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialSettingsTab;
