import { articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { StudentsAttendance } from "@/articulo-140/interfaces/studentsAttendace.interface";

export const getStudentByActivity = async(activityid: string | undefined):Promise<StudentsAttendance> =>{
    const {data} = await articulo140Api.get<StudentsAttendance>(`/activities/attendance/${activityid}?page=1&limit=100`);
    return data
}