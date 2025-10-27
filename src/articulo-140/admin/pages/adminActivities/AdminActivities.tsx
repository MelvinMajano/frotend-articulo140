import { useActivities } from '@/articulo-140/hooks/activities/useActivities'
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Link } from "react-router"
import { ArrowLeft, Eye, Loader2 } from 'lucide-react'

export const AdminActivities = () => {
  const { query } = useActivities()
  const { data, isLoading, isError } = query

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
              Error al cargar las actividades
            </p>
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
                  {data?.message.map((activity) => (
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
                        <div className="flex justify-center gap-2 relative group">
                        <Link to={`/admin/activities/${activity.id}/attendance`}>
                          <Button
                            variant="outline"
                            className="relative overflow-hidden border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white flex items-center font-medium shadow-sm transition-all duration-200"
                            
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver asistencias
                            {/* Efecto de onda */}
                            <span className="absolute inset-0 bg-teal-100 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                          </Button>
                          </Link> 
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
    </div>
  )
}
