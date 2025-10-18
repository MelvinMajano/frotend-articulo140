import { useQuery } from "@tanstack/react-query"
import { getCareers } from "@/articulo-140/admin/actions/getCareers"

export const useCareers = () => {
  const query = useQuery({
    queryKey: ["careers"],
    queryFn: getCareers,
  })

  return { query }
}
