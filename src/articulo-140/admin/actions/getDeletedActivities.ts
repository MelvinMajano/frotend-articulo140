import {articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { DeletedActivitiesResponse } from "@/articulo-140/interfaces/admin.DeletedActivities.response"

export const getDeletedActivities = async (limit: number, page: number) => {
    const { data } = await articulo140Api.get<DeletedActivitiesResponse>("/activities/deleted", {
      params: {
        limit,
        page
      }
    })
    return data
}