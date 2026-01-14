import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../utils/AuthProvider";
import { useNavigate } from "react-router";


const logoutUser = async () => {
    await localStorage.getItem('user');
}


export const useLogout = () => {

    const queryClient = useQueryClient();
    const { dispatch } = useAuth();
    const navigate = useNavigate();

    return useMutation<void, Error>({
        mutationFn: logoutUser,
        onSuccess: () => {
            dispatch({ type: 'LOGOUT' });
            queryClient.setQueryData(['user'], null);
            navigate('/login');

            //queryClient.invalidateQueries({ queryKey: ['protectedData'] })
        },
        onError: (error) => {
            console.error("Logout Failed", error.message);
        }
    });

};