import {articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { StudentsResponse } from "@/articulo-140/interfaces/admin.users.response"

export const getStudents = async (): Promise<StudentsResponse> => {
  const { data } = await articulo140Api.get("/users/students")
  return data
}