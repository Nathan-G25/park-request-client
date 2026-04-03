import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Save, X, Loader2 } from "lucide-react";
import { fetchUserProfile } from "@/components/SideBar";
import type { EditProfile } from "@/schema";
import toast from "react-hot-toast";



export default function Profile() {
  const [editing, setEditing] = useState(false);
//   const queryClient = useQueryClient();


  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
    retry:false
  });

  // 2. Setup Mutation for Saving
  const updateMutation = useMutation({
    mutationFn: async (newData: EditProfile) => {
        const storedUser = localStorage.getItem("user");

            if (!storedUser) {
                throw new Error("No user found");
            }

            const user = JSON.parse(storedUser);
            const token = user.accessToken;


            const response = await fetch("http://localhost:3000/parking-avenue-owner/update/parking-avenue-owner", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newData),
            });

            // const rawText = await response.text();
            // console.log("🔍 Response status:", response.status);
            // console.log("🔍 Response headers:", Object.fromEntries(response.headers.entries()));
            // console.log("🔍 Raw response body:", rawText);

            // console.log(response);
            // console.log(newData);
            if(!response.ok) {
                throw new Error(`${response.status}: Error while updating user`);
            }
      
            const result = await response.json();
            console.log(result);

            return result;
    },
    onSuccess: (newData) => {
        toast.success(newData.message || "Account created successfully! 🎉");
    //   queryClient.invalidateQueries({ queryKey: ["profile"] });
      setEditing(false);
    },
    onError: (error: Error) => {
        toast.error(error.message);
    //   queryClient.invalidateQueries({ queryKey: ["profile"] });
      setEditing(false);
    },
  });

  // 3. Initialize React Hook Form
  // 'values' will automatically update the form when 'user' data loads
  const { register, handleSubmit, reset } = useForm<EditProfile>({
    values: {
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        username: user?.username ?? "",
        phoneNo: user?.phoneNo ?? ""
    }, 
  });

  const onSubmit = (data: EditProfile) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    reset(); 
    setEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  return (
    <div className="max-w-2xl mx-auto">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="bg-card rounded-xl border border-border/50 shadow-card p-8 animate-fade-in"
      >
        <div className="flex items-center gap-5 mb-8">
          <Avatar className="h-20 w-20 text-2xl">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {initials || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-display font-bold text-foreground">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-muted-foreground">@{user?.username}</p>
          </div>
          {!editing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="ml-auto gap-2"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              disabled={!editing}
              {...register("firstName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              disabled={!editing}
              {...register("lastName")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              disabled={!editing}
              {...register("username")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNo">Phone Number</Label>
            <Input
              id="phoneNo"
              disabled={!editing}
              {...register("phoneNo")}
            />
          </div>
        </div>
        {editing && (
          <div className="flex justify-end gap-3 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel} 
              className="gap-2"
              disabled={updateMutation.isPending}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="gap-2"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}