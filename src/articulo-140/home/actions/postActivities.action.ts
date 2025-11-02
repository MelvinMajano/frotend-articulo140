import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { ActivityResponse, Datum } from "@/articulo-140/interfaces/activities.response";



export const postActivities = async(activityLike:Datum) =>{
    console.log(activityLike)
    const data = await articulo140Api.post<ActivityResponse>('/activities', activityLike);
    return data.data.message
};