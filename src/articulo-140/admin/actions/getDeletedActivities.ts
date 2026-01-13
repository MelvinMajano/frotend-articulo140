import {articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { DeletedActivitiesResponse } from "@/articulo-140/interfaces/admin.DeletedActivities.response"

export const getDeletedActivities = async (): Promise<DeletedActivitiesResponse> => {
  try {
    const { data } = await articulo140Api.get("/activities/deleted")
    return data
  } catch (error: any) {
    if (error?.response?.status === 404 || error?.response?.status === 204) {
      return {
        message: "No hay actividades eliminadas",
        data: []
      }
    }
    throw error
  }
}