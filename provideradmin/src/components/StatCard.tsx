// components/dashboard/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number; // positive = up, negative = down
    label?: string; // e.g. "vs yesterday"
    isPositive?: boolean;
  };
  className?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = "default",
}: StatCardProps) => {
  const trendColor =
    trend?.isPositive !== false ? "text-green-600" : "text-red-600";

  return (
    <Card className={cn("overflow-hidden shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className=" text-gray-500 font-medium">{title}</CardTitle>
        <div
          className={cn(
            "py-2 px-2.5 rounded-md",
            variant === "default" && "bg-gray-200",
            variant === "success" && "bg-green-100",
            variant === "warning" && "bg-orange-100",
            variant === "destructive" && "bg-red-100"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5 text-muted-foreground",
              variant === "default" && "text-gray-500",
              variant === "success" && "text-green-500",
              variant === "warning" && "text-orange-500",
              variant === "destructive" && "text-red-100"
            )}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">{value}</div>

        {(description || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {description && <p>{description}</p>}

            {trend && (
              <p
                className={cn(
                  "flex items-center gap-1 font-medium",
                  trendColor
                )}
              >
                {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
                {trend.label && ` ${trend.label}`}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
