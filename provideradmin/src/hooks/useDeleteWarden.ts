import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteWarden = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wardenId: string) => {
        const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        throw new Error("No user found");
      }

      const user = JSON.parse(storedUser);
      const token = user.accessToken;

      if (!token) {
        throw new Error("Unauthorized: No token found");
      }
      const response = await fetch(`http://localhost:3000/warden/${wardenId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to delete warden");
      return response.json();
    },
    onSuccess: () => {
      // This refreshes your warden list automatically
      queryClient.invalidateQueries({ queryKey: ["wardens"] });
    },
  });
};