import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { ActivitiesResponse } from "@/articulo-140/interfaces/activities.response";


export const getActivities = async()=>{
    const {data} = await articulo140Api.get<ActivitiesResponse>('/activities');

    return data;
};