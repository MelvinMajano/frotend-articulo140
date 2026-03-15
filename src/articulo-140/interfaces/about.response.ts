export interface AboutSections {
  carousel: boolean
  mision_vision: boolean
  competencies: boolean
  goals: boolean
}

export type PostCategory = "VOAE" | "Academico" | "General" | "Convocatoria"

export interface Post {
  id: string
  title: string
  content: string
  image_url: string | null
  category: PostCategory
  is_pinned: boolean
  is_visible: boolean
  event_date: string | null
  event_place: string | null
  view_count: number
  created_at: string
}

export interface PostsResponse {
  message: string
  data: Post[]
}

export interface SectionsResponse {
  message: string
  data: AboutSections[]
}

export interface CreatePostBody {
  title: string
  content: string
  image_url: string | null
  category: PostCategory
  is_pinned: boolean
  is_visible: boolean
  event_date: string | null
  event_place: string | null
}