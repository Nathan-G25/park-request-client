import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../utils/AuthProvider";


const logoutUser = async () => {
    await fetch('http://localhost:300/provider/logout', {
        method: 'POST'
    });
}


export const useLogout = () => {

    const queryClient = useQueryClient();
    const { dispatch } = useAuth();

    return useMutation<void, Error>({
        mutationFn: logoutUser,
        onSuccess: () => {
            dispatch({type:'LOGOUT'});
            queryClient.setQueryData(['user'], null);
            //queryClient.invalidateQueries({ queryKey: ['protectedData'] })
        },
        onError: ( error ) => {
            console.error("Logout Failed", error.message);
        }   
    });

};