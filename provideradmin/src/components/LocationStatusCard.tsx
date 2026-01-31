import type { LocationStatus } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";

interface LocationStatusCardProps {
  locationStatus: LocationStatus;
}

const LocationStatusCard = ({ locationStatus }: LocationStatusCardProps) => {
  const percentage = Math.round(
    (locationStatus.occupiedSpots / locationStatus.totalSpots) * 100,
  );
  const isLow = percentage <= 30;
  const isMedium = percentage > 30 && percentage <= 70;

  return (
    <div className="overflow-hidden border-t border-t-gray-200 shadow-none bg-transparent py-3">
      <section className=" w-full px-1 ">
        <div className=" flex justify-between items-center">
          <div className="flex flex-col justify-center text-sm">
            <h3 className="font-medium truncate">{locationStatus.name}</h3>
            <p className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Clock className=" size-3" /> {locationStatus.lastUpdated}
            </p>
          </div>
          <article className=" text-gray-500 font-bold text-sm">
            <span
              className={cn(
                " text-lg",
                isLow
                  ? "text-green-500"
                  : isMedium
                    ? "text-orange-500"
                    : "text-red-600",
              )}
            >
              {locationStatus.occupiedSpots}
            </span>{" "}
            /{locationStatus.totalSpots}
          </article>
        </div>
        <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "absolute h-full transition-all duration-500 ease-out",
              isLow
                ? "bg-green-600"
                : isMedium
                  ? "bg-orange-500"
                  : "bg-red-600",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-1.5 flex items-center justify-between">
          <div className="mt-1 flex items-end justify-between">
          <span className=" text-xs text-gray-500">{percentage}% occupied</span>
        </div>
          <div className="flex items-center gap-1  text-xs">
  
            <CheckCircle2 className="size-3 text-green-500"/> {locationStatus.confidence}% confidence

          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationStatusCard;
