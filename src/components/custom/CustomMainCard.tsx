import { Card, CardHeader } from "../ui/card"
import type { JSX } from "react"

interface props{
  HeaderCardActivities
?: JSX.Element,
  Contentd
?:JSX.Element,
  CustomFooter
?:JSX.Element,
  ContendSideBar?:JSX.Element,
}


export const CustomMainCard = (
  {HeaderCardActivities,Contentd,CustomFooter,ContendSideBar}:props
) => {
  return (
            <Card className="bg-white shadow-lg border-0 p-6">
                <CardHeader className="px-0 pt-0 pb-6">
                {HeaderCardActivities}
                </CardHeader>

                {Contentd}
                {CustomFooter}
                {ContendSideBar}
            </Card>
  )
}


