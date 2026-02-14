import { useState, useMemo, useEffect, useRef } from "react"
import { useActivities } from '@/articulo-140/hooks/activities/activities/useActivities'
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Link, useSearchParams } from "react-router"
import { ArrowLeft, Eye, Loader2, Plus } from 'lucide-react'
import { useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { addImageToActivity, replaceImageActivity } from "../../actions/addImageToActivity.action"
import { toast } from "sonner"
import { articulo140Api } from "@/articulo-140/api/articulo140Api"
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"

export const AdminActivities = () => {
  const { query } = useActivities()
  const { data, isLoading, isError } = query
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [replaceImageDialogOpen, setReplaceImageDialogOpen] = useState(false)

  const isFromFiles = searchParams.get('from') === 'files'
   
  //todo:logica de filtrado mediante la barra de busqueda, se puede filtrar por titulo, horas, ambitos o supervisor
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

    const query = searchQuery.toLowerCase().trim()
    
    return data.data.data.filter((activity: any) => 
      activity.title.toLowerCase().includes(query) ||
      activity.voaeHours.toString().includes(query) ||
      activity.scopes.toLowerCase().includes(query) ||
      activity.Supervisor.toLowerCase().includes(query)
    )
  }, [data?.data?.data, searchQuery])

  //todo: logica de manejo de agregar imagen a actividad
  const queryClient = useQueryClient();
  const addImageMutation = useMutation({
    mutationFn: addImageToActivity,
    onSuccess: (message, variables) => {
      toast.success(message || 'Imagen agregada a la actividad correctamente');
      localStorage.removeItem('selectedImage');
      setConfirmDialogOpen(false);
      setSelectedActivityId(null);

      queryClient.refetchQueries({ 
        queryKey: [`activity-image-${variables.activityId}`] 
      })
  },
  onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al agregar la imagen'
      toast.error(errorMessage)
  }
  });

   const replaceImageMutation = useMutation({
    mutationFn: ({ activityId, imageData }: any) => replaceImageActivity(activityId, imageData),
    onSuccess: (message, variables) => {
      toast.success(message || 'Imagen reemplazada correctamente')
      localStorage.removeItem('selectedImage')
      setReplaceImageDialogOpen(false)
      setConfirmDialogOpen(false)
      setSelectedActivityId(null)
    
      queryClient.refetchQueries({ 
        queryKey: [`activity-image-${variables.activityId}`] 
      })
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Error al reemplazar la imagen'
      toast.error(errorMessage)
    }
  });

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
      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link to="/admin">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-teal-600 hover:bg-teal-50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Regresar
              </Button>
            </Link>
            <CustomImput 
              ref={searchInputRef}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por título, horas, ámbitos o supervisor..."
            />
          </div>
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
            <>
              {/* Contador de resultados */}
              {searchQuery && (
                <div className="mb-4 text-sm text-gray-600">
                  {filteredActivities.length === 0 
                    ? "No se encontraron resultados" 
                    : `Mostrando ${filteredActivities.length} de ${data?.data?.data?.length} actividades`
                  }
                </div>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><span className="text-gray-700">Título</span></TableHead>
                      <TableHead><span className="text-gray-700">Fecha de Inicio</span></TableHead>
                      <TableHead><span className="text-gray-700">Fecha de Fin</span></TableHead>
                      <TableHead><span className="text-gray-700">Horas VOAE</span></TableHead>
                      <TableHead><span className="text-gray-700">Ámbitos</span></TableHead>
                      <TableHead><span className="text-gray-700">Supervisor</span></TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
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
                      filteredActivities.map((activity: any) => (
                        <TableRow
                          key={activity.id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <TableCell className="font-medium text-gray-800">
                            {activity.title}
                          </TableCell>
                          <TableCell>{activity.startDate}</TableCell>
                          <TableCell>{activity.endDate}</TableCell>
                          <TableCell>{activity.voaeHours}</TableCell>
                          <TableCell>{activity.scopes}</TableCell>
                          <TableCell>{activity.Supervisor}</TableCell>
                          <TableCell>
                        <div className="flex justify-center gap-2">
                          {isFromFiles ? (
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedActivityId(activity.id)
                                setConfirmDialogOpen(true)
                              }}
                              className="border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Seleccionar
                            </Button>
                          ) : (
                            <Link to={`/admin/activities/${activity.id}/attendance`}>
                              <Button variant="outline" className="border-teal-600 text-teal-700">
                                <Eye className="w-4 h-4 mr-1" />
                                Ver asistencias
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
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