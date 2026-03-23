"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { LanguageSwitcher } from "@/src/components/language-switcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("common");

  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200 bg-gradient-to-r from-blue-50/90 via-purple-50/90 to-purple-50/90 shadow-sm backdrop-blur-md">
      <nav className="container mx-auto flex items-center justify-between px-2 py-2">
        <Link href="/">
          <Image
            src="/clinix_flow_dark.png"
            alt="Logo ClinixFlow"
            width={180}
            height={60}
            className="block h-8 w-auto object-contain dark:hidden"
            priority
          />
          <Image
            src="/clinix_flow_white.png"
            alt="Logo ClinixFlow"
            width={180}
            height={60}
            className="hidden h-8 w-auto object-contain dark:block"
            priority
          />
        </Link>

        <div className="hidden items-center space-x-6 md:flex">
          <a
            href="#recursos"
            className="text-slate-700 transition-colors hover:text-purple-600"
          >
            Recursos
          </a>
          <a
            href="#beneficios"
            className="text-slate-700 transition-colors hover:text-purple-600"
          >
            Benefícios
          </a>
          <a
            href="#depoimentos"
            className="text-slate-700 transition-colors hover:text-purple-600"
          >
            Depoimentos
          </a>
          <a
            href="#contato"
            className="text-slate-700 transition-colors hover:text-purple-600"
          >
            Contato
          </a>
          <LanguageSwitcher />
          <Link href="/authentication">
            <button className="rounded-lg border border-blue-600 px-2 py-2 text-blue-600 transition-all duration-300 hover:bg-blue-50">
              {t("signIn")}
            </button>
          </Link>
          <Link href="/authentication?tab=signup">
            <button className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-2 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
              {t("signUp")}
            </button>
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-6 px-6 py-2">
            <a
              href="#recursos"
              className="block text-slate-700 hover:text-purple-600"
            >
              Recursos
            </a>
            <a
              href="#beneficios"
              className="block text-slate-700 hover:text-purple-600"
            >
              Benefícios
            </a>
            <a
              href="#depoimentos"
              className="block text-slate-700 hover:text-purple-600"
            >
              Depoimentos
            </a>
            <a
              href="#contato"
              className="block text-slate-700 hover:text-purple-600"
            >
              Contato
            </a>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
            </div>
            <Link href="/authentication">
              <button className="w-full mb-2 rounded-lg border border-blue-600 px-6 py-2 text-blue-600 transition-all duration-300 hover:bg-blue-50">
                {t("signIn")}
              </button>
            </Link>
            <Link href="/authentication?tab=signup">
              <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
                {t("signUp")}
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
