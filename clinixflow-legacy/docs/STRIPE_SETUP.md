# Configuração do Stripe

## Variáveis de Ambiente Necessárias

Para que o sistema de pagamentos funcione corretamente, você precisa configurar as seguintes variáveis de ambiente:

### Stripe Configuration
```env
STRIPE_SECRET_KEY=sk_test_...                    # Chave secreta do Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...   # Chave pública do Stripe
STRIPE_WEBHOOK_SECRET=whsec_...                  # Secret do webhook do Stripe
STRIPE_ESSENTIAL_PLAN_PRICE_ID=price_...         # ID do plano no Stripe
```

### App Configuration
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000        # URL da aplicação
NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/session/...  # URL do portal do cliente
```

## Como Obter as Chaves do Stripe

1. Acesse o [Dashboard do Stripe](https://dashboard.stripe.com/)
2. Vá para **Developers > API keys**
3. Copie as chaves de teste (test keys) para desenvolvimento
4. Para produção, use as chaves live

## Como Configurar o Webhook

1. No Dashboard do Stripe, vá para **Developers > Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://seu-dominio.com/api/stripe/webhook`
4. Eventos a escutar:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## Como Criar o Plano no Stripe

1. No Dashboard do Stripe, vá para **Products**
2. Crie um novo produto chamado "Essential"
3. Configure o preço como R$ 59/mês
4. Copie o `price_id` gerado
5. Use esse ID na variável `STRIPE_ESSENTIAL_PLAN_PRICE_ID`

## Modo de Desenvolvimento

Atualmente, o sistema está configurado para funcionar em modo de desenvolvimento sem as chaves do Stripe. Isso permite que você teste o fluxo de assinatura sem configurar o Stripe imediatamente.

Quando estiver pronto para usar o Stripe real:
1. Configure todas as variáveis de ambiente
2. O sistema automaticamente usará o Stripe real em vez do modo de simulação

## Troubleshooting

- **Erro "Stripe secret key not found"**: Configure a variável `STRIPE_SECRET_KEY`
- **Erro "Stripe publishable key not found"**: Configure a variável `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Webhook não funcionando**: Verifique se a URL do webhook está correta e se o secret está configurado 