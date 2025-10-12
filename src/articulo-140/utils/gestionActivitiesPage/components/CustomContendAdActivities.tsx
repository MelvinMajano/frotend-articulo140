
import { SidebarProvider} from "@/components/ui/sidebar"
import { CustomSidebarAdActivities } from "./CustomSidebarAdActivities"
import { GeneralSeccionAdActivities } from "./sectionsActivities/GeneralSeccionAdActivities"
import { SideBarActivitiesContext } from "../context/SideBarActivitiesContext"
import { StudentsAdActivities } from "./sectionsActivities/StudentsSecctionActivities"
import { ControlZoneAdActivities } from "./sectionsActivities/ControlZone"
import { use } from "react"



export const CustomContendAdActivities = () => {
      const {itemsSelected} = use(SideBarActivitiesContext);
    return (
    <div className="bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full">
          <div className="w-70">
            <div className="min-h-screen">
              <div className="flex h-full">
                <div className="w-full border-r-0">
                  <div className="text-sidebar-foreground flex h-full w-full flex-col rounded-l-xl">
                  <CustomSidebarAdActivities/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 pl-0">
            <div className="min-h-screen">
              <div className="h-full">
                <div className="p-6 pt-4 space-y-8">
                  {itemsSelected==='controlZona'?(
                    <ControlZoneAdActivities/>
                  ):itemsSelected==='Students'?(
                  <StudentsAdActivities/>):
                  (<GeneralSeccionAdActivities/>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
