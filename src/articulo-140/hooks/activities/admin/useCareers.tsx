import { useQuery } from "@tanstack/react-query"
import { getCareers } from "@/articulo-140/admin/actions/getCareers"

export const useCareers = (limit: number, page: number) => {
  const query = useQuery({
    queryKey: ["careers",limit,page],
    queryFn: () => getCareers(limit, page),
  })

  return { query }
}
