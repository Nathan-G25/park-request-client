import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

interface ReservationStatCardProps {
  label: string;
  value: number | string;
  className?: string;
}

const ReservationStatCard = ({
  label,
  value,
  className,
}: ReservationStatCardProps) => {
  return (
    <Card className=" py-3">
      <div className=" flex flex-col gap-2 items-start px-6">
        <h2 className=" text-gray-400">{label}</h2>
        <p className={cn("text-2xl font-bold", className)}>{value}</p>
      </div>
    </Card>
  );
};

export default ReservationStatCard;
