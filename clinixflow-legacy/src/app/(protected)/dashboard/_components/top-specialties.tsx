import {
  Activity,
  Baby,
  Bone,
  Brain,
  Eye,
  Hand,
  Heart,
  Hospital,
  Stethoscope,
} from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TopSpecialtiesProps {
  topSpecialties: {
    specialty: string;
    appointments: number;
  }[];
}

const getSpecialtyIcon = (specialty: string | null | undefined) => {
  if (!specialty) {
    return Stethoscope;
  }
  const specialtyLower = specialty.toLowerCase();

  if (specialtyLower.includes("cardiolog")) return Heart;
  if (
    specialtyLower.includes("ginecolog") ||
    specialtyLower.includes("obstetri")
  )
    return Baby;
  if (specialtyLower.includes("pediatr")) return Activity;
  if (specialtyLower.includes("dermatolog")) return Hand;
  if (
    specialtyLower.includes("ortoped") ||
    specialtyLower.includes("traumatolog")
  )
    return Bone;
  if (specialtyLower.includes("oftalmolog")) return Eye;
  if (specialtyLower.includes("neurolog")) return Brain;

  return Stethoscope;
};

export default function TopSpecialties({
  topSpecialties,
}: TopSpecialtiesProps) {
  const maxAppointments = Math.max(
    ...topSpecialties.map((i) => i.appointments),
  );

  const colors = [
    "from-blue-500 to-purple-600",
    "from-blue-600 to-purple-500",
    "from-purple-500 to-purple-600",
    "from-blue-500 to-purple-500",
  ];

  return (
    <Card className="mx-auto w-full border-border shadow-lg">
      <CardContent>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-md">
              <Hospital className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-base text-foreground">
              Especialidades
            </CardTitle>
          </div>
        </div>

        {/* specialtys List */}
        <div className="space-y-6">
          {topSpecialties
            .filter((specialty) => specialty.specialty && specialty.specialty.trim() !== "")
            .map((specialty, index) => {
              const Icon = getSpecialtyIcon(specialty.specialty);
              const progressValue =
                (specialty.appointments / maxAppointments) * 100;
              const gradientClass = colors[index % colors.length];

              return (
                <div
                  key={specialty.specialty}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`bg-gradient-to-br ${gradientClass} flex h-12 w-12 items-center justify-center rounded-xl shadow-md`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex w-full flex-col justify-center">
                    <div className="flex w-full justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        {specialty.specialty}
                      </h3>
                    <div className="text-right">
                      <span className="rounded-lg bg-blue-50 dark:bg-blue-950/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
                        {specialty.appointments} agend.
                      </span>
                    </div>
                  </div>
                  <Progress value={progressValue} className="mt-2 w-full" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
