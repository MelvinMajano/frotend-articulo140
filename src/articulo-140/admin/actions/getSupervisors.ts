import {articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { SupervisorsResponse } from "@/articulo-140/interfaces/admin.supervisors.response"

export const getSupervisors =  async (limit: number, page: number, search: string) => {
  const { data } = await articulo140Api.get<SupervisorsResponse>("/users/supervisors", {
    params: {
      limit,
      page,
      search
    }
  })
  return data
}