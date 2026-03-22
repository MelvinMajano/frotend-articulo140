import { useState, useEffect, useRef } from "react"
import { useCareers } from "@/articulo-140/hooks/activities/admin/useCareers"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, PenLine, Lock, PlusCircle, ArrowLeft, Unlock, SearchX } from "lucide-react"
import { Link, useSearchParams } from "react-router"
import { ConfirmActionModal } from "@/articulo-140/admin/components/custom/ConfirmActionModal"
import { deleteCareer, restoreCareer } from "../../actions/softDeleteCareer"
import { toast } from "sonner"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { GuidedTour } from "../../components/custom/GuidedTour"
import type { TourStep } from "../../components/custom/GuidedTour"

const LIMIT = 5

// ─── Pasos del tour ───────────────────────────────────────────────────────────
const CAREERS_STEPS: TourStep[] = [
  {
    target: "body",
    title: "👋 ¡Bienvenido!",
    content: "Este es el módulo de Gestión de Carreras. Aquí puedes administrar las carreras registradas en el sistema.",
    placement: "center",
    disableBeacon: true,
    pumaLabel: "¡Hola!",
  },
  {
    target: '[data-tour="careers-search"]',
    title: "Buscador",
    content: "Filtra carreras por código, nombre o facultad. También puedes usar Ctrl+K para enfocarlo rápidamente.",
    placement: "bottom",
    disableBeacon: true,
    pumaMood: "search",
    pumaLabel: "Busca aquí",
  },
  {
    target: '[data-tour="add-career-btn"]',
    title: "Agregar Carrera",
    content: "Haz clic aquí para registrar una nueva carrera en el sistema.",
    placement: "bottom",
    disableBeacon: true,
    pumaPosition: "right",
    pumaMood: "point",
    pumaLabel: "¡Agregar!",
  },
  {
    target: '[data-tour="careers-table"]',
    title: "Tabla de Carreras",
    content: "Aquí se listan todas las carreras con su código, nombre y facultad. Las deshabilitadas aparecen en rojo con el código tachado.",
    placement: "top",
    disableBeacon: true,
    pumaMood: "inspect",
    pumaLabel: "¡Aquí están las carreras!",
  },
  {
    target: '[data-tour="action-edit"]',
    title: "Editar Carrera",
    content: "Usa este botón para modificar el nombre, código o facultad de la carrera.",
    placement: "left",
    disableBeacon: true,
    pumaPosition: "right",
    pumaMood: "look_right",
    pumaLabel: "Editar",
  },
  {
    target: '[data-tour="action-toggle"]',
    title: "Habilitar / Deshabilitar",
    content: "Cambia el estado de la carrera. Si está activa la deshabilita, y si está deshabilitada la vuelve a habilitar.",
    placement: "left",
    disableBeacon: true,
    pumaPosition: "right",
    pumaMood: "look_right",
    pumaLabel: "Estado",
  },
  {
    target: '[data-tour="careers-pagination"]',
    title: "¡Todo listo! 🎉",
    content: "Ya conoces el módulo de carreras. Usa la paginación para navegar entre páginas cuando haya muchas carreras.",
    placement: "top",
    disableBeacon: true,
    pumaMood: "celebrate",
    pumaLabel: "¡Listo!",
  },
]

