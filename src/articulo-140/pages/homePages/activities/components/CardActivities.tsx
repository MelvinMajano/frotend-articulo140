import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Calendar, Clock, MapPin, User } from 'lucide-react'

const activities = [
  {
    id: 1,
    image: "/placeholder.svg",
    title: "Taller de Robótica",
    subtitle: "Aprende a construir y programar robots desde cero.",
    category: "Tecnología",
    date: "2025-09-25",
    location: "Aula Magna, Edificio B",
    participants: "30 estudiantes",
    hours: "8:00 AM - 12:00 PM"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    title: "Conferencia de Innovación",
    subtitle: "Descubre las últimas tendencias en innovación educativa.",
    category: "Conferencia",
    date: "2025-10-02",
    location: "Auditorio Central",
    participants: "100 asistentes",
    hours: "10:00 AM - 1:00 PM"
  },
  {
    id: 3,
    image: "/placeholder.svg",
    title: "Feria de Ciencias",
    subtitle: "Exposición de proyectos científicos estudiantiles.",
    category: "Ciencias",
    date: "2025-10-10",
    location: "Gimnasio Escolar",
    participants: "50 proyectos",
    hours: "9:00 AM - 3:00 PM"
  },
  {
    id: 4,
    image: "/placeholder.svg",
    title: "Torneo de Ajedrez",
    subtitle: "Compite y demuestra tus habilidades mentales.",
    category: "Deportes",
    date: "2025-10-15",
    location: "Sala de Juegos",
    participants: "20 jugadores",
    hours: "2:00 PM - 6:00 PM"
  },
//   {
//     id: 5,
//     image: "/placeholder.svg",
//     title: "Taller de Fotografía",
//     subtitle: "Aprende técnicas básicas y avanzadas de fotografía.",
//     category: "Arte",
//     date: "2025-10-20",
//     location: "Laboratorio de Arte",
//     participants: "15 estudiantes",
//     hours: "11:00 AM - 2:00 PM"
//   },
//   {
//     id: 6,
//     image: "/placeholder.svg",
//     title: "Seminario de Liderazgo",
//     subtitle: "Desarrolla tus habilidades de liderazgo y trabajo en equipo.",
//     category: "Desarrollo Personal",
//     date: "2025-10-25",
//     location: "Sala de Conferencias",
//     participants: "40 participantes",
//     hours: "9:00 AM - 12:00 PM"
//   }
]

export const CardActivities = () => {
  return (
                <CardContent className="px-0 pb-0">
                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-16 items-stretch">
                  {activities.map((activity) => (
                    <Card
                      key={activity.id}
                      className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100 max-w-xs w-64 h-full"
                    >
                      <CardHeader className="p-0">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={activity.image || "/placeholder.svg"}
                            alt={activity.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
                              {activity.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 px-5 pb-5">
                        <div className="mb-4">
                          <h3 className="font-bold text-gray-900 mb-1 text-lg">{activity.title}</h3>
                          <p className="text-sm text-gray-600">{activity.subtitle}</p>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-teal-600" />
                            <span className="font-medium">{activity.date}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-teal-600" />
                            <span>{activity.location}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-teal-600" />
                            <span>Ubicación: {activity.participants}</span>
                          </div>

                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-teal-600 mt-0.5" />
                            <span className="text-xs leading-relaxed">{activity.hours}</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="p-5 pt-0 mt-auto">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 transition-colors duration-200 ">
                          Inscribirse
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
  )
}
