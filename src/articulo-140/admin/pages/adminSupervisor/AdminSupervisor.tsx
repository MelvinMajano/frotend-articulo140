import { useSupervisors } from "@/articulo-140/hooks/activities/admin/useSupervisors"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, PenLine, Trash2, PlusCircle } from "lucide-react"
import { Link } from "react-router"

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
          <Link to="/admin/supervisor/create">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center">
              <PlusCircle className="w-4 h-4 mr-1" />
              Agregar Supervisor
            </Button>
          </Link>
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
                <TableHeader>
                  <TableRow>
                    <TableHead># Cuenta</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Identidad</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((supervisor) => (
                    <TableRow key={supervisor.accountNumber}>
                      <TableCell>{supervisor.accountNumber}</TableCell>
                      <TableCell>{supervisor.name}</TableCell>
                      <TableCell>{supervisor.email}</TableCell>
                      <TableCell>{supervisor.identityNumber}</TableCell>
                      <TableCell>{supervisor.career}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            className="border-teal-600 text-teal-600 hover:bg-teal-50 flex items-center"
                          >
                            <PenLine className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
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
    </div>
  )
}
