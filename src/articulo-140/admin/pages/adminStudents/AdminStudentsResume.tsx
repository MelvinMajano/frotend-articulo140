import { useHoursByStudent,useActivitiesByStudent } from "@/articulo-140/hooks/activities/admin/useDetailsByStudent"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link, useParams } from "react-router"
import { ArrowLeft, User, Clock, Award, Trophy, Microscope, Palette, Users, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"

export const AdminStudentDetail = () => {
  const { id } = useParams()
  
  const { query: activitiesQuery } = useActivitiesByStudent(id || "")
  const { query: hoursQuery } = useHoursByStudent(id || "")

  const { data: activitiesData, isLoading: activitiesLoading, isError: activitiesError } = activitiesQuery
  const { data: hoursData, isLoading: hoursLoading, isError: hoursError } = hoursQuery

  const isLoading = activitiesLoading || hoursLoading
  const isError = activitiesError || hoursError

  const activities = activitiesData?.data || []
  const studentHours = hoursData?.data?.[0]

  const activitiesList =
  activities.length > 0
    ? activities[0].activitiesParticipated.split(",").map(a => a.trim())
    : []

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: UNAH_BLUE }} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-8">
            <p className="text-red-500 text-center">Error al cargar los datos del estudiante</p>
            <div className="flex justify-center mt-4">
              <Link to="/admin/students">
                <Button variant="outline">Regresar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Botón de regreso */}
      <Link to="/admin/students">
        <Button
          variant="ghost"
          className="text-gray-600"
          onMouseEnter={e => { e.currentTarget.style.color = UNAH_BLUE; e.currentTarget.style.background = UNAH_BLUE_SOFT }}
          onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = '' }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Regresar a estudiantes
        </Button>
      </Link>

      {/* Card de información del estudiante */}
      <Card className="bg-white shadow-xl border-0 overflow-hidden py-0 gap-0">
        <CardHeader className="py-6" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm" style={{ background: UNAH_BLUE }}>
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: UNAH_BLUE }}>{studentHours?.studentName || "Estudiante"}</h2>
              <p className="text-gray-500 text-sm mt-1">
                Resumen de actividades y horas VOAE
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Resumen de horas */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" style={{ color: UNAH_BLUE }} />
              <h3 className="text-xl font-bold text-gray-800">Horas por Ámbito</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Cultural */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-900">Cultural</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">{studentHours?.culturalHours || "0"}</p>
                <p className="text-xs text-purple-700 mt-1">horas</p>
              </div>

              {/* Científico Académico */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Microscope className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">Científico</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{studentHours?.cientificoAcademicoHours || "0"}</p>
                <p className="text-xs text-blue-700 mt-1">horas</p>
              </div>

              {/* Deportivo */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-900">Deportivo</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{studentHours?.deportivoHours || "0"}</p>
                <p className="text-xs text-green-700 mt-1">horas</p>
              </div>

              {/* Social */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-900">Social</span>
                </div>
                <p className="text-3xl font-bold text-orange-600">{studentHours?.socialHours || "0"}</p>
                <p className="text-xs text-orange-700 mt-1">horas</p>
              </div>

              {/* Total */}
              <div className="rounded-lg p-4 border-2" style={{ background: UNAH_BLUE_SOFT, borderColor: UNAH_BLUE }}>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5" style={{ color: UNAH_BLUE }} />
                  <span className="text-sm font-semibold" style={{ color: UNAH_BLUE }}>Total</span>
                </div>
                <p className="text-3xl font-bold" style={{ color: UNAH_BLUE }}>{studentHours?.totalHours || "0"}</p>
                <p className="text-xs mt-1" style={{ color: UNAH_BLUE }}>horas</p>
              </div>
            </div>
          </div>

          {/* Tabla de actividades */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5" style={{ color: UNAH_BLUE }} />
              <h3 className="text-xl font-bold text-gray-800">Actividades Participadas</h3>
            </div>

            {activities.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow style={{ background: UNAH_BLUE_SOFT }}>
                      <TableHead className="w-20">
                        <span className="text-gray-700 font-semibold">#</span>
                      </TableHead>
                      <TableHead>
                        <span className="text-gray-700 font-semibold">Actividad</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activitiesList.map((activity, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-600">
                          {index + 1}
                          </TableCell>
                        <TableCell className="text-gray-800">
                          {activity}
                          </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">No hay actividades registradas</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
