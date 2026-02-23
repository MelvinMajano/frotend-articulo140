import { useState, useEffect } from "react"
import { useSupervisors } from "@/articulo-140/hooks/activities/admin/useSupervisors"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DateTimePicker } from "@/components/custom/DatetimePicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"

interface EditActivityModalProps {
  activity: any
  isOpen: boolean
  onClose: () => void
}
const scopes = ["Cultural", "Deportivo", "Académico", "Social"]

export const EditActivityModal = ({ activity, isOpen, onClose }: EditActivityModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    supervisor: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    voaeHours: 0,
    scopes: [] as string[],
    availableSpots: 0,
  })

  const { query } = useSupervisors()
  const { data, isLoading, isError } = query
  const supervisors = data?.data || []

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || "",
        description: activity.description || "",
        supervisor: activity.supervisor || "",
        startDate: activity.startDate ? new Date(activity.startDate) : null,
        endDate: activity.endDate ? new Date(activity.endDate) : null,
        voaeHours: activity.voaeHours || 0,
        scopes: Array.isArray(activity.scopes)
          ? activity.scopes
          : (activity.scopes || "").split(",").map((s: string) => s.trim()),
        availableSpots: activity.availableSpots || 0,
      })
    }
  }, [activity])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleScopeChange = (scope: string) => {
    setFormData((prev) => ({
      ...prev,
      scopes: prev.scopes.includes(scope)
        ? prev.scopes.filter((s) => s !== scope)
        : [...prev.scopes, scope],
    }))
  }

  const handleSubmit = () => {
    console.log("Guardar cambios:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[1200px] max-w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-visible">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Editar Actividad
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Título de la actividad"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Descripción de la actividad"
            />
          </div>

          {/* Supervisor */}
          <div className="space-y-2">
            <Label htmlFor="supervisor">Supervisor</Label>
            <select
              id="supervisor"
              value={formData.supervisor}
              onChange={(e) => handleChange("supervisor", e.target.value)}
              className="w-full border rounded-md p-2 border-gray-300 focus:border-blue-700"
            >
              <option value="">Seleccionar supervisor</option>
              {isLoading ? (
                <option disabled>Cargando supervisores...</option>
              ) : isError ? (
                <option disabled>Error al cargar supervisores</option>
              ) : (
                supervisors.map((sup) => (
                  <option key={sup.accountNumber} value={sup.accountNumber}>
                    {sup.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 min-w-0">
              <Label htmlFor="startDate">Fecha de Inicio</Label>
              <div className="w-full overflow-visible">
                <DateTimePicker
                  date={formData.startDate || undefined}
                  setDate={(date) => handleChange("startDate", date)}
                  placeholder="Seleccionar fecha y hora"
                  className="w-full truncate"
                />
              </div>
            </div>
            <div className="space-y-2 min-w-0">
              <Label htmlFor="endDate">Fecha de Fin</Label>
              <div className="w-full overflow-visible">
                <DateTimePicker
                  date={formData.endDate || undefined}
                  setDate={(date) => handleChange("endDate", date)}
                  placeholder="Seleccionar fecha y hora"
                  className="w-full truncate"
                />
              </div>
            </div>
          </div>
         
          {/* Horas VOAE y Espacios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="voaeHours">Horas VOAE</Label>
              <Input
                id="voaeHours"
                type="number"
                value={formData.voaeHours}
                onChange={(e) => handleChange("voaeHours", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableSpots">Espacios Disponibles</Label>
              <Input
                id="availableSpots"
                type="number"
                value={formData.availableSpots}
                onChange={(e) => handleChange("availableSpots", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Ámbitos */}
          <div className="space-y-2">
            <Label>Ámbitos</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {scopes.map((scope) => (
                <label key={scope} className="flex items-center space-x-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.scopes.includes(scope)}
                    onChange={() => handleScopeChange(scope)}
                    className="h-4 w-4 border-gray-300 rounded focus:ring-blue-700" style={{ accentColor: UNAH_BLUE }}
                  />
                  <span>{scope}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="text-white"
            style={{ background: UNAH_BLUE }}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
