import { useQuery } from "@tanstack/react-query"
import { getDeletedActivities } from "@/articulo-140/admin/actions/getDeletedActivities"

export const useDeletedActivities = (limit: number, page: number) => {
  const query = useQuery({
    queryKey: ['deletedActivities', limit, page],
    queryFn: () => getDeletedActivities(limit, page),
  })

  return { query }
}