export type User = {
    token: string;
    username:string;
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
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    timeAgo: string;
}   