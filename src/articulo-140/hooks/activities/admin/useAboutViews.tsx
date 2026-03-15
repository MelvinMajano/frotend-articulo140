import { useMutation } from "@tanstack/react-query"
import { incrementPostViewAction } from "@/articulo-140/admin/actions/about.actions"
import { useEffect } from "react"

export const getViewerKey = (): string => {
  const stored = localStorage.getItem("viewer_key")
  if (stored) return stored
  const key = crypto.randomUUID()
  localStorage.setItem("viewer_key", key)
  return key
}

export const usePostView = (postId: string) => {
  const mutation = useMutation({
    mutationFn: ({ id, viewerKey }: { id: string; viewerKey: string }) =>
      incrementPostViewAction(id, viewerKey),
  })

  useEffect(() => {
    const viewerKey = getViewerKey()
    mutation.mutate({ id: postId, viewerKey })
  }, [])
}