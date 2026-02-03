import type { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number; // positive = up, negative = down
    label?: string; // optional "vs last week"
  };
  description?: string;
  icon: LucideIcon;
  className?: string;
}

const StatCard = ({
  title,
  value,
  trend,
  description,
  icon: Icon,
  className,
}:StatCardProps) => {
  const isPositive = trend ? trend.value >= 0 : true;
  const trendTextColor = isPositive ? "text-green-600" : "text-red-600";

  return (
    <Card
      className={cn(
        "flex flex-col justify-between px-5 py-3 gap-0 shadow-sm border",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className=" px-2.5 py-2 bg-blue-100 rounded-md"><Icon className="h-5 w-5 text-blue-600" /></div>
      </div>

      <div className=" text-2xl font-bold tracking-tight">{value}</div>

      {description && (
        <p className=" text-xs text-gray-500 pt-1">{description}</p>
      )}

      {trend && (
        <div className=" flex items-center gap-1.5 text-xs pt-1">
          <span className={cn("font-medium", trendTextColor)}>
            {isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
          {trend.label && (
            <span className="text-muted-foreground">{trend.label}</span>
          )}
        </div>
      )}
    </Card>
  );
};

export default StatCard;
