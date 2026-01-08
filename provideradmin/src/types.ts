export type User = {
    id: string;
    username: string;
    password: string;
}

export type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
}

export type AuthAction = 
|{ type:'LOGIN'; payload: User}
|{ type:'LOGOUT' }
