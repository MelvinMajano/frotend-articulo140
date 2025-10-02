import { Combobox } from "@/components/custom/ComboBox";
import { DateTimePicker } from "@/components/custom/DatetimePicker"
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"

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
    <section className="space-y-6">
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
                          <Checkbox id="ambito1" />
                          <Label htmlFor="ambito1" >Deporte</Label>
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
  )
}
