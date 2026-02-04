import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface WardenInfoCardProps {
  label: string;
  value: string;
  className?: string;
}

const WardenInfoCard = ({ label, value, className }: WardenInfoCardProps) => {
  return (
    <Card className={cn("px-6 py-3 shadow-md", className)}>
      <div className=" flex flex-col items-start justify-center">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={cn("mt-0.5 text-2xl font-bold tracking-tight", className)}>{value}</div>
      </div>
    </Card>
  );
};

export default WardenInfoCard;
