import { Stethoscope } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface TopDoctorsProps {
  doctors: {
    id: string;
    name: string;
    avatarImageUrl: string | null;
    specialty: string | null;
    appointments: number;
  }[];
}

export default function TopDoctors({ doctors }: TopDoctorsProps) {
  return (
    <Card className="mx-auto w-full border-border shadow-lg min-w-0">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2 shadow-md shrink-0">
              <Stethoscope className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <CardTitle className="text-sm sm:text-base text-foreground">
              Profissionais
            </CardTitle>
          </div>
        </div>

        {/* Doctors List */}
        <div className="space-y-4 sm:space-y-6">
          {doctors.map((doctor, index) => {
            const colors = [
              "from-blue-500 to-purple-600",
              "from-blue-600 to-purple-500",
              "from-purple-500 to-purple-600",
              "from-blue-500 to-purple-500",
            ];
            const gradientClass = colors[index % colors.length];

            return (
              <div
                key={doctor.id}
                className="flex items-center justify-between gap-2 sm:gap-4"
              >
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-border shrink-0">
                    <AvatarImage src={doctor?.avatarImageUrl ?? ""} />
                    <AvatarFallback
                      className={`bg-gradient-to-br ${gradientClass} text-base sm:text-lg font-medium text-white shadow-md`}
                    >
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{doctor.specialty || "Sem especialidade"}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="rounded-lg bg-blue-50 dark:bg-blue-950/30 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 whitespace-nowrap">
                    {doctor.appointments} agend.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
