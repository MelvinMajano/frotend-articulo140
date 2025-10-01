import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { TypeIsDisable } from "@/articulo-140/interfaces/typeIsDisable.response";


export const getIsDisableActivy = async(id:string|undefined):Promise<string>=>{
    const {data} = await articulo140Api.get<TypeIsDisable>(`/activities/disableEneable/${id}`);
    return data.data.isDisabled
};