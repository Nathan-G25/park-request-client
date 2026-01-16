import { Navigate, Outlet } from "react-router";
import SideBar from "./components/SideBar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { useContext } from "react";
import { AuthContext } from "./utils/AuthProvider";

const Layout = () => {

  const auth = useContext(AuthContext);

  if(!auth || !auth.state.isAuthenticated){
    return <Navigate to="/login" replace/>;

  }

  if(auth.state.user?.token) {
    console.log(`user not know ${auth.state.user.username}`)
  }


  return (
    <SidebarProvider>
      <SideBar />
      {/* <SidebarInset className=" bg-gray-50"/> */}
      <SidebarTrigger className=" -ml-1"/>
      <main className=" flex-1 flex flex-col pl-3 pr-6 md:px-10 pt-5">
        <Outlet/>
      </main>
    </SidebarProvider>
  );
};

export default Layout;
