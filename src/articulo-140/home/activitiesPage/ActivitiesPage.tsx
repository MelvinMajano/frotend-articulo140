import { CustomMainCard } from "@/components/custom/CustomMainCard"
import { CardActivities } from "./components/CardActivities"
import { CustomHeaderCardActivities } from "./components/custom/CustomHeaderCardActivities"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { useActivities } from "@/articulo-140/hooks/activities/useActivities"



export const ActivitiesPage = () => {
  const {query} = useActivities();
  const totalPages: number | undefined = query.data?.data.pagination.totalPage
  return (
    <CustomMainCard Contentd={<CardActivities/>} 
          HeaderCardActivities={<CustomHeaderCardActivities/>}
          CustomFooter={<CustomPagination totalPages={!totalPages? 1: totalPages}/>}
          ></CustomMainCard>
  )
}
 