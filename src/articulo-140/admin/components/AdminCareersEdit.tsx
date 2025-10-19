import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useParams } from "react-router"
import { Hash, BookOpen, Building, Loader2 } from "lucide-react"
import { useCareers } from "@/articulo-140/hooks/activities/admin/useCareers"

export const AdminCareerEdit = () => {
  const { id } = useParams()
  const { query } = useCareers()
  const { data, isLoading } = query

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    faculty: "",
  })

  useEffect(() => {
    if (data?.data && id) {
      const career = data.data.find((c) => String(c.code) === String(id))
      if (career) {
        setFormData({
          code: career.code,
          name: career.name,
          faculty: career.faculty,
        })
      }
    }
  }, [data, id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implementar lógica de actualización de la carrera
    
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="p-6 flex items-center justify-center">
      <Card className="w-full max-w-xl bg-white shadow-xl border-0 overflow-hidden">
        {/* Encabezado con gradiente */}
        <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Editar Carrera</h2>
              <p className="text-blue-100 text-sm mt-1">
                Modifique la información de la carrera
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
                className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50"
                disabled
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
                  className="w-full sm:w-auto h-11 px-8 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-teal-200 transition-all"
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
