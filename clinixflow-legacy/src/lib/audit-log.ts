"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { auditLogTable } from "@/src/db/schema";

type AuditAction = "create" | "update" | "delete" | "view" | "login" | "logout" | "export" | "import";

interface CreateAuditLogParams {
  action: AuditAction;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  description?: string;
  clinicId?: string | null;
}

/**
 * Cria um registro de auditoria no banco de dados
 */
export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id || null;
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null;
    const userAgent = headersList.get("user-agent") || null;

    await db.insert(auditLogTable).values({
      userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      oldValues: params.oldValues ? JSON.stringify(params.oldValues) : null,
      newValues: params.newValues ? JSON.stringify(params.newValues) : null,
      description: params.description || null,
      ipAddress,
      userAgent,
      clinicId: params.clinicId || null,
    });
  } catch (error) {
    // Não queremos que erros de auditoria quebrem o fluxo principal
    // Apenas logamos o erro
    console.error("Erro ao criar log de auditoria:", error);
  }
}

/**
 * Helper para criar log de criação
 */
export async function logCreate(
  entityType: string,
  entityId: string,
  newValues: Record<string, unknown>,
  description?: string,
  clinicId?: string | null,
) {
  await createAuditLog({
    action: "create",
    entityType,
    entityId,
    newValues,
    description,
    clinicId,
  });
}

/**
 * Helper para criar log de atualização
 */
export async function logUpdate(
  entityType: string,
  entityId: string,
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>,
  description?: string,
  clinicId?: string | null,
) {
  await createAuditLog({
    action: "update",
    entityType,
    entityId,
    oldValues,
    newValues,
    description,
    clinicId,
  });
}

/**
 * Helper para criar log de exclusão
 */
export async function logDelete(
  entityType: string,
  entityId: string,
  oldValues: Record<string, unknown>,
  description?: string,
  clinicId?: string | null,
) {
  await createAuditLog({
    action: "delete",
    entityType,
    entityId,
    oldValues,
    description,
    clinicId,
  });
}
