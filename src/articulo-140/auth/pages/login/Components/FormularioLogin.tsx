import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router"
import { type FormEvent } from "react"
import { authStore } from "@/articulo-140/auth/store/authStore"
import { toast } from "sonner"

export const LoginForm = () => {
  const {login} = authStore();
  const navigate = useNavigate()

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const isValid = await login(email,password);

    if(isValid){
      // Limpiar el formulario cuando el login sea exitoso
      form.reset();
      
      navigate('/activities')
      toast.success(`Bienvenido`, {
        style: {
          background: '#10b981', 
          color: 'white',
          border: '1px solid #059669'
        }
      })
    } else {
      toast.error('Credenciales incorrectas', {
        style: {
          background: '#ef4444', 
          color: 'white',
          border: '1px solid #dc2626'
        }
      })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="m-2">
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription >Ingresa tu correo electrónico y contraseña para acceder</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 m-2">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="example@unah.hn"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 m-2 mt-4">
          <Button type="submit" className="w-full">
            Iniciar Sesión
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            ¿No tienes una cuenta?{" "}
            <Link to='/auth/register' className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}