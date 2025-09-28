import { Card, CardHeader } from "../ui/card"
import type { JSX } from "react"

interface props{
  HeaderCardActivities
?: JSX.Element,
  CardActivities
?:JSX.Element,
  CustomPagination
?:JSX.Element,
  ContendSideBar?:JSX.Element,
}


export const CustomMainCard = (
  {HeaderCardActivities,CardActivities,CustomPagination,ContendSideBar}:props
) => {
  return (
            <Card className="bg-white shadow-lg border-0 p-6">
                <CardHeader className="px-0 pt-0 pb-6">
                {HeaderCardActivities}
                </CardHeader>

                {CardActivities}
                {CustomPagination}
                {ContendSideBar}
            </Card>
  )
}


