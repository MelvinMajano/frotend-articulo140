import { useActivities } from "@/articulo-140/hooks/activities/useActivities"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@radix-ui/react-label"
import { Link, useParams} from "react-router"
import { gestionActivitiesStore } from "../../stores/gestionActivitiesStore"

export const ControlZoneAdActivities = () => {
  const {stateFunDisableActivity,stateFunEnableActivity,isDisable} = gestionActivitiesStore();
  const {activityMutation} = useActivities();
  const {id} = useParams();

  const handleHabiltar = () =>{ 
    const isDisableSet= 0;
    stateFunEnableActivity();
    activityMutation.mutate({id,isDisableSet})
  };
          

  const handleDeshabiltar = () =>{
    const isDisableSet=1;
    stateFunDisableActivity();
    activityMutation.mutate({id,isDisableSet})
  };
  return (
    <section className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Zona de control</h1>
                    </div>

                    <div className="space-y-6">  
                      <Card className="border-red-600 flex flex-row">
                        <div className="flex items-center space-x-2 ml-3">
                          <div>
                            <Label htmlFor="desable-activitie" className="font-medium">
                                Deshabilitar
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Al presionar deshabilitar, la actividad no aparecerá más para ningún usuario, exceptuando al administrador.
                            </p>
                          </div>
                        </div>
                        {isDisable===0?(<Button className="m-auto text-red-600 w-1/6 " variant={"ghost"} 
                        onClick={handleDeshabiltar}
                        >
                              Deshabilitar actividad
                        </Button>):(
                          <div className="flex flex-col">
                          <Button className="m-auto text-red-600 w-1/6 " variant={"ghost"} 
                        onClick={handleDeshabiltar}
                        disabled={true}
                        >
                              Deshabilitar actividad
                        </Button>
                        <Button className="m-auto text-black w-1/6" variant={"ghost"} 
                        onClick={handleHabiltar}
                        >
                              Habilitar actividad
                        </Button>
                        </div>)}
                        
                        
                      </Card>
                    </div>

                    <Separator />

                     <Card className="border-red-600 flex flex-row">
                        <div className="flex items-center space-x-2 ml-3">
                          <div>
                            <Label htmlFor="desable-activitie" className="font-medium">
                                Eliminar
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Al presionar eliminar, la actividad tampoco se mostrará para ningún usuario, pero el administrador podrá encontrar las actividades eliminadas aquí. 
                              <Link to="/admin/activities-deleted">
                              <span className="underline text-blue-800">Actividades Eliminadas</span>
                              </Link>
                            </p>
                          </div>
                        </div>
                        <Button className="m-auto mr-5 text-white bg-red-500 hover:bg-red-700">
                              Eliminar Actividad
                        </Button>
                        
                      </Card>
                  </section>
  )
}
