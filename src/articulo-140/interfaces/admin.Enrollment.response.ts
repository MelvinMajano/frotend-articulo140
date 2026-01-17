export interface EnrollmentResponse {
  message: string
  success?: boolean
  isDuplicate?: boolean
  data?: {
    success: boolean
    message: string
    hoursAwarded: number
    scopeCount: number
  }
}