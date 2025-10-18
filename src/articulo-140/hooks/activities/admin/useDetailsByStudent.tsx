import { useQuery } from "@tanstack/react-query"
import { getHoursByStudent, getActivitiesByStudent } from "@/articulo-140/admin/actions/getDetailsByStudent"

export const useHoursByStudent = (studentId: string) => {
  const query = useQuery({
    queryKey: ["studentHours", studentId],
    queryFn: () => getHoursByStudent(studentId),
    enabled: !!studentId,
  })    
    return { query }
}

export const useActivitiesByStudent = (studentId: string) => {
  const query = useQuery({
    queryKey: ["studentActivities", studentId],
    queryFn: () => getActivitiesByStudent(studentId),
    enabled: !!studentId,
  })    
    return { query }
}