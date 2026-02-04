import { useMutation, useQueryClient } from "@tanstack/react-query";
import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import { toast } from "sonner";

interface UpdateHoursAwardedParams {
  attendanceId: string;
  hoursAwarded: number | null;
}

interface UpdateHoursAwardedResponse {
  success: boolean;
  message: string;
  data: {
    attendanceId: string;
    studentName: string;
    accountNumber: number;
    hoursAwarded: number | null;
    updatedAt: string;
  };
}

const updateHoursAwarded = async ({ 
  attendanceId, 
  hoursAwarded 
}: UpdateHoursAwardedParams): Promise<UpdateHoursAwardedResponse> => {
  const { data } = await articulo140Api.put(
    `/activities/attendance/${attendanceId}/hours`, 
    { hoursAwarded }
  );
  return data;
};

export const useUpdateHoursAwarded = (activityId: string | undefined) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateHoursAwarded,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ["attendance", { activityId }] 
      });
      
      toast.success("Horas actualizadas correctamente", {
        description: `${data.data.studentName} - ${data.data.hoursAwarded ?? 0} horas`
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al actualizar las horas";
      const details = error.response?.data?.data || null;
      
      toast.error(message, {
        description: details ? JSON.stringify(details) : undefined
      });
      
      console.error("Error actualizando horas:", error);
    },
  });

  return mutation;
};
