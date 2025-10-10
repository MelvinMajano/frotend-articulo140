import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList,Users, Trash2, UserCog, Briefcase, FileStack } from "lucide-react"
import { Link } from "react-router"

const adminModules = [
  {
    id: 1,
    title: "Actividades",
    description: "Gestiona las actividades del sistema.",
    icon: <ClipboardList className="w-8 h-8 text-teal-600" />,
    route: "/admin/activities",
  },
  {
    id: 2,
    title: "Estudiantes",
    description: "Recupera información de los estudiantes.",
    icon: <Users className="w-8 h-8 text-teal-600" />,
    route: "/admin/students",
  },
  {
    id: 3,
    title: "Supervisores",
    description: "Administra los supervisores del sistema.",
    icon: <UserCog className="w-8 h-8 text-teal-600" />,
    route: "/admin/supervisor",
  },
  {
    id: 4,
    title: "Carreras",
    description: "Gestiona las carreras disponibles.",
    icon: <Briefcase className="w-8 h-8 text-teal-600" />,
    route: "/admin/careers",
  },
  {
    id: 5,
    title: "Archivos",
    description: "Administra los archivos del sistema.",
    icon: <FileStack className="w-8 h-8 text-teal-600" />,
    route: "/admin/files",
  },
  {
    id: 6,
    title: "Actividades Eliminadas",
    description: "Revisa o restaura actividades eliminadas.",
    icon: <Trash2 className="w-8 h-8 text-teal-600" />,
    route: "/admin/activities-deleted",
  },
]

export const CardAdminActions = () => {
  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {adminModules.map((module) => (
        <Card key={module.id} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex items-center gap-3">
            {module.icon}
            <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{module.description}</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link to={module.route}>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white text-sm">Gestionar</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </CardContent>
  )
}