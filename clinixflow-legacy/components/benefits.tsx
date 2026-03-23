import { CheckCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

const Benefits = async () => {
  const t = await getTranslations("landing.benefits");

  const stats = [
    {
      stat: t("stats.schedulingTime.value"),
      label: t("stats.schedulingTime.label"),
    },
    { stat: t("stats.noShows.value"), label: t("stats.noShows.label") },
    {
      stat: t("stats.satisfaction.value"),
      label: t("stats.satisfaction.label"),
    },
    { stat: t("stats.resources.value"), label: t("stats.resources.label") },
  ];

  const cards = [
    t("cards.organized"),
    t("cards.satisfied"),
    t("cards.lessWork"),
    t("cards.moreTime"),
  ];

  return (
    <section
      id="beneficios"
      className="bg-gradient-to-br from-blue-50 via-purple-50/30 to-purple-50 px-6 py-20"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 text-4xl font-bold text-slate-900 md:text-5xl">
              {t("title.part1")}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                {t("title.part2")}
              </span>
            </h2>

            <div className="space-y-6">
              {stats.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                    {benefit.stat}
                  </div>
                  <div className="text-lg text-slate-700">{benefit.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {cards.map((benefit, index) => (
              <div
                key={index}
                className="transform rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-shadow duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl"
              >
                <CheckCircle className="mb-4 h-8 w-8 text-purple-600" />
                <p className="font-semibold text-slate-800">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
