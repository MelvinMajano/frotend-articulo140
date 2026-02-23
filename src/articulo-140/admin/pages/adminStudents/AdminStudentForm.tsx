import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Link, useNavigate } from "react-router"
import { ArrowLeft, Loader2, UserPlus } from "lucide-react"
import type { role } from "@/articulo-140/auth/pages/register/registerInterfaces/register.interface"
import { registerActions } from "@/articulo-140/auth/pages/register/actions/register.action"
import { toast } from "sonner"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"

interface FormDataRegister {
  name: string
  email: string
  accountNumber: number
  identityNumber: string
  password: string
  confirmPassword: string
  role: role
  degreeId: number
}

export const AdminStudentForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const validateForm = (formData: FormDataRegister) => {
    const newErrors: Record<string, string> = {}

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    if (!/^[A-Z]/.test(formData.password)) {
      newErrors.password = newErrors.password
        ? `${newErrors.password}, debe comenzar con mayúscula`
        : "Debe comenzar con mayúscula"
    }

    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    if (!specialCharRegex.test(formData.password)) {
      newErrors.password = newErrors.password
        ? `${newErrors.password} y debe contener al menos un carácter especial`
        : "Debe contener al menos un carácter especial"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const role: role = "student"
    const degreeId = 1
    const formDataObject: FormDataRegister = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      accountNumber: Number(formData.get("accountNumber")),
      identityNumber: formData.get("identityNumber") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      role: role,
      degreeId: degreeId,
    }

    if (validateForm(formDataObject)) {
      const { confirmPassword, ...dataToSend } = formDataObject
      setIsSubmitting(true)
      try {
        const message = await registerActions(dataToSend)
        if (message.includes("Error") || message.includes("error")) {
          toast.error(message)
        } else {
          form.reset()
          setErrors({})
          toast.success(message)
          setTimeout(() => {
            navigate("/admin/students")
          }, 1500) // Pequeño delay para que el usuario vea el toast de éxito
        }
      } catch (error) {
        toast.error("Error inesperado al agregar el estudiante")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="p-6">
      <Card className="bg-white shadow-lg border-0 max-w-3xl mx-auto">
        {/* Header */}
        <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-2">
            <Link to="/admin/students">
            <Button
                variant="ghost"
                className="text-gray-600"
                onMouseEnter={e => { e.currentTarget.style.color = UNAH_BLUE; e.currentTarget.style.background = UNAH_BLUE_SOFT }}
                onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = '' }}
            >
                <ArrowLeft className="w-5 h-5" />
            </Button>
            </Link>
            <div className="p-2 rounded-lg" style={{ background: UNAH_BLUE_SOFT }}>
            <UserPlus className="w-6 h-6" style={{ color: UNAH_BLUE }} />
            </div>
            <div>
            <h2 className="text-2xl font-bold text-gray-800">Agregar Estudiante</h2>
            <p className="text-sm text-gray-600 mt-1">
                Completa el formulario para registrar un nuevo estudiante
            </p>
            </div>
        </div>
        </CardHeader>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="José Pérez"
                  required
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              {/* Correo Electrónico */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@unah.hn"
                  required
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              {/* Número de Cuenta */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-gray-700 font-medium">
                  Número de Cuenta
                </Label>
                <Input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  placeholder="20222001234"
                  required
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              {/* Número de Identidad */}
              <div className="space-y-2">
                <Label htmlFor="identityNumber" className="text-gray-700 font-medium">
                  Número de Identidad
                </Label>
                <Input
                  id="identityNumber"
                  name="identityNumber"
                  type="text"
                  placeholder="0801199012345"
                  required
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Requisitos de contraseña */}
            <div className="border border-gray-200 rounded-lg p-4" style={{ background: UNAH_BLUE_SOFT }}>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Requisitos de la contraseña:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Mínimo 8 caracteres</li>
                <li>Debe comenzar con mayúscula</li>
                <li>Debe contener al menos un carácter especial (!@#$%^&*)</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Link to="/admin/students">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="text-white"
                style={{ background: UNAH_BLUE }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Agregando...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Agregar Estudiante
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}