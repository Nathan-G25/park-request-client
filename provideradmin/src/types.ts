export type User = {
    token: string;
}

export type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
}

export type AuthAction = 
|{ type:'LOGIN'; payload: User}
|{ type:'LOGOUT' }

export type NotificationType =  
| "reservation"
| "walk-in"
| "check-in"
| "capacity"
| "completed"

export interface Notification {
    type: NotificationType;
    title: string;
    description: string;
    timeAgo: string;
}   

export interface ParkingLocation {
    name: string;
    address: string;
    type: string;
    status: "Available" | "Partial" | "Full" | "Closed";
    occupiedSpots: number;
    totalSpots: number;
    lastUpdated: string;
}

export interface WardenStatusSummary {
    online:number;
    onBreak: number;
    avgReliability: number;
}

// export interface Warden {
//     firstName: string;
//     lastName: string;
//     status: "Online" | "Break" | "Offline" | "Away";
//     location: string;
//     reliabilityScore: number;
//     shiftsThisWeek: number;
//     phoneNumber: string;
// }

export interface LocationStatus extends ParkingLocation {
    confidence: number;
}

export interface VehicleLog {
    plateNumber: string;
    action: "Entry" | "Exit";
    timestamp: string;
    location: string;
    duration?: string;
}

export interface Reservation {
  id: string
  customerName: string
  vehicleModel: string
  plateNumber: string
  location: string
  spot: string
  timeRange: string         
  timeLabel: string         
  status: "Active" | "Upcoming" | "Completed"
  amount: string             
}