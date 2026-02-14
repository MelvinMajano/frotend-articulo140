import { articulo140Api } from "@/articulo-140/api/articulo140Api"
import { useQuery } from "@tanstack/react-query"

interface ActivityImage {
  id: string
  activityId: string
  fileName: string
  url: string
}

export const useActivityImages = (activityId: string | undefined) => {

  const query = useQuery({
    queryKey: [`activity-image-${activityId}`],
    queryFn: async () => {
      if (!activityId) return null
      
      try {
        const { data } = await articulo140Api.get<{ data: ActivityImage }>(
          `/activities/images/by-activity/${activityId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        )
        return data?.data?.url || null
      } catch (error) {
        return null
      }
    },
    enabled: !!activityId,
    staleTime: 1000 * 60 * 5,
  })

  return {
    imageUrl: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}