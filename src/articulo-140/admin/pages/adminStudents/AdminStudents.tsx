import { useState, useMemo, useEffect, useRef } from "react"
import { useStudents } from "@/articulo-140/hooks/activities/admin/useStudents"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2, UserRoundSearch, PlusCircle, ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { AddActivityModal } from "../../components/AddActivityModel"

export const AdminStudents = () => {
  const { query } = useStudents()
  const { data, isLoading, isError } = query
  
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
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

  const filteredStudents = useMemo(() => {
    if (!data?.data) return []
    
    if (!searchQuery.trim()) return data.data

    const query = searchQuery.toLowerCase().trim()
    
    return data.data.filter((student) => 
      student.accountNumber.toString().toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.identityNumber.toLowerCase().includes(query) ||
      student.career.toLowerCase().includes(query)
    )
  }, [data?.data, searchQuery])

  const handleAddActivity = (studentId: string) => {
    setSelectedStudentId(studentId)
    setModalOpen(true)
  }

  return (
    <div className="p-4">
      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full">
            <Link to='/admin'>
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
          <Link to="/admin/students/create">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center">
              <PlusCircle className="w-4 h-4 mr-1" />
              Agregar Estudiante
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
            <p className="text-red-500 text-center py-6">Error al cargar los estudiantes</p>
          ) : (
            <>
              {/* Contador de resultados */}
              {searchQuery && (
                <div className="mb-4 text-sm text-gray-600">
                  {filteredStudents.length === 0 
                    ? "No se encontraron resultados" 
                    : `Mostrando ${filteredStudents.length} de ${data?.data.length} estudiantes`
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
                      filteredStudents.map((student) => (
                        <TableRow key={student.accountNumber}>
                          <TableCell>
                            <span className="font-medium">{student.accountNumber}</span>
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.identityNumber}</TableCell>
                          <TableCell>{student.career}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Link to={`/admin/students/${student.id}`}>
                                <Button
                                  variant="outline"
                                  className="border-teal-600 text-teal-600 hover:bg-teal-50 flex items-center"
                                >
                                  <UserRoundSearch className="w-4 h-4 mr-1" />
                                  Consultar
                                </Button>
                              </Link>
                              <Button
                                onClick={() => handleAddActivity(student.id)}
                                className="bg-teal-600 hover:bg-teal-700 text-white flex items-center"
                              >
                                <PlusCircle className="w-4 h-4 mr-1" />
                                Agregar actividad
                              </Button>
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