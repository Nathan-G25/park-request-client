import {
  Calendar,
  Car,
  ChartColumn,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  Radio,
  User2,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import z from "zod";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Parking Assets",
    url: "/assets",
    icon: Car,
  },
  {
    title: "Wardens",
    url: "/wardens",
    icon: Users,
  },
  {
    title: "Live Operations",
    url: "/live-ops",
    icon: Radio,
  },
  {
    title: "Reservations",
    url: "/reservations",
    icon: Calendar,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartColumn,
  },
];

export const ProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string().email(),
  phoneNo: z.string(),
  isVerified: z.string(),
});

export type UserProfile = z.infer<typeof ProfileSchema>;


const fetchUserProfile = async (): Promise<UserProfile> => {
      const storedUser = localStorage.getItem("user");

      if(!storedUser) {
        throw new Error("No user found");
      }

      const user = JSON.parse(storedUser);
      const token = user.accessToken;


      if(!token) {
        throw new Error("No accesstoken found");
      }

      const response = await fetch(
        "http://localhost:3000/parking-avenue-owner/me",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
     
      const data = await response.json();

     if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }
        throw new Error("Could not fetch profile");
      }

      const result = ProfileSchema.safeParse(data);

      if(!result.success) {
        console.error("Profile data validation failed", result.error);
        throw new Error("Invalid profile data received");
      }

      return result.data;
}

const SideBar = () => {

  const { mutate: logout } = useLogout();

  const {data: user, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
    retry: false, 
  });

  if(error) {
    console.error("Error fetching user profile:", error);
  }
  
  return (
    <Sidebar collapsible="icon" className=" w-64 rounded-r-md font-inter">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg tracking-tighter font-medium mt-2 mb-5 text-white">
            {" "}
            Park Request
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className=" text-gray-300 pt-4 gap-3">
              {items.map(
                (item) => (
                  console.log(item),
                  (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className=" pb-3">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className=" text-gray-300">
                  <User2 /> {user?.username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
                align="end"
              >
                <DropdownMenuItem>
                  <User2 />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => logout()}
                >
                  <LogOut />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
