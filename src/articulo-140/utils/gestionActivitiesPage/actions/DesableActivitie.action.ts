import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { IsDisabletype } from "@/articulo-140/interfaces/typeActivityisDisable";


interface props{
    id:string | undefined,
    isDisableSet:number,
}

export const disableActivity = async({id,isDisableSet}:props):Promise<IsDisabletype>=>{
       const {data} = await articulo140Api.put<IsDisabletype>(`/activities/disableEneable/${id}`,{
        isDisableSet
       })
       return data;
};