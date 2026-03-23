import { Resend } from "resend";

// Inicializar Resend apenas se a API key estiver disponível
// Isso permite que o código seja importado mesmo sem a variável definida
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendWelcomeEmail({
  to,
  password,
  clinicName,
  name,
}: {
  to: string;
  password: string;
  clinicName: string;
  name: string;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY não está configurada. Email não será enviado.");
    return;
  }

  try {
    await resend.emails.send({
      from: "ClinixFlow <noreply@clinixflow.com.br>",
      to,
      subject: `Bem-vindo à ${clinicName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0;">Bem-vindo ao ClinixFlow!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px; color: #374151;">Olá ${name},</p>
            
            <p style="font-size: 16px; color: #374151;">
              Você foi cadastrado na <strong>${clinicName}</strong> e já pode acessar o sistema ClinixFlow!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;"><strong>Acesso:</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 16px; color: #111827;"><strong>${to}</strong></p>
              
              <p style="margin: 15px 0 5px 0; font-size: 14px; color: #6b7280;"><strong>Senha temporária:</strong></p>
              <p style="margin: 0; font-size: 18px; color: #111827; letter-spacing: 2px; font-family: monospace;"><strong>${password}</strong></p>
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/authentication" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Acessar o Sistema
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              <strong>⚠️ Importante:</strong> Por segurança, recomendamos que você altere sua senha após o primeiro acesso.
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              Se você não solicitou este cadastro, pode ignorar este email.
            </p>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              © ${new Date().getFullYear()} ClinixFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  name,
}: {
  to: string;
  resetUrl: string;
  name: string;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY não está configurada. Email não será enviado.");
    return;
  }

  try {
    await resend.emails.send({
      from: "ClinixFlow <noreply@clinixflow.com.br>",
      to,
      subject: "Redefinição de Senha - ClinixFlow",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0;">Redefinição de Senha</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px; color: #374151;">Olá ${name},</p>
            
            <p style="font-size: 16px; color: #374151;">
              Você solicitou a redefinição de senha da sua conta no ClinixFlow.
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Redefinir Senha
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
              Este link expira em 1 hora. Se você não solicitou esta redefinição, pode ignorar este email.
            </p>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              © ${new Date().getFullYear()} ClinixFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Erro ao enviar email de redefinição:", error);
    throw error;
  }
}

