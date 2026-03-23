-- Adicionar subscription_id na tabela activation_codes
ALTER TABLE "activation_codes" ADD COLUMN IF NOT EXISTS "subscription_id" uuid;

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activation_codes" ADD CONSTRAINT "activation_codes_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

