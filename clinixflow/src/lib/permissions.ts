// Default RBAC permissions per role
// Tenant admins can override these via Settings > Permissões

export type Resource =
  | "dashboard"
  | "patients"
  | "team"
  | "appointments"
  | "inconsistencies"
  | "documents"
  | "evaluations"
  | "financial"
  | "reports"
  | "vaccines"
  | "settings";

export type Action = "view" | "create" | "edit" | "delete" | "export";

export type ResourcePermissions = Partial<Record<Action, boolean>>;
export type RolePermissions = Partial<Record<Resource, ResourcePermissions>>;

export const resourceLabels: Record<Resource, string> = {
  dashboard: "Dashboard",
  patients: "Pacientes",
  team: "Equipe",
  appointments: "Agendamentos",
  inconsistencies: "Inconsistências",
  documents: "Documentos",
  evaluations: "Avaliações",
  financial: "Financeiro",
  reports: "Relatórios",
  vaccines: "Vacinas",
  settings: "Configurações",
};

export const actionLabels: Record<Action, string> = {
  view: "Visualizar",
  create: "Criar",
  edit: "Editar",
  delete: "Excluir",
  export: "Exportar",
};

export const allResources: Resource[] = [
  "dashboard", "patients", "team", "appointments", "inconsistencies",
  "documents", "evaluations", "financial", "reports", "vaccines", "settings",
];

export const allActions: Action[] = ["view", "create", "edit", "delete", "export"];

export const roleLabels: Record<string, string> = {
  ORG_ADMIN: "Administrador",
  MANAGER: "Gerente",
  HEALTH_PROFESSIONAL: "Profissional de Saúde",
  RECEPTIONIST: "Recepcionista",
  FINANCIAL: "Financeiro",
  PATIENT: "Paciente",
};

export const allRoles = [
  "ORG_ADMIN", "MANAGER", "HEALTH_PROFESSIONAL", "RECEPTIONIST", "FINANCIAL", "PATIENT",
] as const;

// Actions that apply to each resource
export const resourceActions: Record<Resource, Action[]> = {
  dashboard: ["view"],
  patients: ["view", "create", "edit", "delete", "export"],
  team: ["view", "create", "edit", "delete"],
  appointments: ["view", "create", "edit", "delete", "export"],
  inconsistencies: ["view", "edit"],
  documents: ["view", "create", "edit", "delete"],
  evaluations: ["view", "create", "edit", "delete"],
  financial: ["view", "create", "edit", "delete", "export"],
  reports: ["view", "export"],
  vaccines: ["view", "create", "edit", "delete"],
  settings: ["view", "edit"],
};

const full = (actions: Action[]): ResourcePermissions =>
  Object.fromEntries(actions.map(a => [a, true])) as ResourcePermissions;

const none = (actions: Action[]): ResourcePermissions =>
  Object.fromEntries(actions.map(a => [a, false])) as ResourcePermissions;

const pick = (actions: Action[], allowed: Action[]): ResourcePermissions =>
  Object.fromEntries(actions.map(a => [a, allowed.includes(a)])) as ResourcePermissions;

export const defaultPermissions: Record<string, RolePermissions> = {
  ORG_ADMIN: {
    dashboard: full(resourceActions.dashboard),
    patients: full(resourceActions.patients),
    team: full(resourceActions.team),
    appointments: full(resourceActions.appointments),
    inconsistencies: full(resourceActions.inconsistencies),
    documents: full(resourceActions.documents),
    evaluations: full(resourceActions.evaluations),
    financial: full(resourceActions.financial),
    reports: full(resourceActions.reports),
    vaccines: full(resourceActions.vaccines),
    settings: full(resourceActions.settings),
  },
  MANAGER: {
    dashboard: full(resourceActions.dashboard),
    patients: pick(resourceActions.patients, ["view", "create", "edit", "export"]),
    team: pick(resourceActions.team, ["view", "create", "edit"]),
    appointments: full(resourceActions.appointments),
    inconsistencies: full(resourceActions.inconsistencies),
    documents: pick(resourceActions.documents, ["view", "create", "edit"]),
    evaluations: pick(resourceActions.evaluations, ["view"]),
    financial: pick(resourceActions.financial, ["view", "create", "edit", "export"]),
    reports: full(resourceActions.reports),
    vaccines: pick(resourceActions.vaccines, ["view", "create", "edit"]),
    settings: full(resourceActions.settings),
  },
  HEALTH_PROFESSIONAL: {
    dashboard: full(resourceActions.dashboard),
    patients: pick(resourceActions.patients, ["view", "edit"]),
    team: pick(resourceActions.team, ["view"]),
    appointments: pick(resourceActions.appointments, ["view", "create", "edit"]),
    inconsistencies: pick(resourceActions.inconsistencies, ["view", "edit"]),
    documents: pick(resourceActions.documents, ["view", "create"]),
    evaluations: pick(resourceActions.evaluations, ["view", "create", "edit"]),
    financial: none(resourceActions.financial),
    reports: none(resourceActions.reports),
    vaccines: pick(resourceActions.vaccines, ["view", "create"]),
    settings: none(resourceActions.settings),
  },
  RECEPTIONIST: {
    dashboard: full(resourceActions.dashboard),
    patients: pick(resourceActions.patients, ["view", "create", "edit"]),
    team: pick(resourceActions.team, ["view"]),
    appointments: pick(resourceActions.appointments, ["view", "create", "edit"]),
    inconsistencies: pick(resourceActions.inconsistencies, ["view"]),
    documents: pick(resourceActions.documents, ["view", "create"]),
    evaluations: none(resourceActions.evaluations),
    financial: none(resourceActions.financial),
    reports: none(resourceActions.reports),
    vaccines: none(resourceActions.vaccines),
    settings: none(resourceActions.settings),
  },
  FINANCIAL: {
    dashboard: full(resourceActions.dashboard),
    patients: pick(resourceActions.patients, ["view"]),
    team: none(resourceActions.team),
    appointments: pick(resourceActions.appointments, ["view"]),
    inconsistencies: none(resourceActions.inconsistencies),
    documents: none(resourceActions.documents),
    evaluations: none(resourceActions.evaluations),
    financial: full(resourceActions.financial),
    reports: full(resourceActions.reports),
    vaccines: none(resourceActions.vaccines),
    settings: none(resourceActions.settings),
  },
  PATIENT: {
    dashboard: full(resourceActions.dashboard),
    patients: none(resourceActions.patients),
    team: none(resourceActions.team),
    appointments: pick(resourceActions.appointments, ["view"]),
    inconsistencies: none(resourceActions.inconsistencies),
    documents: pick(resourceActions.documents, ["view"]),
    evaluations: pick(resourceActions.evaluations, ["view"]),
    financial: none(resourceActions.financial),
    reports: none(resourceActions.reports),
    vaccines: pick(resourceActions.vaccines, ["view"]),
    settings: none(resourceActions.settings),
  },
};

// Deep merge: overrides on top of defaults
export function mergePermissions(
  defaults: RolePermissions,
  overrides: RolePermissions
): RolePermissions {
  const result: RolePermissions = {};
  for (const resource of allResources) {
    result[resource] = {
      ...(defaults[resource] || {}),
      ...(overrides[resource] || {}),
    };
  }
  return result;
}
