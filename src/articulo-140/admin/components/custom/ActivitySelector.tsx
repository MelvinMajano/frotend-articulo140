import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Calendar, MapPin, Users, ArrowLeft, Clock } from "lucide-react"
import { useActivities } from "@/articulo-140/hooks/activities/useActivities"
import type { Message } from "@/articulo-140/interfaces/activities.response"
import type { UUID } from "crypto"

interface ExistingActivitySelectorProps {
  studentId: string
  onBack: () => void
  onClose: () => void
}

type Activity = Message & { id: UUID }

export const ExistingActivitySelector = ({
  //studentId
  onBack,
  onClose
}: ExistingActivitySelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)

  const { query } = useActivities()
  const { data, isLoading, isError } = query

  const handleAssignActivity = () => {
    if (!selectedActivityId) return
    
    // Aquí iría la lógica para asignar la actividad al estudiante usando studentId y selectedActivityId
    
    onClose()
  }

  const activities = Array.isArray(data?.message) ? (data.message as Activity[]) : []

  const filteredActivities = activities.filter((activity) => {
    const title = activity.title?.toLowerCase() || ""
    const description = activity.description?.toLowerCase() || ""
    const query = searchQuery.toLowerCase()
    return title.includes(query) || description.includes(query)
  })

  return (
    <div className="py-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-gray-600 hover:text-teal-600 hover:bg-teal-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {/* Buscador */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar actividad por nombre o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de actividades */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : isError ? (
        <p className="text-red-500 text-center py-6">Error al cargar las actividades</p>
      ) : (
        <>
          <div className="h-[400px] pr-4 overflow-y-auto">
            {filteredActivities.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No se encontraron actividades
              </p>
            ) : (
              <div className="space-y-3">
                {filteredActivities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => setSelectedActivityId(activity.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 shadow-sm transition-all duration-200 ${
                      selectedActivityId === activity.id
                        ? "border-teal-600 bg-teal-50 shadow-md"
                        : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                    }`}
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
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{activity.Supervisor}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignActivity}
              disabled={!selectedActivityId}
              className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Asignar Actividad
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
