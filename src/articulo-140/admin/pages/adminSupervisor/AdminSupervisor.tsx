import { useState, useMemo, useEffect, useRef } from "react"
import { useSupervisors } from "@/articulo-140/hooks/activities/admin/useSupervisors"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { deleteSupervisor, restoreSupervisor } from "../../actions/softDeleteSupervisor"
import { Loader2, PenLine, Lock, PlusCircle, ArrowLeft, Unlock, UserCog } from "lucide-react"
import { Link, useSearchParams } from "react-router"
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"
import { toast } from "sonner"
import { CustomPagination } from "@/components/custom/CustomPagination"

export const AdminSupervisor = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const limit = 10
  
  const { query } = useSupervisors(limit, currentPage)
  const { data, isLoading, isError } = query

  const [selectedSupervisor, setSelectedSupervisor] = useState<any | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [isRestoreAction, setIsRestoreAction] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [changingStateId, setChangingStateId] = useState<string | null>(null)
  const [animatingId, setAnimatingId] = useState<string | null>(null)
  
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Resetear a página 1 cuando cambie la búsqueda
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchParams({ page: '1' })
    }
  }, [searchQuery, setSearchParams])

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
    if (!data?.data?.data) return []
    
    const supervisors = data.data.data
    
    if (!searchQuery.trim()) return supervisors

    const query = searchQuery.toLowerCase().trim()
    
    return supervisors.filter((supervisor) => 
      supervisor.accountNumber.toString().toLowerCase().includes(query) ||
      supervisor.name.toLowerCase().includes(query) ||
      supervisor.email.toLowerCase().includes(query) ||
      supervisor.identityNumber.toLowerCase().includes(query) ||
      supervisor.career.toLowerCase().includes(query)
    )
  }, [data?.data?.data, searchQuery])

  const handleActionClick = (supervisor: any) => {
    setSelectedSupervisor(supervisor)
    setIsRestoreAction(supervisor.isDeleted === "true")
    setOpenModal(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedSupervisor) return

    const supervisorId = selectedSupervisor.accountNumber.toString()
    setChangingStateId(supervisorId)
    setOpenModal(false)

    try {
      // Animación previa
      setAnimatingId(supervisorId)
      await new Promise(resolve => setTimeout(resolve, 400))

      if (isRestoreAction) {
        await restoreSupervisor(selectedSupervisor.accountNumber)
        toast.success(`Supervisor ${selectedSupervisor.name} habilitado correctamente`)
      } else {
        await deleteSupervisor(selectedSupervisor.accountNumber)
        toast.success(`Supervisor ${selectedSupervisor.name} deshabilitado correctamente`)
      }

      await query.refetch()
      
      await new Promise(resolve => setTimeout(resolve, 200))
      
    } catch (error) {
      toast.error(`Error al ${isRestoreAction ? "habilitar" : "deshabilitar"} el supervisor`)
    } finally {
      setChangingStateId(null)
      setAnimatingId(null)
      setSelectedSupervisor(null)
    }
  }

  // Total de páginas y supervisores desde la paginación del backend
  const totalPages = data?.data?.pagination?.totalPage || 1
  const totalSupervisors = data?.data?.pagination?.total || 0
  const hasSupervisors = data?.data?.data && data.data.data.length > 0

  return (
    <div className="p-4">
      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className= "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Primera fila: Título con badge y buscador */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Título y badge */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Gestión de Supervisores
                </h2>
                {hasSupervisors && (
                  <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-teal-100 text-teal-700">
                    {totalSupervisors}
                  </span>
                )}
              </div>
            </div>

            {/* Buscador*/}
            <div className="w-full lg:w-auto lg:min-w-[320px]">
              <CustomImput 
                ref={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar supervisores..."
              />
            </div>
          </div>

          {/*Botón Agregar y contador de búsqueda */}
          <div className="flex items-center justify-between">
            <Link to="/admin/supervisor/create">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center shadow-sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Agregar Supervisor
              </Button>
            </Link>

            {/* Contador de búsqueda (solo cuando hay búsqueda activa) */}
            {searchQuery && hasSupervisors && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-teal-50 px-4 py-2 rounded-md">
                <span className="font-medium">{filteredSupervisors.length}</span>
                <span>de</span>
                <span className="font-medium">{totalSupervisors}</span>
                <span>supervisores encontrados</span>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Contenido */}
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-6">Error al cargar los supervisores</p>
          ) : !hasSupervisors ? (
            /* Estado vacío*/
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <UserCog className="w-16 h-16" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                No hay supervisores registrados
              </p>
              <p className="text-gray-500 text-sm">
                Agrega un supervisor para comenzar
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <TooltipProvider>
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
                        filteredSupervisors.map((supervisor) => {
                          const supervisorId = supervisor.accountNumber.toString()
                          const isChangingState = changingStateId === supervisorId
                          const isAnimating = animatingId === supervisorId
                          const isDisabled = supervisor.isDeleted === "true"

                          return (
                            /* Animación mejorada de cambio de estado */
                            <TableRow 
                              key={supervisor.accountNumber}
                              className={`transition-all duration-400 ${
                                isAnimating 
                                  ? 'animate-pulse bg-yellow-50 scale-[0.98]' 
                                  : isDisabled 
                                    ? 'bg-red-50/30 hover:bg-red-50/50' 
                                    : 'bg-white hover:bg-gray-50'
                              }`}
                            >
                              <TableCell>
                                <span className={`font-medium ${isDisabled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                  {supervisor.accountNumber}
                                </span>
                              </TableCell>
                              <TableCell className={isDisabled ? 'text-gray-400' : 'text-gray-900'}>
                                {supervisor.name}
                              </TableCell>
                              <TableCell className={isDisabled ? 'text-gray-400' : 'text-gray-600'}>
                                {supervisor.email}
                              </TableCell>
                              <TableCell className={isDisabled ? 'text-gray-400' : 'text-gray-600'}>
                                {supervisor.identityNumber}
                              </TableCell>
                              <TableCell className={isDisabled ? 'text-gray-400' : 'text-gray-600'}>
                                {supervisor.career}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center gap-2">
                                  {/* Tooltip para Editar */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link to={`/admin/supervisor/edit/${supervisor.accountNumber}`}>
                                        <Button
                                          variant="outline"
                                          className="border-teal-600 text-teal-600 hover:bg-teal-50 flex items-center font-medium shadow-sm transition-all duration-200"
                                          disabled={changingStateId !== null}
                                        >
                                          <PenLine className="w-4 h-4 mr-1" />
                                          Editar
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Editar información del supervisor</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Tooltip para Habilitar/Deshabilitar */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      {isDisabled ? (
                                        <Button
                                          onClick={() => handleActionClick(supervisor)}
                                          className="bg-green-600 hover:bg-green-700 text-white flex items-center font-medium shadow-sm transition-all duration-200"
                                          disabled={changingStateId !== null}
                                        >
                                          {isChangingState ? (
                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                          ) : (
                                            <Unlock className="w-4 h-4 mr-1" />
                                          )}
                                          Habilitar
                                        </Button>
                                      ) : (
                                        <Button
                                          onClick={() => handleActionClick(supervisor)}
                                          className="bg-gray-500 hover:bg-gray-600 text-white flex items-center font-medium shadow-sm transition-all duration-200"
                                          disabled={changingStateId !== null}
                                        >
                                          {isChangingState ? (
                                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                          ) : (
                                            <Lock className="w-4 h-4 mr-1" />
                                          )}
                                          Deshabilitar
                                        </Button>
                                      )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{isDisabled ? "Habilitar supervisor" : "Deshabilitar supervisor"}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </TooltipProvider>
              </div>
            </>
          )}
        </CardContent>

        {/* Footer con paginación - solo mostrar si no hay búsqueda activa */}
        {!searchQuery && hasSupervisors && (
          <CardFooter className="flex justify-center pt-4">
            <CustomPagination totalPages={totalPages} />
          </CardFooter>
        )}
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