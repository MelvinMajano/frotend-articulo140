import { useParams, Link } from "react-router"
import { useStudentsAttendaceByActivity } from "@/articulo-140/hooks/activities/activities/useStudentsAttendaceByActivity"
import { useActivyByid } from "@/articulo-140/hooks/activities/activities/useActivityById"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, FileSpreadsheet, Loader2, Send, CheckCircle2, Clock } from "lucide-react"
import { useRef, useState, useEffect, type ChangeEvent } from "react"
import { useImportActivityAttendance } from "@/articulo-140/hooks/activities/activities/useImportActivityAttendance"
import { useUpdateHoursAwarded } from "@/articulo-140/hooks/activities/activities/useUpdateHoursAwarded"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateActivityStatus } from "@/articulo-140/utils/gestionActivitiesPage/actions/updateActivityStatus.action"
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"
import { toast } from "sonner"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"

// ─── Helpers de status ────────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:              { label: "Pendiente",         color: "#92400e", bg: "#fffbeb" },
  inProgress:           { label: "En progreso",       color: "#1e40af", bg: "#eff6ff" },
  finished:             { label: "Finalizada",        color: "#065f46", bg: "#ecfdf5" },
  submittedToSudecad:   { label: "Enviada a SUDECAD", color: "#5b21b6", bg: "#f5f3ff" },
  approvedBySudecad:    { label: "Aprobada por SUDECAD", color: "#166534", bg: "#f0fdf4" },
}

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_LABELS[status] ?? { label: status, color: "#374151", bg: "#f9fafb" }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export const ActivityAttendance = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useStudentsAttendaceByActivity(id)
  const { activityByIDquery } = useActivyByid(id)
  const { importMutation, lastImport, validateAndImport } = useImportActivityAttendance(id)
  const updateHoursMutation = useUpdateHoursAwarded(id)

  const activity    = activityByIDquery.data
  const maxHours    = activity?.voaeHours ?? 0
  const students    = data?.message?.data ?? []
  const status      = activity?.status ?? ""

  // ── Estado de edición de horas ───────────────────────────────────────────────
  const [editingHours, setEditingHours] = useState<Record<string, number | null>>({})

  // ── Autocompletar horas al cargar estudiantes ────────────────────────────────
  // Solo rellena los que aún no tienen horas asignadas (hoursAwarded === null o 0)
  useEffect(() => {
  if (!students.length || !maxHours) return

  const toAutoFill: Array<{ attendanceId: string; hours: number }> = []

  students.forEach((s) => {
    if (!s.hoursAwarded || s.hoursAwarded === 0) {
      toAutoFill.push({ attendanceId: s.attendanceId, hours: maxHours })
    }
  })

  if (toAutoFill.length === 0) return

  // 1. Actualizar el estado local para que se vean en los inputs
  const initialHours: Record<string, number> = {}
  toAutoFill.forEach(({ attendanceId, hours }) => {
    initialHours[attendanceId] = hours
  })
  setEditingHours(prev => ({ ...initialHours, ...prev }))

  // 2. Persistir en el backend cada uno que fue autocompletado
  toAutoFill.forEach(({ attendanceId, hours }) => {
    updateHoursMutation.mutate({ attendanceId, hoursAwarded: hours })
  })

}, [students.length, maxHours])

  // ── Validación: todos los estudiantes deben tener horas > 0 ─────────────────
  const allHoursAssigned = students.length > 0 && students.every((s) => {
    const editing = editingHours[s.attendanceId]
    const current = editing !== undefined ? editing : s.hoursAwarded
    return current !== null && current > 0
  })

  // ── Modales de confirmación ──────────────────────────────────────────────────
  const [submitToSudecadOpen, setSubmitToSudecadOpen] = useState(false)
  const [approveOpen,         setApproveOpen]         = useState(false)

  // ── Mutación de status ───────────────────────────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: updateActivityStatus,
    onSuccess: (message) => {
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ['activityById', id] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error al actualizar el estado")
    },
  })

  const handleSubmitToSudecad = () => {
    // TODO: Generar el Excel con los datos de asistencia antes de enviar
    // exportAttendanceToExcel(students, activity)
    statusMutation.mutate({ actividadId: id!, status: 4 }) // 4 = submittedToSudecad
    setSubmitToSudecadOpen(false)
  }

  const handleApprove = () => {
    statusMutation.mutate({ actividadId: id!, status: 5 }) // 5 = approvedBySudecad
    setApproveOpen(false)
  }

  // ── Handlers de horas ────────────────────────────────────────────────────────
  const handleHoursChange = (attendanceId: string, value: string) => {
    if (value === "") {
      setEditingHours(prev => ({ ...prev, [attendanceId]: null }))
      return
    }
    const num = parseFloat(value)
    // No permitir valores fuera del rango [0, maxHours]
    const clamped = Math.min(Math.max(0, num), maxHours)
    setEditingHours(prev => ({ ...prev, [attendanceId]: clamped }))
  }

  const handleHoursBlur = (attendanceId: string, currentValue: number | null) => {
    const newValue = editingHours[attendanceId]

    if (newValue !== undefined && newValue !== currentValue && newValue !== null && newValue >= 0) {
      updateHoursMutation.mutate({ attendanceId, hoursAwarded: newValue })
    }

    // Limpiar solo si ya fue guardado (no si sigue en edición)
    if (newValue === currentValue || newValue === null) {
      setEditingHours(prev => {
        const updated = { ...prev }
        delete updated[attendanceId]
        return updated
      })
    }
  }

  const getDisplayValue = (attendanceId: string, currentValue: number | null) => {
    if (editingHours[attendanceId] !== undefined) {
      return editingHours[attendanceId] === null ? "" : editingHours[attendanceId]
    }
    return currentValue ?? ""
  }

  // ── Import ───────────────────────────────────────────────────────────────────
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (validateAndImport(file)) {
      event.target.value = ""
    }
  }

  // ── ¿Se puede editar? — solo si no fue enviado/aprobado ─────────────────────
  const isEditable = status === "finished"

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="p-4">
      <Card className="bg-white shadow-lg border-0 w-full">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Izquierda: volver + título + status */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/admin/activities">
              <Button variant="ghost" className="text-gray-600 hover:text-teal-600 hover:bg-teal-50">
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>

            {activityByIDquery.isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : activity ? (
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{activity.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Máximo <span className="font-semibold" style={{ color: UNAH_BLUE }}>{maxHours}h</span> por estudiante
                  </p>
                </div>
                <StatusBadge status={status} />
              </div>
            ) : null}
          </div>

          {/* Derecha: importar Excel */}
          <div className="ml-auto">
            <input
              ref={fileInputRef} type="file"
              accept=".xlsx,.xls,.csv" className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={importMutation.isPending}
              className="border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white flex items-center font-medium shadow-sm transition-all duration-200"
            >
              {importMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importando...</>
              ) : (
                <><FileSpreadsheet className="w-4 h-4 mr-2" />Importar asistencia desde Excel</>
              )}
            </Button>
          </div>
        </CardHeader>

        {/* ── Resultado última importación ─────────────────────────────────── */}
        <CardContent>
          {lastImport && (
            <div className="mb-6 rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900">
              <p className="font-semibold text-teal-900">Última importación</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center justify-between rounded-md bg-white/60 px-3 py-2 shadow-sm"><span>Nuevos</span><span className="font-semibold">{lastImport.created}</span></div>
                <div className="flex items-center justify-between rounded-md bg-white/60 px-3 py-2 shadow-sm"><span>Existentes</span><span className="font-semibold">{lastImport.existing}</span></div>
                <div className="flex items-center justify-between rounded-md bg-white/60 px-3 py-2 shadow-sm"><span>Inscritos</span><span className="font-semibold">{lastImport.registered}</span></div>
                <div className="flex items-center justify-between rounded-md bg-white/60 px-3 py-2 shadow-sm"><span>Asistencias</span><span className="font-semibold">{lastImport.attendanceSaved}</span></div>
              </div>
              {lastImport.errors && lastImport.errors.length > 0 && (() => {
                const criticalErrors = lastImport.errors.filter(err =>
                  err.message?.includes("actividad debe estar finalizada") ||
                  err.message?.includes("Actividad no encontrada") ||
                  err.message?.includes("no admite nuevas inscripciones")
                );
                const validationErrors = lastImport.errors.filter(err =>
                  err.row && !err.message?.includes("no quedo inscrito")
                );
                return criticalErrors.length === 0 && validationErrors.length > 0 && (
                  <div className="mt-3 rounded-md bg-white/80 px-3 py-2 text-red-800">
                    <p className="font-semibold">Errores de validación ({validationErrors.length})</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {validationErrors.slice(0, 3).map((error, index) => (
                        <li key={`${error.row ?? index}-${index}`}>
                          {error.row ? `Fila ${error.row}: ` : ""}
                          {error.issues?.join("; ") || error.message || "Error desconocido"}
                        </li>
                      ))}
                      {validationErrors.length > 3 && (
                        <li>...y {validationErrors.length - 3} errores más</li>
                      )}
                    </ul>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── Tabla ─────────────────────────────────────────────────────── */}
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-6">Error al cargar la asistencia</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader style={{ background: UNAH_BLUE_SOFT }}>
                  <TableRow>
                    <TableHead><span className="font-semibold text-black">Nombre</span></TableHead>
                    <TableHead><span className="font-semibold text-black">N° Cuenta</span></TableHead>
                    <TableHead><span className="font-semibold text-black">Hora entrada</span></TableHead>
                    <TableHead><span className="font-semibold text-black">Hora salida</span></TableHead>
                    <TableHead className="text-center">
                      <span className="font-semibold text-black">
                        Horas otorgadas
                        {maxHours > 0 && (
                          <span className="ml-1 text-xs font-normal text-gray-500">(máx. {maxHours}h)</span>
                        )}
                      </span>
                    </TableHead>
                    <TableHead><span className="font-semibold text-black">Ámbitos</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length > 0 ? (
                    students.map((student) => {
                      const displayVal = getDisplayValue(student.attendanceId, student.hoursAwarded)
                      const isOverMax  = typeof displayVal === "number" && displayVal > maxHours
                      const isEmpty    = displayVal === "" || displayVal === null

                      return (
                        <TableRow key={student.attendanceId} className="hover:bg-gray-50 transition-colors duration-200">
                          <TableCell className="font-medium text-gray-800">{student.name}</TableCell>
                          <TableCell>{student.accountNumber}</TableCell>
                          <TableCell>{new Date(student.entryTime).toLocaleString("es-HN")}</TableCell>
                          <TableCell>{new Date(student.exitTime).toLocaleString("es-HN")}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Input
                                type="number"
                                min="0"
                                max={maxHours}
                                step="1"
                                disabled={!isEditable}
                                value={displayVal}
                                onChange={(e) => handleHoursChange(student.attendanceId, e.target.value)}
                                onBlur={() => handleHoursBlur(student.attendanceId, student.hoursAwarded)}
                                className={`w-20 text-center transition-colors ${
                                  isOverMax  ? "border-red-400 focus:ring-red-300" :
                                  isEmpty    ? "border-amber-400 focus:ring-amber-300" :
                                              "border-gray-200"
                                } ${!isEditable ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}`}
                                placeholder="0"
                              />
                              {isOverMax && (
                                <span className="text-xs text-red-500">Máx. {maxHours}h</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{student.Scope}</TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-6">
                        No hay registros de asistencia aún
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* ── Footer: acciones de status ───────────────────────────────────── */}
        {students.length > 0 && (
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">

            {/* Indicador de progreso */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {status === "finished" && (
                allHoursAssigned ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Todos los estudiantes tienen horas asignadas
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                    <Clock className="w-4 h-4" />
                    {students.filter(s => {
                      const val = editingHours[s.attendanceId] !== undefined
                        ? editingHours[s.attendanceId]
                        : s.hoursAwarded
                      return !val || val <= 0
                    }).length} estudiante(s) sin horas asignadas
                  </span>
                )
              )}
              {status === "submittedToSudecad" && (
                <span className="flex items-center gap-1.5 text-purple-600 font-medium">
                  <Send className="w-4 h-4" />
                  Asistencias enviadas a SUDECAD — en espera de aprobación
                </span>
              )}
              {status === "approvedBySudecad" && (
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Actividad aprobada por SUDECAD
                </span>
              )}
            </div>

            {/* Botones de acción según status */}
            <div className="flex gap-3">

              {/* Enviar a SUDECAD — solo si status es finished y todos tienen horas */}
              {status === "finished" && (
                <Button
                  disabled={!allHoursAssigned || statusMutation.isPending}
                  onClick={() => setSubmitToSudecadOpen(true)}
                  className="flex items-center gap-2 font-semibold shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: allHoursAssigned ? "#5b21b6" : "#e5e7eb", color: allHoursAssigned ? "#fff" : "#9ca3af" }}
                >
                  {statusMutation.isPending
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>
                    : <><Send className="w-4 h-4" />Enviar a SUDECAD</>
                  }
                </Button>
              )}

              {/* Marcar como aprobada — solo si status es submittedToSudecad */}
              {status === "submittedToSudecad" && (
                <Button
                  disabled={statusMutation.isPending}
                  onClick={() => setApproveOpen(true)}
                  className="flex items-center gap-2 font-semibold shadow-sm transition-all hover:opacity-90"
                  style={{ background: "#166534", color: "#fff" }}
                >
                  {statusMutation.isPending
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Procesando...</>
                    : <><CheckCircle2 className="w-4 h-4" />Marcar como aprobada por SUDECAD</>
                  }
                </Button>
              )}
            </div>
          </CardFooter>
        )}
      </Card>

      {/* ── Modales de confirmación ──────────────────────────────────────────── */}
      <ConfirmActionModal
        open={submitToSudecadOpen}
        onOpenChange={setSubmitToSudecadOpen}
        title="Enviar asistencias a SUDECAD"
        message="¿Estás seguro de que deseas enviar las asistencias a SUDECAD? Esta acción bloqueará la edición de horas y no podrá revertirse."
        confirmText="Sí, enviar"
        cancelText="Cancelar"
        onConfirm={handleSubmitToSudecad}
      />
      <ConfirmActionModal
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Confirmar aprobación de SUDECAD"
        message="¿Confirmas que SUDECAD ha aprobado y procesado las horas de esta actividad? Los estudiantes recibirán sus horas VOAE de forma oficial."
        confirmText="Confirmar aprobación"
        cancelText="Cancelar"
        onConfirm={handleApprove}
      />
    </div>
  )
}