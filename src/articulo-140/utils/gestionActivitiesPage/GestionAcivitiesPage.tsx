import { CustomMainCard } from "@/components/custom/CustomMainCard"
import { CustomContendAdActivities } from "./components/CustomContendAdActivities"
import { SideBarActivitiesProvider } from "./context/SideBarActivitiesContext"



export const GestionAcivitiesPage = () => {
  return (
    <SideBarActivitiesProvider>
    <CustomMainCard ContendSideBar={<CustomContendAdActivities/>}/>
    </SideBarActivitiesProvider>
  )
}
