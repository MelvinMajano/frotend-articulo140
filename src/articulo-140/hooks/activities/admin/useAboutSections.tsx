import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSectionsAction, updateSectionsAction } from "@/articulo-140/admin/actions/about.actions"

export const useAboutSections = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["about-sections"],
    queryFn: getSectionsAction,
  })

  const mutation = useMutation({
    mutationFn: updateSectionsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-sections"] })
    },
  })

  return { query, mutation }
}