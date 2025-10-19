import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { ActivitiesPage } from "./activitiesPage/ActivitiesPage"
import { authStore } from "../auth/store/authStore"
import { MinimalModal } from "@/components/custom/CustomModal"
import { ActivityForm } from "./activitiesPage/components/custom/CustomFormActivities"





export const HomePage = () => {
  const {state,isAdmin} = authStore();
  return (
    <>
    {state==="authenticated" && ( <div>
      <div className="flex justify-between ml-2 mr-4 mb-2">
        <CustomImput/>
        {isAdmin() && (
          <MinimalModal
          trigger={
            <Button >Agregar actividad</Button>
          }
          >
            <ActivityForm/>
          </MinimalModal>
           )}
      </div>
      <ActivitiesPage/>
    </div>)}
    </>
  )
}
