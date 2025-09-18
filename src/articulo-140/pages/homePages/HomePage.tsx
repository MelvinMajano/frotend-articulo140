import { CustomImput } from "@/components/custom/CustomImput"
import { CustomMainCard } from "@/components/custom/CustomMainCard"
import { Button } from "@/components/ui/button"

export const HomePage = () => {
  return (
    <div>
            <div className="flex justify-between ml-2 mr-4 mb-2">
              <CustomImput/>
              <Button >Agregar actividad</Button>
            </div>
            <CustomMainCard></CustomMainCard>
            
    </div>
  )
}
