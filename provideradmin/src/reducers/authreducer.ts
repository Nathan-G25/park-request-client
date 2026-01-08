import type { AuthAction, AuthState } from "../types";

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {
                isAuthenticated: true,
                user: action.payload
            }
        case 'LOGOUT':
            localStorage.removeItem('user');
            return {
                isAuthenticated: false,
                user: null
            }
        default:
            return state;
    }
}