import { useState, type FormEvent } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useCareers } from "@/articulo-140/hooks/activities/admin/useCareers"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { UserPlus,Mail,Hash,CreditCard,GraduationCap,Lock,Loader2} from "lucide-react"
import { authStore } from "@/articulo-140/auth/store/authStore"
import { toast } from "sonner"
import type { Career } from "@/articulo-140/interfaces/admin.careers.response"

export const AdminSupervisorForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    accountNumber: "",
    identityNumber: "",
    career: null as Career | null,
    password: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const { query } = useCareers()
  const { data, isLoading, isError } = query
  const careers = data?.data || []

  const { register } = authStore()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === "career") {
      const selectedCareer = careers.find((c) => c.id === Number(value)) || null
      setFormData((prev) => ({ ...prev, career: selectedCareer }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const validatePassword = (password: string) => {
    const errors: string[] = []
    if (password.length < 8) errors.push("Debe tener al menos 8 caracteres")
    if (!/^[A-Z]/.test(password)) errors.push("Debe comenzar con mayúscula")
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
      errors.push("Debe contener al menos un carácter especial")
    return errors
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const passwordErrors = validatePassword(formData.password)
    if (passwordErrors.length > 0) {
      toast.warning(passwordErrors.join(", "))
      return
    }

    setIsSubmitting(true)

    const supervisorData = {
      name: formData.name,
      email: formData.email,
      accountNumber: Number(formData.accountNumber),
      identityNumber: formData.identityNumber,
      role: "supervisor" as const,
      degreeId: formData.career?.id || 0,
      password: formData.password,
    }

    try {
      const message = await register(supervisorData)

      if (message.toLowerCase().includes("error")) {
        toast.error(message, {
          duration: 3000,
          position: "top-right",
        })
      } else {
        toast.success("Supervisor registrado correctamente", {
          style: {
            background: "#10b981",
            color: "white",
            border: "1px solid #059669",
          },
        })

        // Limpia los campos
        setFormData({
          name: "",
          email: "",
          accountNumber: "",
          identityNumber: "",
          career: null,
          password: "",
        })

        setTimeout(() => {
          navigate("/admin/supervisor")
        }, 1000)
      }
    } catch (err) {
      toast.error("Ocurrió un error al registrar el supervisor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-white shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-8">
          <div className="flex items-center justify-center gap-5">
            <div className="p-4 bg-white/20 rounded-lg backdrop-blur-sm">
              <UserPlus className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">Registrar Nuevo Supervisor</h2>
              <p className="text-s text-teal-100 text-sm mt-1">
                Complete la información del supervisor
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
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

            {/* Correo */}
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

            {/* Contraseña */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-teal-600" />
                Contraseña
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Ingrese una contraseña segura"
                value={formData.password}
                onChange={handleChange}
                className="h-11 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                required
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="h-11 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  required
                />
              </div>

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
              <select
                id="career"
                name="career"
                value={formData.career ? String(formData.career.id) : ""}
                onChange={handleChange}
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 bg-white transition duration-150"
                required
              >
                <option value="">Seleccionar carrera</option>
                {isLoading ? (
                  <option disabled>Cargando carreras...</option>
                ) : isError ? (
                  <option disabled>Error al cargar carreras</option>
                ) : (
                  careers.map((career: Career) => (
                    <option key={career.id} value={String(career.id)}>
                      {career.name}
                    </option>
                  ))
                )}
              </select>
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
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto h-11 px-8 text-white font-semibold transition-all ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-200"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registrando...
                    </span>
                  ) : (
                    "Registrar Supervisor"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
