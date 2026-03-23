/**
 * Trata erros e retorna mensagens amigáveis para o usuário
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    // Erros do Better Auth
    if ("code" in error) {
      const errorCode = error.code as string;
      
      switch (errorCode) {
        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
          return "Este email já está em uso. Por favor, use outro email.";
        case "INVALID_EMAIL":
          return "Email inválido. Por favor, verifique o email informado.";
        case "INVALID_PASSWORD":
          return "Senha inválida. A senha deve ter pelo menos 8 caracteres.";
        case "USER_NOT_FOUND":
          return "Usuário não encontrado.";
        case "UNAUTHORIZED":
          return "Você não tem permissão para realizar esta ação.";
        default:
          return error.message || "Ocorreu um erro inesperado.";
      }
    }

    // Outros erros
    const message = error.message.toLowerCase();
    
    if (message.includes("email") && message.includes("já") || message.includes("already")) {
      return "Este email já está em uso. Por favor, use outro email.";
    }
    
    if (message.includes("unauthorized") || message.includes("não autenticado")) {
      return "Você não está autenticado. Por favor, faça login novamente.";
    }
    
    if (message.includes("clinic not found") || message.includes("clínica não encontrada")) {
      return "Clínica não encontrada. Por favor, verifique sua sessão.";
    }
    
    if (message.includes("doctor code not found") || message.includes("patient code not found")) {
      return "Erro ao processar código. Por favor, tente novamente.";
    }

    return error.message || "Ocorreu um erro inesperado.";
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "Ocorreu um erro inesperado. Por favor, tente novamente.";
}

/**
 * Extrai mensagem de erro do resultado do next-safe-action
 */
export function extractActionError(result: {
  serverError?: unknown;
  validationErrors?: unknown;
}): string | null {
  if (result.serverError) {
    return getErrorMessage(result.serverError);
  }

  if (result.validationErrors) {
    const errors = result.validationErrors as Record<string, string[]>;
    const firstError = Object.values(errors)[0]?.[0];
    return firstError || "Por favor, verifique os campos do formulário.";
  }

  return null;
}

