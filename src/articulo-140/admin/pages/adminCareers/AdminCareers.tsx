import { useCareers } from "@/articulo-140/hooks/activities/admin/useCareers"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, PenLine, Trash2, PlusCircle, ArrowLeft } from "lucide-react"
import { Link } from "react-router"

export const AdminCareers = () => {
    const { query } = useCareers()
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
          <Link to="/admin/careers/create">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center">
              <PlusCircle className="w-4 h-4 mr-1" />
              Agregar Carrera
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
            <p className="text-red-500 text-center py-6">Error al cargar las carreras</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><span className="text-gray-700"># Codigo</span></TableHead>
                    <TableHead><span className="text-gray-700">Nombre</span></TableHead>
                    <TableHead><span className="text-gray-700">Facultad</span></TableHead>
                    <TableHead className="text-center"><span className="text-gray-700">Acciones</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((career) => (
                    <TableRow key={career.code}>
                      <TableCell><span className="font-medium">{career.code}</span></TableCell>
                      <TableCell>{career.name}</TableCell>
                      <TableCell>{career.faculty}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Link to={`/admin/careers/edit/${career.code}`}>
                              <Button
                                variant="outline"
                                className="border-teal-600 text-teal-600 hover:bg-teal-50 flex items-center"
                              >
                                <PenLine className="w-4 h-4 mr-1" />
                                Editar
                              </Button>
                            </Link>
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