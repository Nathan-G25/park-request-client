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