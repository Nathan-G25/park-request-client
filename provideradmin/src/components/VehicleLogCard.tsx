import { cn } from "@/lib/utils";
import type { VehicleLog } from "@/types";
import { Car, Clock } from "lucide-react";

interface VehicleLogProps {
  log: VehicleLog;
}

const VehicleLogCard = ({ log }: VehicleLogProps) => {
  const isEntry = log.action === "Entry";

  return (
    <section className="overflow-hidden border-0 shadow-none bg-transparent py-3">
      <div className=" flex justify-between items-center">
        <div className=" flex items-center gap-6">
          <div
            className={cn(
              "rounded-md px-2 py-1",
              isEntry
                ? "text-green-500 bg-green-100"
                : "text-orange-500 bg-orange-100",
            )}
          >
            <Car />
          </div>
          <div className=" flex flex-col">
            <div className=" flex gap-2">
              <p className=" font-medium tracking-tight">{log.plateNumber}</p>
              <span
                className={cn(
                  " rounded-2xl text-xs text-center px-2.5 py-1 border",
                  isEntry
                    ? "border-green-500 text-green-500"
                    : "border-orange-500 text-orange-500",
                )}
              >
                {log.action}
              </span>
            </div>
            <p className=" text-gray-500 text-xs">{log.location}</p>
          </div>
        </div>
        <div className=" flex flex-col gap-2">
          <p className=" text-gray-600 text-sm ">{log.timestamp}</p>
          {log.duration && <div className=" text-gray-500 text-xs flex gap-1 items-center"><Clock className="size-3"/><span>{log.duration}</span></div>}
        </div>
      </div>
    </section>
  );
};

export default VehicleLogCard;
