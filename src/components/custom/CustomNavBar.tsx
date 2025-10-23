

import { useState } from "react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu} from "lucide-react"
import { authStore } from "@/articulo-140/auth/store/authStore"


export function CustomNavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const {state,isAdmin,logout} = authStore();
  let navItems =[{ name: "Inicio", href: "/" }];

  if(state==="authenticated"){
    navItems = [
    { name: "Inicio", href: "/" },
    { name: "Actividades", href: "/activities" },
  ]
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-br from-blue-50 to-purple-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center ">
        {/* Logo */}
        <div className="mr-8 flex ml-8">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 bg-foreground rounded-sm flex items-center justify-center">
              <div className="h-3 w-3 bg-background rounded-sm" />
            </div>
            <span className="hidden font-bold sm:inline-block text-foreground">Articulo 140</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end space-x-2 mr-8">
          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-2">
            {state==="no-authenticated"?(<Link to="/auth/login">
            <Button size="sm">
              Iniciar Sesión
            </Button>
            </Link>):<Link to="/">
            <Button variant="ghost" size="sm" onClick={logout}>
              Cerrar Sesión
            </Button>
            </Link>}
            {isAdmin() && ( <Link to="/admin">
            <Button size="sm" className="bg-red-500 text-background hover:bg-red-700">
              Administrar
            </Button>
            </Link>)} 
          </div>

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <div className="h-6 w-6 bg-foreground rounded-sm flex items-center justify-center">
                    <div className="h-3 w-3 bg-background rounded-sm" />
                  </div>
                  <span className="font-bold">MiApp</span>
                </Link>
              </div>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-foreground/60 transition-colors hover:text-foreground"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-8 flex flex-col space-y-3">
                  <Button variant="ghost" className="justify-start">
                    Iniciar Sesión
                  </Button>
                  <Button className="justify-start bg-foreground text-background hover:bg-foreground/90">
                    Comenzar
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
