import { useQuery } from "@tanstack/react-query"
import { getSupervisors } from "@/articulo-140/admin/actions/getSupervisors"

export const useSupervisors = () => {
  const query = useQuery({ 
    queryKey: ["supervisors"],
    queryFn: getSupervisors,
  })

  return { query }
} 
