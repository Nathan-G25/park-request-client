import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface AnalyticsCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  color?: "trend" | "graph" | "clock" | "mappin";
  className?: string;
}

const AnalyticsCard = ({
  icon: Icon,
  value,
  label,
  color = "trend",
  className,
}: AnalyticsCardProps) => {
  const iconColor = {
    trend: "text-blue-600 bg-blue-100",
    graph: "text-green-600 bg-green-100",
    clock: "text-orange-600 bg-orange-100",
    mappin: "text-fuchsia-600 bg-fuchsia-100",
  }[color];
  return (
    <Card
      className={cn(
        "flex flex-row items-center gap-5 px-6 py-4 text-center shadow-sm border",
        className,
      )}
    >
      <div className={cn(" rounded-md py-2 px-2.5", iconColor)}>
        <Icon className={cn("size-5")} />
      </div>
      <div className=" flex flex-col items-start justify-center">
        <p className=" text-sm text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-xl font-bold tracking-tight">{value}</div>
      </div>
    </Card>
  );
};

export default AnalyticsCard;
