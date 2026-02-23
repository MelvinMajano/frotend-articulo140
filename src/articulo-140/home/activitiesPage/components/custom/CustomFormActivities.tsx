import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
import { useForm, Controller } from 'react-hook-form';
import { DateTimePicker } from "@/components/custom/DatetimePicker"
import { Clock, User, FileText, Award, PlusCircle } from "lucide-react"
import { useSupervisors } from "@/articulo-140/hooks/activities/admin/useSupervisors"
import type { Datum } from "@/articulo-140/interfaces/activities.response"
import { useActivities } from "@/articulo-140/hooks/activities/activities/useActivities"
import { toast } from "sonner"
import { UNAH_BLUE, UNAH_GOLD, UNAH_GOLD_DARK } from "@/lib/colors"

// Interfaz para el formulario
interface ActivityFormData {
  title: string
  description: string
  startDate: Date | undefined
  endDate: Date | undefined
  voaeHours: number
  availableSpots: number
  supervisorId: string | undefined
  scopesId: string[]
}

interface ActivityFormProps {
  onClose?: () => void
}

export const ActivityForm = ({ onClose }: ActivityFormProps) => {

  const { query } = useSupervisors(100, 1) // Obtener supervisores para el select
  const supervisors = query?.data?.data?.data;
  const {createActivityMutation} = useActivities();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ActivityFormData>({
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      voaeHours: 0,
      availableSpots: 0,
      supervisorId: undefined, 
      scopesId: [],
    }
  });

  const scopes = [
    { id: "1", name: "Cultural", value: "1" },
    { id: "2", name: "Deportivo", value: "2" },
    { id: "3", name: "Científico Académico", value: "3" },
    { id: "4", name: "Social", value: "4" },
  ]

  const onSubmit = handleSubmit(async (data: ActivityFormData) => {
    try {
      if (!data.startDate || !data.endDate) {
        toast.error('Las fechas de inicio y fin son obligatorias');
        return;
      }

      if (!data.supervisorId) {
        toast.error('Debe seleccionar un supervisor');
        return;
      }

      const formDataObject: Datum = {
        title: data.title,
        description: data.description,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        voaeHours: data.voaeHours,
        availableSpots: data.availableSpots,
        supervisorId: data.supervisorId,
        scopes: data.scopesId, // Enviar como array en lugar de string
      } as unknown as Datum;

      await createActivityMutation.mutateAsync(formDataObject, {
        onSuccess: () => {
          toast.success('Actividad creada correctamente', {
            position: 'top-right',
          });
        },
        onError: (error) => {
          console.log(error);
          toast.error('Error al crear la actividad');
        },
      });
    } catch (error) {
      console.error('Error en el formulario:', error);
      toast.error('Error inesperado');
    }
  });
    

  return (
    <div className="p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-white shadow-xl border-0 overflow-hidden" style={{ borderTop: `4px solid ${UNAH_GOLD_DARK}` }}>
        <CardHeader>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Agregar Actividad</h2>
              <div style={{ width: '3rem', height: '3px', background: `linear-gradient(90deg, ${UNAH_GOLD}, ${UNAH_GOLD_DARK})`, borderRadius: '2px', margin: '8px auto 0' }} />
              <p className="text-sm mt-2">
                Complete la información de la actividad
              </p>
            </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Título */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: UNAH_BLUE }} />
                Título de la actividad
              </label>
              <Input
                {...register("title", { required: "El título es obligatorio" })}
                type="text"
                placeholder="Ej. Charla sobre circuitos"
                className="h-10 border-gray-300 focus:border-blue-700 focus:ring-blue-700"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" style={{ color: UNAH_BLUE }} />
                Descripción
              </label>
              <Textarea
                {...register("description", { required: "La descripción es obligatoria" })}
                placeholder="Ej. Charla de estudiantes sobre circuitos electrónicos"
                className="min-h-[80px] border-gray-300 focus:border-blue-700 focus:ring-blue-700 resize-none"
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Grid de campos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Supervisor */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: UNAH_BLUE }} />
                  Supervisor
                </label>
                <Controller
                  name="supervisorId"
                  control={control}
                  rules={{ required: "Debe seleccionar un supervisor" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-10 border-gray-300 focus:border-blue-700 focus:ring-blue-700">
                        <SelectValue placeholder="Seleccione un supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {supervisors?.filter(supervisor => supervisor.id && supervisor.id.trim() !== '' && supervisor.isDeleted === "false").map((supervisor) => (
                          <SelectItem key={supervisor.id} value={supervisor.id}>
                            {supervisor.name}
                          </SelectItem>
                        ))}
                        {(!supervisors || supervisors.length === 0) && (
                          <div className="p-2 text-sm text-gray-500">No hay supervisores disponibles</div>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.supervisorId && (
                  <p className="text-sm text-red-600">{errors.supervisorId.message}</p>
                )}
              </div>

              {/* Horas VOAE */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: UNAH_BLUE }} />
                  Horas VOAE
                </label>
                <Input
                  {...register("voaeHours", { 
                    required: "Las horas VOAE son obligatorias",
                    min: { value: 1, message: "Debe ser al menos 1 hora" },
                    valueAsNumber: true
                  })}
                  type="number"
                  placeholder="Ej. 5"
                  min="1"
                  className="h-10 border-gray-300 focus:border-blue-700 focus:ring-blue-700"
                />
                {errors.voaeHours && (
                  <p className="text-sm text-red-600">{errors.voaeHours.message}</p>
                )}
              </div>

              {/* Cupos disponibles */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: UNAH_BLUE }} />
                  Cupos disponibles
                </label>
                <Input
                  {...register("availableSpots", { 
                    required: "Los cupos disponibles son obligatorios",
                    min: { value: 1, message: "Debe ser al menos 1 cupo" },
                    valueAsNumber: true
                  })}
                  type="number"
                  placeholder="Ej. 30"
                  min="1"
                  className="h-10 border-gray-300 focus:border-blue-700 focus:ring-blue-700"
                />
                {errors.availableSpots && (
                  <p className="text-sm text-red-600">{errors.availableSpots.message}</p>
                )}
              </div>
            </div>

            {/* Fechas y horas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de inicio */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: UNAH_BLUE }} />
                  Fecha y hora de inicio
                </label>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "La fecha de inicio es obligatoria" }}
                  render={({ field }) => (
                    <DateTimePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Seleccionar fecha y hora de inicio"
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              {/* Fecha de fin */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: UNAH_BLUE }} />
                  Fecha y hora de fin
                </label>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: "La fecha de fin es obligatoria" }}
                  render={({ field }) => (
                    <DateTimePicker
                      date={field.value}
                      setDate={field.onChange}
                      placeholder="Seleccionar fecha y hora de fin"
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Ámbitos (Checkboxes) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: UNAH_BLUE }} />
                Ámbitos
              </label>
              <Controller
                name="scopesId"
                control={control}
                rules={{ required: "Debe seleccionar al menos un ámbito" }}
                render={({ field }) => (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200" style={{ borderLeft: `3px solid ${UNAH_GOLD_DARK}` }}>
                    {scopes.map((scope) => (
                      <div key={scope.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={scope.id}
                          checked={field.value?.includes(scope.value) || false}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...(field.value || []), scope.value]
                              : (field.value || []).filter((id: string) => id !== scope.value);
                            field.onChange(updatedValue);
                          }}
                          className="border-gray-400 data-[state=checked]:bg-[#1E40AF] data-[state=checked]:border-[#1E40AF]"
                        />
                        <Label
                          htmlFor={scope.id}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {scope.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              />
              {errors.scopesId && (
                <p className="text-sm text-red-600">{errors.scopesId.message}</p>
              )}
            </div>

            {/* Botones */}
            <div className="border-t border-gray-200 pt-5 mt-6">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto h-10 px-6 transition-colors"
                    style={{ borderColor: UNAH_BLUE, color: UNAH_BLUE }}
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-10 px-8 text-white font-semibold transition-all"
                  style={{ background: UNAH_BLUE }}
                >
                  <PlusCircle className="w-4 h-4 mr-2" style={{ color: UNAH_GOLD_DARK }} />
                  Agregar Actividad
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
