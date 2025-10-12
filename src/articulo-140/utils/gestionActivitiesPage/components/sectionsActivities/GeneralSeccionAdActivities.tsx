import { Combobox } from "@/components/custom/ComboBox";
import { DateTimePicker } from "@/components/custom/DatetimePicker"
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

let startDateValue: Date | undefined = new Date('2025-10-15T09:00:00');
let endDateValue: Date | undefined = new Date('2025-10-15T09:00:00');

const startDateProps = {
  date: startDateValue,
  setDate: (date: Date | undefined) => {
    startDateValue = date; // ✅ Actualiza la variable
    console.log('Fecha de inicio:', date);
    // Forzar re-render si es necesario
  },
  placeholder: "Seleccionar fecha de inicio"
};

const endDateProps = {
  date: endDateValue,                                     // Sin fecha inicial
  setDate: (date: Date | undefined) => {
    console.log('Fecha de fin:', date);
  },
  placeholder: "Seleccionar fecha de finalización"
};

export const GeneralSeccionAdActivities = () => {
  return (
    <>
    <section className="space-y-6 pb-20">
                    <div className="flex flex-row justify-between">
                      <h1 className="text-2xl font-bold mb-2">General</h1>
                      <Badge className="h-min my-auto mr-6 w-fit bg-yellow-300 text-black" >Pendiente</Badge>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="repo-name" className="font-medium">Título</Label>
                        <Input className="!border-0 !border-b !border-gray-300 focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!border-gray-300 !bg-transparent" />
                          <p className="text-sm text-muted-foreground">
                              Al hacer clic en el título podrá editarlo según sus preferencias.   
                          </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2 ">
                        <Label htmlFor="repo-name" className="font-medium">Descripción</Label>
                        <Input className="!border-0 !border-b !border-gray-300 focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!border-gray-300 !bg-transparent" />
                          <p className="text-sm text-muted-foreground">
                              Al hacer clic en la descripción podrá editarlo según sus preferencias.   
                          </p>
                      </div>
                    </div>

                    <div className="space-y-6 grid grid-cols-2 ">
                      <div className="space-y-2 w-sm">
                        <Label htmlFor="repo-name" className="font-medium">Cantidad de horas VOAE</Label>
                        <Input className="!border-0 !border-b !border-gray-300 focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!border-gray-300 !bg-transparent" />
                          <p className="text-sm text-muted-foreground">
                              Al hacer clic en las horas podrá editarlo según sus preferencias.   
                          </p>
                      </div>
                      <div className="space-y-2 w-sm">
                        <Label htmlFor="repo-name" className="font-medium">Capacidad Máxima de Estudiantes </Label>
                        <Input className="!border-0 !border-b !border-gray-300 focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!border-gray-300 !bg-transparent" />
                          <p className="text-sm text-muted-foreground">
                              Al hacer clic en la cantidad de cupos podrá editarlo según sus preferencias.   
                          </p>
                      </div>
                    </div>
                    
                    <div className="space-y-6 grid grid-cols-2 ">
                      <div className="space-y-2 w-sm">
                        <Label htmlFor="repo-name" className="font-medium">Fecha y Hora de Inicio</Label>
                          <DateTimePicker {...startDateProps}/>
                          <p className="text-sm text-muted-foreground">
                              Al hacer clic en las horas podrá editarlo según sus preferencias.   
                          </p>
                      </div>
                      <div className="space-y-2 w-sm">
                        <Label htmlFor="repo-name" className="font-medium">Fecha y Hora de Finalizacion</Label>
                        <DateTimePicker {...endDateProps}/>
                          <p className="text-sm text-muted-foreground">
                              Al hacer clic en la cantidad de cupos podrá editarlo según sus preferencias.   
                          </p>
                      </div>
                    </div>

                    <div className="space-y-6 grid grid-cols-2 ">
                      <div className="space-y-2 w-sm">
                        <Label htmlFor="repo-name" className="font-medium">Ámbitos</Label>
                          <div className="flex flex-row">
                            <Checkbox id="ambito1" />
                            <Label htmlFor="ambito1" className="font-normal ml-0.5">Deporte</Label></div>
                            <div className="flex flex-row">
                            <Checkbox id="ambito1" />
                            <Label htmlFor="ambito1" className="font-normal ml-0.5">Cultural</Label></div>
                            <div className="flex flex-row">
                            <Checkbox id="ambito1" />
                            <Label htmlFor="ambito1" className="font-normal ml-0.5">Social</Label></div>
                            <div className="flex flex-row">
                            <Checkbox id="ambito1" />
                            <Label htmlFor="ambito1" className="font-normal ml-0.5">Cientifico</Label></div>
                          <p className="text-sm text-muted-foreground">
                              Al hacer clic en las horas podrá editarlo según sus preferencias.   
                          </p>
                      </div>
                      <div className="space-y-2 w-sm">
                        <Label htmlFor="repo-name" className="font-medium">Supervisor</Label>
                        <Combobox/>
                          <p className="text-sm text-muted-foreground">
                              Al hacer clic en la cantidad de cupos podrá editarlo según sus preferencias.   
                          </p>
                      </div>
                    </div>
                      

                  </section>

                  {/* Footer Sticky con botones */}
                  <footer className="sticky bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40 transition-all duration-300 ease-in-out transform translate-y-0 animate-in slide-in-from-bottom-2">
                    <div className="container mx-auto px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          className="flex items-center gap-2 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Aceptar
                        </Button>
                      </div>
                    </div>
                  </footer>
                  </>
  )
}
