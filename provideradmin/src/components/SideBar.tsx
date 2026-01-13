import { LayoutDashboard} from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"

const items =[
    {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
]

const SideBar = () => {
  return (
    <Sidebar className=" w-64 rounded-r-md">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className=" text-xl mt-2 mb-5 text-white">Provider Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className=" text-white">
              {items.map((item) => (
                console.log(item),
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default SideBar