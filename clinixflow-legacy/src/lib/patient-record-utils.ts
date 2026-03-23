/**
 * Utilitários para manipulação de dados de prontuários
 */

const MASKED_CONTENT = "**********";

/**
 * Mascara o conteúdo de uma evolução se o profissional não for o responsável
 */
export function maskPatientRecordContent<T extends {
  doctorId: string | null;
  content?: string | null;
  avaliationContent?: string | null;
}>(
  record: T | null,
  userDoctorId: string | null | undefined,
): T | null {
  if (!record || !userDoctorId) {
    return record;
  }

  // Se for o profissional responsável, retorna sem máscara
  if (record.doctorId === userDoctorId) {
    return record;
  }

  // Se não for o responsável, mascara o conteúdo
  return {
    ...record,
    content: record.content ? MASKED_CONTENT : record.content,
    avaliationContent: record.avaliationContent ? MASKED_CONTENT : record.avaliationContent,
  };
}

/**
 * Mascara conteúdo em um array de evoluções
 */
export function maskPatientRecordsContent<T extends {
  doctorId: string | null;
  content?: string | null;
  avaliationContent?: string | null;
}>(
  records: T[],
  userDoctorId: string | null | undefined,
): T[] {
  if (!userDoctorId) {
    return records.map((record) => ({
      ...record,
      content: record.content ? MASKED_CONTENT : record.content,
      avaliationContent: record.avaliationContent ? MASKED_CONTENT : record.avaliationContent,
    }));
  }

  return records.map((record) => maskPatientRecordContent(record, userDoctorId) as T);
}
