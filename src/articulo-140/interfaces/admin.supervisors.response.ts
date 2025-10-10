export interface SupervisorsResponse {
  message: string
  data: Supervisor[]
}

export interface Supervisor {
  name: string
  email: string
  accountNumber: number
  identityNumber: string
  career: string
}