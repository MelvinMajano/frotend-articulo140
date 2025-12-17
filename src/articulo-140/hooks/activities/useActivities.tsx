import { useMutation, useQuery } from "@tanstack/react-query"
import { getActivities } from "../../home/actions/getActivities.action"
import { gestionActivitiesStore } from "@/articulo-140/utils/gestionActivitiesPage/stores/gestionActivitiesStore";
import { useSearchParams } from "react-router";
import { postActivities } from "@/articulo-140/home/actions/postActivities.action";
import { updateActivity } from "@/articulo-140/home/actions/updateActivity.action";

export const useActivities = () => {
  const {disbaleActivity} = gestionActivitiesStore();
  const [searchParams] = useSearchParams();

  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '6';
  
   const query = useQuery({
    queryKey:['activities',{limit,page}],
    queryFn:()=>getActivities(+limit,+page),
    retry:false,
    refetchInterval: 5*60*1000,
  });

  const createActivityMutation = useMutation({
    mutationFn:postActivities,
    onSuccess: (data) => {
      console.log('Actividad creada exitosamente:', data);
      query.refetch();
    },
    onError: (error) => {
      console.error(' Error al crear actividad:', error);
    }
  });

  const updateActivityMutation = useMutation({
    mutationFn: updateActivity,
    onSuccess: (message) => {
      console.log('Actividad actualizada exitosamente:', message);
      query.refetch();
    },
    onError: (error) => {
      console.error('Error al actualizar actividad:', error);
    }
  });

  // Mantener el original del disable
  const activityMutation = useMutation({
    mutationFn: disbaleActivity,
    onSuccess: (message: string) => {
      console.log(message)
    },
    onError: (mesage: string) => {
      console.log(mesage)
    }
  });
  
  return{
    query,
    createActivityMutation,
    updateActivityMutation,
    activityMutation
  }
}
