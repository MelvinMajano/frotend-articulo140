import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router"
import { type FormEvent } from "react"
import { authStore } from "@/articulo-140/auth/store/authStore"
import { toast } from "sonner"
import { UNAH_BLUE, UNAH_GOLD } from "@/lib/colors"

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
    <Card className="w-full max-w-md" style={{ border: `1.5px solid ${UNAH_BLUE}25`, boxShadow: `0 4px 32px 0 ${UNAH_BLUE}18` }}>
      <CardHeader className="m-2">
        {/* Franja decorativa dorada */}
        <div className="w-10 h-1 rounded-full mb-3" style={{ background: UNAH_GOLD }} />
        <CardTitle className="text-2xl m-auto" style={{ color: UNAH_BLUE }}>Iniciar Sesión</CardTitle>
        <CardDescription className="font-medium text-black m-auto">Ingresa tu correo electrónico y contraseña para acceder</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 m-2">
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: UNAH_BLUE }}>Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="example@unah.hn"
              required
              className="focus-visible:ring-2"
              style={{ "--tw-ring-color": UNAH_BLUE } as React.CSSProperties}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: UNAH_BLUE }}>Contraseña</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="focus-visible:ring-2"
              style={{ "--tw-ring-color": UNAH_BLUE } as React.CSSProperties}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 m-2 mt-4">
          <Button type="submit" className="w-full" style={{ background: UNAH_BLUE, color: "#fff" }}>
            Iniciar Sesión
          </Button>
          <p className="text-sm text-black text-center">
            ¿No tienes una cuenta?{" "}
            <Link to='/auth/register' className="hover:underline font-medium" style={{ color: UNAH_BLUE }}>
              Regístrate aquí
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}