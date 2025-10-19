import { useState } from "react"
import { useCareers } from "@/articulo-140/hooks/activities/admin/useCareers"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, PenLine, Trash2, PlusCircle, ArrowLeft, AlertTriangle } from "lucide-react"
import { Link } from "react-router"
import { MinimalModal } from "@/components/custom/CustomModal"

export const AdminCareers = () => {
  const { query } = useCareers()
  const { data, isLoading, isError } = query

  const [selectedCareer, setSelectedCareer] = useState<any | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const handleDeleteClick = (career: any) => {
    setSelectedCareer(career)
    setOpenModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      // 🔧 TODO: Implementar llamada DELETE al backend
      console.log("Eliminando carrera:", selectedCareer)
      setOpenModal(false)
      setSelectedCareer(null)
    } catch (error) {
      console.error("Error al eliminar carrera:", error)
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
                    <TableHead><span className="text-gray-700"># Código</span></TableHead>
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
                          <Button
                            onClick={() => handleDeleteClick(career)}
                            className="bg-red-600 hover:bg-red-700 text-white flex items-center"
                          >
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

      {/* Modal de confirmación */}
      <MinimalModal open={openModal} onOpenChange={setOpenModal} trigger={<></>}>
        <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-red-100 text-red-600 p-4 rounded-full">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            ¿Deseas eliminar esta carrera?
          </h2>
          <p className="text-gray-600">
            Esta acción no se puede deshacer. Se eliminará permanentemente la carrera{" "}
            <span className="font-semibold text-gray-900">
              {selectedCareer?.name}
            </span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setOpenModal(false)}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Sí, eliminar
            </Button>
          </div>
        </div>
      </MinimalModal>
    </div>
  )
}
