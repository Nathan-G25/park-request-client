import type { NotificationType } from "@/types";
import { AlertTriangleIcon, Building, Calendar, CheckCircle2, Shield, type LucideIcon } from "lucide-react";

export const getNotificationStyles: Record<
  NotificationType,
  {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
  }
> = {
  "newApplication": {
    icon: Building,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  "checkIn": {
    icon: Shield,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  "surge": {
    icon: Calendar,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
    "capacity": {
        icon: AlertTriangleIcon,
        bgColor: "bg-orange-100",
        iconColor: "text-orange-600",
    },
    "approval": {
        icon: CheckCircle2,
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
    },
    "inactivity": {
        icon: Shield,
        bgColor: "bg-red-100",
        iconColor: "text-red-600"
    }
};
