import { Outlet } from "react-router"


export const DashboardActivitiesLayout = () => {
  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
    <div className="max-w-7xl mx-auto">
      <Outlet/>
    </div> 
  </div>
  )
}
