import { useQuery } from "@tanstack/react-query"
import { getStudents } from "@/articulo-140/admin/actions/getStudents"

export const useStudents = (limit: number, page: number) => {
  const query = useQuery({
    queryKey: ["students", limit, page],
    queryFn: () => getStudents(limit, page),
  })

  return { query }
}

