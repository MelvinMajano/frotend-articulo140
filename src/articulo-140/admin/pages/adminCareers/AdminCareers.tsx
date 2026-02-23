import { useState, useMemo, useEffect, useRef } from "react"
import { useCareers } from "@/articulo-140/hooks/activities/admin/useCareers"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, PenLine, Lock, PlusCircle, ArrowLeft, Unlock } from "lucide-react"
import { Link } from "react-router"
import { ConfirmActionModal } from "@/articulo-140/admin/components/custom/ConfirmActionModal"
import { deleteCareer, restoreCareer } from "../../actions/softDeleteCareer"
import { toast } from "sonner"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"

export const AdminCareers = () => {
  const { query } = useCareers()
  const { data, isLoading, isError } = query

  const [selectedCareer, setSelectedCareer] = useState<any | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [isRestoreAction, setIsRestoreAction] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const searchInputRef = useRef<HTMLInputElement>(null)

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

  const filteredCareers = useMemo(() => {
    if (!data?.data) return []
    
    if (!searchQuery.trim()) return data.data

    const query = searchQuery.toLowerCase().trim()
    
    return data.data.filter((career) => 
      career.code.toLowerCase().includes(query) ||
      career.name.toLowerCase().includes(query) ||
      career.faculty.toLowerCase().includes(query)
    )
  }, [data?.data, searchQuery])

  const handleActionClick = (career: any) => {
    setSelectedCareer(career)
    setIsRestoreAction(career.isDisabled === "true")
    setOpenModal(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedCareer) return

    try {
      if (isRestoreAction) {
        await restoreCareer(selectedCareer.id)
        toast.success(`Carrera ${selectedCareer.name} habilitada correctamente`)
      } else {
        await deleteCareer(selectedCareer.id)
        toast.success(`Carrera ${selectedCareer.name} deshabilitada correctamente`)
      }

      query.refetch?.()
    } catch (error) {
      toast.error(`Error al ${isRestoreAction ? "habilitar" : "deshabilitar"} la carrera`)
    } finally {
      setOpenModal(false)
      setSelectedCareer(null)
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
                className="text-gray-600"
                onMouseEnter={e => { e.currentTarget.style.color = UNAH_BLUE; e.currentTarget.style.background = UNAH_BLUE_SOFT }}
                onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = '' }}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Regresar
              </Button>
            </Link>
            <CustomImput 
              ref = {searchInputRef}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por código, nombre o facultad..."
            />
          </div>
          <Link to="/admin/careers/create">
            <Button className="text-white flex items-center" style={{ background: UNAH_BLUE }}>
              <PlusCircle className="w-4 h-4 mr-1" />
              Agregar Carrera
            </Button>
          </Link>
        </CardHeader>

        {/* Contenido */}
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: UNAH_BLUE }} />
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-6">Error al cargar las carreras</p>
          ) : (
            <>
              {/* Mostrar contador de resultados */}
              {searchQuery && (
                <div className="mb-4 text-sm text-gray-600">
                  {filteredCareers.length === 0 
                    ? "No se encontraron resultados" 
                    : `Mostrando ${filteredCareers.length} resultado${filteredCareers.length > 1 ? "s" : ""}`
                  }
                </div>
              )}

              <div className="overflow-x-auto">
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
                    {filteredCareers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                          {searchQuery 
                            ? "No se encontraron carreras que coincidan con tu búsqueda" 
                            : "No hay carreras registradas"
                          }
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCareers.map((career) => (
                        <TableRow key={career.code} style={{ background: UNAH_BLUE_SOFT }}>
                          <TableCell><span className="font-medium">{career.code}</span></TableCell>
                          <TableCell>{career.name}</TableCell>
                          <TableCell>{career.faculty}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Link to={`/admin/careers/edit/${career.code}`}>
                                <Button
                                  variant="outline"
                                  style={{ borderColor: UNAH_BLUE, color: UNAH_BLUE }}
                                  className="flex items-center"
                                >
                                  <PenLine className="w-4 h-4 mr-1" />
                                  Editar
                                </Button>
                              </Link>

                              {career.isDisabled === "true" ? (
                                <Button
                                  onClick={() => handleActionClick(career)}
                                  className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                                >
                                  <Unlock className="w-4 h-4 mr-1" />
                                  Habilitar
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleActionClick(career)}
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
            ? "¿Deseas habilitar esta carrera?"
            : "¿Deseas deshabilitar esta carrera?"
        }
        message={
          <>
            {isRestoreAction ? (
              <>
                La carrera{" "}
                <span className="font-semibold text-gray-900">
                  {selectedCareer?.name}
                </span>{" "}
                será habilitada nuevamente.
              </>
            ) : (
              <>
                Esta acción no se puede deshacer. La carrera{" "}
                <span className="font-semibold text-gray-900">
                  {selectedCareer?.name}
                </span>{" "}
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