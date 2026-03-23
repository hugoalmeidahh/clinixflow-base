/**
 * Utilitários para verificação de permissões por role
 */

export type UserRole =
  | "master"
  | "clinic_owner"
  | "clinic_admin"
  | "clinic_gestor"
  | "clinic_recepcionist"
  | "doctor"
  | "patient";

/**
 * Verifica se o role pode ver o valor da consulta
 */
export function canViewAppointmentPrice(role: string | undefined): boolean {
  if (!role) return false;
  // clinic_owner, clinic_admin e clinic_gestor podem ver
  // clinic_recepcionist, doctor e patient NÃO podem ver
  return ["clinic_owner", "clinic_admin", "clinic_gestor"].includes(role);
}

/**
 * Verifica se o role pode cadastrar profissionais
 */
export function canCreateDoctors(role: string | undefined): boolean {
  if (!role) return false;
  // Apenas owner, admin e gestor podem cadastrar profissionais
  return ["clinic_owner", "clinic_admin", "clinic_gestor"].includes(role);
}

/**
 * Verifica se o role pode cadastrar pacientes
 */
export function canCreatePatients(role: string | undefined): boolean {
  if (!role) return false;
  // owner, admin, gestor e recepcionist podem cadastrar pacientes
  return [
    "clinic_owner",
    "clinic_admin",
    "clinic_gestor",
    "clinic_recepcionist",
  ].includes(role);
}

/**
 * Verifica se o role pode fazer agendamentos
 */
export function canCreateAppointments(role: string | undefined): boolean {
  if (!role) return false;
  // owner, admin, gestor e recepcionist podem fazer agendamentos
  return [
    "clinic_owner",
    "clinic_admin",
    "clinic_gestor",
    "clinic_recepcionist",
  ].includes(role);
}

/**
 * Verifica se o role precisa de plano (subscription)
 */
export function requiresPlan(role: string | undefined): boolean {
  if (!role) return true;
  // Master, doctor e patient não precisam de plano
  return !["master", "doctor", "patient"].includes(role);
}

/**
 * Verifica se o role é um profissional da clínica (não paciente)
 */
export function isClinicStaff(role: string | undefined): boolean {
  if (!role) return false;
  return [
    "clinic_owner",
    "clinic_admin",
    "clinic_gestor",
    "clinic_recepcionist",
    "doctor",
  ].includes(role);
}

/**
 * Verifica se o usuário pode ver o conteúdo completo do prontuário
 * Regras:
 * - Apenas o profissional (doctor) que criou a evolução pode ver o conteúdo completo
 * - Admin/Owner NÃO podem ver conteúdo clínico (apenas metadados)
 * - Outros profissionais NÃO podem ver evoluções de outros profissionais
 */
export function canViewPatientRecordContent(
  userRole: string | undefined,
  userDoctorId: string | undefined,
  recordDoctorId: string | undefined,
): boolean {
  if (!userRole) return false;

  // Apenas profissionais (doctor) podem ver conteúdo
  if (userRole !== "doctor") {
    return false;
  }

  // Profissional só pode ver suas próprias evoluções
  if (!userDoctorId || !recordDoctorId) {
    return false;
  }

  return userDoctorId === recordDoctorId;
}

/**
 * Verifica se o role pode acessar prontuários (mesmo que apenas metadados)
 */
export function canAccessPatientRecords(role: string | undefined): boolean {
  if (!role) return false;
  // Apenas profissionais podem acessar prontuários
  return role === "doctor";
}
