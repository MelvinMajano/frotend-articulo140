import {articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { SupervisorsResponse } from "@/articulo-140/interfaces/admin.supervisors.response"

export const getSupervisors = async (): Promise<SupervisorsResponse> => {
  const { data } = await articulo140Api.get("/users/supervisors")
  return data
}