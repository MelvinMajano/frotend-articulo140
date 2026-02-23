import { useActivities } from "@/articulo-140/hooks/activities/activities/useActivities"
import { useActivyByid } from "@/articulo-140/hooks/activities/activities/useActivityById"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@radix-ui/react-label"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"
import { gestionActivitiesStore } from "../../stores/gestionActivitiesStore"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Estado } from "@/articulo-140/types/types"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmActionModal } from "@/articulo-140/admin/components/custom/ConfirmActionModal"
import { DateTimePicker } from "@/components/custom/DatetimePicker"
import { UNAH_BLUE_SOFT } from "@/lib/colors"

export const ControlZoneAdActivities = () => {
  const [disableConfirmOpen, setDisableConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  const { getStatusColor, getActivityEstatus, setActivityEstatus, stateFunDisableActivity, stateFunEnableActivity, isDisable } = gestionActivitiesStore();
  const { activityMutation, deleteActivityMutation } = useActivities();
  const { activityByIDquery, updateActivityMutation} = useActivyByid(id);
  const [searchParams, setSearchParams] = useSearchParams();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [originalStartDate, setOriginalStartDate] = useState<Date | undefined>(undefined);
  const [originalEndDate, setOriginalEndDate] = useState<Date | undefined>(undefined);

  const handleStatusChange = (newStatus: string) => {
    setNextStatus(newStatus);
    const activity = activityByIDquery.data;
    if (activity) {
      const sd = activity.startDate ? new Date(activity.startDate) : undefined;
      const ed = activity.endDate ? new Date(activity.endDate) : undefined;
      setStartDate(sd);
      setEndDate(ed);
      setOriginalStartDate(sd);
      setOriginalEndDate(ed);
      setConfirmOpen(true);
    } else {
      toast.error("No se pudo obtener la información de la actividad.");
    }
  };


  const getValidStatus = (value: string | null): Estado => {
    if (value === 'pendiente' || value === 'en-progreso' || value === 'finalizado') {
      return value
    }
    return "pendiente"
  };

  const savedStatus = id ? getActivityEstatus(id) : null;
  const queryStatus = searchParams.get('Status');
  const estadoURL = savedStatus ?? getValidStatus(queryStatus);

  if (id && savedStatus && queryStatus !== savedStatus) {
    setSearchParams((prev) => {
      prev.set('Status', savedStatus);
      return prev;
    }, { replace: true });
  }

  const handleConfirmUpdate = async () => {
    if (!startDate || !endDate || !nextStatus) return;
    if (endDate <= startDate) {
      toast.error("La fecha de finalización debe ser posterior a la fecha de inicio.");
      return;
    }

    const activity = activityByIDquery.data;
    if (!activity) {
      toast.error("No se pudo obtener la información de la actividad.");
      return;
    }

    const scopeMap: Record<string, string> = {
      "cultural": "1",
      "social": "2",
      "deportivo": "3",
      "academico": "4"
    };

    let scopesArr: string[];
    if (Array.isArray(activity.scopes)) {
      scopesArr = activity.scopes.map(s => scopeMap[s.toLowerCase()] || s).filter(s => ["1","2","3","4"].includes(s));
    } else if (typeof activity.scopes === 'string') {
      scopesArr = activity.scopes.split(",").map(s => {
        const trimmed = s.trim().toLowerCase();
        return scopeMap[trimmed] || s.trim();
      }).filter(s => ["1","2","3","4"].includes(s));
    } else {
      scopesArr = [];
    }

    if (!scopesArr.length) {
      toast.error("La actividad debe tener al menos un scope válido.");
      return;
    }

    const payload = {
      actividadId: activity.id,
      title: activity.title,
      description: activity.description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      voaeHours: activity.voaeHours,
      availableSpots: activity.availableSpots,
      supervisorId: activity.SupervisorId,
      scopes: scopesArr,
      isDisable: activity.isDisabled === "true" ? 1 : 0,
    };

    try {
      await updateActivityMutation.mutateAsync(payload);
      toast.success("Actividad actualizada correctamente");
      setConfirmOpen(false);
      if (id) setActivityEstatus(id, nextStatus as Estado);
      setSearchParams((prev) => {
        prev.set('Status', nextStatus);
        return prev;
      });
    } catch (error: any) {
      const messageError = error?.response?.data?.message || error?.message || 'Error al actualizar la actividad';
      toast.error(messageError);
    }
  };

  const handleDeshabiltar = () => {
    setDisableConfirmOpen(true);
  };

  const handleConfirmDisable = () => {
    const isDisableSet = 1;
    stateFunDisableActivity();
    activityMutation.mutate({ id, isDisableSet }, {
      onSuccess: () => {
        toast.success('Actividad deshabilitada correctamente');
        setDisableConfirmOpen(false);
      },
      onError(error: any) {
        const messageError = error?.response?.data?.message || error?.message || 'error al deshabilitar la actividad';
        toast.error(messageError);
      },
    })
  }

  const handleHabiltar = () => {
    const isDisableSet = 0;
    stateFunEnableActivity();
    activityMutation.mutate({ id, isDisableSet })
  };


  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  }

  const handleConfirmDelete = () => {
    deleteActivityMutation.mutate({
      id
    }, {
      onSuccess: (response) => {
        toast.success(response);
        setDeleteConfirmOpen(false);
        navigate('/admin/activities-deleted');
      },
      onError: (error: any) => {
        const messageError = error?.response?.data?.message || error?.message || 'error al eliminar la actividad';
        toast.error(messageError);
      }
    })
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Zona de control</h1>
      </div>
      <Separator />
      <div className="space-y-6">
        <Card className="border flex flex-row items-center gap-4 px-3 py-6 sm:justify-between" style={{ background: UNAH_BLUE_SOFT }}>
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
          <Select value={estadoURL} onValueChange={handleStatusChange}>
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
        <Card className="border-red-600 flex flex-row" style={{ background: UNAH_BLUE_SOFT }}>
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

      <Card className="border-red-600 flex flex-row" style={{ background: UNAH_BLUE_SOFT }}>
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
        <Button
          onClick={handleDelete}
          className="m-auto mr-5 text-white bg-red-500 hover:bg-red-700">
          Eliminar Actividad
        </Button>
      </Card>
      <ConfirmActionModal
        open={disableConfirmOpen}
        onOpenChange={setDisableConfirmOpen}
        title="Deshabilitar Actividad"
        message={
          <>
            ¿Estás seguro de que deseas <strong>deshabilitar</strong> esta actividad?
            <br />
            Esta acción la ocultará para todos los usuarios, excepto para el administrador.
          </>
        }
        confirmText="Deshabilitar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDisable}
      />
      <ConfirmActionModal
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Eliminar Actividad"
        variant="danger"
        message={
          <>
            ¿Estás seguro de que deseas <strong>Eliminar</strong> esta actividad?
            <br />
            Esta acción la eliminara para todos los usuarios, Incluyendo el administrador
            <br />
            pero la podra encontrar en <span >Actividades Eliminadas</span>.
          </>
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
      />
      <ConfirmActionModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="¿Desea cambiar el estado de la actividad?"
        message={
          <div>
            <div className="mb-2">Al cambiar el estado, es obligatorio restablecer la fecha y hora de la actividad.</div>
            <div className="flex gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <Label>Fecha y Hora de Inicio</Label>
                <DateTimePicker
                  date={startDate}
                  setDate={setStartDate}
                  isModified={!!startDate && !!originalStartDate && startDate.getTime() !== originalStartDate.getTime()}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Fecha y Hora de Finalización</Label>
                <DateTimePicker
                  date={endDate}
                  setDate={setEndDate}
                  isModified={!!endDate && !!originalEndDate && endDate.getTime() !== originalEndDate.getTime()}
                />
              </div>
            </div>
          </div>
        }
        confirmText="Guardar cambios"
        cancelText="Cancelar"
        onConfirm={handleConfirmUpdate}
      />
    </section>
  )
}
