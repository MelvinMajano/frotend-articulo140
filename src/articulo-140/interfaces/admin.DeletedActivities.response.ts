import type { UUID } from "crypto";

export interface DeletedActivitiesResponse {
  message: string
  data: DeletedActivities[]
}

export interface DeletedActivities {
      id: UUID;
      title: string
      description: string
      supervisor: string
      startDate: string
      endDate: string
      voaeHours: number
      scopes: string[]
      availableSpots: number
}

