import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { ActivityResponse } from "@/articulo-140/interfaces/activities.response";

interface UpdateActivityData {
  actividadId: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  voaeHours?: number;
  availableSpots?: number;
  supervisorId?: string;
  scopes?: string[];
  isDisable?: number;
}

export const updateActivity = async(activityData: UpdateActivityData) => {
  const { actividadId, ...activityLike } = activityData;
  const { data } = await articulo140Api.put<ActivityResponse>(`/activities/${actividadId}`, activityLike);
  return data.message;
};
