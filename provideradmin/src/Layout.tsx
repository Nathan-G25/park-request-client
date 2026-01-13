import { Navigate, Outlet } from "react-router";
import SideBar from "./components/SideBar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { useContext } from "react";
import { AuthContext } from "./utils/AuthProvider";

const Layout = () => {

  const auth = useContext(AuthContext);

  if(!auth || !auth.state.isAuthenticated){
    return <Navigate to="/login" replace/>;

  }


  return (
    <SidebarProvider>
      <SideBar />
      {/* <SidebarInset className=" bg-gray-50"/> */}
      <SidebarTrigger/>
      <main className=" flex-1 flex flex-col ">
        <Outlet/>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
