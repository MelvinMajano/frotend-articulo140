import { useMemo } from 'react'
import { authStore } from '@/articulo-140/auth/store/authStore'
import { useActivities } from '@/articulo-140/hooks/activities/activities/useActivities'
import type { Datum } from '@/articulo-140/interfaces/activities.response'
import { MinimalModal } from '@/components/custom/CustomModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Calendar, CalendarX, Gem, User } from 'lucide-react'
import { Link } from 'react-router'
import { DetailsInscriptionsActivity } from './custom/CustomDetailsInscriptionActivitys'
import { gestionActivitiesStore } from '@/articulo-140/utils/gestionActivitiesPage/stores/gestionActivitiesStore'
import { CustomStatusIndicator } from './custom/CustomStatusIndicator'

interface CardActivitiesProps {
  searchQuery: string
}

export const CardActivities = ({ searchQuery }: CardActivitiesProps) => {
  const { isAdmin, isSupervisor, isStudent } = authStore()
  const { query } = useActivities()
  const activities: Datum[] | undefined = query?.data?.data.data

  const { getActivityEstatus, numberToStatus } = gestionActivitiesStore()

  // Filtrar actividades si no es Admin y por búsqueda (excluyendo fechas)
  const filteredActivities = useMemo(() => {
    if (!activities) return []

    // Primer filtro: actividades deshabilitadas
    let filtered = activities.filter((activity) => {
      // Si es admin, mostrar todas las actividades
      if (isAdmin()) return true
      // Si NO es admin, solo mostrar actividades habilitadas
      return activity.isDisabled !== 'true'
    })

    // Segundo filtro: búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      
      filtered = filtered.filter((activity) => 
        activity.title?.toLowerCase().includes(query) ||
        activity.description?.toLowerCase().includes(query) ||
        activity.scopes.toString().toLowerCase().includes(query) ||
        activity.availableSpots?.toString().includes(query) ||
        activity.voaeHours?.toString().includes(query)
      )
    }

    return filtered
  }, [activities, isAdmin, searchQuery])

  return (
    <CardContent className="px-0 pb-0">
      {/* Contador de resultados */}
      {searchQuery && activities && (
        <div className="mb-4 ml-16 text-sm text-gray-600">
          {filteredActivities.length === 0 
            ? "No se encontraron resultados" 
            : `Mostrando ${filteredActivities.length} de ${activities.length} actividades`
          }
        </div>
      )}

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 text-lg">
            {searchQuery 
              ? "No se encontraron actividades que coincidan con tu búsqueda" 
              : "No hay actividades disponibles"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-16 items-stretch">
          {filteredActivities.map((activity) => {
            const savedStatus = getActivityEstatus(activity.id.toString())
            const estadoParam = savedStatus ?? numberToStatus(activity.status)

            const isActivityDisabled = activity.isDisabled === 'true'
            
            return (
              <Card
                key={activity.id}
                className={`flex flex-col overflow-hidden transition-all duration-300 ${
                  isActivityDisabled
                    ? 'opacity-60 bg-gray-50 border-gray-200 max-w-xs w-64 h-full'
                    : 'hover:shadow-xl hover:-translate-y-1 bg-white border border-gray-100 max-w-xs w-64 h-full'
                }`}
              >
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={"/placeholder.svg"}
                      alt={activity.title}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        isActivityDisabled ? '' : 'hover:scale-105'
                      }`}
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
                        {activity.scopes}
                      </Badge>
                      <CustomStatusIndicator 
                        status={activity.status}
                        activityId={activity.id.toString()}
                        showLabel={false}
                      />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-5 pb-5">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span className="font-medium">Inicio: {activity.startDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarX className="w-4 h-4 text-teal-600" />
                      <span className="font-medium">Fin: {activity.endDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-600" />Cupos:
                      <span className="font-medium"> {activity.availableSpots}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Gem className="w-4 h-4 text-teal-600" />Horas Voae:
                      <span className="font-medium"> {activity.voaeHours}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col p-5 pt-0 mt-auto">
                  {isAdmin() && (
                    <Link to={`/activities-details/${activity.id}?Status=${estadoParam}`} className="block w-full">
                      <Button 
                        className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 transition-colors duration-200`} 
                        variant={isActivityDisabled ? 'ghost' : 'default'}
                      >
                        Gestionar
                      </Button>
                    </Link>
                  )}
                  {isSupervisor() && (
                    <Link to={`/supervisor/incriptions-attendance/${activity.id}`} className="block w-full">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 transition-colors duration-200">
                        Supervisar
                      </Button>
                    </Link>
                  )}
                  {isStudent() && (
                    <MinimalModal
                      trigger={
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 transition-colors duration-200">
                          Ver Detalles
                        </Button>
                      }
                      title="Detalles de la actividad"
                      description="Información detallada y formulario de inscripción para la actividad"
                    >
                      <DetailsInscriptionsActivity />
                    </MinimalModal>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </CardContent>
  )
}