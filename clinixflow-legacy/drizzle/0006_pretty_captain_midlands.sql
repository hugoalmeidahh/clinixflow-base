CREATE TYPE "public"."treatment" AS ENUM('terapia_ocupacional', 'psicomotricidade', 'fonoaudiologia', 'psicologia', 'fisioterapia', 'neurologia', 'outros');--> statement-breakpoint
CREATE TABLE "patients_to_treatments" (
	"patient_id" uuid,
	"treatment" "treatment" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "is_whatsapp" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "cid" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "observations" text;--> statement-breakpoint
ALTER TABLE "patients_to_treatments" ADD CONSTRAINT "patients_to_treatments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;