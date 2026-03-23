"use client";

import { Calendar, CalendarDays, LayoutGrid, List } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ViewType = "table" | "daily" | "weekly" | "cards";

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const views: { key: ViewType; icon: typeof List; labelKey: string }[] = [
  { key: "daily", icon: CalendarDays, labelKey: "dayView" },
  { key: "weekly", icon: Calendar, labelKey: "weekView" },
  { key: "table", icon: List, labelKey: "listView" },
  { key: "cards", icon: LayoutGrid, labelKey: "cardsView" },
];

const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  const t = useTranslations("appointments");

  return (
    <div className="bg-card flex rounded-lg border p-1">
      {views.map(({ key, icon: Icon, labelKey }) => {
        const label = labelKey === "dayView" ? "Dia" : t(labelKey);
        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                variant={currentView === key ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(key)}
                className="flex items-center gap-1 sm:gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ViewToggle;
