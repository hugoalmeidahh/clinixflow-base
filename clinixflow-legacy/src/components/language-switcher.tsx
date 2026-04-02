"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserLanguage } from "@/src/actions/update-user-language";

const localeOptions = [
  { value: "pt-BR", label: "Português", flag: "🇧🇷" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "es", label: "Español", flag: "🇪🇸" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentLocale = localeOptions.find((l) => l.value === locale);

  const handleLocaleChange = (newLocale: string) => {
    document.cookie = `locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
    startTransition(async () => {
      await updateUserLanguage(newLocale);
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          disabled={isPending}
        >
          <span className="text-xs sm:inline">
            {currentLocale?.flag} {currentLocale?.label}
          </span>
          {/* <span className="text-xs sm:hidden">{currentLocale?.flag}</span> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {localeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleLocaleChange(option.value)}
            className={`cursor-pointer gap-2 ${
              locale === option.value ? "bg-accent" : ""
            }`}
          >
            <span>{option.flag}</span>
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
