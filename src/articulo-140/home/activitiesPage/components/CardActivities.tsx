import { authStore } from '@/articulo-140/auth/store/authStore'
import { useActivities } from '@/articulo-140/hooks/activities/useActivities'
import type { Message } from '@/articulo-140/interfaces/activities.response'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Calendar, CalendarX, Gem, User } from 'lucide-react'
import { Link } from 'react-router'



export const CardActivities = () => {
  const {isAdmin} = authStore();
  const {query} = useActivities();
  const message:Message[]|undefined= query?.data?.message


  return (
                <CardContent className="px-0 pb-0">
                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-16 items-stretch">
                  {message?.map((activity) => (
                    <Card
                      key={activity.id}
                      className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100 max-w-xs w-64 h-full"
                    >
                      <CardHeader className="p-0">
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={"/placeholder.svg"}
                            alt={activity.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
                              {activity.scopes}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 px-5 pb-5">
                        <div className="mb-4">
                          <h3 className="font-bold text-gray-900 mb-1 text-lg">{activity.title}</h3>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-teal-600" />
                            <span className="font-medium">Inicio: {activity.startDate}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <CalendarX className="w-4 h-4 text-teal-600" />
                            <span className="font-medium">Fin: {activity.endDate}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-teal-600" />Cupos:
                            <span  className="font-medium"> {activity.availableSpots}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Gem className="w-4 h-4 text-teal-600" />Horas Voae:
                            <span  className="font-medium"> {activity.voaeHours}</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex flex-col p-5 pt-0 mt-auto">
                        {isAdmin()?(<Link to={`/activities-details/${activity.id}`} className="block w-full">
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 transition-colors duration-200 ">
                          Administrar
                        </Button>
                        </Link>):(<Link to={``} className="block w-full">
                        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 transition-colors duration-200 ">
                          Inscribirse
                        </Button>
                        </Link>)}
                        
                        
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
  )
}
