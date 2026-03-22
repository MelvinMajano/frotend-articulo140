import { useState, useEffect, useRef } from "react"
import { useStudents } from "@/articulo-140/hooks/activities/admin/useStudents"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2, SearchX, UserRoundSearch, PlusCircle, ArrowLeft} from "lucide-react"
import { Link, useSearchParams } from "react-router"
import { AddActivityModal } from "../../components/AddActivityModel"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"
import { GuidedTour } from "../../components/custom/GuidedTour"
import type { TourStep } from "../../components/custom/GuidedTour"

const ADMIN_STUDENTS_STEPS: TourStep[] = [
  {
    target: "body",
    title: "👋 ¡Bienvenido!",
    content:
      "Este es el módulo de Gestión de Estudiantes. Te mostraremos las funciones principales en unos pocos pasos.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="search-input"]',
    title: "Buscador",
    content:
      "Usa este campo para buscar estudiantes por nombre, número de cuenta, correo, identidad o carrera. También puedes usar Ctrl+K para enfocarlo rápidamente.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="add-student-btn"]',
    title: "Agregar Estudiante",
    content:
      "Haz clic aquí para registrar un nuevo estudiante en el sistema.",
    placement: "left",
    disableBeacon: true,
    pumaPosition: "right",
    pumaLabel: "¡Click aquí!"
  },
  {
    target: '[data-tour="students-table"]',
    title: "Tabla de Estudiantes",
    content:
      "Aquí se listan todos los estudiantes registrados. Puedes ver su información y realizar acciones sobre cada uno.",
    placement: "top",
    disableBeacon: true,
    pumaLabel: "¡Aquí están tus estudiantes!",
  },
  {
    target: '[data-tour="action-consult"]',
    title: "Consultar",
    content:
      "Presiona este botón para ver el detalle de horas VOAE acumuladas por el estudiante.",
    placement: "left",
    disableBeacon: true,
    pumaPosition: "right",
    pumaLabel: "¡Consulta las horas VOAE aquí!"
  },
  {
    target: '[data-tour="action-add-activity"]',
    title: "Agregar Actividad",
    content:
      "Usa este botón para asignarle una nueva actividad VOAE al estudiante directamente desde esta vista.",
    placement: "left",
    disableBeacon: true,
    pumaPosition: "right",
    pumaLabel: "¡Agrega una actividad VOAE aquí!"
  },
  {
    target: '[data-tour="pagination"]',
    title: "Paginación",
    content:
      "Navega entre páginas de estudiantes desde aquí cuando la lista sea extensa.",
    placement: "top",
    disableBeacon: true,
  },
]

export const AdminStudents = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const searchQuery = searchParams.get('search') || ''
  const limit = 7
  
  const { query } = useStudents(limit, currentPage, searchQuery)
  const { data, isLoading, isError } = query
  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (value: string) => {
    setSearchParams({ page: '1', ...(value.trim() ? { search: value } : {}) })
  }

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

  

  const handleAddActivity = (studentId: string) => {
    setSelectedStudentId(studentId)
    setModalOpen(true)
  }

  // Filtrado de estudiantes desde backend
  const filteredStudents = data?.data?.data ?? []

  const totalPages = data?.data?.pagination?.totalPage || 1 
  const totalStudents = data?.data?.pagination?.total || 0
  const hasStudents = filteredStudents.length > 0

  return (
    <div className="p-4">

      {/* Tour guiado — primera vez automático, F1 para repetir */}
      <GuidedTour tourId="admin-students" steps={ADMIN_STUDENTS_STEPS} />

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

            {/* data-tour en el buscador */}
            <div className="w-full lg:w-auto lg:min-w-[320px]" data-tour="search-input">
              <CustomImput 
                ref={searchInputRef}
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Buscar estudiantes..."
              />
            </div>
          </div>

          {/* Segunda fila: Contador de búsqueda y Botón Agregar */}
          <div className="flex items-center justify-between right-0 top-full mt-2 lg:mt-0 gap-4">
            {/*data-tour en el botón de agregar */}
            <Link to="/admin/students/create" data-tour="add-student-btn">
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
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-gray-400 mb-4">
                 <SearchX className="w-16 h-16" />
               </div>
                  <p className="text-gray-600 text-lg font-medium mb-2">
                    {searchQuery 
                       ? "No se encontraron estudiantes que coincidan con tu búsqueda"
                       : "No hay estudiantes registrados"
                    }
                  </p>
                {searchQuery && (
                  <p className="text-gray-500 text-sm">
                     Intenta con otro término de búsqueda
                  </p>
                )}
            </div>
          ) : (
            <>
              {/* data-tour en la tabla */}
              <div className="overflow-x-auto" data-tour="students-table">
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
                        filteredStudents.map((student: any, index: number) => (
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
                                {/* data-tour en el primer botón Consultar */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      to={`/admin/students/${student.id}`}
                                      {...(index === 0 ? { "data-tour": "action-consult" } : {})}
                                    >
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
                                {/* data-tour en el primer botón Agregar actividad */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => handleAddActivity(student.id)}
                                      className="text-white flex items-center font-medium shadow-sm transition-all duration-200"
                                      style={{ background: UNAH_BLUE }}
                                      {...(index === 0 ? { "data-tour": "action-add-activity" } : {})}
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

        {/*  data-tour en la paginación — solo si aplica */}
        { hasStudents && totalPages > 1 && (
          <CardFooter className="flex justify-center pt-4" data-tour="pagination">
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