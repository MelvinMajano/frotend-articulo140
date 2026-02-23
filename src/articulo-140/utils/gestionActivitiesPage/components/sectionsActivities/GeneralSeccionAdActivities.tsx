import { CustomCombobox} from "@/components/custom/CustomCombobox";
import { DateTimePicker } from "@/components/custom/DatetimePicker"
import { Badge } from "@/components/ui/badge";
import { UNAH_BLUE } from "@/lib/colors";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useParams, useSearchParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod"; 

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useActivyByid } from "@/articulo-140/hooks/activities/activities/useActivityById";
import { activitySchema, type ActivityFormValues } from "./zod/FormControlZone.schema";
import { gestionActivitiesStore } from "../../stores/gestionActivitiesStore";
import type { Estado } from "@/articulo-140/types/types";



const scopes = [
  { id: "1", name: "Deporte", value: "1" as const },
  { id: "2", name: "Cultural", value: "2" as const },
  { id: "3", name: "CientificoAcademico", value: "3" as const },
  { id: "4", name: "Social", value: "4" as const },
];

const SCOPE_MAP: Record<string, "1" | "2" | "3" | "4"> = {
  deportivo: "1", cultural: "2", cientificoacademico: "3", social: "4"
};

const normalizeScopes = (scopesRaw: any): ("1" | "2" | "3" | "4")[] => {
  if (!scopesRaw) return [];
  const rawArray = Array.isArray(scopesRaw) ? scopesRaw : String(scopesRaw).split(",");
  return rawArray
    .map((s: any) => {
      const normalized = String(s).trim().toLowerCase();
      const mapped = SCOPE_MAP[normalized];
      // Si está en el mapa, devolvemos ese valor, sino intentamos usar el valor original si es válido
      if (mapped) return mapped;
      // Verificamos si el valor original es uno de los valores válidos
      const original = String(s).trim();
      if (original === "1" || original === "2" || original === "3" || original === "4") {
        return original;
      }
      return null;
    })
    .filter((v): v is "1" | "2" | "3" | "4" => v !== null);
};

export const GeneralSeccionAdActivities = () => {
  
  const {id} = useParams();
  const {activityByIDquery, updateActivityMutation} = useActivyByid(id);
  
 
  if (activityByIDquery.isLoading) {
    return <div>Cargando...</div>;
  }

  if (activityByIDquery.isError) {
    return <div>Error al cargar actividad</div>;
  }

  if (!activityByIDquery.data) {
    return null;
  }

  const activities = activityByIDquery.data;
  const scopesFromApi = normalizeScopes(activities.scopes);

  return <GeneralSeccionForm activities={activities} scopesFromApi={scopesFromApi} updateActivityMutation={updateActivityMutation} id={id} />;
};

const GeneralSeccionForm = ({ activities, scopesFromApi, updateActivityMutation, id }: any) => {
  const { getStatusColor, getStatusLabel, getActivityEstatus } = gestionActivitiesStore();
  const [searchParams] = useSearchParams();

  const getValidStatus = (value: string | null): Estado => {
    if (value === 'pendiente' || value === 'en-progreso' || value === 'finalizado') return value;
    return 'pendiente';
  };

  const savedStatus = id ? getActivityEstatus(id) : null;
  const queryStatus = searchParams.get('Status');
  const estadoURL: Estado = savedStatus ?? getValidStatus(queryStatus);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {isDirty,errors,isSubmitting,dirtyFields},
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: activities.title || "",
      description: activities.description || "",
      voaeHours: Number(activities.voaeHours) || 0,
      availableSpots: Number(activities.availableSpots) || 0,
      startDate: activities.startDate ? new Date(activities.startDate) : undefined,
      endDate: activities.endDate ? new Date(activities.endDate) : undefined,
      scopesId: scopesFromApi || [],
      supervisorId: activities.SupervisorId || "",
    }
  });

