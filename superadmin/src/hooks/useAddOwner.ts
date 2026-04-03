import type { SignUpFormData } from "@/schema";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useAddOwner = () => {
    return useMutation({
        mutationFn: async (data: SignUpFormData) => {
            const formData = new FormData();

            formData.append("username", data.username);
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("email", data.email);
            formData.append("phoneNo", data.phoneNo);

            if (data.personalId && data.personalId instanceof FileList && data.personalId[0]) {
                formData.append("personalId", data.personalId[0]);
            } else {
                throw new Error("Personal ID file is required!");
            }

            // 🔍 DEBUG: Log before appending
            console.log("🔍 Inside mutationFn - personalId check:");
            console.log("  - data.personalId:", data.personalId);
            console.log("  - instanceof FileList:", data.personalId instanceof FileList);
            console.log("  - length:", data.personalId?.length);
            console.log("  - first file:", data.personalId?.[0]?.name);

            if (data.personalId && data.personalId instanceof FileList && data.personalId[0]) {
                console.log("")
                formData.append("personalId", data.personalId[0]);
                console.log("✅ File appended to FormData");
            } else {
                console.error("❌ File check failed - throwing error");
                throw new Error("Personal ID file is required!");
            }

            // 🔍 DEBUG: Log all FormData entries
            console.log("📦 FormData entries:");
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`  ${key}: File { name: "${value.name}", size: ${value.size}, type: "${value.type}" }`);
                } else {
                    console.log(`  ${key}: ${value}`);
                }
            }

            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                throw new Error("No user found");
            }

            const user = JSON.parse(storedUser);
            const token = user.accessToken;


            const response = await fetch("http://localhost:3000/admin/register/parking-avenue-owner", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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