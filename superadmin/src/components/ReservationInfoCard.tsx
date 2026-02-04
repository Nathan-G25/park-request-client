import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

interface ReservationInfoCardProps {
  label: string;
  value: string;
  className?: string;
}

const ReservationInfoCard = ({
  label,
  value,
  className,
}: ReservationInfoCardProps) => {
  return (
    <Card className={cn("px-6 py-4 shadow-md", className)}>
      <div className=" flex flex-col  items-start justify-center">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div
          className={cn("mt-0.5 text-2xl font-bold tracking-tight", className)}
        >
          {value}
        </div>
      </div>
    </Card>
  );
};

export default ReservationInfoCard;
