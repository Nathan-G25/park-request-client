import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../utils/AuthProvider";
import type { User } from "../types";
import { useNavigate } from "react-router";


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

    const data = await response.json();

    //const user = data.user;

    console.log(data)

    return data;
}



export const useLogin = () => {

    const queryClient = useQueryClient();
    const { state,dispatch } = useAuth();
    const navigate = useNavigate();
    
    return useMutation<User, Error, LoginCredentials>({
        mutationFn: loginUser,
        onSuccess: ( user : User ) => {
            dispatch({ type: 'LOGIN', payload: user})
            queryClient.setQueryData(['user'], user)
            navigate('/');
            console.log(`Logged in user: ${user.username}`);

        },
        onError: ( error ) => {
            console.error("Login error: ", error.message);
        }
    });

};