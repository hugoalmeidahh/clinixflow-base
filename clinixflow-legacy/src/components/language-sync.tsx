"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface LanguageSyncProps {
  preferredLanguage: string | null;
}

/**
 * Syncs the user's saved language preference (from DB) to the locale cookie
 * on first access (e.g., new device where no cookie is set yet).
 * Runs once per session and only triggers a refresh if the cookie was actually missing.
 */
export function LanguageSync({ preferredLanguage }: LanguageSyncProps) {
  const router = useRouter();
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current || !preferredLanguage) return;
    synced.current = true;

    const hasCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("locale="));

    if (!hasCookie) {
      document.cookie = `locale=${preferredLanguage};path=/;max-age=${60 * 60 * 24 * 365}`;
      router.refresh();
    }
  }, [preferredLanguage, router]);

  return null;
}
