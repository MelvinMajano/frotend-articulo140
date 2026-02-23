import { useState, useMemo, useEffect, useRef } from "react"
import { useStudents } from "@/articulo-140/hooks/activities/admin/useStudents"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2, UserRoundSearch, PlusCircle, ArrowLeft, Users } from "lucide-react"
import { Link, useSearchParams } from "react-router"
import { AddActivityModal } from "../../components/AddActivityModel"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"

export const AdminStudents = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const limit = 5
  
  const { query } = useStudents(limit, currentPage)
  const { data, isLoading, isError } = query
  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
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

  // Filtrado local para la búsqueda
  const filteredStudents = useMemo(() => {
    if (!data?.data?.data) return []
    
    const students = data.data.data 
    
    if (!searchQuery.trim()) return students

    const query = searchQuery.toLowerCase().trim()
    
    return students.filter((student) => 
      student.accountNumber.toString().toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.identityNumber.toLowerCase().includes(query) ||
      student.career.toLowerCase().includes(query)
    )
  }, [data?.data?.data, searchQuery])

  const handleAddActivity = (studentId: string) => {
    setSelectedStudentId(studentId)
    setModalOpen(true)
  }

  // Total de páginas y estudiantes desde la paginación del backend
  const totalPages = data?.data?.pagination?.totalPage || 1
  const totalStudents = data?.data?.pagination?.total || 0
  const hasStudents = data?.data?.data && data.data.data.length > 0

  return (
    <div className="p-4">
      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Primera fila: Título con badge y buscador */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Título y badge */}
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
                  Gestión de Estudiantes
                </h2>
                {hasStudents && (
                  <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full" style={{ background: UNAH_BLUE_SOFT, color: UNAH_BLUE }}>
                    {totalStudents}
                  </span>
                )}
              </div>
            </div>

            {/* Buscador */}
            <div className="w-full lg:w-auto lg:min-w-[320px]">
              <CustomImput 
                ref={searchInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar estudiantes..."
              />
            </div>
          </div>

          {/* Segunda fila: Contador de búsqueda y Botón Agregar */}
          <div className="flex items-center justify-between">
            {/* Contador de búsqueda*/}
            {searchQuery && hasStudents ? (
              <div className="flex items-center gap-2 text-sm text-gray-600 px-4 py-2 rounded-md" style={{ background: UNAH_BLUE_SOFT }}>
                <span className="font-medium">{filteredStudents.length}</span>
                <span>de</span>
                <span className="font-medium">{totalStudents}</span>
                <span>estudiantes encontrados</span>
              </div>
            ) : (
              <div></div> // Espacio vacío cuando no hay búsqueda
            )}

            {/* Botón Agregar*/}
            <Link to="/admin/students/create">
              <Button className="text-white flex items-center shadow-sm" style={{ background: UNAH_BLUE }}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Agregar Estudiante
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
            <p className="text-red-500 text-center py-6">Error al cargar los estudiantes</p>
          ) : !hasStudents ? (
            /* Estado vacío */
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="w-16 h-16" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                No hay estudiantes registrados
              </p>
              <p className="text-gray-500 text-sm">
                Agrega un estudiante para comenzar
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
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
                      {filteredStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                            {searchQuery 
                              ? "No se encontraron estudiantes que coincidan con tu búsqueda" 
                              : "No hay estudiantes registrados"
                            }
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredStudents.map((student: any) => (
                          <TableRow 
                            key={student.accountNumber}
                            style={{ background: UNAH_BLUE_SOFT }}
                          >
                            <TableCell>
                              <span className="font-medium text-gray-900">{student.accountNumber}</span>
                            </TableCell>
                            <TableCell className="text-gray-900">{student.name}</TableCell>
                            <TableCell className="text-gray-600">{student.email}</TableCell>
                            <TableCell className="text-gray-600">{student.identityNumber}</TableCell>
                            <TableCell className="text-gray-600">{student.career}</TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                {/* Tooltip para Consultar */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link to={`/admin/students/${student.id}`}>
                                      <Button
                                        variant="outline"
                                      style={{ borderColor: UNAH_BLUE, color: UNAH_BLUE }}
                                      className="flex items-center font-medium shadow-sm transition-all duration-200"
                                      >
                                        <UserRoundSearch className="w-4 h-4 mr-1" />
                                        Consultar
                                      </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Ver Horas VOAE del estudiante</p>
                                  </TooltipContent>
                                </Tooltip>

                                {/* Tooltip para Agregar Actividad */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => handleAddActivity(student.id)}
                                      className="text-white flex items-center font-medium shadow-sm transition-all duration-200"
                                      style={{ background: UNAH_BLUE }}
                                    >
                                      <PlusCircle className="w-4 h-4 mr-1" />
                                      Agregar actividad
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Asignar una nueva actividad VOAE</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TooltipProvider>
              </div>
            </>
          )}
        </CardContent>

        {/* Footer con paginación - solo mostrar si no hay búsqueda activa */}
        {!searchQuery && hasStudents && (
          <CardFooter className="flex justify-center pt-4">
            <CustomPagination totalPages={totalPages} />
          </CardFooter>
        )}
      </Card>

      {/* Modal para agregar actividad */}
      {selectedStudentId && (
        <AddActivityModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          studentId={selectedStudentId}
        />
      )}
    </div>
  )
}