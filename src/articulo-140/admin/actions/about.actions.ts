import { articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { PostsResponse, SectionsResponse, CreatePostBody } from "@/articulo-140/interfaces/about.response"

export const getSectionsAction = async () => {
  const { data } = await articulo140Api.get<SectionsResponse>("/about/sections")
  return data
}

export const updateSectionsAction = async (sections: {
  carousel: boolean
  mision_vision: boolean
  competencies: boolean
  goals: boolean
}) => {
  const { data } = await articulo140Api.put("/about/sections", sections, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  return data
}


export const getPostsAction = async (category?: string) => {
  const { data } = await articulo140Api.get<PostsResponse>("/about/posts", {
    params: category ? { category } : {}
  })
  return data
}


export const getAdminPostsAction = async () => {
  const { data } = await articulo140Api.get<PostsResponse>("/about/posts/admin", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  return data
}

export const createPostAction = async (post: CreatePostBody) => {
  const { data } = await articulo140Api.post("/about/posts", post, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  return data
}

export const updatePostAction = async (id: string, post: CreatePostBody) => {
  const { data } = await articulo140Api.put(`/about/posts/${id}`, post, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  return data
}

export const deletePostAction = async (id: string) => {
  const { data } = await articulo140Api.delete(`/about/posts/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  return data
}

export const togglePostVisibilityAction = async (id: string) => {
  const { data } = await articulo140Api.patch(`/about/posts/${id}/visibility`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  return data
}

export const togglePostPinAction = async (id: string) => {
  const { data } = await articulo140Api.patch(`/about/posts/${id}/pin`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  return data
}

export const incrementPostViewAction = async (id: string, viewerKey: string) => {
  const { data } = await articulo140Api.post(`/about/posts/${id}/view`, {
    viewer_key: viewerKey
  })
  return data
}