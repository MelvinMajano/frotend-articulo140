import { useState, useMemo, useEffect, useRef } from "react"
import { useDeletedActivities } from "@/articulo-140/hooks/activities/admin/useDeletedActivities"
import { restoreDeletedActivity } from "@/articulo-140/admin/actions/restoreDeletedActivity"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "react-router"
import { ArrowLeft, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react'
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { useSearchParams } from "react-router"

export const ActivitiesDeletedPage = () => {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const limit = 5
  
  const { query } = useDeletedActivities(limit, currentPage)
  const { data, isLoading, isError } = query
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [activityToRestore, setActivityToRestore] = useState<string | null>(null)
  const [restoringActivityId, setRestoringActivityId] = useState<string | null>(null)
  const [fadingOutId, setFadingOutId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  const totalPages = data?.data?.pagination?.totalPage || 1
  const totalActivities = data?.data?.pagination?.total || 0
  const hasActivities = data?.data?.data && data.data.data.length > 0

  // Resetear a página 1 cuando cambie la búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchParams({ page: '1' })
    }
  }, [searchQuery, setSearchParams])

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
    
    const activities = data.data.data
    
    if (!searchQuery.trim()) return activities

    const query = searchQuery.toLowerCase().trim()
    
    return activities.filter((activity: any) => 
      activity.title.toLowerCase().includes(query) ||
      activity.voaeHours.toString().includes(query) ||
      (Array.isArray(activity.scopes) 
        ? activity.scopes.join(' ').toLowerCase().includes(query)
        : activity.scopes.toString().toLowerCase().includes(query)) ||
      activity.supervisor.toLowerCase().includes(query)
    )
  }, [data?.data?.data, searchQuery])

  const handleRestoreClick = (activityId: string) => {
    setActivityToRestore(activityId)
    setIsConfirmOpen(true)
  }

  const handleConfirmRestore = async () => {
    if (activityToRestore) {
      setRestoringActivityId(activityToRestore)
      setIsConfirmOpen(false) 
      
      try {
        await restoreDeletedActivity(activityToRestore)
        
        // Animar salida antes de actualizar
        setFadingOutId(activityToRestore)
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Invalidar queries primero para actualizar los datos
        await queryClient.invalidateQueries({ queryKey: ['deletedActivities'] })
        
        // Si era la última actividad de la página actual y no es la página 1, ir a la página anterior
        const remainingActivities = filteredActivities.length - 1
        if (remainingActivities === 0 && currentPage > 1) {
          setSearchParams({ page: String(currentPage - 1) })
        } else {
          // Si estamos en página 1 o hay más actividades, mantener página 1
          setSearchParams({ page: '1' })
        }
        
        toast.success("Actividad restaurada exitosamente")
        setActivityToRestore(null)
      } catch (error) {
        toast.error("Error al restaurar la actividad. Por favor, intenta nuevamente.")
      } finally {
        setRestoringActivityId(null)
        setFadingOutId(null)
      }
    }
  }

  return (
    <div className="p-4">
      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Título y badge de contador */}
            <div className="flex items-center gap-3">
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Actividades Eliminadas
                </h2>
                {hasActivities && (
                  <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700">
                    {totalActivities}
                  </span>
                )}
              </div>
            </div>

            {/* Buscador */}
            <div className="w-full sm:w-auto sm:min-w-[300px]">
              <CustomImput 
                ref={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar por título, horas, ámbitos o supervisor..."
              />
            </div>
          </div>

          {/* Contador de búsqueda (solo cuando hay búsqueda activa) */}
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
              Error al cargar las actividades eliminadas
            </p>
          ) : !hasActivities ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="relative mb-6">
                {/* Círculo de fondo con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-green-100 rounded-full blur-2xl opacity-50"></div>
                {/* Ícono */}
                <div className="relative bg-gradient-to-br from-teal-500 to-green-500 p-6 rounded-full shadow-lg">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Todo en orden!
              </h3>
              <p className="text-gray-600 text-center mb-1">
                No hay actividades eliminadas
              </p>
              <p className="text-gray-500 text-sm text-center max-w-md">
                Todas las actividades están activas en el sistema. Las actividades eliminadas aparecerán aquí.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <TooltipProvider>
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
                              : "No hay actividades eliminadas"
                            }
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredActivities.map((activity: any) => {
                          const isRestoring = restoringActivityId === activity.id
                          
                          return (
                            /* Animación de salida */
                            <TableRow
                              key={activity.id}
                              className={`hover:bg-gray-50 transition-all duration-300 ${
                                fadingOutId === activity.id ? 'opacity-0 scale-95' : 'opacity-100'
                              }`}
                            >
                              <TableCell className="font-medium text-gray-800">
                                {activity.title}
                              </TableCell>
                              <TableCell>{activity.startDate}</TableCell>
                              <TableCell>{activity.endDate}</TableCell>
                              <TableCell>{activity.voaeHours}</TableCell>
                              <TableCell>
                                {Array.isArray(activity.scopes) 
                                  ? activity.scopes.join(', ') 
                                  : activity.scopes}
                              </TableCell>
                              <TableCell>{activity.supervisor}</TableCell>
                              <TableCell>
                                <div className="flex justify-center gap-2">
                                  {/* Tooltip*/}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        className="bg-teal-600 hover:bg-teal-700 text-white flex items-center font-medium shadow-sm transition-all duration-200"
                                        onClick={() => handleRestoreClick(activity.id)}
                                        disabled={restoringActivityId !== null}
                                      >
                                        {isRestoring ? (
                                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        ) : (
                                          <RotateCcw className="w-4 h-4 mr-1" />
                                        )}
                                        Restaurar
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Reactivar actividad en el sistema</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </TooltipProvider>
              </div>
            </>
          )}
        </CardContent>

        {/* Footer con paginación - solo mostrar si no hay búsqueda activa */}
        {!searchQuery && hasActivities && (
          <CardFooter className="flex justify-center pt-4">
            <CustomPagination totalPages={totalPages} />
          </CardFooter>
        )}
      </Card>

      {/* Modal de Confirmación de Restaurar */}
      <ConfirmActionModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Restaurar actividad"
        message={
          <>
            ¿Estás seguro de que deseas <strong>restaurar</strong> esta actividad?
            <br />
            Esta acción reactivará la actividad en el sistema.
          </>
        }
        confirmText="Restaurar"
        cancelText="Cancelar"
        onConfirm={handleConfirmRestore}
      />
    </div>
  )
}