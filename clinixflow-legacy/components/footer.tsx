import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const Footer = async () => {
  const t = await getTranslations("landing.footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contato"
      className="bg-gradient-to-br from-slate-50 to-blue-50/30 px-6 py-16 text-slate-900"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/">
              <Image
                src="/clinix_flow_dark.png"
                alt={t("logoAlt")}
                width={180}
                height={60}
                className="block dark:hidden"
                priority
              />
              <Image
                src="/clinix_flow_white.png"
                alt={t("logoAlt")}
                width={180}
                height={60}
                className="hidden dark:block"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </Link>
            <p className="text-slate-600">{t("description")}</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900">
              {t("product.title")}
            </h4>
            <div className="space-y-2 text-slate-600">
              <a
                href="#"
                className="block transition-colors hover:text-cyan-600"
              >
                {t("product.features")}
              </a>
              <a
                href="#"
                className="block transition-colors hover:text-cyan-600"
              >
                {t("product.pricing")}
              </a>
              <a
                href="#"
                className="block transition-colors hover:text-cyan-600"
              >
                {t("product.security")}
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900">
              {t("support.title")}
            </h4>
            <div className="space-y-2 text-slate-600">
              <a
                href="#"
                className="block transition-colors hover:text-cyan-600"
              >
                {t("support.helpCenter")}
              </a>
              <a
                href="/privacy"
                className="block transition-colors hover:text-cyan-600"
              >
                {t("support.privacy")}
              </a>
              <a
                href="/terms"
                className="block transition-colors hover:text-cyan-600"
              >
                {t("support.terms")}
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-slate-900">
              {t("contact.title")}
            </h4>
            <div className="space-y-3 text-slate-600">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-cyan-600" />
                <span>{t("contact.phone")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-cyan-600" />
                <span>{t("contact.email")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-cyan-600" />
                <span>{t("contact.location")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-slate-600">
          <p>
            &copy; {currentYear} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