const onSubmit = handleSubmit(async (data: ActivityFormValues) => {
    if (!isDirty) {
      toast.info('No se detectaron cambios');
      return;
    }
    const formDataObject = {
      actividadId: id,
      title: data.title,
      description: data.description,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      voaeHours: data.voaeHours,
      availableSpots: data.availableSpots,
      supervisorId: data.supervisorId,
      scopes: data.scopesId,
      isDisable: 0,
    };

    await updateActivityMutation.mutateAsync(formDataObject, {
      onSuccess: () => {
        toast.success('Actividad actualizada correctamente', {
          position: 'top-right',
        });
      },
      onError: (error: any) => {
        console.error(error);
        toast.error('Error al actualizar la actividad');
      },
    });
});


  return (
       <form onSubmit={onSubmit}>
      <section className="space-y-6 pb-20">
        {/* Encabezado */}
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-bold mb-2">General</h1>
          <Badge className={`h-min my-auto mr-6 w-fit border ${getStatusColor(estadoURL)}`}>
            {getStatusLabel(estadoURL)}
          </Badge>
        </div>

        <Separator />

        {/* Título */}
        <div className="space-y-2">
          <Label htmlFor="title" className="font-medium">Título</Label>
          <Input 
            {...register("title")}
            className={`!border-0 !border-b focus:!ring-0 !bg-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          <p className="text-sm text-muted-foreground">Al hacer clic en el título podrá editarlo.</p>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="description" className="font-medium">Descripción</Label>
          <Input 
            {...register("description")}
            className={`!border-0 !border-b focus:!ring-0 !bg-transparent ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          <p className="text-sm text-muted-foreground">Al hacer clic en la descripción podrá editarlo.</p>
        </div>

        {/* Horas y Capacidad */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium">Cantidad de horas VOAE</Label>
            <Input
              type="number"
              {...register("voaeHours")}
              className="!border-0 !border-b border-gray-300 !bg-transparent"
            />
            {errors.voaeHours && <p className="text-xs text-red-500">{errors.voaeHours.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Capacidad Máxima</Label>
            <Input 
              type="number"
              {...register("availableSpots")}
              className="!border-0 !border-b border-gray-300 !bg-transparent"
            />
            {errors.availableSpots && <p className="text-xs text-red-500">{errors.availableSpots.message}</p>}
          </div>
        </div>

        {/* Fechas con Controller */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium">Fecha y Hora de Inicio</Label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker 
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Seleccionar inicio"
                  isModified={!!dirtyFields.startDate}
                />
              )}
            />
            {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Fecha y Hora de Finalización</Label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DateTimePicker 
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Seleccionar fin"
                  isModified={!!dirtyFields.endDate}
                />
              )}
            />
            {errors.endDate && <p className="text-xs text-red-500">{errors.endDate.message}</p>}
          </div>
        </div>

        {/* Ámbitos y Supervisor */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-medium">Ámbitos</Label>
            <Controller
              name="scopesId"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 gap-2">
                  {scopes.map((scope) => (
                    <div key={scope.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={scope.id}
                        checked={field.value?.includes(scope.value)}
                        className="data-[state=checked]:bg-[#1E40AF] data-[state=checked]:border-[#1E40AF]"
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          field.onChange(checked 
                            ? [...current, scope.value] 
                            : current.filter((v) => v !== scope.value)
                          );
                        }}
                      />
                      <Label htmlFor={scope.id} className="font-normal cursor-pointer">
                        {scope.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.scopesId && <p className="text-xs text-red-500">{errors.scopesId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Supervisor</Label>
            <Controller
              name="supervisorId"
              control={control}
              render={({ field }) => (
                <CustomCombobox
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.supervisorId && <p className="text-xs text-red-500">{errors.supervisorId.message}</p>}
          </div>
        </div>
      </section>

      {/* Footer Persistente */}
      <footer className="sticky bottom-0 bg-background/95 backdrop-blur border-t p-4">
        <div className="container mx-auto flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => reset()} 
            disabled={!isDirty || isSubmitting}
            style={{ borderColor: UNAH_BLUE, color: UNAH_BLUE }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={!isDirty || isSubmitting} 
            className="text-white shadow-md transition-all"
            style={{ background: UNAH_BLUE }}
          >
            {isSubmitting ? 'Guardando...' : 'Aceptar'}
          </Button>
        </div>
      </footer>
    </form>
  );
}
