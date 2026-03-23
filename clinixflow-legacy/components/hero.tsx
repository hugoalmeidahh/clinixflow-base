import { Calendar, Clock, Users } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

const Hero = async () => {
  const t = await getTranslations("landing.hero");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50/30 to-purple-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-200/40 to-purple-200/40 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-purple-200/40 to-purple-300/40 blur-3xl" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0f2fe12_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe12_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl leading-tight font-bold tracking-tight lg:text-6xl">
                <span className="text-slate-900">{t("title.part1")}</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t("title.part2")}
                </span>
              </h1>
              <p className="max-w-xl text-xl leading-relaxed text-slate-600">
                {t("subtitle")}{" "}
                <span className="font-semibold text-slate-800">
                  {t("subtitleHighlight")}
                </span>
                .
              </p>
            </div>

            {/* <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 text-lg text-white shadow-xl shadow-blue-500/30 hover:from-blue-700 hover:to-purple-700"
                asChild
              >
                <a href="/authentication">Comece por aqui</a>
              </Button>
            </div> */}

            {/* Stats */}
            <div className="flex flex-wrap gap-8 border-t border-slate-200 pt-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg shadow-blue-500/30">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {t("stats.appointments.value")}
                  </div>
                  <div className="text-sm text-slate-600">
                    {t("stats.appointments.label")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg shadow-purple-500/30">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {t("stats.professionals.value")}
                  </div>
                  <div className="text-sm text-slate-600">
                    {t("stats.professionals.label")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 p-3 shadow-lg shadow-blue-500/30">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">
                    {t("stats.timeSaved.value")}
                  </div>
                  <div className="text-sm text-slate-600">
                    {t("stats.timeSaved.label")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Image */}
          <div className="relative hidden lg:block">
            <div className="relative transform overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200 transition-transform duration-500 hover:scale-105">
              <Image
                src="/image.png"
                alt={t("imageAlt")}
                width={600}
                height={400}
                className="h-auto w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
            </div>
            {/* Floating decorative elements */}
            <div className="absolute -top-6 -right-6 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-purple-400/30 to-purple-500/30 blur-3xl delay-300" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
