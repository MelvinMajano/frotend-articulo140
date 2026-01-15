import { useParams, Link } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { getEstudentsIncriptionsActivity } from "@/articulo-140/supervisor/actions/GetstudentsInscriptionsActivity.actios"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

export const ActivityAttendance = () => {
  const {id} = useParams();
  const query = useQuery({
    queryKey: ["students",{id}],
    queryFn: () => getEstudentsIncriptionsActivity(id),
    retry:false
  })
  const { data, isLoading, isError } = query

  return (
    <div className="p-4">
      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link to="/admin/activities">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-teal-600 hover:bg-teal-50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Regresar
              </Button>
            </Link>
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
              Error al cargar la asistencia
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Número de cuenta</TableHead>
                    <TableHead>Hora de entrada</TableHead>
                    <TableHead>Hora de salida</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.data?.length ?? 0) > 0 ? (
                    data?.data?.map((student) => (
                      <TableRow
                        key={student.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <TableCell className="font-medium text-gray-800">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.accountNumber}</TableCell>
                        <TableCell>
                          {new Date(student.entryTime).toLocaleString("es-HN")}
                        </TableCell>
                        <TableCell>
                          {new Date(student.exitTime).toLocaleString("es-HN")}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 py-6"
                      >
                        No hay registros de asistencia aún
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
