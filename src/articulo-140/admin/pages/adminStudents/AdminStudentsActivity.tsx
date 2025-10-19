import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
import { DateTimePicker } from "@/components/custom/DatetimePicker"
import { Link } from "react-router"
import { Clock, GraduationCap, User, FileText, Award, PlusCircle } from "lucide-react"

export const AdminAddActivityToStudent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    degreeId: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    voaeHours: "",
    supervisorId: "",
    scopesId: [] as string[],
  })

  // TODO: Reemplazar con datos reales desde la API

  const degrees = [
    { id: "1", name: "Ingeniería en Sistemas" },
    { id: "2", name: "Ingeniería Civil" },
    { id: "3", name: "Medicina" },
    { id: "4", name: "Derecho" },
  ]

  const supervisors = [
    { id: "1", name: "Dr. Carlos Martínez" },
    { id: "2", name: "Lic. Ana García" },
    { id: "3", name: "Ing. Roberto López" },
  ]

  const scopes = [
    { id: "1", name: "Cultural", value: "1" },
    { id: "2", name: "Deportivo", value: "2" },
    { id: "3", name: "Científico Académico", value: "3" },
    { id: "4", name: "Social", value: "4" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (scopeId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      scopesId: checked
        ? [...prev.scopesId, scopeId]
        : prev.scopesId.filter((id) => id !== scopeId),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // TODO : Enviar formData a la API
  }

  return (
    <div className="p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-white shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Agregar Actividad a Estudiante</h2>
              <p className="text-teal-50 text-sm mt-1">
                Complete la información de la actividad
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Título de la actividad
              </label>
              <Input
                type="text"
                name="title"
                placeholder="Ej. Charla sobre circuitos"
                value={formData.title}
                onChange={handleChange}
                className="h-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Descripción
              </label>
              <Textarea
                name="description"
                placeholder="Ej. Charla de estudiantes sobre circuitos electrónicos"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[80px] border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none"
                required
              />
            </div>

            {/* Carrera, Supervisor y Horas VOAE en Grid de 3 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Carrera */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                  Carrera
                </label>
                <Select
                  value={formData.degreeId}
                  onValueChange={(value) => handleSelectChange("degreeId", value)}
                  required
                >
                  <SelectTrigger className="h-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                    <SelectValue placeholder="Seleccione una carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    {degrees.map((degree) => (
                      <SelectItem key={degree.id} value={degree.id}>
                        {degree.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Supervisor */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-teal-600" />
                  Supervisor
                </label>
                <Select
                  value={formData.supervisorId}
                  onValueChange={(value) => handleSelectChange("supervisorId", value)}
                  required
                >
                  <SelectTrigger className="h-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                    <SelectValue placeholder="Seleccione un supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisors.map((supervisor) => (
                      <SelectItem key={supervisor.id} value={supervisor.id}>
                        {supervisor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Horas VOAE */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Horas VOAE
                </label>
                <Input
                  type="number"
                  name="voaeHours"
                  placeholder="Ej. 5"
                  min="1"
                  value={formData.voaeHours}
                  onChange={handleChange}
                  className="h-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            {/* Fechas y horas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de inicio */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Fecha y hora de inicio
                </label>
                <DateTimePicker
                  date={formData.startDate}
                  setDate={(date: Date | undefined) => setFormData((prev) => ({ ...prev, startDate: date }))}
                  placeholder="Seleccionar fecha y hora de inicio"
                />
              </div>

              {/* Fecha de fin */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Fecha y hora de fin
                </label>
                <DateTimePicker
                  date={formData.endDate}
                  setDate={(date: Date | undefined) => setFormData((prev) => ({ ...prev, endDate: date }))}
                  placeholder="Seleccionar fecha y hora de fin"
                />
              </div>
            </div>

            {/* Ámbitos (Checkboxes) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-600" />
                Ámbitos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                {scopes.map((scope) => (
                  <div key={scope.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={scope.id}
                      checked={formData.scopesId.includes(scope.value)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(scope.value, checked as boolean)
                      }
                      className="border-gray-400 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    <Label
                      htmlFor={scope.id}
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {scope.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="border-t border-gray-200 pt-5 mt-6">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <Link to="/admin/students" className="w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto h-10 px-6 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-10 px-8 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-teal-200 transition-all"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Agregar Actividad
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
