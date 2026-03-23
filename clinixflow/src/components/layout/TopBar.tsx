import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar = () => {
  const { profile, userRole } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const currentLang = supportedLanguages.find(l => l.code === i18n.language) || supportedLanguages[0];

  return (
    <header className={cn(
      "flex h-14 items-center justify-between border-b border-border bg-card px-4 md:h-16 md:px-6",
      isMobile && "pl-14"
    )}>
      <div />
      <div className="flex items-center gap-2 md:gap-3">
        {/* Language switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9" title={t("common.language")}>
              <span className="text-base">{currentLang.flag}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {supportedLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={cn(i18n.language === lang.code && "bg-accent")}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate("/settings")}>
          <Settings className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium leading-none">{profile?.full_name || t("common.name")}</p>
            <p className="text-xs text-muted-foreground">{t(`roles.${userRole?.role || ""}`, "")}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
