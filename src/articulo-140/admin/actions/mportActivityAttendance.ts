import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { AttendanceImportResponse } from "@/articulo-140/interfaces/admin.attendanceImport.response";

export const importActivityAttendance = async(activityId : string | undefined ,file:File): Promise<AttendanceImportResponse>=>{
    const formData= new FormData();
    formData.append('file',file)
    const {data} = await articulo140Api.post< Promise<AttendanceImportResponse>>(`/activities/import-file/${activityId}`,formData,{
        headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data
};