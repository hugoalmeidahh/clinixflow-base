CREATE TYPE "public"."user_role" AS ENUM('clinic_owner', 'clinic_admin', 'doctor', 'patient');--> statement-breakpoint
CREATE TABLE "doctors_to_users" (
	"doctor_id" uuid,
	"user_id" text,
	"clinic_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "patients_to_users" (
	"patient_id" uuid,
	"user_id" text,
	"clinic_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'clinic_owner' NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors_to_users" ADD CONSTRAINT "doctors_to_users_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors_to_users" ADD CONSTRAINT "doctors_to_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doctors_to_users" ADD CONSTRAINT "doctors_to_users_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients_to_users" ADD CONSTRAINT "patients_to_users_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients_to_users" ADD CONSTRAINT "patients_to_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patients_to_users" ADD CONSTRAINT "patients_to_users_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;