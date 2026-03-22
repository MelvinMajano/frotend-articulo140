import { useQuery } from "@tanstack/react-query"
import { getCareers } from "@/articulo-140/admin/actions/getCareers"

export const useCareers = (limit: number, page: number, search: string) => {
  const query = useQuery({
    queryKey: ["careers",limit,page,search],
    queryFn: () => getCareers(limit, page, search ),
    retry: false
  })

  return { query }
}
