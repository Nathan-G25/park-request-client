import type { Warden } from "@/schema";
import { Avatar } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { MapPin, MoreVertical, Phone, Star } from "lucide-react";

interface WardenCardProps {
  warden: Warden;
}

const WardenCard = ({ warden }: WardenCardProps) => {
  const statusStyle =
    {
      ONDUTY: "bg-green-100 text-green-600",
      OFFDUTY: "bg-gray-100 text-gray-600",
    }[warden.wardenStatus] ?? "bg-gray-100 text-gray-600";

  const statusDotColor =
    {
      ONDUTY: "bg-green-400",
      OFFDUTY: "bg-gray-400",
    }[warden.wardenStatus] ?? "bg-gray-400";

  const initials =
    `${warden.firstName?.[0] ?? ""}${warden.lastName?.[0] ?? ""}`.toUpperCase() ||
    "JD";
  const fullName =
    [warden.firstName, warden.lastName].filter(Boolean).join(" ") || "John Doe";

  return (
    <div className=" overflow-hidden transtion-all shadow-md hover:shadow-lg py-6 rounded-md w-full">
      <section className=" flex flex-col md:flex-row md:items-center md:justify-between w-full px-6">
        <section className=" flex items-center gap-5">
          <div className=" flex items-end">
            <Avatar className={cn(" size-18 bg-blue-700 z-0 ")}>
              <AvatarFallback className=" font-medium text-center  text-white flex items-center justify-center w-full text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                " size-4 rounded-full -ml-5 mb-1 z-20 border border-white",
                statusDotColor,
              )}
            ></span>
          </div>
          <div className=" flex flex-col justify-center">
            <h3 className=" font-medium">{fullName}</h3>
            <div className=" flex gap-3 items-center">
              <div
                className={cn(
                  "font-medium rounded-full flex gap-2 items-center px-3 py-1",
                  statusStyle,
                )}
              >
                <span
                  className={cn(" size-2 rounded-full", statusDotColor)}
                ></span>
                <p className=" text-sm">{warden.wardenStatus}</p>
              </div>
              {warden.wardenStatus === "ONDUTY" && (
                <span className=" text-gray-500 text-sm">Active Now</span>
              )}
            </div>
            <div className=" flex items-center gap-0.5 pt-2 text-gray-500">
              <MapPin className=" size-4" />
              <p className=" text-xs md:text-sm mr-5 md:mr-2">{warden.currentLocation}</p>
              <Phone className=" size-4" />
              <p className=" text-xs md:text-sm">{warden.phoneNo}</p>
            </div>
          </div>
        </section>
        <section className=" flex items-center md:justify-center justify-around pt-3 md:pt-0 gap-5">
          <div className=" hidden ">
            <div className=" flex items-center gap-1">
              <Star className=" size-4 md:size-5 text-yellow-500" />
              <p className=" font-medium md:text-base text-sm">80%</p>
            </div>
            <p className=" text-gray-500 text-xs md:text-sm">Reliability Score</p>
          </div>
          <div className=" hidden">
            <p className=" font-medium md:text-base text-sm">5</p>
            <p className=" text-xs md:text-sm text-gray-500">Shifts this week</p>
          </div>
          <button className=" outline-0 cursor-pointer p-1 hover:bg-neutral-100">
            <MoreVertical className=" size-4 md:size-5" />
          </button>
        </section>
      </section>
    </div>
  );
};

export default WardenCard;
