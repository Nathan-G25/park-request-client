import { useMutation } from "@tanstack/react-query"

export const useUpdateProviderStatus = () => {
    return useMutation({
        mutationFn: async (data: {username: string, approvalStatus: string}) => {
            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                throw new Error("No user found");
            }

            const user = JSON.parse(storedUser);
            const token = user.accessToken;

            if (!token) {
                throw new Error("No accesstoken found");
            }
            
            const response = await fetch(
                "http://localhost:3000/admin/update-verification-status",
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                },
            );

            const result = await response.json();

            console.log(result);

            if(!response.ok) {
                throw  new Error(`${response.status} operation was unsuccessful`);
            }

            return result;
        }
    })
}