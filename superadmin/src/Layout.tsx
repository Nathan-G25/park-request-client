import { Outlet } from "react-router"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import SideBar from "./components/SideBar"

const Layout = () => {
  return (
    <SidebarProvider>
      <SideBar />
      {/* <SidebarInset className=" bg-gray-50"/> */}
      <SidebarTrigger className=" -ml-1"/>
      <main className=" flex-1 flex flex-col pl-3 pr-6 md:px-10 pt-5">
        <Outlet/>
      </main>
    </SidebarProvider>
  )
}

export default Layout