import { Navigate, Outlet } from "react-router";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import SideBar from "./components/SideBar";
import { AuthContext } from "./utils/AuthProvider";
import { useContext } from "react";

const Layout = () => {
  const auth = useContext(AuthContext);

  if (!auth || !auth.state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarTrigger className=" -ml-1" />
      <main className=" flex-1 flex flex-col pl-3 pr-6 md:px-10 pt-5">
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default Layout;
