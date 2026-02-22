import { useQuery } from "@tanstack/react-query"
import { getDeletedActivities } from "@/articulo-140/admin/actions/getDeletedActivities"

export const useDeletedActivities = (limit: number, page: number) => {
  const query = useQuery({
    queryKey: ['deletedActivities', limit, page],
    queryFn: async () => {
      try {
        return await getDeletedActivities(limit, page)
      } catch (error: any) {
        const status = error?.status ?? error?.response?.status
        if (status === 404) {
          return { data: { data: [], pagination: { total: 0, totalPage: 1 } } }
        }
        throw error
      }
    },
  })

  return { query }
}