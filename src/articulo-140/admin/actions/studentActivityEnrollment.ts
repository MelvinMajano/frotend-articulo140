import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { EnrollmentResponse } from "@/articulo-140/interfaces/admin.Enrollment.response";

export const assignStudentToFinishedActivity = async (
  studentId: string, 
  activityId: string
): Promise<EnrollmentResponse> => {
  try {
    const { data } = await articulo140Api.post<EnrollmentResponse>(
      `/users/${studentId}/registerActivity/${activityId}`,
      {
        studentId,
        activityId
      }
    )
    return data
  } catch (error: any) {
    console.error("Error al asignar actividad:", error)
    throw error
  }
}
