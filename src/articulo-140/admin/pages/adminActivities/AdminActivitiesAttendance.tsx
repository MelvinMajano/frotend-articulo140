import { useParams, Link } from "react-router"
import { useStudentsAttendaceByActivity } from "@/articulo-140/hooks/activities/activities/useStudentsAttendaceByActivity"
import { useActivyByid } from "@/articulo-140/hooks/activities/activities/useActivityById"
import { exportAttendanceToExcel } from "@/articulo-140/utils/gestionActivitiesPage/actions/exportAttendanceToExcel"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, FileSpreadsheet, Loader2, Send, CheckCircle2, Clock, Check, X, Download } from "lucide-react"
import { useRef, useState, useEffect, useCallback, type ChangeEvent } from "react"
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
  // Refs de los inputs de horas — para hacer focus al primer disponible tras importar
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // ── Data ────────────────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useStudentsAttendaceByActivity(id)
  const { activityByIDquery } = useActivyByid(id)
  const { importMutation, lastImport, validateAndImport } = useImportActivityAttendance(id)
  const updateHoursMutation = useUpdateHoursAwarded(id)

  const activity    = activityByIDquery.data
  const maxHours    = activity?.voaeHours ?? 0
  const students    = data?.message?.data ?? []
  const status      = activity?.status ?? ""

  // ── Estado de edición ─────────────────────────────────────────────────────────
  // editingHours: valor local del input (cambio pendiente de confirmar)
  const [editingHours,   setEditingHours]   = useState<Record<string, number | null>>({})
  // confirmedHours: set de attendanceIds cuyo valor ya fue guardado en el backend en esta sesión
  const [confirmedHours, setConfirmedHours] = useState<Set<string>>(new Set())
  // focusedId: attendanceId del input que tiene el foco activo
  const [focusedId,      setFocusedId]      = useState<string | null>(null)
  // savingId: attendanceId del input que está guardando actualmente
  const [savingId,       setSavingId]       = useState<string | null>(null)

  // ── Autocompletar horas al cargar — SOLO LOCAL, sin llamar al endpoint ────────
  useEffect(() => {
    if (!students.length || !maxHours) return

    const initialHours: Record<string, number> = {}
    students.forEach((s) => {
      if (!s.hoursAwarded || s.hoursAwarded === 0) {
        initialHours[s.attendanceId] = maxHours
      }
    })

    if (Object.keys(initialHours).length > 0) {
      setEditingHours(prev => ({ ...initialHours, ...prev }))
    }
  }, [students.length, maxHours])

  // ── Focus al primer input tras importar ───────────────────────────────────────
  useEffect(() => {
    if (!importMutation.isSuccess) return
    // Esperar a que React renderice la tabla actualizada
    const timer = setTimeout(() => {
      const firstStudent = students[0]
      if (firstStudent) {
        inputRefs.current[firstStudent.attendanceId]?.focus()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [importMutation.isSuccess])

  // ── Validacion: todos los estudiantes tienen horas confirmadas en el backend ──
  // Un estudiante cuenta como listo si:
  //   a) ya tenia hoursAwarded > 0 desde el servidor (dato previo), O
  //   b) fue confirmado exitosamente en esta sesión (confirmedHours)
  // Los valores solo en editingHours (locales sin confirmar) no cuentan.
  const allHoursAssigned = students.length > 0 && students.every((s) => {
    const alreadySaved  = s.hoursAwarded !== null && s.hoursAwarded > 0
    const justConfirmed = confirmedHours.has(s.attendanceId)
    return alreadySaved || justConfirmed
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
    const clamped = Math.min(Math.max(0, num), maxHours)
    setEditingHours(prev => ({ ...prev, [attendanceId]: clamped }))
  }

  const handleFocus = (attendanceId: string) => {
    setFocusedId(attendanceId)
  }

  // ── Confirmar: llama al endpoint y limpia el focus ─────────────────────────────
  const handleConfirm = useCallback((attendanceId: string, currentSaved: number | null) => {
    const newValue = editingHours[attendanceId]

    // Si el valor no cambió o es inválido, solo cerrar el flotante
    if (newValue === undefined || newValue === currentSaved) {
      setFocusedId(null)
      return
    }

    if (newValue === null || newValue < 0) {
      setFocusedId(null)
      return
    }

    setSavingId(attendanceId)
    updateHoursMutation.mutate(
      { attendanceId, hoursAwarded: newValue },
      {
        onSuccess: () => {
          setSavingId(null)
          setFocusedId(null)
          // Marcar como confirmado para que allHoursAssigned lo cuente
          setConfirmedHours(prev => new Set(prev).add(attendanceId))
          // Limpiar del estado local ya que el valor quedó guardado en el backend
          setEditingHours(prev => {
            const next = { ...prev }
            delete next[attendanceId]
            return next
          })
          // Desplazar foco al siguiente input disponible
          const currentIndex = students.findIndex(s => s.attendanceId === attendanceId)
          const nextStudent  = students[currentIndex + 1]
          if (nextStudent) {
            setTimeout(() => {
              inputRefs.current[nextStudent.attendanceId]?.focus()
            }, 50)
          }
        },
        onError: () => {
          setSavingId(null)
          // No cerrar el flotante para que el usuario pueda reintentar
        },
      }
    )
  }, [editingHours, updateHoursMutation, students])

  // ── Cancelar: revierte el valor local al guardado en el backend ───────────────
  const handleCancel = useCallback((attendanceId: string) => {
    setEditingHours(prev => {
      const next = { ...prev }
      delete next[attendanceId]
      return next
    })
    setFocusedId(null)
  }, [])

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
          <div className="ml-auto flex items-center gap-2">

            {(status === "submittedToSudecad" || status === "approvedBySudecad") && (
              <div className="ml-auto">
                <Button
                  onClick={() => exportAttendanceToExcel(students, activity?.title ?? "actividad", maxHours)}
                  variant="outline"
                  className="flex items-ri gap-2 font-medium border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </Button>
              </div>
            )}

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
              {importMutation.isPending
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importando...</>
                : <><FileSpreadsheet className="w-4 h-4 mr-2" />Importar asistencia desde Excel</>
              }
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
                      const isFocused   = focusedId === student.attendanceId
                      const isSaving    = savingId  === student.attendanceId
                      // Pendiente = editable + sin horas confirmadas (backend previo o sesión actual)
                      const isPending   = isEditable
                        && !(student.hoursAwarded !== null && student.hoursAwarded > 0)
                        && !confirmedHours.has(student.attendanceId)

                      return (
                        <TableRow key={student.attendanceId} className="hover:bg-gray-50 transition-colors duration-200">
                          <TableCell className="font-medium text-gray-800">{student.name}</TableCell>
                          <TableCell>{student.accountNumber}</TableCell>
                          <TableCell>{new Date(student.entryTime).toLocaleString("es-HN")}</TableCell>
                          <TableCell>{new Date(student.exitTime).toLocaleString("es-HN")}</TableCell>
                          <TableCell className="text-center">
                            {/* Contenedor relativo para posicionar el flotante */}
                            <div className="relative inline-flex flex-col items-center gap-1">
                              <Input
                                ref={el => { inputRefs.current[student.attendanceId] = el }}
                                type="number"
                                min="0"
                                max={maxHours}
                                step="1"
                                disabled={!isEditable || isSaving}
                                value={displayVal}
                                onChange={(e) => handleHoursChange(student.attendanceId, e.target.value)}
                                onFocus={() => handleFocus(student.attendanceId)}
                                className={`w-20 text-center transition-colors ${
                                  isOverMax           ? "border-red-400 focus:ring-red-300" :
                                  isEmpty || isPending ? "border-amber-400 focus:ring-amber-300" :
                                                        "border-gray-200"
                                } ${!isEditable ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}
                                  ${isFocused ? "ring-2 ring-blue-300" : ""}
                                `}
                                placeholder="0"
                              />

                              {/* ── Botones flotantes de confirmar/cancelar ── */}
                              {isFocused && isEditable && (
                                <div
                                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10"
                                  // Evitar que el click en los botones dispare onBlur del input
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  {/* Confirmar */}
                                  <button
                                    onClick={() => handleConfirm(student.attendanceId, student.hoursAwarded)}
                                    disabled={isSaving || isOverMax}
                                    className="flex items-center justify-center w-6 h-6 rounded-full text-white transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                    style={{ background: "#16a34a" }}
                                    title="Confirmar"
                                  >
                                    {isSaving
                                      ? <Loader2 className="w-3 h-3 animate-spin" />
                                      : <Check className="w-3 h-3" />
                                    }
                                  </button>

                                  {/* Cancelar */}
                                  <button
                                    onClick={() => handleCancel(student.attendanceId)}
                                    disabled={isSaving}
                                    className="flex items-center justify-center w-6 h-6 rounded-full text-white transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                    style={{ background: "#dc2626" }}
                                    title="Cancelar"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              )}

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
                      const alreadySaved  = s.hoursAwarded !== null && s.hoursAwarded > 0
                      const justConfirmed = confirmedHours.has(s.attendanceId)
                      return !alreadySaved && !justConfirmed
                    }).length} estudiante(s) sin horas confirmadas
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

              {/* Enviar a SUDECAD — solo si status es finished y todos tienen horas confirmadas*/}  
              {status === "finished" && (
                <Button
                  disabled={!allHoursAssigned || statusMutation.isPending || !!focusedId}
                  onClick={() => setSubmitToSudecadOpen(true)}
                  className="flex items-center gap-2 font-semibold shadow-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: allHoursAssigned && !focusedId ? "#5b21b6" : "#e5e7eb", color: allHoursAssigned && !focusedId ? "#fff" : "#9ca3af" }}
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