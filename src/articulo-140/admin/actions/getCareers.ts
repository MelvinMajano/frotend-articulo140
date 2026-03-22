import {articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { CareersResponse } from "@/articulo-140/interfaces/admin.careers.response"

export const getCareers = async (limit: number, page: number, search: string) => {
  const { data } = await articulo140Api.get<CareersResponse>("/activities/degrees",{
    params: {
      limit,
      page,
      search 
    }
  })
  return data
}