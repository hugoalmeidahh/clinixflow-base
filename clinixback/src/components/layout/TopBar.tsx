import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();

  const email = user?.email || "";
  const initials = email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  const currentLang =
    supportedLanguages.find((l) => l.code === i18n.language) || supportedLanguages[0];

  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between border-b border-border bg-card px-4 md:h-16 md:px-6",
        isMobile && "pl-14"
      )}
    >
      <div />
      <div className="flex items-center gap-2 md:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <span className="text-sm font-medium">{currentLang.flag}</span>
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

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium leading-none">{email}</p>
            <p className="text-xs text-muted-foreground">SaaS Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
