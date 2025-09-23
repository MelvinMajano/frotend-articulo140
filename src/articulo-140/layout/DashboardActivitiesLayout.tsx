import { CustomNavBar } from "@/components/custom/CustomNavBar"
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router"


export const DashboardActivitiesLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
    <CustomNavBar/>
   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
    <div className="max-w-7xl mx-auto">
      <Outlet/>
    </div> 
  </div>
  </>
  )
}
