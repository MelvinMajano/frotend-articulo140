import {articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { StudentsResponse } from "@/articulo-140/interfaces/admin.users.response"

export const getStudents = async (limit: number, page: number, search: string) => {
  const { data } = await articulo140Api.get<StudentsResponse>("/users/students",{
    params: {
      limit,
      page,
      ...(search ? { search } : {})
    }
  })
  return data
}