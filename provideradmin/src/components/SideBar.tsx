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
import { useAuth } from "@/utils/AuthProvider";
import { useLogout } from "@/hooks/useLogout";

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

const SideBar = () => {

  const { state } = useAuth();
  const { mutate:logout } = useLogout();

  return (
    <Sidebar collapsible="icon" className=" w-64 rounded-r-md">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg tracking-tighter font-medium mt-2 mb-5 text-white">
            {" "}
            Park Request
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className=" text-gray-300 pt-4 gap-2">
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
                )
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
                  <User2 /> {state.user?.username}
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
                <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                  <LogOut/>
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
