import { useQuery } from "@tanstack/react-query"
import { getStudents } from "@/articulo-140/admin/actions/getStudents"

export const useStudents = (limit: number, page: number, search: string) => {
  const query = useQuery({
    queryKey: ["students", limit, page, search],
    queryFn: () => getStudents(limit, page, search),
    retry: false
  })

  return { query }
}

