import { and, eq, gt } from "drizzle-orm";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { db } from "@/src/db";
import { appointmentsTable } from "@/src/db/schema";

const NextAppointmentsCard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.clinic?.id) {
    return (
      <div className="relative">
        <div className="absolute inset-0 rotate-6 transform rounded-3xl bg-gradient-to-r from-[#75D5E3] to-[#3AE0AE] opacity-20"></div>
        <div className="relative transform rounded-3xl bg-card p-8 shadow-2xl transition-transform duration-300 hover:-translate-y-2">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                Próximas Consultas
              </h3>
              <Calendar className="h-6 w-6 text-[#75D5E3]" />
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">Nenhuma consulta encontrada.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();

  const [appointments] = await Promise.all([
    db.query.appointmentsTable.findMany({
      where: and(
        eq(appointmentsTable.clinicId, session.user.clinic.id),
        gt(appointmentsTable.date, now),
      ),
      orderBy: (appointments, { asc }) => [asc(appointments.date)],
      limit: 5,
      with: {
        patient: true,
        doctor: true,
      },
    }),
  ]);

  return (
    <div className="relative">
      <div className="absolute inset-0 rotate-6 transform rounded-3xl bg-gradient-to-r from-[#75D5E3] to-[#3AE0AE] opacity-20"></div>
      <div className="relative transform rounded-3xl bg-card p-8 shadow-2xl transition-transform duration-300 hover:-translate-y-2">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">
              Próximas Consultas
            </h3>
            <Calendar className="h-6 w-6 text-[#75D5E3]" />
          </div>

          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 rounded-xl bg-muted p-4 transition-colors hover:bg-[#75D5E3]/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#0B5652] to-[#3AE0AE] font-semibold text-white">
                    {appointment.patient
                      ? appointment.patient.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                      : ""}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {appointment.patient?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{`Dr. ${appointment.doctor?.name}`}</p>
                  </div>
                  <div className="font-semibold text-[#75D5E3]">
                    {appointment.date.toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}{" "}
                    {appointment.date.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                Nenhuma consulta futura encontrada.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextAppointmentsCard;
