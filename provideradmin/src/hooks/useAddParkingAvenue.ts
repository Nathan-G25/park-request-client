import type { CreateParkingAvenue } from "@/schema"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-hot-toast";

export const useAddParkingAvenue = () => {
    return useMutation({
        mutationFn: async (data: CreateParkingAvenue) => {
            console.log(" legalDoc debug:", {
                hasLegalDoc: !!data.legalDoc,
                isFileList: data.legalDoc instanceof FileList,
                length: data.legalDoc instanceof FileList ? data.legalDoc.length : 'N/A',
                firstFileName: data.legalDoc?.[0]?.name,
                firstFileType: data.legalDoc?.[0]?.type,
                firstFileSize: data.legalDoc?.[0]?.size,
                // Log the whole FileList as array for inspection
                files: data.legalDoc instanceof FileList
                    ? Array.from(data.legalDoc).map(f => ({ name: f.name, type: f.type, size: f.size }))
                    : 'Not a FileList'
            });

            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("address", data.address);
            formData.append("latitude", data.latitude.toString());
            formData.append("longitude", data.longitude.toString());
            formData.append("workingHrs", data.workingHrs);
            formData.append("hourlyRate", data.hourlyRate.toString());
            formData.append("totalSpots", data.totalSpots.toString());
            formData.append("status", data.status);
            formData.append("currentSpots", data.currentSpots.toString());

            if (data.legalDoc && data.legalDoc[0]) {

                formData.append("legalDoc", data.legalDoc[0])
            }

            const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                throw new Error("No user found");
            }

            const user = JSON.parse(storedUser);
            const token = user.accessToken;

            if (!token) {
                throw new Error("Unauthorized: No token found");
            }

            const response = await fetch("http://localhost:3000/parking-avenue", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            })

            const rawText = await response.text();
            console.log("🔍 Response status:", response.status);
            console.log("🔍 Response headers:", Object.fromEntries(response.headers.entries()));
            console.log("🔍 Raw response body:", rawText);

            if (!response.ok) {
                // Try to parse as JSON, fallback to raw text
                let errorMessage = rawText;
                try {
                    const json = JSON.parse(rawText);
                    errorMessage = json.message || json.error || JSON.stringify(json);
                } catch {
                    // Keep rawText if not JSON
                }
                throw new Error(`Server error ${response.status}: ${errorMessage}`);
            }

            // Parse success response
            try {
                return JSON.parse(rawText);
            } catch {
                throw new Error("Server returned invalid JSON");
            }

        },
        onError: (error: Error) => {
            console.error(error);
            toast.error(error.message);
        },
    })
}