import type { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface WardenStatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  color?: "success" | "warning" | "accent" | "default";
  className?: string;
}

const WardenStatCard = ({
  icon: Icon,
  value,
  label,
  color = "default",
  className,
}: WardenStatCardProps) => {

  const iconColor = {
    success: "text-green-600 bg-green-100 ",
    warning: "text-orange-600 bg-orange-100",
    accent: "text-purple-600 bg-purple-100",
    default: "text-gray-600 bg-gray-100",
  }[color];

  return (
    <Card
      className={cn(
        "flex flex-row items-center gap-5 px-8 py-8 text-center shadow-sm border",
        className,
      )}
    >
      <div className={cn("mb-1.5 rounded-md p-2", iconColor)}>
        <Icon className={cn("size-6")} />
      </div>
      <div className=" flex flex-col items-start justify-center">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
};

export default WardenStatCard;
