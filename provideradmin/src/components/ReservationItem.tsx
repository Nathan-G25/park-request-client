import type { Reservation } from "@/types"
import { Clock, DollarSign, MapPin, MoreHorizontal, User } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"

interface ReservationItemProps {
  reservation: Reservation
  variant: "table" | "card"
}

const ReservationItem = ({reservation, variant}: ReservationItemProps) => {
    
    const statusStyles = {
    Active:    "bg-green-100 text-green-800 hover:bg-green-100/80 border",
    Upcoming:  "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200",
    Completed: "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border-gray-200",
  }
 
  if (variant === "card") {
    // ── Mobile Card ────────────────────────────────────────────────
    return (
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-medium leading-tight truncate">
                {reservation.customerName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {reservation.vehicleModel} • {reservation.plateNumber}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{reservation.location}</span>
            </div>
            <p className="mt-0.5 text-xs font-medium">{reservation.spot}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{reservation.timeRange}</span>
            </div>
            <p className="mt-0.5 text-xs font-medium">{reservation.timeLabel}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn("px-3 py-1 text-xs font-medium", statusStyles[reservation.status])}
          >
            {reservation.status}
          </Badge>
          <div className="flex items-center gap-1.5 font-medium text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            {reservation.amount}
          </div>
        </div>
      </div>
    )
  }
    return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium">
            {reservation.customerName.split(" ").map(n => n[0]).join("").slice(0,2)}
          </div>
          <div>
            <div className="font-medium">{reservation.customerName}</div>
            <div className="text-xs text-muted-foreground">{reservation.vehicleModel}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 font-mono text-sm whitespace-nowrap">
        {reservation.plateNumber}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <div className="truncate">{reservation.location}</div>
            <div className="text-xs text-muted-foreground truncate">{reservation.spot}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs">{reservation.timeRange}</p>
            <div className="text-xs text-muted-foreground">{reservation.timeLabel}</div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <Badge
          variant="outline"
          className={cn("px-3 py-1 text-xs font-medium", statusStyles[reservation.status])}
        >
          {reservation.status}
        </Badge>
      </td>

      <td className="px-4 py-4 font-medium whitespace-nowrap">
        {reservation.amount}
      </td>

      <td className="px-4 py-4 text-right">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  )
}


export default ReservationItem