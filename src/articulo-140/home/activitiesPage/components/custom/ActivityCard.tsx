import { useActivityImages } from '@/articulo-140/hooks/activities/admin/useActivityImages'
import { authStore } from '@/articulo-140/auth/store/authStore'
import type { Datum } from '@/articulo-140/interfaces/activities.response'
import { MinimalModal } from '@/components/custom/CustomModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Calendar, CalendarX, Gem, User } from 'lucide-react'
import { Link } from 'react-router'
import { gestionActivitiesStore } from '@/articulo-140/utils/gestionActivitiesPage/stores/gestionActivitiesStore'
import { DetailsInscriptionsActivity } from './CustomDetailsInscriptionActivitys'
import { CustomStatusIndicator } from './CustomStatusIndicator'
import { UNAH_BLUE, UNAH_BLUE_GRADIENT, UNAH_BLUE_SOFT } from '@/lib/colors'


interface ActivityCardProps {
  activity: Datum
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const { isAdmin, isSupervisor, isStudent } = authStore()
  const { getActivityEstatus, numberToStatus } = gestionActivitiesStore()
  
  const { imageUrl } = useActivityImages(activity.id.toString())

  const savedStatus = getActivityEstatus(activity.id.toString())
  const estadoParam = savedStatus ?? numberToStatus(activity.status)
  const isActivityDisabled = activity.isDisabled === 'true'

  return (
    <Card
      key={activity.id}
      className={`flex flex-col overflow-hidden transition-all duration-300 ${
        isActivityDisabled
          ? 'opacity-60 bg-gray-50 border-gray-200 max-w-xs w-64 h-full'
          : 'hover:shadow-xl hover:-translate-y-1 bg-[#EFF6FF] max-w-xs w-64 h-full'
      }`}
      style={!isActivityDisabled ? { border: `1.5px solid ${UNAH_BLUE}20`, boxShadow: `0 2px 12px 0 ${UNAH_BLUE}12` } : {}}
    >
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={imageUrl ?? '/placeholder.svg'}
            alt={activity.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isActivityDisabled ? '' : 'hover:scale-105'
            }`}
          />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs" style={{ background: UNAH_BLUE_SOFT, color: UNAH_BLUE, border: `1px solid ${UNAH_BLUE}20` }}>
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
            <Calendar className="w-4 h-4" style={{ color: UNAH_BLUE }} />
            <span className="font-medium">Inicio: {activity.startDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarX className="w-4 h-4" style={{ color: UNAH_BLUE }} />
            <span className="font-medium">Fin: {activity.endDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4" style={{ color: UNAH_BLUE }} />
            Cupos:
            <span className="font-medium"> {activity.availableSpots}</span>
          </div>

          <div className="flex items-center gap-2">
            <Gem className="w-4 h-4" style={{ color: UNAH_BLUE }} />
            Horas Voae:
            <span className="font-medium"> {activity.voaeHours}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col p-5 pt-0 mt-auto">
        {isAdmin() && (
          <Link to={`/activities-details/${activity.id}?Status=${estadoParam}`} className="block w-full">
            <Button
              className="w-full text-white font-medium py-2.5 transition-colors duration-200"
              variant={isActivityDisabled ? 'ghost' : 'default'}
              style={{ background: UNAH_BLUE }}
            >
              Gestionar
            </Button>
          </Link>
        )}
        {isSupervisor() && (
          <Link to={`/supervisor/incriptions-attendance/${activity.id}`} className="block w-full">
            <Button className="w-full text-white font-medium py-2.5 transition-colors duration-200" style={{ background: UNAH_BLUE_GRADIENT }}>
              Supervisar
            </Button>
          </Link>
        )}
        {isStudent() && (
          <MinimalModal
            trigger={
              <Button className="w-full text-white font-medium py-2.5 transition-colors duration-200" style={{ background: UNAH_BLUE_GRADIENT }}>
                Ver Detalles
              </Button>
            }
            title={activity.title}
            description={activity.description}
          >
            <DetailsInscriptionsActivity />
          </MinimalModal>
        )}
      </CardFooter>
    </Card>
  )
}