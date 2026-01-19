import { getStudentByActivity } from "@/articulo-140/utils/gestionActivitiesPage/actions/get-Students-AttendanceByActivity";
import { useQuery } from "@tanstack/react-query"

export const useStudentsAttendaceByActivity = (activityId: string | undefined) => {
    const query = useQuery({
        queryKey:['attendance', {activityId}],
        queryFn:()=>getStudentByActivity(activityId),
        retry:false,
        staleTime: 1000 * 60 * 5,
        enabled: !!activityId,
    });
 
    return query;
}
