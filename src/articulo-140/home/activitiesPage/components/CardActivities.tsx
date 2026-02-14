import { authStore } from '@/articulo-140/auth/store/authStore'
import { useActivities } from '@/articulo-140/hooks/activities/activities/useActivities'
import type { Datum } from '@/articulo-140/interfaces/activities.response'
import { CardContent } from '@/components/ui/card'
import { useMemo } from 'react'
import { ActivityCard } from './custom/ActivityCard'

interface CardActivitiesProps {
  searchQuery: string
}

export const CardActivities = ({ searchQuery }: CardActivitiesProps) => {
  const { isAdmin} = authStore()
  const { query } = useActivities()
  const activities: Datum[] | undefined = query?.data?.data.data

 const filteredActivities = useMemo(() => {
    if (!activities) return []

    let filtered = activities.filter((activity) => {
      if (isAdmin()) return true
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-16 items-stretch">
        {filteredActivities?.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </CardContent>
  )
}