export const AdminCareers = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Leer búsqueda y página desde la URL ──────────────────────────────────────
  const searchQuery = searchParams.get("search") || ""
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const { query } = useCareers(LIMIT, currentPage, searchQuery)
  const { data, isLoading, isError } = query

  const [selectedCareer, setSelectedCareer] = useState<any | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [isRestoreAction, setIsRestoreAction] = useState(false)
  const [changingStateId, setChangingStateId] = useState<string | null>(null)
  const [animatingId, setAnimatingId] = useState<string | null>(null)

  const searchInputRef = useRef<HTMLInputElement>(null)

  // ── Actualizar URL al buscar — resetea a página 1 ────────────────────────────
  const handleSearch = (value: string) => {
    setSearchParams({ page: "1", ...(value.trim() ? { search: value } : {}) })
  }

  // ── Atajo de teclado Ctrl+K / Cmd+K ─────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // ── Datos desde el backend ────────────────────────────────────────────────────
  const careers      = data?.data?.data ?? []
  const totalPages   = data?.data?.pagination?.totalPage || 1
  const totalCareers = data?.data?.pagination?.total || 0
  const hasCareers   = careers.length > 0

  // ── Handlers de habilitar / deshabilitar ─────────────────────────────────────
  const handleActionClick = (career: any) => {
    setSelectedCareer(career)
    setIsRestoreAction(career.isDisabled === "true")
    setOpenModal(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedCareer) return
    const careerId = selectedCareer.code.toString()
    setChangingStateId(careerId)
    setOpenModal(false)
    try {
      setAnimatingId(careerId)
      await new Promise(resolve => setTimeout(resolve, 400))
      if (isRestoreAction) {
        await restoreCareer(selectedCareer.id)
        toast.success(`Carrera ${selectedCareer.name} habilitada correctamente`)
      } else {
        await deleteCareer(selectedCareer.id)
        toast.success(`Carrera ${selectedCareer.name} deshabilitada correctamente`)
      }
      await query.refetch?.()
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      toast.error(`Error al ${isRestoreAction ? "habilitar" : "deshabilitar"} la carrera`)
    } finally {
      setChangingStateId(null)
      setAnimatingId(null)
      setSelectedCareer(null)
    }
  }

  return (
    <div className="p-4">

      <GuidedTour tourId="admin-careers" steps={CAREERS_STEPS} />

      <Card className="bg-white shadow-lg border-0 w-full">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

          {/* Título, badge y buscador */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
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
                  Gestión de Carreras
                </h2>
                {hasCareers && (
                  <span
                    className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full"
                    style={{ background: UNAH_BLUE_SOFT, color: UNAH_BLUE }}
                  >
                    {totalCareers}
                  </span>
                )}
              </div>
            </div>

            {/* Buscador */}
            <div className="w-full lg:w-auto lg:min-w-[320px]" data-tour="careers-search">
              <CustomImput
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Buscar por código, nombre o facultad..."
              />
            </div>
          </div>

          {/* botón agregar */}
          <div className="flex items-center justify-between right-0 top-full mt-2 lg:mt-0 gap-4">
            <Link to="/admin/careers/create" data-tour="add-career-btn">
              <Button className="text-white flex items-center shadow-sm" style={{ background: UNAH_BLUE }}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Agregar Carrera
              </Button>
            </Link>
          </div>
        </CardHeader>

        {/* Contenido */}
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: UNAH_BLUE }} />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <SearchX className="w-16 h-16" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                {searchQuery
                  ? "No se encontraron carreras que coincidan con tu búsqueda"
                  : "No hay carreras registradas"
                }
              </p>
              {searchQuery && (
                <p className="text-gray-500 text-sm">
                  Intenta con otro término de búsqueda
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto" data-tour="careers-table">
              <Table>
                <TableHeader style={{ background: UNAH_BLUE_SOFT }}>
                  <TableRow>
                    <TableHead><span className="font-semibold text-black"># Código</span></TableHead>
                    <TableHead><span className="font-semibold text-black">Nombre</span></TableHead>
                    <TableHead><span className="font-semibold text-black">Facultad</span></TableHead>
                    <TableHead className="text-center"><span className="font-semibold text-black">Acciones</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {careers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                        {searchQuery
                          ? "No se encontraron carreras que coincidan con tu búsqueda"
                          : "No hay carreras registradas"
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    careers.map((career, index) => {
                      const careerId        = career.code.toString()
                      const isChangingState = changingStateId === careerId
                      const isAnimating     = animatingId     === careerId
                      const isDisabled      = career.isDisabled === "true"

                      return (
                        <TableRow
                          key={career.code}
                          style={!isAnimating && !isDisabled ? { background: UNAH_BLUE_SOFT } : undefined}
                          className={`transition-all duration-400 ${
                            isAnimating
                              ? "animate-pulse bg-yellow-50 scale-[0.98]"
                              : isDisabled
                                ? "bg-red-50/30 hover:bg-red-50/50"
                                : ""
                          }`}
                        >
                          <TableCell>
                            <span className={`font-medium ${isDisabled ? "text-gray-400 line-through" : "text-gray-900"}`}>
                              {career.code}
                            </span>
                          </TableCell>
                          <TableCell className={isDisabled ? "text-gray-400" : "text-gray-900"}>
                            {career.name}
                          </TableCell>
                          <TableCell className={isDisabled ? "text-gray-400" : "text-gray-600"}>
                            {career.faculty}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">

                              <Link
                                to={`/admin/careers/edit/${career.code}`}
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

                              {isDisabled ? (
                                <Button
                                  onClick={() => handleActionClick(career)}
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
                                  onClick={() => handleActionClick(career)}
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

                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* Paginación */}
        {hasCareers && totalPages > 1 && (
          <CardFooter className="flex justify-center pt-4" data-tour="careers-pagination">
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
            ? "¿Deseas habilitar esta carrera?"
            : "¿Deseas deshabilitar esta carrera?"
        }
        message={
          <>
            {isRestoreAction ? (
              <>
                La carrera{" "}
                <span className="font-semibold text-gray-900">{selectedCareer?.name}</span>{" "}
                será habilitada nuevamente.
              </>
            ) : (
              <>
                Esta acción no se puede deshacer. La carrera{" "}
                <span className="font-semibold text-gray-900">{selectedCareer?.name}</span>{" "}
                será deshabilitada.
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