import type { SignUpFormData } from "@/schema";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useRegisterOwner = () => {
    return useMutation({
        mutationFn: async (data: SignUpFormData) => {
            const formData = new FormData();

            formData.append("username", data.username);
            formData.append("password", data.password);
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("email", data.email);
            formData.append("phoneNo", data.phoneNo);

            if (data.personalId && data.personalId[0]) {
                formData.append("personalId", data.personalId[0]);
            }

            const response = await fetch("http://localhost:3000/parking-avenue-owner/register", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Registration failed");
            }

            return result;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Account created successfully! 🎉");
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
};