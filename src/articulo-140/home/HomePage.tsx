import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { ActivitiesPage } from "./activitiesPage/ActivitiesPage"
import { authStore } from "../auth/store/authStore"





export const HomePage = () => {
  const {isAdmin} = authStore();
  return (
    <div>
      <div className="flex justify-between ml-2 mr-4 mb-2">
        <CustomImput/>
        {isAdmin() && ( <Button >Agregar actividad</Button>)}
      </div>
      <ActivitiesPage/>
    </div>
  )
}
