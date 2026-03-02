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
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"
import { GuidedTour } from "../../components/custom/GuidedTour"
import type { TourStep } from "../../components/custom/GuidedTour"

// ─── Pasos del tour ───────────────────────────────────────────────────────────

const SUPERVISOR_STEPS: TourStep[] = [
  {
    target: "body",
    title: "👋 ¡Bienvenido!",
    content: "Este es el módulo de Gestión de Supervisores. Aquí puedes administrar los supervisores del sistema.",
    placement: "center",
    disableBeacon: true,
    pumaLabel: "¡Hola!",
  },
  {
    target: '[data-tour="supervisor-search"]',
    title: "Buscador",
    content: "Filtra supervisores por nombre, número de cuenta, correo, identidad o carrera. Usa Ctrl+K para enfocarlo rápidamente.",
    placement: "bottom",
    disableBeacon: true,
    pumaLabel: "Busca aquí",
  },
  {
    target: '[data-tour="add-supervisor-btn"]',
    title: "Agregar Supervisor",
    content: "Haz clic aquí para registrar un nuevo supervisor en el sistema.",
    placement: "bottom",
    disableBeacon: true,
    pumaPosition: "left",
    pumaMood: "point",
    pumaLabel: "¡Agregar!",
  },
  {
    target: '[data-tour="supervisors-table"]',
    title: "Tabla de Supervisores",
    content: "Aquí se listan todos los supervisores. Los deshabilitados aparecen en rojo con su nombre tachado.",
    placement: "top",
    disableBeacon: true,
    pumaMood: "inspect",
    pumaLabel: "¡Aquí están los supervisores!",
  },
  {
    target: '[data-tour="action-edit"]',
    title: "Editar Supervisor",
    content: "Usa este botón para modificar la información del supervisor: nombre, correo, carrera y más.",
    placement: "left",
    disableBeacon: true,
    pumaPosition: "right",
    pumaMood: "look_right",
    pumaLabel: "Editar",
  },
  {
    target: '[data-tour="action-toggle"]',
    title: "Habilitar / Deshabilitar",
    content: "Este botón cambia el estado del supervisor. Si está activo lo deshabilita, y si está deshabilitado lo vuelve a habilitar.",
    placement: "left",
    disableBeacon: true,
    pumaPosition: "right",
    pumaMood: "look_right",
    pumaLabel: "Estado",
  },
  {
    target: '[data-tour="supervisor-pagination"]',
    title: "¡Todo listo! 🎉",
    content: "Ya conoces el módulo. Usa la paginación para navegar entre páginas cuando haya muchos supervisores.",
    placement: "top",
    disableBeacon: true,
    pumaMood: "celebrate",
    pumaLabel: "¡Listo para gestionar!",
  },
]

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

      {/*  Tour guiado — primera vez automático, F1 para repetir */}
      <GuidedTour tourId="admin-supervisors" steps={SUPERVISOR_STEPS} />

      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Título y badge */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600"
                  onMouseEnter={e => { e.currentTarget.style.color = UNAH_BLUE; e.currentTarget.style.background = UNAH_BLUE_SOFT }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = '' }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Gestión de Supervisores
                </h2>
                {hasSupervisors && (
                  <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full" style={{ background: UNAH_BLUE_SOFT, color: UNAH_BLUE }}>
                    {totalSupervisors}
                  </span>
                )}
              </div>
            </div>

            {/* data-tour en el buscador */}
            <div className="w-full lg:w-auto lg:min-w-[320px]" data-tour="supervisor-search">
              <CustomImput 
                ref={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar supervisores..."
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* data-tour en el botón agregar */}
            <Link to="/admin/supervisor/create" data-tour="add-supervisor-btn">
              <Button className="text-white flex items-center shadow-sm" style={{ background: UNAH_BLUE }}>
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
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: UNAH_BLUE }} />
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
              {/* data-tour en la tabla */}
              <div className="overflow-x-auto" data-tour="supervisors-table">
                <TooltipProvider>
                  <Table>
                    <TableHeader style={{ background: UNAH_BLUE_SOFT }}>
                      <TableRow>
                        <TableHead><span className="font-semibold text-black"># Cuenta</span></TableHead>
                        <TableHead><span className="font-semibold text-black">Nombre</span></TableHead>
                        <TableHead><span className="font-semibold text-black">Correo</span></TableHead>
                        <TableHead><span className="font-semibold text-black">Identidad</span></TableHead>
                        <TableHead><span className="font-semibold text-black">Carrera</span></TableHead>
                        <TableHead className="text-center"><span className="font-semibold text-black">Acciones</span></TableHead>
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
                        filteredSupervisors.map((supervisor, index) => {
                          const supervisorId = supervisor.accountNumber.toString()
                          const isChangingState = changingStateId === supervisorId
                          const isAnimating = animatingId === supervisorId
                          const isDisabled = supervisor.isDeleted === "true"

                          return (
                            /* Animación mejorada de cambio de estado */
                            <TableRow 
                              key={supervisor.accountNumber}
                              style={!isAnimating && !isDisabled ? { background: UNAH_BLUE_SOFT } : undefined}
                              className={`transition-all duration-400 ${
                                isAnimating 
                                  ? 'animate-pulse bg-yellow-50 scale-[0.98]' 
                                  : isDisabled 
                                    ? 'bg-red-50/30 hover:bg-red-50/50' 
                                    : ''
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

                                  {/* data-tour en el primer botón Editar */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        to={`/admin/supervisor/edit/${supervisor.accountNumber}`}
                                        {...(index === 0 ? { "data-tour": "action-edit" } : {})}
                                      >
                                        <Button
                                          variant="outline"
                                          style={{ borderColor: UNAH_BLUE, color: UNAH_BLUE }}
                                          className="flex items-center font-medium shadow-sm transition-all duration-200"
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

                                  {/* data-tour en el primer botón Habilitar/Deshabilitar */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      {isDisabled ? (
                                        <Button
                                          onClick={() => handleActionClick(supervisor)}
                                          className="bg-green-600 hover:bg-green-700 text-white flex items-center font-medium shadow-sm transition-all duration-200"
                                          disabled={changingStateId !== null}
                                          {...(index === 0 ? { "data-tour": "action-toggle" } : {})}
                                        >
                                          {isChangingState
                                            ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                            : <Unlock className="w-4 h-4 mr-1" />
                                          }
                                          Habilitar
                                        </Button>
                                      ) : (
                                        <Button
                                          onClick={() => handleActionClick(supervisor)}
                                          className="bg-gray-500 hover:bg-gray-600 text-white flex items-center font-medium shadow-sm transition-all duration-200"
                                          disabled={changingStateId !== null}
                                          {...(index === 0 ? { "data-tour": "action-toggle" } : {})}
                                        >
                                          {isChangingState
                                            ? <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                            : <Lock className="w-4 h-4 mr-1" />
                                          }
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

        {/* data-tour en la paginación */}
        {!searchQuery && hasSupervisors && (
          <CardFooter className="flex justify-center pt-4" data-tour="supervisor-pagination">
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