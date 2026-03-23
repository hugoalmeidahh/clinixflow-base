import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

const Testimonials = async () => {
  const t = await getTranslations("landing.testimonials");

  const testimonials = [
    {
      name: t("items.testimonial1.name"),
      specialty: t("items.testimonial1.specialty"),
      text: t("items.testimonial1.text"),
      rating: 5,
    },
    {
      name: t("items.testimonial2.name"),
      specialty: t("items.testimonial2.specialty"),
      text: t("items.testimonial2.text"),
      rating: 5,
    },
    {
      name: t("items.testimonial3.name"),
      specialty: t("items.testimonial3.specialty"),
      text: t("items.testimonial3.text"),
      rating: 5,
    },
  ];

  return (
    <section id="depoimentos" className="bg-white px-6 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold text-slate-900 md:text-5xl">
            {t("title.part1")}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("title.part2")}
            </span>{" "}
            {t("title.part3")}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md transition-shadow duration-300 hover:border-purple-200 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-current text-purple-600"
                  />
                ))}
              </div>
              <p className="mb-6 text-slate-700 italic">{testimonial.text}</p>
              <div>
                <p className="font-semibold text-slate-900">
                  {testimonial.name}
                </p>
                <p className="text-slate-600">{testimonial.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
