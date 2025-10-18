import {articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { ActivitiesDataResponse, HoursDataResponse  } from "@/articulo-140/interfaces/admin.studentsDetail.response"

export const getHoursByStudent = async (studentId: string): Promise<HoursDataResponse> => {
  const { data } = await articulo140Api.get<HoursDataResponse>(`/users/${studentId}/fields`)
  return data
}

export const getActivitiesByStudent = async (studentId: string): Promise<ActivitiesDataResponse> => {
  const { data } = await articulo140Api.get<ActivitiesDataResponse>(`/users/${studentId}/activities`)
  return data
}