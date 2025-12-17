import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { Message } from "@/articulo-140/interfaces/activitiesbyId.response";


export const getActivitiesByID = async(id:string | undefined):Promise<Message>=>{
    const {data} = await articulo140Api.get(`activities/${id}`);
    return data.message[0]
}