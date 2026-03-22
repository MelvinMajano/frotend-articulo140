import { useQuery } from "@tanstack/react-query"
import { getSupervisors } from "@/articulo-140/admin/actions/getSupervisors"

export const useSupervisors = (limit: number, page: number, search: string) => {
  const query = useQuery({ 
    queryKey: ["supervisors", limit, page, search],
    queryFn: () => getSupervisors(limit, page, search),
    retry: false
  })

  return { query }
} 
