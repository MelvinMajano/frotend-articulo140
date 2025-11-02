import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { ActivityResponse } from "@/articulo-140/interfaces/activities.response";


export const getActivities = async(limit:number,page:number)=>{
    const {data} = await articulo140Api.get<ActivityResponse>('/activities',{
        params:{
            limit,
            page
        }
    });

    return data;
};