export interface StudentsResponse {
  message: string
  data: Student[]
}

export interface Student {
  id: string
  name: string
  email: string
  accountNumber: number
  identityNumber: string
  career: string
}