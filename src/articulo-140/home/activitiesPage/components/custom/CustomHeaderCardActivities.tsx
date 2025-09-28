import { Badge } from "@/components/ui/badge"


const activities:string[] = []

export const CustomHeaderCardActivities = () => {
  return (
    <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Actividades Disponibles</h3>
                    <p className="text-sm text-gray-500 mt-1">Selecciona una actividad para inscribirte</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
                    {activities.length} actividades
                  </Badge>
    </div>
  )
}
