import type { NotificationType } from "@/types";
import { AlertTriangle, Car, CheckCircle2, Clock, UserCheck, type LucideIcon } from "lucide-react";

export const getNotificationStyles: Record<
  NotificationType,
  {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
  }
> = {
  reservation: {
    icon: Clock,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  "walk-in": {
    icon: Car,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  "check-in": {
    icon: UserCheck,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
    "capacity": {
        icon: AlertTriangle,
        bgColor: "bg-orange-100",
        iconColor: "bg-orange-600",
    },
    "completed": {
        icon: CheckCircle2,
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
    }
};
