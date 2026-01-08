import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { statusNumber } from "@/articulo-140/types/types";

interface props{
    actividadId: string;
    status: statusNumber;
};

export const updateActivityStatus = async({actividadId,status}:props):Promise<string>=>{
    const {data}= await articulo140Api.put(`/activities/${actividadId}/status?status=${status}`);
    return data.message;
};