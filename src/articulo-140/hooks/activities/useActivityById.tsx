import { updateActivity } from "@/articulo-140/home/actions/updateActivity.action"
import { getActivitiesByID } from "@/articulo-140/utils/gestionActivitiesPage/actions/getActivitiesByID"
import { useMutation, useQuery } from "@tanstack/react-query"


export const useActivyByid =(id:string | undefined)=>{

    const activityByIDquery = useQuery({
        queryKey: ['activityById', id],
        queryFn: ()=>getActivitiesByID(id),
        enabled: !!id,
        retry:false,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    const updateActivityMutation = useMutation({
        mutationFn: updateActivity,
    })

    return {
        activityByIDquery,
        updateActivityMutation
    }
}