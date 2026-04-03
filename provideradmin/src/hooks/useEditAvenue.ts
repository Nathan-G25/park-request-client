
import type { editParkingAvenue } from "@/schema";
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast";

export const useEditAvenue = () => {
    return useMutation({
        mutationFn: async (data: editParkingAvenue) => {

            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("workingHrs", data.workingHrs);
            formData.append("hourlyRate", data.hourlyRate.toString());
            formData.append("totalSpots", data.totalSpots.toString());
            formData.append("status", data.status);
            formData.append("currentSpots", data.currentSpots.toString());
            

            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                throw new Error("No user found");
            }

            const user = JSON.parse(storedUser);
            const token = user.accessToken;

            if (!token) {
                throw new Error("Unauthorized: No token found");
            }

            const response = await fetch("http://localhost:3000/admin/register/parking-avenue", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            })

            // const rawText = await response.text();
            // console.log("🔍 Response status:", response.status);
            // console.log("🔍 Response headers:", Object.fromEntries(response.headers.entries()));
            // console.log("🔍 Raw response body:", rawText);

            console.log(response);
            console.log(data);
            if(!response.ok) {
                throw new Error(`!${response.status}: error occured`)
            }

            // if (!response.ok) {
            //     // Try to parse as JSON, fallback to raw text
            //     let errorMessage = rawText;
            //     try {
            //         const json = JSON.parse(rawText);
            //         errorMessage = json.message || json.error || JSON.stringify(json);
            //     } catch {
            //         // Keep rawText if not JSON
            //     }
            //     throw new Error(`Server error ${response.status}: ${errorMessage}`);
            // }

            // Parse success response
            // try {
            //     return JSON.parse(rawText);
            // } catch {
            //     throw new Error("Server returned invalid JSON");
            // }

        },
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message);
        },
    })
}