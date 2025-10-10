export interface StudentsResponse {
  message: string
  data: Student[]
}

export interface Student {
  name: string
  email: string
  accountNumber: number
  identityNumber: string
  career: string
}