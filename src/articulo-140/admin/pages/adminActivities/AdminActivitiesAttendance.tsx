import { useParams, Link } from "react-router"
import { useStudentsAttendaceByActivity } from "@/articulo-140/hooks/activities/activities/useStudentsAttendaceByActivity"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileSpreadsheet, Loader2 } from "lucide-react"
import { useRef, type ChangeEvent } from "react"
import { useImportActivityAttendance } from "@/articulo-140/hooks/activities/activities/useImportActivityAttendance"

export const ActivityAttendance = () => {
  const {id} = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError } = useStudentsAttendaceByActivity(id);
  const { importMutation, lastImport, validateAndImport } = useImportActivityAttendance(id);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (validateAndImport(file)) {
      event.target.value = "";
    }
  };

  const openFilePicker = () => { fileInputRef.current?.click(); };

  return (
    <div className="p-4">
      <Card className="bg-white shadow-lg border-0 w-full">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link to="/admin/activities">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-teal-600 hover:bg-teal-50"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Regresar
              </Button>
            </Link>
          </div>

          <div className="ml-auto">
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" 
            onChange={handleFileChange}/>
            <Button 
            variant="outline"
            onClick={openFilePicker}
            disabled={importMutation.isPending}
            className="border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white flex items-center font-medium shadow-sm transition-all duration-200"
            >
              {
                importMutation.isPending ? (
                  <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando asistencia...
                </>
                ):(
                  <>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Importar asistencia desde Excel
                  </>
                )
              }
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {lastImport && (
            <div className="mb-6 rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900">
              <p className="font-semibold text-teal-900">Última importación</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center justify-between rounded-md bg-white/60 px-3 py-2 shadow-sm"><span>Nuevos</span><span className="font-semibold">{lastImport.created}</span></div>
                <div className="flex items-center justify-between rounded-md bg-white/60 px-3 py-2 shadow-sm"><span>Existentes</span><span className="font-semibold">{lastImport.existing}</span></div>
                <div className="flex items-center justify-between rounded-md bg-white/60 px-3 py-2 shadow-sm"><span>Inscritos</span><span className="font-semibold">{lastImport.registered}</span></div>
                <div className="flex items-center justify-between rounded-md bg-white/60 px-3 py-2 shadow-sm"><span>Asistencias</span><span className="font-semibold">{lastImport.attendanceSaved}</span></div>
              </div>
              {lastImport.errors && lastImport.errors.length > 0 && (() => {
                const criticalErrors = lastImport.errors.filter(err =>
                  err.message?.includes("actividad debe estar finalizada") ||
                  err.message?.includes("Actividad no encontrada") ||
                  err.message?.includes("no admite nuevas inscripciones")
                );
                const validationErrors = lastImport.errors.filter(err =>
                  err.row && !err.message?.includes("no quedo inscrito")
                );
                return criticalErrors.length === 0 && validationErrors.length > 0 && (
                  <div className="mt-3 rounded-md bg-white/80 px-3 py-2 text-red-800">
                    <p className="font-semibold">Errores de validación ({validationErrors.length})</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">
                      {validationErrors.slice(0, 3).map((error, index) => (
                        <li key={`${error.row ?? index}-${index}`}>
                          {error.row ? `Fila ${error.row}: ` : ""}
                          {error.issues?.join("; ") || error.message || "Error desconocido"}
                        </li>
                      ))}
                      {validationErrors.length > 3 && (
                        <li>...y {validationErrors.length - 3} errores más</li>
                      )}
                    </ul>
                  </div>
                );
              })()}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-6">
              Error al cargar la asistencia
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Número de cuenta</TableHead>
                    <TableHead>Hora de entrada</TableHead>
                    <TableHead>Hora de salida</TableHead>
                    <TableHead>Horas obtenidas</TableHead>
                    <TableHead>Ámbitos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.message?.data?.length ?? 0) > 0 ? (
                    data?.message?.data?.map((student) => (
                      <TableRow
                        key={student.accountNumber}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <TableCell className="font-medium text-gray-800">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.accountNumber}</TableCell>
                        <TableCell>
                          {new Date(student.entryTime).toLocaleString("es-HN")}
                        </TableCell>
                        <TableCell>
                          {new Date(student.exitTime).toLocaleString("es-HN")}
                        </TableCell>
                        <TableCell className="text-center">{student.hoursAwarded}</TableCell>
                        <TableCell>{student.Scope}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500 py-6"
                      >
                        No hay registros de asistencia aún
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
