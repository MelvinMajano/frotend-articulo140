import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getActivities } from "../../../home/actions/getActivities.action"
import { gestionActivitiesStore } from "@/articulo-140/utils/gestionActivitiesPage/stores/gestionActivitiesStore";
import { useSearchParams } from "react-router";
import { postActivities } from "@/articulo-140/home/actions/postActivities.action";
import { updateActivity } from "@/articulo-140/home/actions/updateActivity.action";
import { updateActivityStatus } from "@/articulo-140/utils/gestionActivitiesPage/actions/updateActivityStatus.action";
import { useEffect } from "react";

export const useActivities = () => {
  const {disbaleActivity} = gestionActivitiesStore();
  const [searchParams] = useSearchParams();
   const queryClient = useQueryClient();

  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? '6';
  
   const query = useQuery({
    queryKey:['activities',{limit,page}],
    queryFn:()=>getActivities(+limit,+page),
    retry:false,
    refetchInterval: 5*60*1000,
  });

  // Sincronizar status de BD con Zustand solo cuando cambian los status
  const activityStatuses = query.data?.data?.data?.map(a => `${a.id}-${a.status}`).join(',');
  
  useEffect(()=>{
    if(query.data?.data?.data){
      const { setActivityEstatus, numberToStatus } = gestionActivitiesStore.getState();
      query.data.data.data.forEach((activity) => {
        setActivityEstatus(activity.id.toString(), numberToStatus(activity.status));
      });
    }
  }, [activityStatuses])

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

  const activityMutation = useMutation({
    mutationFn: disbaleActivity,
    onSuccess: (message: string) => {
      console.log(message)
    },
    onError: (mesage: string) => {
      console.log(mesage)
    }
  });

  const updateStatusMutation =useMutation({
    mutationFn: updateActivityStatus,
    onSuccess: () => {
      queryClient.refetchQueries({queryKey:['activities']})
    },
  });
  
  return{
    query,
    createActivityMutation,
    updateActivityMutation,
    activityMutation,
    updateStatusMutation
  }
}
