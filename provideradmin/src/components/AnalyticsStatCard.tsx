import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import type { LucideIcon } from "lucide-react";

interface WardenStatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  color?: "success" | "warning" | "accent" ;
  className?: string;
}

const AnalyticsStatCard = ({
  icon: Icon,
  value,
  label,
  color = "success",
  className,
}: WardenStatCardProps) => {
  const iconColor = {
    success: "text-green-600 bg-green-100 border-green-200",
    warning: "text-orange-600 bg-orange-100 border-orange-200",
    accent: "text-blue-600 bg-blue-100 border-blue-200",
  }[color];

  return (
    <Card
      className={cn(
        "flex flex-row items-center gap-5 px-6 py-3 text-center shadow-sm border",
        className,
      )}
    >
      <div className={cn(" rounded-md border py-2 px-2.5", iconColor)}>
        <Icon className={cn("size-5")} />
      </div>
      <div className=" flex flex-col items-start justify-center">
        <p className=" text-sm text-muted-foreground">{label}</p>
        <div className=" mt-0.5 text-xl font-bold tracking-tight">{value}</div>
      </div>
    </Card>
  );
};

export default AnalyticsStatCard;
