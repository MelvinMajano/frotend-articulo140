import { useState, useEffect, useRef } from "react"
import { useActivities } from '@/articulo-140/hooks/activities/activities/useActivities'
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link, useSearchParams } from "react-router"
import { ArrowLeft, Eye, Loader2, Plus, SearchX } from 'lucide-react'
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { addImageToActivity, replaceImageActivity } from "../../actions/addImageToActivity.action"
import { toast } from "sonner"
import { articulo140Api } from "@/articulo-140/api/articulo140Api"
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"
import { GuidedTour } from "../../components/custom/GuidedTour"
import type { TourStep } from "../../components/custom/GuidedTour"

// ─── Pasos del tour — modo normal ────────────────────────────────────────────
const ACTIVITIES_STEPS: TourStep[] = [
  {
    target: "body",
    title: "👋 ¡Bienvenido!",
    content: "Este es el módulo de Gestión de Actividades VOAE. Te guiaremos por sus funciones principales.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="activities-search"]',
    title: "Buscador",
    content: "Filtra actividades por título, horas VOAE, ámbitos o supervisor. También puedes usar Ctrl+K para enfocarlo.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="activities-table"]',
    title: "Tabla de Actividades",
    content: "Aquí se listan todas las actividades registradas con su información: fechas, horas VOAE, ámbitos y supervisor responsable.",
    placement: "top",
    disableBeacon: true,
    pumaLabel: "¡Revisa tus actividades aquí!",
  },
  {
    target: '[data-tour="action-attendance"]',
    title: "Ver Asistencias",
    content: "Haz clic aquí para consultar la lista completa de asistentes registrados en esta actividad.",
    placement: "right",
    disableBeacon: true,
    pumaPosition: "right",
    pumaLabel: "Consulta las asistencias de cada actividad",
  },
  {
    target: '[data-tour="activities-pagination"]',
    title: "Paginación",
    content: "Navega entre páginas cuando la lista de actividades sea extensa.",
    placement: "top",
    disableBeacon: true,
    pumaMood: "celebrate",
    pumaLabel: "¡Navega por las páginas!",
  },
]

// ─── Pasos del tour — modo selección de imagen ───────────────────────────────
const ACTIVITIES_FROM_FILES_STEPS: TourStep[] = [
  {
    target: "body",
    title: "📎 Asignar Imagen",
    content: "Estás en modo selección. Elige la actividad a la que quieres asignar la imagen que seleccionaste.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="activities-search"]',
    title: "Buscador",
    content: "Usa el buscador para encontrar rápidamente la actividad a la que quieres asignar la imagen.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="activities-table"]',
    title: "Tabla de Actividades",
    content: "Aquí se listan todas las actividades disponibles. Revisa el título y los datos antes de seleccionar.",
    placement: "top",
    disableBeacon: true,
    pumaLabel: "¡Aquí están tus actividades!",
  },
  {
    target: '[data-tour="action-select"]',
    title: "Seleccionar Actividad",
    content: "Presiona este botón para asignar la imagen que elegiste a esta actividad. Si ya tiene imagen, podrás reemplazarla.",
    placement: "left",
    disableBeacon: true,
    pumaPosition: "right",
    pumaMood: "celebrate",
    pumaLabel: "¡Selecciona una actividad!",
  },
]

