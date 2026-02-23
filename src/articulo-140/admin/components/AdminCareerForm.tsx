import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { BookOpen, Hash, Building } from "lucide-react"
import { postCareer } from "../actions/postCareers"
import { toast } from "sonner"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"

export const AdminCareerForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    faculty: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.code.trim() || !formData.name.trim() || !formData.faculty.trim()) {
      setError("Todos los campos son obligatorios")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      
      await postCareer(formData)

      toast.success("Carrera registrada exitosamente")

      // Limpiar el formulario
      setFormData({
        code: "",
        name: "",
        faculty: "",
      })

      setTimeout(() => {
        navigate("/admin/careers")
      }, 1000)

    } catch (err: any) {
      toast.error("Error al registrar la carrera")
      setError(err.response?.data?.message || "Error al registrar la carrera")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 flex items-center justify-center">
      <Card className="w-full max-w-xl bg-white shadow-xl border-0 overflow-hidden py-0 gap-0">
        {/* Encabezado con gradiente */}
        <CardHeader className="py-8" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="flex items-center justify-center gap-5">
            <div className="p-4 rounded-lg" style={{ background: UNAH_BLUE }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold" style={{ color: UNAH_BLUE }}>Registrar Nueva Carrera</h2>
              <p className="text-sm text-gray-500 mt-1">
                Complete la información de la carrera
              </p>
            </div>
          </div>
        </CardHeader>

        {/* Contenido del formulario */}
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Código de carrera */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Hash className="w-4 h-4" style={{ color: UNAH_BLUE }} />
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
                disabled={isSubmitting}
              />
            </div>

            {/* Nombre de carrera */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: UNAH_BLUE }} />
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
                disabled={isSubmitting}
              />
            </div>

            {/* Facultad */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Building className="w-4 h-4" style={{ color: UNAH_BLUE }} />
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
                disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-8 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: UNAH_BLUE }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registrando..." : "Registrar Carrera"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}