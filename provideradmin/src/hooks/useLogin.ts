import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../utils/AuthProvider";
import type { User } from "../types";


type LoginCredentials = {
    username: string;
    password: string;
}

const loginUser = async ( credentials: LoginCredentials ): Promise<User> => {

    const response = await fetch('http://localhost:3000/parking-avenue-owner/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( credentials )
    } );

    if( !response.ok) {
        throw new Error('Login failed');
    }

    return response.json() as Promise<User>;
}


export const useLogin = () => {

    const queryClient = useQueryClient();
    const { dispatch } = useAuth();
    
    return useMutation<User, Error, LoginCredentials>({
        mutationFn: loginUser,
        onSuccess: ( user ) => {
            dispatch({ type: 'LOGIN', payload: user})
            queryClient.setQueryData(['user'], user)
        },
        onError: ( error ) => {
            console.error("Login error: ", error.message);
        }
    });

};