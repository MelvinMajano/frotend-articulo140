// import { useActivities } from "@/articulo-140/hooks/activities/useActivities";
// import type { Message } from "@/articulo-140/interfaces/activities.response";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Clock, Users, User, BookOpen } from "lucide-react";

export const DetailsInscriptionsActivity = () => {
    //const {query} = useActivities();
    //const message:Message[]|undefined= query?.data?.message

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Card className="border shadow-sm">
                <CardHeader className="pb-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-light text-gray-900 leading-tight">
                                Título de la actividad
                            </h1>
                        </div>
                        <Badge 
                            variant="outline" 
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 font-normal"
                        >
                            Pendiente
                        </Badge>
                    </div>
                    <div>
                        <p className="text-gray-600 leading-relaxed">
                            Esta actividad es de ingeniería en sistemas
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Ámbitos */}
                    <div className="space-y-2 p-4 border border-gray-100 rounded-lg bg-gray-50/30">
                        <h3 className="text-sm font-medium text-gray-900 text-center">Ámbitos</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Badge 
                                variant="secondary" 
                                className="bg-blue-50 text-blue-700 border-0 font-normal hover:bg-blue-100"
                            >
                                Cultural
                            </Badge>
                            <Badge 
                                variant="secondary" 
                                className="bg-purple-50 text-purple-700 border-0 font-normal hover:bg-purple-100"
                            >
                                Científico Académico
                            </Badge>
                            <Badge 
                                variant="secondary" 
                                className="bg-green-50 text-green-700 border-0 font-normal hover:bg-green-100"
                            >
                                Deporte
                            </Badge>
                            <Badge 
                                variant="secondary" 
                                className="bg-pink-50 text-pink-700 border-0 font-normal hover:bg-pink-100"
                            >
                                Social
                            </Badge>
                        </div>
                    </div>

                    {/* Grid de información */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Duración */}
                        <div className="flex flex-col gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50/30">
                            <Label className="justify-center text-center font-medium">Duración</Label>
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div>
                                    <Label className="text-xs text-gray-500 uppercase tracking-wide">Hora de inicio</Label>
                                    <div className="text-gray-900 font-medium">2025-10-15 03:00:00</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Finalización</div>
                                    <div className="text-gray-900 font-medium">2025-10-15 11:00:00</div>
                                </div>
                            </div>
                        </div>

                        {/* Información de interés */}
                        <div className="flex flex-col gap-3 p-4 border border-gray-100 rounded-lg bg-gray-50/30">
                            <Label className="justify-center text-center font-medium">Información de interés</Label>
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Horas VOAE</div>
                                    <div className="text-gray-900 font-medium">8 horas</div>
                                </div>
                            </div>
                        
                            <div className="flex items-center gap-3">
                                <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Cupos disponibles</div>
                                    <div className="text-gray-900 font-medium">25</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Supervisor */}
                    <div className="flex items-center justify-center gap-3 py-4 px-4 border border-gray-100 rounded-lg bg-gray-50/30">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Supervisor</div>
                            <div className="text-gray-900 font-medium">Dr. Juan Pérez</div>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-6 border-t border-gray-100">
                    <div className="flex gap-3 w-full">
                        <Button 
                            variant="outline" 
                            className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                            Regresar
                        </Button>
                        <Button 
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                        >
                            Inscribirse
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};