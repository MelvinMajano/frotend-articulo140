import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { BookOpen, Hash, Building } from "lucide-react"

export const AdminCareerForm = () => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    faculty: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar lógica de envío al backend
    console.log("Carrera registrada:", formData)
  }

  return (
    <div className="p-6 flex items-center justify-center">
      <Card className="w-full max-w-xl bg-white shadow-xl border-0 overflow-hidden">
        {/* Encabezado con gradiente */}
        <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-8">
          <div className="flex items-center justify-center gap-5">
            <div className="p-4 bg-white/20 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Registrar Nueva Carrera</h2>
              <p className="text-sm text-indigo-100 mt-1">
                Complete la información de la carrera
              </p>
            </div>
          </div>
        </CardHeader>

        {/* Contenido del formulario */}
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Código de carrera */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-teal-600" />
                Código de carrera
              </label>
              <Input
                type="text"
                name="code"
                placeholder="Ej. SIS-001"
                value={formData.code}
                onChange={handleChange}
                className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Nombre de carrera */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                Nombre de la carrera
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Ej. Ingeniería en Sistemas"
                value={formData.name}
                onChange={handleChange}
                className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Facultad */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-600" />
                Facultad
              </label>
              <Input
                type="text"
                name="faculty"
                placeholder="Ej. Facultad de Ingeniería"
                value={formData.faculty}
                onChange={handleChange}
                className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Botones */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <Link to="/admin/careers" className="w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto h-11 px-6 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-8 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-teal-200 transition-all">
                  Registrar Carrera
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
