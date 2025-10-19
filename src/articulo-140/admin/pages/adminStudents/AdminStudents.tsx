import { useStudents } from "@/articulo-140/hooks/activities/admin/useStudents"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, UserRoundSearch, PlusCircle, ArrowLeft } from "lucide-react"
import { Link } from "react-router"

export const AdminStudents = () => {
  const { query } = useStudents()
  const { data, isLoading, isError } = query

  return (
    <div className="p-4">
      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full">
           <Link to = '/admin'>
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
            <p className="text-red-500 text-center py-6">Error al cargar los estudiantes</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <table className="min-w-full border-collapse">
                  <TableHeader>
                    <TableRow>
                      <TableHead><span className="text-gray-700"># Cuenta</span></TableHead>
                      <TableHead><span className="text-gray-700">Nombre</span></TableHead>
                      <TableHead><span className="text-gray-700">Correo</span></TableHead>
                      <TableHead><span className="text-gray-700">Identidad</span></TableHead>
                      <TableHead><span className="text-gray-700">Carrera</span></TableHead>
                      <TableHead className="text-center"><span className="text-gray-700">Acciones</span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.map((student) => (
                      <TableRow key={student.accountNumber}>
                        <TableCell>
                          <span className="font-medium">{student.accountNumber}</span>
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.identityNumber}</TableCell>
                        <TableCell>{student.career}</TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                           <Link to={`/admin/students/${student.id}`}>
                              <Button
                                variant="outline"
                                className="border-teal-600 text-teal-600 hover:bg-teal-50 flex items-center"
                              >
                                 <UserRoundSearch className="w-4 h-4 mr-1" />
                                Consultar
                              </Button>
                            </Link>
                           <Link to={`/admin/students/${student.id}/addActivity`}>
                              <Button
                                className="bg-teal-600 hover:bg-teal-700 text-white flex items-center"
                              >
                                <PlusCircle className="w-4 h-4 mr-1" />
                                Agregar actividad
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </table>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}