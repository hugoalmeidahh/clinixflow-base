import { Calendar, Clock, Phone, Shield, Star, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";

const Features = async () => {
  const t = await getTranslations("landing.features");

  const features = [
    {
      icon: Calendar,
      title: t("items.scheduling.title"),
      description: t("items.scheduling.description"),
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Clock,
      title: t("items.reminders.title"),
      description: t("items.reminders.description"),
      color: "from-blue-600 to-purple-500",
      badge: t("items.reminders.badge"),
    },
    {
      icon: Users,
      title: t("items.patients.title"),
      description: t("items.patients.description"),
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Shield,
      title: t("items.security.title"),
      description: t("items.security.description"),
      color: "from-blue-600 to-purple-600",
    },
    {
      icon: Star,
      title: t("items.interface.title"),
      description: t("items.interface.description"),
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Phone,
      title: t("items.support.title"),
      description: t("items.support.description"),
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <section
      id="recursos"
      className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/50 px-6 py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl">
            {t("title.part1")}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("title.part2")}
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative transform rounded-2xl border border-slate-200 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-xl"
            >
              {feature.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  {feature.badge}
                </span>
              )}
              <div
                className={`h-14 w-14 bg-gradient-to-br ${feature.color} mb-6 flex items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
