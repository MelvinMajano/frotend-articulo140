import { CustomMainCard } from "@/components/custom/CustomMainCard"
import { CustomContendAdActivities } from "./components/CustomContendAdActivities"
import { SideBarActivitiesProvider } from "./context/SideBarActivitiesContext"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import { gestionActivitiesStore } from "./stores/gestionActivitiesStore"


export const GestionAcivitiesPage = () => {
  const {id} = useParams();
  const {getIsDisbleActivity}= gestionActivitiesStore();
    useQuery({
      queryKey:['isDisable',{id}],
      queryFn:()=>getIsDisbleActivity(id),
      retry:false
    })
      
  return (
    <SideBarActivitiesProvider>
    <CustomMainCard ContendSideBar={<CustomContendAdActivities />}/>
    </SideBarActivitiesProvider>
  )
}
