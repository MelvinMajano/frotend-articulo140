import { CardActivities } from "@/articulo-140/pages/homePages/activities/components/CardActivities"
import { Badge } from "../ui/badge"
import { Card, CardHeader } from "../ui/card"
import { CustomPagination } from "./CustomPagination"

const activities:string[] = []

export const CustomMainCard = () => {
  return (
                <Card className="bg-white shadow-lg border-0 p-6">
              <CardHeader className="px-0 pt-0 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Actividades Disponibles</h3>
                    <p className="text-sm text-gray-500 mt-1">Selecciona una actividad para inscribirte</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
                    {activities.length} actividades
                  </Badge>
                  
                </div>
              </CardHeader>
              <CardActivities/>
              <CustomPagination/>
            </Card>
  )
}
