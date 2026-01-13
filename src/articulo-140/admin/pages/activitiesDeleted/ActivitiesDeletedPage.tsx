import { useState } from "react"
import { useDeletedActivities } from "@/articulo-140/hooks/activities/admin/useDeletedActivities"
import { restoreDeletedActivity } from "@/articulo-140/admin/actions/restoreDeletedActivity"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Link } from "react-router"
import { ArrowLeft, RotateCcw, Loader2 } from 'lucide-react'
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const ActivitiesDeletedPage = () => {
  const queryClient = useQueryClient()
  const { query } = useDeletedActivities()
  const { data, isLoading, isError } = query
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [activityToRestore, setActivityToRestore] = useState<string | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleRestoreClick = (activityId: string) => {
    setActivityToRestore(activityId)
    setIsConfirmOpen(true)
  }

  const handleConfirmRestore = async () => {
    if (activityToRestore) {
      setIsRestoring(true)
      setIsConfirmOpen(false) 
      
      try {
        await restoreDeletedActivity(activityToRestore)
  
        await queryClient.invalidateQueries({ queryKey: ['deletedActivities'] })
        
        toast.success("Actividad restaurada exitosamente")
        
        setActivityToRestore(null)
      } catch (error) {
        toast.error("Error al restaurar la actividad. Por favor, intenta nuevamente.")
        console.error("Error al restaurar actividad:", error)
      } finally {
        setIsRestoring(false)
      }
    }
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
            <CustomImput />
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
              Error al cargar las actividades eliminadas
            </p>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <RotateCcw className="w-16 h-16" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                No hay actividades eliminadas
              </p>
              <p className="text-gray-500 text-sm">
                Todas las actividades están activas en el sistema
              </p>
            </div>
          ) : (
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
                  {data.data.map((activity: any) => (
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
                      <TableCell>{activity.supervisor}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            className="bg-teal-600 hover:bg-teal-700 text-white flex items-center font-medium shadow-sm transition-all duration-200"
                            onClick={() => handleRestoreClick(activity.id)}
                            disabled={isRestoring}
                          >
                            {isRestoring ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4 mr-1" />
                            )}
                            Restaurar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
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