import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/hooks/useTenant";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Loader2, RotateCcw, Save, Info } from "lucide-react";
import {
  defaultPermissions, mergePermissions, allResources, resourceActions,
  resourceLabels, actionLabels, roleLabels, allRoles,
  type Resource, type Action, type RolePermissions,
} from "@/lib/permissions";
import type { Database } from "@/integrations/supabase/types";

type ModuleType = Database["public"]["Enums"]["module_type"];

// Map resources to modules (resources not listed are BASE/always visible)
const resourceModuleMap: Partial<Record<Resource, ModuleType>> = {
  evaluations: "EVALUATIONS",
  financial: "FINANCIAL",
  reports: "REPORTS",
  vaccines: "VACCINES",
};

const PermissionsTab = () => {
  const { tenantId } = useAuth();
  const { tenant } = useTenant();
  const [selectedRole, setSelectedRole] = useState<string>("MANAGER");
  const [permissions, setPermissions] = useState<RolePermissions>({});
  const [overrides, setOverrides] = useState<Record<string, RolePermissions>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const activeModules: ModuleType[] = (tenant?.active_modules as ModuleType[]) || ["BASE"];

  // Filter resources: only show resources whose module is active
  const visibleResources = allResources.filter(resource => {
    const requiredModule = resourceModuleMap[resource];
    if (!requiredModule) return true; // BASE resources always visible
    return activeModules.includes(requiredModule);
  });

  // Fetch tenant overrides
  useEffect(() => {
    if (!tenantId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("role_permissions").select("role, permissions").eq("tenant_id", tenantId);
      const map: Record<string, RolePermissions> = {};
      (data || []).forEach((row: any) => { map[row.role] = row.permissions as RolePermissions; });
      setOverrides(map);
      setLoading(false);
    };
    fetch();
  }, [tenantId]);

  useEffect(() => {
    const defaults = defaultPermissions[selectedRole] || {};
    const roleOverrides = overrides[selectedRole] || {};
    setPermissions(mergePermissions(defaults, roleOverrides));
  }, [selectedRole, overrides]);

  const togglePermission = (resource: Resource, action: Action) => {
    setPermissions(prev => ({
      ...prev,
      [resource]: { ...(prev[resource] || {}), [action]: !(prev[resource]?.[action] ?? false) },
    }));
  };

  const toggleResourceAll = (resource: Resource) => {
    const actions = resourceActions[resource];
    const allEnabled = actions.every(a => permissions[resource]?.[a]);
    setPermissions(prev => ({
      ...prev,
      [resource]: Object.fromEntries(actions.map(a => [a, !allEnabled])),
    }));
  };

  const handleSave = async () => {
    if (!tenantId) return;
    setSaving(true);
    const { error } = await supabase.from("role_permissions").upsert(
      { tenant_id: tenantId, role: selectedRole, permissions: permissions as any },
      { onConflict: "tenant_id,role" }
    );
    if (error) toast.error(error.message);
    else { setOverrides(prev => ({ ...prev, [selectedRole]: permissions })); toast.success("Permissões salvas!"); }
    setSaving(false);
  };

  const handleReset = () => {
    const defaults = defaultPermissions[selectedRole] || {};
    setPermissions(mergePermissions(defaults, {}));
  };

  const editableRoles = allRoles.filter(r => r !== "ORG_ADMIN");

  if (loading) {
    return (
      <Card><CardContent className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></CardContent></Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Permissões por Função</CardTitle>
          <CardDescription>Configure o que cada função pode fazer. Administradores sempre têm acesso total. Módulos inativos não são exibidos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                {editableRoles.map(role => (
                  <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {overrides[selectedRole] && <Badge variant="secondary" className="text-xs">Customizado</Badge>}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Recurso</th>
                    {(["view", "create", "edit", "delete", "export"] as Action[]).map(action => (
                      <th key={action} className="text-center py-3 px-3 font-medium min-w-[80px]">{actionLabels[action]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleResources.map(resource => {
                    const actions = resourceActions[resource];
                    const allEnabled = actions.every(a => permissions[resource]?.[a]);
                    return (
                      <tr key={resource} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <button onClick={() => toggleResourceAll(resource)} className="flex items-center gap-2 text-left font-medium hover:text-primary transition-colors">
                            <Checkbox checked={allEnabled} className="pointer-events-none" />
                            {resourceLabels[resource]}
                          </button>
                        </td>
                        {(["view", "create", "edit", "delete", "export"] as Action[]).map(action => {
                          const applicable = actions.includes(action);
                          const checked = permissions[resource]?.[action] ?? false;
                          return (
                            <td key={action} className="text-center py-3 px-3">
                              {applicable ? (
                                <div className="flex justify-center">
                                  <Checkbox checked={checked} onCheckedChange={() => togglePermission(resource, action)} />
                                </div>
                              ) : (
                                <span className="text-muted-foreground/30">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              As permissões padrão são definidas pelo sistema. Você pode personalizar para a sua organização.
              Clique em <strong>Restaurar padrão</strong> para voltar às configurações originais.
              Módulos inativos são ocultados automaticamente.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Restaurar padrão
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Salvar permissões
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsTab;
