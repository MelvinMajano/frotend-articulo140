import { CustomMainCard } from "@/components/custom/CustomMainCard"
import { CardActivities } from "./components/CardActivities"
import { CustomHeaderCardActivities } from "./components/custom/CustomHeaderCardActivities"
import { CustomPagination } from "@/components/custom/CustomPagination"


export const ActivitiesPage = () => {
  return (
    <CustomMainCard Contentd={<CardActivities/>} 
          HeaderCardActivities={<CustomHeaderCardActivities/>}
          CustomPagination={<CustomPagination/>}
          ></CustomMainCard>
  )
}
