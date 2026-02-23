import { CustomNavBar } from "@/components/custom/CustomNavBar"
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router"
import { UNAH_BLUE_SOFT, UNAH_WHITE } from "@/lib/colors"

export const DashboardActivitiesLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
    <CustomNavBar/>
   <div className="min-h-screen p-4" style={{ background: `linear-gradient(135deg, ${UNAH_BLUE_SOFT} 0%, ${UNAH_WHITE} 100%)` }}>
    <div className="max-w-7xl mx-auto">
      <Outlet/>
    </div> 
  </div>
  </>
  )
}
