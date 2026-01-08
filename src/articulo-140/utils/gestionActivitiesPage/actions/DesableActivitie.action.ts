import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { TypeIsDisable } from "@/articulo-140/interfaces/typeIsDisable.response";


interface props{
    id:string | undefined,
    isDisableSet:number,
}

export const disableActivity = async({id,isDisableSet}:props):Promise<TypeIsDisable>=>{
       const {data} = await articulo140Api.put<TypeIsDisable>(`/activities/disableEneable/${id}`,{
        isDisableSet
       })
       return data;
};