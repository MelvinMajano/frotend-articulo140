import { useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

export const AdminSupervisorForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    accountNumber: "",
    identityNumber: "",
    career: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="p-4 flex justify-center">
      <Card className="max-w-lg w-full bg-white shadow-lg border-0">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-700">
            Registrar Nuevo Supervisor
          </h2>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Ej. Juan Pérez"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <Input
                type="email"
                name="email"
                placeholder="Ej. juan@unah.hn"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de cuenta
              </label>
              <Input
                type="number"
                name="accountNumber"
                placeholder="Ej. 20222001369"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de identidad
              </label>
              <Input
                type="text"
                name="identityNumber"
                placeholder="Ej. 0510200501160"
                value={formData.identityNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carrera
              </label>
              <Input
                type="text"
                name="career"
                placeholder="Ej. Ingeniería en Sistemas"
                value={formData.career}
                onChange={handleChange}
              />
            </div>

           
            <div className="flex justify-end gap-3 pt-4">
              <Link to="/admin/supervisor">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-400 text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Registrar Supervisor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
