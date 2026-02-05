import {articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { CareersResponse } from "@/articulo-140/interfaces/admin.careers.response"

export const getCareers = async (): Promise<CareersResponse> => {
  const { data } = await articulo140Api.get("/activities/degrees")
  return data
}