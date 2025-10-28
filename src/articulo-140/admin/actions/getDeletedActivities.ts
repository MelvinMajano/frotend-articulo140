import {articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { DeletedActivitiesResponse } from "@/articulo-140/interfaces/admin.DeletedActivities.response"

export const getDeletedActivities = async (): Promise<DeletedActivitiesResponse> => {
  const { data } = await articulo140Api.get("/activities/deleted")
  return data
}