import { CustomImput } from "@/components/custom/CustomImput"
import { CustomMainCard } from "@/components/custom/CustomMainCard"
import { Button } from "@/components/ui/button"
import { CardActivities } from "./activities/components/CardActivities"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomHeaderCardActivities } from "./activities/components/custom/CustomHeaderCardActivities"



export const HomePage = () => {
  

  return (
    <div>
          <div className="flex justify-between ml-2 mr-4 mb-2">
            <CustomImput/>
            <Button >Agregar actividad</Button>
          </div>
          <CustomMainCard CardActivities={<CardActivities/>} 
          HeaderCardActivities={<CustomHeaderCardActivities/>}
          CustomPagination={<CustomPagination/>}
          ></CustomMainCard>
            
    </div>
  )
}
