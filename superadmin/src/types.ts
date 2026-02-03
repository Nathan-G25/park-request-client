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