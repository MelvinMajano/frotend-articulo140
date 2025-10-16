import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router"
import type { role } from "../registerInterfaces/register.interface"
import { authStore } from "@/articulo-140/auth/store/authStore"
import { toast } from "sonner"

interface formdataRegister{
      name:string;
      email:string;
      accountNumber:number;
      identityNumber:string;
      password:string;
      confirmPassword:string;
      role:role;
      degreeId:number
}

export const RegisterForm =() => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const {register} = authStore();

  const validateForm = (formData:formdataRegister) => {
    const newErrors: Record<string, string> = {}

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
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
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const role:role = "student";
    const degreeId = 1
    const formDataObject:formdataRegister = {
      name:formData.get('name') as string,
      email:formData.get('email') as string,
      accountNumber:Number(formData.get('accountNumber')) ,
      identityNumber:formData.get('identityNumber') as string,
      password:formData.get('password') as string,
      confirmPassword:formData.get('confirmPassword') as string,
      role:role,
      degreeId:degreeId
    }

    if(validateForm(formDataObject)){
      const { confirmPassword, ...dataToSend } = formDataObject;
      try {
        const message = await register(dataToSend);
        if (message.includes('Error') || message.includes('error')) {
          toast.error(message);
        } else {
          toast.success(message);
        }
      } catch (error) {
        toast.error('Error inesperado en el registro');
      }
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
        <CardDescription>Completa el formulario para registrarte</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="José Pérez"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@unah.hn"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Número de Cuenta</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              type="text"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identityNumber">Número de Identidad</Label>
            <Input
              id="identityNumber"
              name="identityNumber"
              type="text"
              placeholder="0801199012345"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 mt-3">
          <Button type="submit" className="w-full">
            Registrarse
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
