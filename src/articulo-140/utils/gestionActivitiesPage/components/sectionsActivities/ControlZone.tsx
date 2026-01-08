import { useActivities } from "@/articulo-140/hooks/activities/activities/useActivities"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@radix-ui/react-label"
import { Link, useParams, useSearchParams } from "react-router"
import { gestionActivitiesStore } from "../../stores/gestionActivitiesStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Estado } from "@/articulo-140/types/types"

export const ControlZoneAdActivities = () => {
  const { getStatusColor,statusToNumber,getActivityEstatus,setActivityEstatus,stateFunDisableActivity, stateFunEnableActivity, isDisable } = gestionActivitiesStore();

  const { activityMutation,updateStatusMutation } = useActivities();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const getValidStatus = (value:string | null):Estado=>{
    if(value==='pendiente'||value==='en-progreso'||value==='finalizado'){
      return value
    }
    return "pendiente"
  };

 
  const savedStatus = id ? getActivityEstatus(id):null;
  const queryStatus = searchParams.get('Status');
  const estadoURL = savedStatus ?? getValidStatus(queryStatus);

  if (id && savedStatus && queryStatus !== savedStatus) {
    setSearchParams((prev) => {
      prev.set('Status', savedStatus);
      return prev;
    }, { replace: true });
  }

  // Handler cuando el usuario cambia el estado
  const onEstadoChange = (nextEstado: Estado) => {
    // 1. Actualizar query param (para navegación)
    setSearchParams((prev) => {
      prev.set('Status', nextEstado);
      return prev;
    });

    // 2. Guardar en Zustand (para persistencia entre navegaciones)
    if (id) setActivityEstatus(id, nextEstado);

    // 3. Actualizar en el backend
    updateStatusMutation.mutate({
      actividadId: id!,
      status: statusToNumber(nextEstado),
    });
  };

  const handleHabiltar = () => {
    const isDisableSet = 0;
    stateFunEnableActivity();
    activityMutation.mutate({ id, isDisableSet })
  };


  const handleDeshabiltar = () => {
    const isDisableSet = 1;
    stateFunDisableActivity();
    activityMutation.mutate({ id, isDisableSet })
  };
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Zona de control</h1>
      </div>
      <Separator />
      <div className="space-y-6">
        <Card className="border-red-600 flex flex-row items-center gap-4 px-3 py-6 sm:justify-between">
          <div className="flex items-center space-x-2">
            <div>
              <Label htmlFor="estado-activitie" className="font-medium">
                Estado
              </Label>
              <p className="text-sm text-muted-foreground">
                Puede actualizar el estado de la actividad seleccionando uno de los tres estados disponibles para cada actividad.
              </p>
            </div>
          </div>
          <Select value={estadoURL} onValueChange={(value) => onEstadoChange(value as Estado)}>
            <SelectTrigger className="ml-auto w-40 justify-between sm:self-center sm:mr-5">
              <SelectValue>
                <div
                  className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium ${getStatusColor(estadoURL)}`}
                >
                  {estadoURL.charAt(0).toUpperCase() + estadoURL.slice(1)}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end" sideOffset={4} className="w-[--radix-select-trigger-width]">
              <SelectItem value="pendiente">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-blue-700">Pendiente</span>
                </div>
              </SelectItem>
              <SelectItem value="en-progreso">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-green-700">En Progreso</span>
                </div>
              </SelectItem>
              <SelectItem value="finalizado">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-amber-700">Finalizado</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </Card>
      </div>
      <Separator />
      <div className="space-y-6">
        <Card className="border-red-600 flex flex-row">
          <div className="flex items-center space-x-2 ml-3">
            <div>
              <Label htmlFor="desable-activitie" className="font-medium">
                Deshabilitar
              </Label>
              <p className="text-sm text-muted-foreground">
                Al presionar deshabilitar, la actividad no aparecerá más para ningún usuario, exceptuando al administrador.
              </p>
            </div>
          </div>
          {isDisable === 0 ? (<Button className="m-auto text-red-600 w-1/6 " variant={"ghost"}
            onClick={handleDeshabiltar}
          >
            Deshabilitar actividad
          </Button>) : (
            <div className="flex flex-col">
              <Button className="m-auto text-red-600 w-1/6 " variant={"ghost"}
                onClick={handleDeshabiltar}
                disabled={true}
              >
                Deshabilitar actividad
              </Button>
              <Button className="m-auto text-black w-1/6" variant={"ghost"}
                onClick={handleHabiltar}
              >
                Habilitar actividad
              </Button>
            </div>)}


        </Card>
      </div>



      <Card className="border-red-600 flex flex-row">
        <div className="flex items-center space-x-2 ml-3">
          <div>
            <Label htmlFor="desable-activitie" className="font-medium">
              Eliminar
            </Label>
            <p className="text-sm text-muted-foreground">
              Al presionar eliminar, la actividad tampoco se mostrará para ningún usuario, pero el administrador podrá encontrar las actividades eliminadas aquí{"  "}
              <Link to="/admin/activities-deleted">
                <span className="underline text-blue-800">Actividades Eliminadas</span>
              </Link>
            </p>
          </div>
        </div>
        <Button className="m-auto mr-5 text-white bg-red-500 hover:bg-red-700">
          Eliminar Actividad
        </Button>

      </Card>
    </section>
  )
}
