import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getPostsAction, getAdminPostsAction,
  createPostAction, updatePostAction, deletePostAction,
  togglePostVisibilityAction, togglePostPinAction
} from "@/articulo-140/admin/actions/about.actions"
import type { PostCategory } from "@/articulo-140/interfaces/about.response"

export const useAboutPosts = (isAdmin: boolean, category?: PostCategory | "all") => {
  const queryClient = useQueryClient()

  const selectedCategory = category === "all" ? undefined : category

  // Query diferente según rol
  const query = useQuery({
    queryKey: ["about-posts", isAdmin, selectedCategory],
    queryFn: () => isAdmin
      ? getAdminPostsAction()
      : getPostsAction(selectedCategory),
  })

  const createMutation = useMutation({
    mutationFn: createPostAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about-posts"] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updatePostAction>[1] }) =>
      updatePostAction(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about-posts"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deletePostAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about-posts"] }),
  })

  const toggleVisibilityMutation = useMutation({
    mutationFn: togglePostVisibilityAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about-posts"] }),
  })

  const togglePinMutation = useMutation({
    mutationFn: togglePostPinAction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["about-posts"] }),
  })

  return {
    query,
    createMutation,
    updateMutation,
    deleteMutation,
    toggleVisibilityMutation,
    togglePinMutation,
  }
}