export const AdminActivities = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Leer búsqueda y página desde la URL ──────────────────────────────────────
  const searchQuery = searchParams.get("search") || ""
  const currentPage = searchParams.get("page") || "1"

  const { query } = useActivities(currentPage, undefined, searchQuery)
  const { data, isLoading, isError } = query

  const searchInputRef = useRef<HTMLInputElement>(null)

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [replaceImageDialogOpen, setReplaceImageDialogOpen] = useState(false)

  const isFromFiles = searchParams.get("from") === "files"

  // ── Actualizar URL al buscar — resetea a página 1 ────────────────────────────
  const handleSearch = (value: string) => {
    setSearchParams({ page: "1", ...(value.trim() ? { search: value } : {}), ...(isFromFiles ? { from: "files" } : {}) })
  }

  // ── Atajo de teclado Ctrl+K / Cmd+K ─────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // ── Datos desde el backend ────────────────────────────────────────────────────
  const activities      = data?.data?.data ?? []
  const totalPages      = data?.data?.pagination?.totalPage || 1
  const totalActivities = data?.data?.pagination?.total || 0
  const hasActivities   = activities.length > 0

  // ── Imagen mutations ─────────────────────────────────────────────────────────
  const queryClient = useQueryClient()

  const addImageMutation = useMutation({
    mutationFn: addImageToActivity,
    onSuccess: (message, variables) => {
      toast.success(message || 'Imagen agregada a la actividad correctamente')
      localStorage.removeItem('selectedImage')
      setConfirmDialogOpen(false)
      setSelectedActivityId(null)
      queryClient.refetchQueries({ queryKey: [`activity-image-${variables.activityId}`] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Error al agregar la imagen')
    }
  })

  const replaceImageMutation = useMutation({
    mutationFn: ({ activityId, imageData }: any) => replaceImageActivity(activityId, imageData),
    onSuccess: (message, variables) => {
      toast.success(message || 'Imagen reemplazada correctamente')
      localStorage.removeItem('selectedImage')
      setReplaceImageDialogOpen(false)
      setConfirmDialogOpen(false)
      setSelectedActivityId(null)
      queryClient.refetchQueries({ queryKey: [`activity-image-${variables.activityId}`] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || 'Error al reemplazar la imagen')
    }
  })

  const handleConfirmSelection = async () => {
    const selectedImageStr = localStorage.getItem('selectedImage')
    if (!selectedImageStr || !selectedActivityId) {
      toast.error('Imagen o actividad no seleccionada')
      return
    }
    const selectedImage = JSON.parse(selectedImageStr)
    try {
      await articulo140Api.get(`/activities/images/by-activity/${selectedActivityId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setConfirmDialogOpen(false)
      setReplaceImageDialogOpen(true)
    } catch (error: any) {
      if (error?.response?.status === 404) {
        addImageMutation.mutate({
          activityId: selectedActivityId,
          imagePublicId: selectedImage.publicId,
          imageUrl: selectedImage.secureUrl,
          imageName: selectedImage.publicId,
        })
      } else {
        toast.error('Error al verificar la imagen existente')
      }
    }
  }

  const handleReplaceImage = () => {
    const selectedImageStr = localStorage.getItem('selectedImage')
    if (!selectedImageStr || !selectedActivityId) {
      toast.error('Imagen o actividad no seleccionada')
      return
    }
    const selectedImage = JSON.parse(selectedImageStr)
    replaceImageMutation.mutate({
      activityId: selectedActivityId,
      imageData: {
        imagePublicId: selectedImage.publicId,
        imageUrl: selectedImage.secureUrl,
        imageName: selectedImage.publicId,
      }
    })
  }

  return (
    <div className="p-4">

      <GuidedTour
        tourId={isFromFiles ? "admin-activities-files" : "admin-activities"}
        steps={isFromFiles ? ACTIVITIES_FROM_FILES_STEPS : ACTIVITIES_STEPS}
      />

      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Título y badge */}
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-teal-600 hover:bg-teal-50"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-800">
                Gestión de Actividades
              </h2>
              {hasActivities && (
                <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-teal-100 text-teal-700">
                  {totalActivities}
                </span>
              )}
            </div>
          </div>

          {/* Buscador*/}
          <div className="flex items-center gap-3 mt-2 lg:mt-0">
            <div className="w-full sm:min-w-[300px]" data-tour="activities-search">
              <CustomImput
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Buscar por título, horas, ámbitos o supervisor..."
              />
            </div>
          </div>
        </CardHeader>

        {/* Contenido */}
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <SearchX className="w-16 h-16" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                {searchQuery
                  ? "No se encontraron actividades que coincidan con tu búsqueda"
                  : "No hay actividades disponibles"
                }
              </p>
              {searchQuery && (
                <p className="text-gray-500 text-sm">
                  Intenta con otro término de búsqueda
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto" data-tour="activities-table">
              <TooltipProvider>
                <Table>
                  <TableHeader style={{ background: UNAH_BLUE_SOFT }}>
                    <TableRow>
                      <TableHead><span className="font-semibold text-black">Título</span></TableHead>
                      <TableHead><span className="font-semibold text-black">Fecha de Inicio</span></TableHead>
                      <TableHead><span className="font-semibold text-black">Fecha de Fin</span></TableHead>
                      <TableHead><span className="font-semibold text-black">Horas VOAE</span></TableHead>
                      <TableHead><span className="font-semibold text-black">Ámbitos</span></TableHead>
                      <TableHead><span className="font-semibold text-black">Supervisor</span></TableHead>
                      <TableHead className="text-center"><span className="font-semibold text-black">Acciones</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                          {searchQuery
                            ? "No se encontraron actividades que coincidan con tu búsqueda"
                            : "No hay actividades disponibles"
                          }
                        </TableCell>
                      </TableRow>
                    ) : (
                      activities.map((activity: any, index: number) => (
                        <TableRow
                          key={activity.id}
                          style={{ background: UNAH_BLUE_SOFT }}
                        >
                          <TableCell className="font-medium text-gray-800">{activity.title}</TableCell>
                          <TableCell>{activity.startDate}</TableCell>
                          <TableCell>{activity.endDate}</TableCell>
                          <TableCell>{activity.voaeHours}</TableCell>
                          <TableCell>{activity.scopes}</TableCell>
                          <TableCell>{activity.Supervisor}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              {isFromFiles ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedActivityId(activity.id)
                                        setConfirmDialogOpen(true)
                                      }}
                                      style={{ borderColor: UNAH_BLUE, color: UNAH_BLUE }}
                                      className="hover:text-white transition-all duration-200"
                                      onMouseEnter={e => { e.currentTarget.style.background = UNAH_BLUE }}
                                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                                      {...(index === 0 ? { "data-tour": "action-select" } : {})}
                                    >
                                      <Plus className="w-4 h-4 mr-1" />
                                      Seleccionar
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Asignar imagen seleccionada a esta actividad</p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      to={`/admin/activities/${activity.id}/attendance`}
                                      {...(index === 0 ? { "data-tour": "action-attendance" } : {})}
                                    >
                                      <Button
                                        style={{ background: UNAH_BLUE, color: 'white' }}
                                        className="transition-all duration-200"
                                      >
                                        <Eye className="w-4 h-4 mr-1" />
                                        Ver asistencias
                                      </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ver lista de asistencias de esta actividad</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TooltipProvider>
            </div>
          )}
        </CardContent>

        {/* Paginación */}
        {hasActivities && totalPages > 1 && (
          <CardFooter className="flex justify-center pt-4" data-tour="activities-pagination">
            <CustomPagination totalPages={totalPages} />
          </CardFooter>
        )}
      </Card>

      <ConfirmActionModal
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title="Confirmar selección"
        message="¿Estás seguro de que deseas agregar la imagen seleccionada a esta actividad?"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmSelection}
      />
      <ConfirmActionModal
        open={replaceImageDialogOpen}
        onOpenChange={setReplaceImageDialogOpen}
        title="Reemplazar imagen"
        message="Esta actividad ya tiene una imagen asignada. ¿Deseas reemplazarla con la nueva?"
        confirmText="Reemplazar"
        cancelText="Cancelar"
        onConfirm={handleReplaceImage}
      />
    </div>
  )
}