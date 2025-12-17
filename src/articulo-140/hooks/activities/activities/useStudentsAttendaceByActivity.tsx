import { getStudentByActivity } from "@/articulo-140/utils/gestionActivitiesPage/actions/get-Students-AttendanceByActivity";
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router";


export const useStudentsAttendaceByActivity = () => {
    const {id:activityId} = useParams();
    const query = useQuery({
        queryKey:['StudenteAttendanceByActivity'],
        queryFn:()=>getStudentByActivity(activityId),
        retry:false,
        staleTime: 1000 * 60 * 5,
    });
 
    return {
        query
  }
}
