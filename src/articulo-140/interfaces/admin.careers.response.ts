export interface CareersResponse {
  message: string
  data: Career[]
}

export interface Career {
  id: number
  code: string
  name: string
  faculty: string
}