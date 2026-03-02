import { useState, useMemo, useEffect, useRef } from "react"
import { useActivities } from '@/articulo-140/hooks/activities/activities/useActivities'
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link, useSearchParams } from "react-router"
import { ArrowLeft, Eye, Loader2, Plus } from 'lucide-react'
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { addImageToActivity, replaceImageActivity } from "../../actions/addImageToActivity.action"
import { toast } from "sonner"
import { articulo140Api } from "@/articulo-140/api/articulo140Api"
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"
import { GuidedTour } from "../../components/custom/GuidedTour"
import type { TourStep } from "../../components/custom/GuidedTour"

// ─── Pasos del tour — modo normal (Ver asistencias) ───────────────────────────
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
    pumaLabel: "¡Revisa tus actividades aquí!"
  },
  {
    target: '[data-tour="action-attendance"]',
    title: "Ver Asistencias",
    content: "Haz clic aquí para consultar la lista completa de asistentes registrados en esta actividad.",
    placement: "right",
    disableBeacon: true,
    pumaPosition: "right",
    pumaLabel: "Consulta las asistencias de cada actividad"
  },
  {
    target: '[data-tour="activities-pagination"]',
    title: "Paginación",
    content: "Navega entre páginas cuando la lista de actividades sea extensa.",
    placement: "top",
    disableBeacon: true,
    pumaMood: "celebrate",
    pumaLabel: "¡Navega por las páginas!"
  },
]

// ─── Pasos del tour — modo selección de imagen (isFromFiles) ─────────────────
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
    pumaLabel: "¡Aquí están tus actividades!"
  },
  {
    target: '[data-tour="action-select"]',
    title: "Seleccionar Actividad",
    content: "Presiona este botón para asignar la imagen que elegiste a esta actividad. Si ya tiene imagen, podrás reemplazarla.",
    placement: "left",
    disableBeacon: true,
    pumaPosition: "right",
    pumaMood: "celebrate",
    pumaLabel: "¡Selecciona una actividad!"
  },
]

export const AdminActivities = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const { query } = useActivities()
  const { data, isLoading, isError } = query

  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [replaceImageDialogOpen, setReplaceImageDialogOpen] = useState(false)

  const isFromFiles = searchParams.get('from') === 'files'

  const totalPages = data?.data?.pagination?.totalPage || 1
  const totalActivities = data?.data?.pagination?.total || 0
  const hasActivities = data?.data?.data && data.data.data.length > 0

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        next.set('page', '1')
        return next
      })
    }
  }, [searchQuery])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredActivities = useMemo(() => {
    if (!data?.data?.data) return []
    if (!searchQuery.trim()) return data.data.data

    const q = searchQuery.toLowerCase().trim()
    return data.data.data.filter((activity: any) =>
      activity.title.toLowerCase().includes(q) ||
      activity.voaeHours.toString().includes(q) ||
      activity.scopes.toLowerCase().includes(q) ||
      activity.Supervisor.toLowerCase().includes(q)
    )
  }, [data?.data?.data, searchQuery])

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

      {/* Tour guiado — cambia pasos según el modo de la vista */}
      <GuidedTour
        tourId={isFromFiles ? "admin-activities-files" : "admin-activities"}
        steps={isFromFiles ? ACTIVITIES_FROM_FILES_STEPS : ACTIVITIES_STEPS}
      />

      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

            {/* data-tour en el buscador */}
            <div className="w-full sm:w-auto sm:min-w-[300px]" data-tour="activities-search">
              <CustomImput
                ref={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar por título, horas, ámbitos o supervisor..."
              />
            </div>
          </div>

          {/* Contador de búsqueda */}
          {searchQuery && hasActivities && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-teal-50 px-4 py-2 rounded-md">
              <span className="font-medium">{filteredActivities.length}</span>
              <span>de</span>
              <span className="font-medium">{totalActivities}</span>
              <span>actividades encontradas</span>
            </div>
          )}
        </CardHeader>

        {/* Contenido */}
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-6">
              Error al cargar las actividades
            </p>
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
                    {filteredActivities.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                          {searchQuery
                            ? "No se encontraron actividades que coincidan con tu búsqueda"
                            : "No hay actividades disponibles"
                          }
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredActivities.map((activity: any, index: number) => (
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
                                //  data-tour en primer botón Seleccionar (modo imagen)
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
                                // data-tour en primer botón Ver asistencias (modo normal)
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

        {/* data-tour en la paginación */}
        {!searchQuery && hasActivities && totalPages > 1 && (
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