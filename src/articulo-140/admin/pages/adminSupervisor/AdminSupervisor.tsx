import { useState } from "react"
import { useSupervisors } from "@/articulo-140/hooks/activities/admin/useSupervisors"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, PenLine, Lock, PlusCircle, ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"

export const AdminSupervisor = () => {
  const { query } = useSupervisors()
  const { data, isLoading, isError } = query

  const [selectedSupervisor, setSelectedSupervisor] = useState<any | null>(null)
  const [openModal, setOpenModal] = useState(false)

  const handleDisableClick = (supervisor: any) => {
    setSelectedSupervisor(supervisor)
    setOpenModal(true)
  }

  const handleConfirmDisable = async () => {
    try {

      // TODO: Aquí irá la lógica para deshabilitar el supervisor

      setOpenModal(false)
      setSelectedSupervisor(null)
    } catch (error) {
      console.error("Error al eliminar supervisor:", error)
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
                    <TableHead><span className="text-gray-700"># Cuenta</span></TableHead>
                    <TableHead><span className="text-gray-700">Nombre</span></TableHead>
                    <TableHead><span className="text-gray-700">Correo</span></TableHead>
                    <TableHead><span className="text-gray-700">Identidad</span></TableHead>
                    <TableHead><span className="text-gray-700">Carrera</span></TableHead>
                    <TableHead className="text-center"><span className="text-gray-700">Acciones</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((supervisor) => (
                    <TableRow key={supervisor.accountNumber}>
                      <TableCell><span className="font-medium">{supervisor.accountNumber}</span></TableCell>
                      <TableCell>{supervisor.name}</TableCell>
                      <TableCell>{supervisor.email}</TableCell>
                      <TableCell>{supervisor.identityNumber}</TableCell>
                      <TableCell>{supervisor.career}</TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Link to={`/admin/supervisor/edit/${supervisor.accountNumber}`}>
                            <Button
                              variant="outline"
                              className="border-teal-600 text-teal-600 hover:bg-teal-50 flex items-center"
                            >
                              <PenLine className="w-4 h-4 mr-1" />
                              Editar
                            </Button>
                          </Link>
                          <Button
                            onClick={() => handleDisableClick(supervisor)}
                            className="bg-gray-500 hover:bg-gray-600 text-white flex items-center"
                          >
                            <Lock className="w-4 h-4 mr-1" />
                            Deshabilitar
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

      {/* Modal de confirmación para deshabilitar supervisor */}
      <ConfirmActionModal
        open={openModal}
        onOpenChange={setOpenModal}
        title="¿Deseas deshabilitar este supervisor?"
        message={
          <>
            Esta acción no se puede deshacer. El supervisor{" "}
            <span className="font-semibold text-gray-900">
              {selectedSupervisor?.name}
            </span>{" "}
            será deshabilitado.
          </>
        }
        confirmText="Sí, deshabilitar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDisable}
      />
    </div>
  )
}
