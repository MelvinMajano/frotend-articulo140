import { Card, CardHeader } from "@/components/ui/card"
import type { JSX } from "react"

interface Props {
  HeaderAdmin?: JSX.Element
  CardAdmin?: JSX.Element
  CustomPagination?: JSX.Element
}

export const CustomMainCardAdmin = ({ HeaderAdmin, CardAdmin, CustomPagination }: Props) => {
  return (
    <Card className="bg-white shadow-lg border-0 p-6">
      <CardHeader className="px-0 pt-0 pb-6">{HeaderAdmin}</CardHeader>
      {CardAdmin}
      {CustomPagination}
    </Card>
  )
}