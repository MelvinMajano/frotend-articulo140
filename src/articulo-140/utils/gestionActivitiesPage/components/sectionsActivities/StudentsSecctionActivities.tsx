import { Separator } from "@/components/ui/separator"
import { Table, 
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, } from "@/components/ui/table"


export const StudentsAdActivities = () => {
  return (
    <section className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Estudiantes</h1>
                    </div>
                    <Separator />
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="w-full overflow-x-auto">
                         <Table className="min-w-full">
                            <TableCaption>Tabla de asistencias</TableCaption>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[180px] text-left">Nombre</TableHead>
                                  <TableHead className="w-[140px] text-center">Número de cuenta</TableHead>
                                  <TableHead className="w-[150px] text-center">Hora de entrada</TableHead>
                                  <TableHead className="w-[150px] text-center">Hora de salida</TableHead>
                                  <TableHead className="w-[120px] text-center">Horas obtenidas</TableHead>
                                  <TableHead className="w-[120px] text-center">Ambitos</TableHead>
                              </TableRow>
                              </TableHeader>
                              <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Melvin Majano</TableCell>
                                <TableCell className="text-center">20215024751</TableCell>
                                <TableCell className="text-center">2025-10-15 08:00:00</TableCell>
                                <TableCell className="text-center">2025-10-15 17:00:00</TableCell>
                                <TableCell className="text-center">4</TableCell>
                                <TableCell>cultural, científico, académico</TableCell>
                              </TableRow>
                            </TableBody>
                         </Table>
                        </div>
                      </div>
                    </div>
                  </section>
  )
}
