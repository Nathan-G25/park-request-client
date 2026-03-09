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
| "newApplication"
| "checkIn"
| "surge"
| "capacity"
| "approval"
| "inactivity"

export interface Notification {
    type: NotificationType;
    title: string;
    description: string;
    timeAgo: string;
}   

export interface Provider {
    id: number;
    name: string;
    email: string;
    locations: number;
    spaces:number;
    status: string;
}

export interface Warden {
  id: string;
  name: string;
  provider: string;
  zone: string;
  status: string;
  reliability: number;
  updatesToday: number;
  lastSeen: string;
}
export interface Reservation {
  id: string;
  driver: string;
  location: string;
  provider: string;
  startTime: string;
  duration: string;
  status: string;
  amount: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorType: "admin" | "provider" | "warden";
  target: string;
  category: "auth" | "provider" | "warden";
  timestamp: string;
}