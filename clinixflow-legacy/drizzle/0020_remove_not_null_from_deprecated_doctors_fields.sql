-- Migration: Remover constraints NOT NULL de campos deprecated da tabela doctors
-- Esses campos são deprecated pois agora usamos:
-- - doctorSpecialtiesTable ao invés de specialty, classNumberRegister, classNumberType
-- - doctorAvailabilityTable ao invés de availableFromWeekDay, availableToWeekDay, availableFromTime, availableToTime

-- 1. Tornar specialty nullable
ALTER TABLE "doctors" 
ALTER COLUMN "specialty" DROP NOT NULL;

-- 2. Tornar class_number_register nullable
ALTER TABLE "doctors" 
ALTER COLUMN "class_number_register" DROP NOT NULL;

-- 3. Tornar class_number_type nullable
ALTER TABLE "doctors" 
ALTER COLUMN "class_number_type" DROP NOT NULL;

-- 4. Tornar available_from_week_day nullable
ALTER TABLE "doctors" 
ALTER COLUMN "available_from_week_day" DROP NOT NULL;

-- 5. Tornar available_to_week_day nullable
ALTER TABLE "doctors" 
ALTER COLUMN "available_to_week_day" DROP NOT NULL;

-- 6. Tornar available_from_time nullable
ALTER TABLE "doctors" 
ALTER COLUMN "available_from_time" DROP NOT NULL;

-- 7. Tornar available_to_time nullable
ALTER TABLE "doctors" 
ALTER COLUMN "available_to_time" DROP NOT NULL;
