import { useQuery } from "@tanstack/react-query"
import { getSupervisors } from "@/articulo-140/admin/actions/getSupervisors"

export const useSupervisors = (limit: number, page: number) => {
  const query = useQuery({ 
    queryKey: ["supervisors", limit, page],
    queryFn: () => getSupervisors(limit, page)
  })

  return { query }
} 
