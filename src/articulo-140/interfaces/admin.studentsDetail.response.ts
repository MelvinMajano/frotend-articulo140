export interface HoursData {
  studentName: string
  culturalHours: string
  cientificoAcademicoHours: string
  deportivoHours: string
  socialHours: string
  totalHours: string
}

export interface HoursDataResponse {
  message: string
  data: HoursData[]
}

export interface ActivitiesDataResponse {
  message: string
  data: ActivityData[]
}

export interface ActivityData {
  studentName: string
  activitiesParticipated: string
}