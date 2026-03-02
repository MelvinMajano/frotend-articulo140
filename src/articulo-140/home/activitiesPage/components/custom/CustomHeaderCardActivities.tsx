import { Badge } from "@/components/ui/badge"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"
import { useActivities } from "@/articulo-140/hooks/activities/activities/useActivities"

export const CustomHeaderCardActivities = () => {
  const { query } = useActivities()
  const total: number = query.data?.data.pagination.total ?? 0

  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Actividades Disponibles</h3>
        <p className="text-sm text-gray-500 mt-1">Selecciona una actividad para inscribirte</p>
      </div>
      <Badge variant="secondary" className="text-xs" style={{ background: UNAH_BLUE_SOFT, color: UNAH_BLUE, border: `1px solid ${UNAH_BLUE}25` }}>
        {total} actividades
      </Badge>
    </div>
  )
}
