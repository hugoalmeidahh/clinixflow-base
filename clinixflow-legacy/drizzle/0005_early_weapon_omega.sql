ALTER TABLE "clinics" ADD COLUMN "clinic_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "doctor_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "patient_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD CONSTRAINT "clinics_clinic_code_unique" UNIQUE("clinic_code");