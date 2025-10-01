import { useMutation, useQuery } from "@tanstack/react-query"
import { getActivities } from "../../home/actions/getActivities.action"
import { gestionActivitiesStore } from "@/articulo-140/utils/gestionActivitiesPage/stores/gestionActivitiesStore";

export const useActivities = () => {
  const {disbaleActivity} = gestionActivitiesStore();

   const query = useQuery({
    queryKey:['activities'],
    queryFn:getActivities,
    retry:false,
    refetchInterval: 5*60*1000,
  })

  const activityMutation = useMutation({
    mutationFn:disbaleActivity,
    onSuccess: (message:string)=>{
      console.log(message)
    },
    onError:(mesage:string)=>{
      console.log(mesage)
    }
  });
  
  return{
    query,
    activityMutation,
  }
}
