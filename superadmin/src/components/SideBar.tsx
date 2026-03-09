import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton } from './ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Calendar, ChartColumn, ChevronUp, CircleParking, FileText, LayoutDashboard, LogOut, Shield, User2 } from 'lucide-react'

const items = [
  {
    title: "Overview",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Providers",
    url: "/providers",
    icon: CircleParking,
  },
  {
    title: "Wardens",
    url: "/wardens",
    icon: Shield,
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
   {
    title: "Audit Logs",
    url: "/audit-logs",
    icon: FileText,
  },
];

const SideBar = () => {
  return (
    <Sidebar collapsible="icon" className=" w-64 rounded-r-md">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg tracking-tighter font-medium mt-2 mb-5 text-white">
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
                <SidebarMenuSubButton className=" text-gray-300">
                  <User2 className=' text-gray-300!' /> Admin
                  <ChevronUp className="ml-auto text-gray-300!" />
                </SidebarMenuSubButton>
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
                <DropdownMenuItem variant="destructive">
                  <LogOut/>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SideBar