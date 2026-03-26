import type { LiveActivity } from "@/schema";
import { Car, Clock, type LucideIcon } from "lucide-react";

export const getNotificationStyles: Record<
  LiveActivity["type"],
  {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
  }
> = {
  RESERVATION: {
    icon: Clock,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  WALK_IN: {
    icon: Car,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },

};
