import { useSupervisors } from "@/articulo-140/hooks/activities/admin/useSupervisors"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, PenLine, PlusCircle, Trash2 } from "lucide-react"

export const AdminSupervisor = () => {
  const { query } = useSupervisors()
  const { data, isLoading, isError } = query

  return (
    <div className="p-4">
      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <CustomImput />
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center">
            <PlusCircle className="w-4 h-4 mr-1" />
            Agregar Supervisor
          </Button>
        </CardHeader>

        {/* Contenido */}
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-6">Error al cargar los supervisores</p>
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
                      <TableHead><span className="text-gray-700 text-center">Acciones</span></TableHead>
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
                            <Button
                              variant="outline"
                              className="border-teal-600 text-teal-600 hover:bg-teal-50 flex items-center"
                            >
                              <PenLine className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              className="bg-teal-600 hover:bg-teal-700 text-white flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Eliminar
                            </Button>
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
