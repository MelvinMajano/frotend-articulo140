import { useState, useMemo, useEffect, useRef } from "react"
import { useSupervisors } from "@/articulo-140/hooks/activities/admin/useSupervisors"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteSupervisor, restoreSupervisor } from "../../actions/softDeleteSupervisor"
import { Loader2, PenLine, Lock, PlusCircle, ArrowLeft, Unlock } from "lucide-react"
import { Link } from "react-router"
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"
import { toast } from "sonner"

export const AdminSupervisor = () => {
  const { query } = useSupervisors()
  const { data, isLoading, isError } = query

  const [selectedSupervisor, setSelectedSupervisor] = useState<any | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [isRestoreAction, setIsRestoreAction] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Atajo de teclado Cmd+K / Ctrl+K
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

  const filteredSupervisors = useMemo(() => {
    if (!data?.data) return []
    
    if (!searchQuery.trim()) return data.data

    const query = searchQuery.toLowerCase().trim()
    
    return data.data.filter((supervisor) => 
      supervisor.accountNumber.toString().toLowerCase().includes(query) ||
      supervisor.name.toLowerCase().includes(query) ||
      supervisor.email.toLowerCase().includes(query) ||
      supervisor.identityNumber.toLowerCase().includes(query) ||
      supervisor.career.toLowerCase().includes(query)
    )
  }, [data?.data, searchQuery])

  const handleActionClick = (supervisor: any) => {
    setSelectedSupervisor(supervisor)
    setIsRestoreAction(supervisor.isDeleted === "true")
    setOpenModal(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedSupervisor) return

    try {
      if (isRestoreAction) {
        await restoreSupervisor(selectedSupervisor.accountNumber)
        toast.success(`Supervisor ${selectedSupervisor.name} habilitado correctamente`)
      } else {
        await deleteSupervisor(selectedSupervisor.accountNumber)
        toast.success(`Supervisor ${selectedSupervisor.name} deshabilitado correctamente`)
      }

      query.refetch?.()
    } catch (error) {
      toast.error(`Error al ${isRestoreAction ? "habilitar" : "deshabilitar"} el supervisor`)
    } finally {
      setOpenModal(false)
      setSelectedSupervisor(null)
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
            <CustomImput 
              ref={searchInputRef}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por cuenta, nombre, correo, identidad o carrera..."
            />
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
            <>
              {/* Contador de resultados */}
              {searchQuery && (
                <div className="mb-4 text-sm text-gray-600">
                  {filteredSupervisors.length === 0 
                    ? "No se encontraron resultados" 
                    : `Mostrando ${filteredSupervisors.length} de ${data?.data.length} supervisores`
                  }
                </div>
              )}

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
                    {filteredSupervisors.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                          {searchQuery 
                            ? "No se encontraron supervisores que coincidan con tu búsqueda" 
                            : "No hay supervisores registrados"
                          }
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSupervisors.map((supervisor) => (
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

                              {supervisor.isDeleted === "true" ? (
                                <Button
                                  onClick={() => handleActionClick(supervisor)}
                                  className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                                >
                                  <Unlock className="w-4 h-4 mr-1" />
                                  Habilitar
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleActionClick(supervisor)}
                                  className="bg-gray-500 hover:bg-gray-600 text-white flex items-center"
                                >
                                  <Lock className="w-4 h-4 mr-1" />
                                  Deshabilitar
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <ConfirmActionModal
        open={openModal}
        onOpenChange={setOpenModal}
        title={
          isRestoreAction
            ? "¿Deseas habilitar este supervisor?"
            : "¿Deseas deshabilitar este supervisor?"
        }
        message={
          <>
            {isRestoreAction ? (
              <>
                El supervisor{" "}
                <span className="font-semibold text-gray-900">
                  {selectedSupervisor?.name}
                </span>{" "}
                será habilitado nuevamente.
              </>
            ) : (
              <>
                Esta acción no se puede deshacer. El supervisor{" "}
                <span className="font-semibold text-gray-900">
                  {selectedSupervisor?.name}
                </span>{" "}
                será deshabilitado.
              </>
            )}
          </>
        }
        confirmText={isRestoreAction ? "Sí, habilitar" : "Sí, deshabilitar"}
        cancelText="Cancelar"
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}