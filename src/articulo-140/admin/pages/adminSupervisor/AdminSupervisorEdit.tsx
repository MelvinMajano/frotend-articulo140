import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useParams} from "react-router"
import { UserPlus, Mail, Hash, CreditCard, GraduationCap, Loader2 } from "lucide-react"
import { useSupervisors } from "@/articulo-140/hooks/activities/admin/useSupervisors"

export const AdminSupervisorEdit = () => {
  const { id } = useParams()
  const { query } = useSupervisors()
  const { data, isLoading } = query

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    accountNumber: "",
    identityNumber: "",
    career: "",
  })

  useEffect(() => {
    if (data?.data && id) {
      const accountNumber = Number(id)
      if (Number.isNaN(accountNumber)) return
      const supervisor = data.data.find(
        (sup) => sup.accountNumber === accountNumber
      )
      if (supervisor) {
        setFormData({
          name: supervisor.name,
          email: supervisor.email,
          accountNumber: String(supervisor.accountNumber),
          identityNumber: supervisor.identityNumber,
          career: supervisor.career,
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
    // TODO : Implementar lógica de envío del formulario
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white shadow-xl border-0 overflow-hidden">
        {/* Header con gradiente */}
        <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <UserPlus className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Editar Supervisor</h2>
              <p className="text-teal-50 text-sm mt-1">
                Modifique la información del supervisor
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre completo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal-600" />
                Nombre completo
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Ej. Juan Carlos Pérez López"
                value={formData.name}
                onChange={handleChange}
                className="h-11 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            {/* Correo electrónico */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600" />
                Correo electrónico institucional
              </label>
              <Input
                type="email"
                name="email"
                placeholder="Ej. juan.perez@unah.hn"
                value={formData.email}
                onChange={handleChange}
                className="h-11 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            {/* Grid de 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Número de cuenta */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-teal-600" />
                  Número de cuenta
                </label>
                <Input
                  type="text"
                  name="accountNumber"
                  placeholder="20222001369"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="h-11 border-gray-300 focus:border-teal-500 focus:ring-teal-500 bg-gray-50"
                  disabled
                />
              </div>

              {/* Número de identidad */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  Número de identidad
                </label>
                <Input
                  type="text"
                  name="identityNumber"
                  placeholder="0510200501160"
                  value={formData.identityNumber}
                  onChange={handleChange}
                  className="h-11 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            {/* Carrera */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                Carrera
              </label>
              <Input
                type="text"
                name="career"
                placeholder="Ej. Ingeniería en Sistemas"
                value={formData.career}
                onChange={handleChange}
                className="h-11 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            {/* Botones */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <Link to="/admin/supervisor" className="w-full sm:w-auto">
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
                  <UserPlus className="w-4 h-4 mr-2" />
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
