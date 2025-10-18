export interface CareersResponse {
  message: string
  data: Career[]
}

export interface Career {
  code: string
  name: string
  faculty: string
}