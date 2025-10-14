import { CustomNavBar } from "@/components/custom/CustomNavBar"
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router"


export const AuthLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
    <CustomNavBar/>
   <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="max-w-7xl mx-auto h-full">
      <Outlet/>
    </div> 
  </div>
  </>
  )
}