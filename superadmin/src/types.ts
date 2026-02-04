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
  alert?: string;
}