import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, Calendar, UserCheck, Users, Clock, Info, AlertCircle, PlusCircle, List } from "lucide-react"
import { useActivities } from "@/articulo-140/hooks/activities/activities/useActivities"
import { assignStudentToFinishedActivity } from "../../actions/studentActivityEnrollment"
import { postExternalActivity } from "@/articulo-140/home/actions/postActivities.action"
import type { Datum } from "@/articulo-140/interfaces/activities.response"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Props {
  studentId: string
  onBack: () => void
  onClose: () => void
}

type Tab = "existing" | "create"

const SCOPE_OPTIONS = [
  { value: "1", label: "Cultural" },
  { value: "2", label: "Social" },
  { value: "3", label: "Deportivo" },
  { value: "4", label: "Científico Académico" },
]

// ─── Formulario de actividad externa ─────────────────────────────────────────
interface ExternalFormState {
  title: string
  description: string
  startDate: string
  endDate: string
  voaeHours: string
  scopes: string[]
}

const EMPTY_FORM: ExternalFormState = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  voaeHours: "",
  scopes: [],
}

// ─── Componente principal ─────────────────────────────────────────────────────
export const ExistingActivitySelector = ({ studentId, onClose }: Props) => {
  const [activeTab,          setActiveTab]          = useState<Tab>("existing")
  const [searchQuery,        setSearchQuery]        = useState("")
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [isSubmitting,       setIsSubmitting]       = useState(false)
  const [duplicateError,     setDuplicateError]     = useState(false)
  const [form,               setForm]               = useState<ExternalFormState>(EMPTY_FORM)
  const [formErrors,         setFormErrors]         = useState<Partial<Omit<ExternalFormState, "scopes"> & { scopes?: string }>>({})

  const queryClient = useQueryClient()
  const { query }   = useActivities("1", "1000")
  const { data, isLoading, isError } = query

  // ── Actividades externas ya creadas (status === 'external') ─────────────────
  const allActivities: Datum[] = Array.isArray(data?.data?.data) ? data.data.data : []
  const externalActivities     = allActivities.filter(a => a.status === "external")
  const filteredActivities     = externalActivities.filter(a => {
    const q = searchQuery.toLowerCase()
    return (
      a.title?.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q)
    )
  })

  // ── Asignar actividad existente ──────────────────────────────────────────────
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
      await queryClient.invalidateQueries({ queryKey: ["studentHours",      studentId] })
      await queryClient.invalidateQueries({ queryKey: ["studentActivities", studentId] })
      onClose()
    } catch (error: any) {
      if (error?.response?.status === 409 || error?.response?.data?.isDuplicate) {
        setDuplicateError(true)
        toast.error(error?.response?.data?.message || "El estudiante ya está registrado en esta actividad")
      } else {
        toast.error(error?.response?.data?.message || "Error al asignar la actividad")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Validación del formulario ────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const errors: Partial<Omit<ExternalFormState, "scopes"> & { scopes?: string }> = {}

    if (!form.title.trim())
      errors.title = "El título es requerido"

    if (!form.startDate)
      errors.startDate = "La fecha de inicio es requerida"

    if (!form.endDate)
      errors.endDate = "La fecha de fin es requerida"

    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate))
      errors.endDate = "La fecha de fin debe ser posterior a la de inicio"

    if (!form.voaeHours || isNaN(Number(form.voaeHours)) || Number(form.voaeHours) <= 0)
      errors.voaeHours = "Las horas deben ser un número mayor a 0"

    if (form.scopes.length === 0)
      errors.scopes = "Selecciona al menos un ámbito"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ── Crear actividad externa ──────────────────────────────────────────────────
  const handleCreateExternal = async () => {
    if (!validateForm()) return
    setIsSubmitting(true)
    try {
      await postExternalActivity({
      title:          form.title.trim(),
      description:    form.description.trim(),
      startDate:      new Date(form.startDate).toISOString(),
      endDate:        new Date(form.endDate).toISOString(),
      voaeHours:      Number(form.voaeHours),
      availableSpots: 9999,
      supervisorId:   "05133e00-68f1-43b8-a254-477ae2d72bfc", 
      scopes:         form.scopes,
    } as unknown as Datum)

      toast.success("Actividad externa creada. Ahora puedes seleccionarla en la pestaña anterior.")
      setForm(EMPTY_FORM)
      setFormErrors({})
      await queryClient.invalidateQueries({ queryKey: ["activities"] })
      setActiveTab("existing")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error al crear la actividad externa")
    } finally {
      setIsSubmitting(false)
    }
  }

  const setField = (field: keyof ExternalFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setFormErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const toggleScope = (value: string) => {
    setForm(prev => ({
      ...prev,
      scopes: prev.scopes.includes(value)
        ? prev.scopes.filter(s => s !== value)
        : [...prev.scopes, value],
    }))
    setFormErrors(prev => ({ ...prev, scopes: undefined }))
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200">
        {([
          { key: "existing", label: "Actividades externas", icon: <List className="w-4 h-4" /> },
          { key: "create",   label: "Crear nueva",          icon: <PlusCircle className="w-4 h-4" /> },
        ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setSelectedActivityId(null); setDuplicateError(false) }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors"
            style={activeTab === tab.key
              ? { background: UNAH_BLUE, color: "#fff" }
              : { background: "#f9fafb", color: "#6b7280" }
            }
          >
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Actividades existentes ──────────────────────────────────────── */}
      {activeTab === "existing" && (
        <>
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar actividad por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={isSubmitting}
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium">Solo actividades externas</p>
              <p className="text-xs text-blue-700">
                Se muestran actividades externas a la carrera. Para agregar una nueva usa la pestaña "Crear nueva".
              </p>
            </div>
          </div>

          {/* Error duplicado */}
          {duplicateError && (
            <Card className="bg-red-50 border-red-200 p-3">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  El estudiante ya está registrado en esta actividad. Selecciona otra.
                </p>
              </div>
            </Card>
          )}

          {/* Lista */}
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: UNAH_BLUE }} />
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-6">Error al cargar las actividades</p>
          ) : (
            <>
              <div className="h-[280px] pr-1 overflow-y-auto space-y-3">
                {filteredActivities.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">
                    {searchQuery
                      ? "No se encontraron actividades"
                      : "No hay actividades externas aún. Crea una desde la pestaña \"Crear nueva\"."}
                  </p>
                ) : (
                  filteredActivities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => { setSelectedActivityId(activity.id); setDuplicateError(false) }}
                      disabled={isSubmitting}
                      className={`w-full text-left p-4 rounded-xl border-2 shadow-sm transition-all duration-200 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      style={{
                        borderColor: selectedActivityId === activity.id ? UNAH_BLUE : "#E5E7EB",
                        background:  selectedActivityId === activity.id ? UNAH_BLUE_SOFT : "white",
                        boxShadow:   selectedActivityId === activity.id ? `0 4px 12px 0 ${UNAH_BLUE}20` : undefined,
                      }}
                    >
                      <h4 className="font-semibold text-gray-800 mb-1">{activity.title}</h4>
                      <p className="text-gray-500 text-sm mb-2 line-clamp-2">{activity.description || "Sin descripción"}</p>
                      <div className="grid grid-cols-2 text-sm text-gray-600 gap-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(activity.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{activity.voaeHours} horas VOAE</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" />
                          <span>{activity.scopes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{activity.Supervisor || "Externo"}</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Acciones */}
              <div className="flex gap-3 justify-end pt-3 border-t">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="border-gray-300">
                  Cancelar
                </Button>
                <Button
                  onClick={handleAssignActivity}
                  disabled={!selectedActivityId || isSubmitting}
                  className="text-white disabled:opacity-50"
                  style={{ background: UNAH_BLUE }}
                >
                  {isSubmitting
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Asignando...</>
                    : "Asignar Actividad"
                  }
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {/* ── Tab: Crear actividad externa ─────────────────────────────────────── */}
      {activeTab === "create" && (
        <div className="space-y-4">

          {/* Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              Las actividades creadas aquí se guardan con estado <strong>Externo</strong> y quedan disponibles para asignarse a cualquier estudiante.
            </p>
          </div>

          <div className="h-[280px] overflow-y-auto pr-1 space-y-3">

            {/* Título */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Título *</Label>
              <Input
                value={form.title}
                onChange={e => setField("title", e.target.value)}
                placeholder="Ej: Congreso Internacional de Ingeniería"
                disabled={isSubmitting}
                className={formErrors.title ? "border-red-400" : ""}
              />
              {formErrors.title && <p className="text-xs text-red-500">{formErrors.title}</p>}
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Descripción</Label>
              <textarea
                value={form.description}
                onChange={e => setField("description", e.target.value)}
                placeholder="Descripción de la actividad..."
                disabled={isSubmitting}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              />
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha inicio *</Label>
                <Input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={e => setField("startDate", e.target.value)}
                  disabled={isSubmitting}
                  className={formErrors.startDate ? "border-red-400" : ""}
                />
                {formErrors.startDate && <p className="text-xs text-red-500">{formErrors.startDate}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha fin *</Label>
                <Input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={e => setField("endDate", e.target.value)}
                  disabled={isSubmitting}
                  className={formErrors.endDate ? "border-red-400" : ""}
                />
                {formErrors.endDate && <p className="text-xs text-red-500">{formErrors.endDate}</p>}
              </div>
            </div>

            {/* Horas VOAE */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Horas VOAE *</Label>
              <Input
                type="number"
                min="1"
                value={form.voaeHours}
                onChange={e => setField("voaeHours", e.target.value)}
                placeholder="Ej: 5"
                disabled={isSubmitting}
                className={`w-32 ${formErrors.voaeHours ? "border-red-400" : ""}`}
              />
              {formErrors.voaeHours && <p className="text-xs text-red-500">{formErrors.voaeHours}</p>}
            </div>

            {/* Ámbitos */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Ámbito(s) *</Label>
              <div className="flex flex-wrap gap-2">
                {SCOPE_OPTIONS.map(scope => {
                  const active = form.scopes.includes(scope.value)
                  return (
                    <button
                      key={scope.value}
                      type="button"
                      onClick={() => toggleScope(scope.value)}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all"
                      style={{
                        borderColor: active ? UNAH_BLUE : "#e5e7eb",
                        background:  active ? UNAH_BLUE : "white",
                        color:       active ? "#fff"     : "#6b7280",
                      }}
                    >
                      {scope.label}
                    </button>
                  )
                })}
              </div>
              {formErrors.scopes && <p className="text-xs text-red-500">{formErrors.scopes}</p>}
            </div>

          </div>

          {/* Acciones */}
          <div className="flex gap-3 justify-end pt-3 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="border-gray-300">
              Cancelar
            </Button>
            <Button
              onClick={handleCreateExternal}
              disabled={isSubmitting}
              className="text-white"
              style={{ background: UNAH_BLUE }}
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creando...</>
                : <><PlusCircle className="w-4 h-4 mr-2" />Crear actividad externa</>
              }
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}