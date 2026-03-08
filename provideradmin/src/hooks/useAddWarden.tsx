import type { CreateWarden } from "@/schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useAddWarden = () => {
  return useMutation({
    mutationFn: async (data: CreateWarden) => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error("No user found");
      }

      const user = JSON.parse(storedUser);
      const token = user.accessToken;

      if (!token) {
        throw new Error("Unauthorized: No token found");
      }
      const response = await fetch("http://localhost:3000/warden", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(`${response.status} unable to complete the operation`);
      }

      return result;
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error(error.message);
    },
  });
};
