import { Card, CardHeader } from "../ui/card"
import type { JSX } from "react"
import { UNAH_BLUE } from "@/lib/colors"

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
            <Card className="bg-white p-6" style={{ boxShadow: `0 4px 24px 0 ${UNAH_BLUE}14`, border: `1.5px solid ${UNAH_BLUE}15` }}>
                <CardHeader className="px-0 pt-0 pb-6">
                {HeaderCardActivities}
                </CardHeader>

                {Contentd}
                {CustomFooter}
                {ContendSideBar}
            </Card>
  )
}


