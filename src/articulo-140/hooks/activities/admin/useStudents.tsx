import { useQuery } from "@tanstack/react-query"
import { getStudents } from "@/articulo-140/admin/actions/getStudents"

export const useStudents = () => {
  const query = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  })

  return { query }
}
