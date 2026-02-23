import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Calendar,UserCheck, Users, Clock, Info, AlertCircle} from "lucide-react"
import { useActivities } from "@/articulo-140/hooks/activities/activities/useActivities"
import { assignStudentToFinishedActivity } from "../../actions/studentActivityEnrollment"
import type { Datum } from "@/articulo-140/interfaces/activities.response"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"

interface ExistingActivitySelectorProps {
  studentId: string
  onBack: () => void
  onClose: () => void
}

type Activity = Datum

export const ExistingActivitySelector = ({
  studentId,
  onClose
}: ExistingActivitySelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [duplicateError, setDuplicateError] = useState(false)
  const queryClient = useQueryClient()

  const { query } = useActivities('1','1000') // Cargar todas las actividades para el selector
  const { data, isLoading, isError } = query

  const handleAssignActivity = async () => {
    if (!selectedActivityId) return
    
    setIsSubmitting(true)
    setDuplicateError(false)
    
    try {
      const response = await assignStudentToFinishedActivity(studentId, selectedActivityId)
      
      if (response?.isDuplicate) {
        setDuplicateError(true)
        toast.error(response.message || "El estudiante ya está registrado en esta actividad")
        return
      }
      
      toast.success(response.message || "Actividad asignada exitosamente")
      
      await queryClient.invalidateQueries({ queryKey: ['studentHours', studentId] })
      await queryClient.invalidateQueries({ queryKey: ['studentActivities', studentId] })
      
      onClose()
    } catch (error: any) {
      if (error?.response?.status === 409 || error?.response?.data?.isDuplicate) {
        setDuplicateError(true)
        toast.error(error?.response?.data?.message || "El estudiante ya está registrado en esta actividad")
      } else {
        const errorMessage = error?.response?.data?.message || "Error al asignar la actividad"
        toast.error(errorMessage)
      }
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const activities: Activity[] = Array.isArray(data?.data?.data)
    ? data.data.data
    : []

  // Filtrar solo actividades finalizadas
  const finishedActivities = activities.filter((activity) => 
    activity.status === 'finished'
  )

  const filteredActivities = finishedActivities.filter((activity) => {
    const title = activity.title?.toLowerCase() || ""
    const description = activity.description?.toLowerCase() || ""
    const query = searchQuery.toLowerCase()
    return title.includes(query) || description.includes(query)
  })

  return (
    <div className="space-y-3">

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar actividad por nombre o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          disabled={isSubmitting}
        />
      </div>

      {/* Recordatorio */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900 font-medium">
            Solo actividades finalizadas
          </p>
          <p className="text-xs text-blue-700">
            Solo se muestran actividades con estado "Finalizado" para poder asignar horas VOAE al estudiante.
          </p>
        </div>
      </div>

      {/* Alerta de error duplicado */}
      {duplicateError && (
        <Card className="bg-red-50 border-red-200 p-3">
          <div className="flex gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">
              El estudiante ya está registrado en esta actividad. Por favor, selecciona otra actividad diferente.
            </p>
          </div>
        </Card>
      )}

      {/* Lista de actividades */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : isError ? (
        <p className="text-red-500 text-center py-6">Error al cargar las actividades</p>
      ) : (
        <>
          <div className="h-[320px] pr-2 overflow-y-auto">
            {filteredActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                {searchQuery 
                  ? "No se encontraron actividades" 
                  : "No hay actividades finalizadas disponibles"}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredActivities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => {
                      setSelectedActivityId(activity.id)
                      setDuplicateError(false)
                    }}
                    disabled={isSubmitting}
                    className={`w-full text-left p-4 rounded-xl border-2 shadow-sm transition-all duration-200 ${
                      selectedActivityId === activity.id
                        ? "border-teal-600 bg-teal-50 shadow-md"
                        : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                      {activity.description || "Sin descripción"}
                    </p>

                    <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(activity.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{activity.voaeHours} horas VOAE</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" />
                        <span>Cupos: {activity.availableSpots}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{activity.Supervisor}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end pt-3 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignActivity}
              disabled={!selectedActivityId || isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Asignando...
                </>
              ) : (
                "Asignar Actividad"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}