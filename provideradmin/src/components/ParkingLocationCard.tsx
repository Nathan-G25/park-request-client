import type { ParkingLocation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Car, MapPin, MoreHorizontal } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ParkingLocationCardProps {
  location: ParkingLocation;
  onMoreClick?: (id: string) => void;
}

const ParkingLocationCard = ({
  location,
  onMoreClick,
}: ParkingLocationCardProps) => {
  const percentage = Math.round(
    (location.occupiedSpots / location.totalSpots) * 100,
  );
  const isLow = percentage <= 30;
  const isMedium = percentage > 30 && percentage <= 70;

//   const statusVariant =
//     location.status === "Available"
//       ? "secondary"
//       : location.status === "Partial"
//         ? "outline"
//         : location.status === "Full"
//           ? "destructive"
//           : "default";

  return (
    <Card className="overflow-hidden transition-all shadow-md hover:shadow-lg">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start flex-wrap justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2">
              <Car className="size-7 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base leading-tight">
                {location.name}
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                <MapPin className="size-4 inline" /> {location.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {location.type}
            </Badge>
            <Badge
              className={cn(
                "text-sm",
                isLow
                  ? "bg-green-100 text-green-500"
                  : isMedium
                    ? "bg-orange-100 text-orange-500"
                    : "bg-red-600",
              )}
            >
              {location.status}
            </Badge>

            {onMoreClick && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onMoreClick(location.id)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Occupancy</span>
            <span className="font-medium">
              {location.occupiedSpots} / {location.totalSpots} spaces
            </span>
          </div>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
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

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Last updated {location.lastUpdated}</span>
            <span
              className={cn(
                "font-medium text-base pt-2",
                isLow
                  ? "text-green-600"
                  : isMedium
                    ? "text-orange-600"
                    : "text-red-600",
              )}
            >
              {percentage}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingLocationCard;
