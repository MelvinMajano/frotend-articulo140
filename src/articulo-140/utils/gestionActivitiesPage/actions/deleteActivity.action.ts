import { articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { DeleteResponse } from "@/articulo-140/interfaces/activities.delete.response";

interface props{
    id:string | undefined,
}

export const deleteActivity = async({id}:props):Promise<string>=>{
    const response = await articulo140Api.delete<DeleteResponse>(`/activities/${id}`);
    return response.data.message
}