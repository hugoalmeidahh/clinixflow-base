import { cn } from "@/lib/utils";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-[1920px] mx-auto w-full">
      {children}
    </div>
  );
};
export const PageHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">{children}</div>;
};
export const PageHeaderContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="space-y-1 flex-1 min-w-0">{children}</div>;
};
export const PageTitle = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-xl sm:text-2xl font-bold truncate">{children}</h1>;
};
export const PageDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-muted-foreground text-xs sm:text-sm">{children}</p>;
};
export const PageActions = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2 flex-wrap flex-shrink-0">{children}</div>;
};
export const PageContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("space-y-4 sm:space-y-6", className)}>{children}</div>;
};
