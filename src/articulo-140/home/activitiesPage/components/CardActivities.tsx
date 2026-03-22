import { authStore } from '@/articulo-140/auth/store/authStore'
import { useActivities } from '@/articulo-140/hooks/activities/activities/useActivities'
import type { Datum } from '@/articulo-140/interfaces/activities.response'
import { CardContent } from '@/components/ui/card'
import { ActivityCard } from './custom/ActivityCard'
import { useSearchParams } from 'react-router'
import { Loader2, SearchX, CalendarX } from 'lucide-react'
import { UNAH_BLUE } from '@/lib/colors'

export const CardActivities = () => {
  const { isAdmin }    = authStore()
  const { query }      = useActivities()
  const [searchParams] = useSearchParams()
  const searchQuery    = searchParams.get("search") || ""

  const activities: Datum[] | undefined = query?.data?.data.data

  const visibleActivities = activities?.filter((activity) => {
    if (isAdmin()) return true
    return activity.isDisabled !== "true"
  }) ?? []

  // ── Cargando ──────────────────────────────────────────────────────────────
  if (query.isLoading) {
    return (
      <CardContent className="px-0 pb-0">
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: UNAH_BLUE }} />
        </div>
      </CardContent>
    )
  }

  // ── Sin resultados de búsqueda (404) ──────────────────────────────────────
  if (query.isError && searchQuery) {
    return (
      <CardContent className="px-0 pb-0">
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <SearchX className="w-14 h-14 text-gray-300" />
          <p className="text-gray-600 text-lg font-medium">
            Sin resultados para "{searchQuery}"
          </p>
          <p className="text-gray-500 text-sm text-center max-w-sm">
            No se encontró ninguna actividad que coincida con tu búsqueda.
            Intenta con otro título, ámbito o número de horas.
          </p>
        </div>
      </CardContent>
    )
  }

  // ── Sin actividades en absoluto ───────────────────────────────────────────
  if (!visibleActivities.length) {
    return (
      <CardContent className="px-0 pb-0">
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CalendarX className="w-14 h-14 text-gray-300" />
          <p className="text-gray-600 text-lg font-medium">
            No hay actividades disponibles
          </p>
        </div>
      </CardContent>
    )
  }

  // ── Grid de actividades ───────────────────────────────────────────────────
  return (
    <CardContent className="px-0 pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-16 items-stretch">
        {visibleActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </CardContent>
  )
}