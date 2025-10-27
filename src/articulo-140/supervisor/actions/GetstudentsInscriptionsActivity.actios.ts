import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { EstudentsResponse } from "../Interfaces/InscriptionsEstudentsResponse";




export const getEstudentsIncriptionsActivity = async(activityId:string | undefined):Promise<EstudentsResponse> =>{
    const {data} = await articulo140Api.get<EstudentsResponse>(`/activities/${activityId}/register`);
    return data
};