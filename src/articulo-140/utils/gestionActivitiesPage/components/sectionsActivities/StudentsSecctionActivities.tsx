import { useStudentsAttendaceByActivity } from "@/articulo-140/hooks/activities/activities/useStudentsAttendaceByActivity"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { Separator } from "@/components/ui/separator"
import { Table, 
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow, } from "@/components/ui/table"
import { useParams } from "react-router"

export const StudentsAdActivities = () => {
  const {id: activityId} = useParams();
  const {data, isLoading } = useStudentsAttendaceByActivity(activityId);

  if(isLoading){
    return <CustomFullScreenLoading/>
  }

  return (
    <section className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">Estudiantes</h1>
                    </div>
                    <Separator />
                    <div className="space-y-6 ">
                      <div className="space-y-2">
                        <div className="rounded-lg border bg-background shadow-sm overflow-visible [&_[data-slot=table-container]]:overflow-visible">
                          <Table className="min-w-full">
                            <TableCaption className="text-xs">Tabla de asistencias</TableCaption>
                            <TableHeader className="bg-muted/30">
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[140px] text-center">Número de cuenta</TableHead>
                                <TableHead className="w-[180px] text-left">Nombre</TableHead>
                                <TableHead className="w-[150px] text-center">Hora de entrada</TableHead>
                                <TableHead className="w-[150px] text-center">Hora de salida</TableHead>
                                <TableHead className="w-[120px] text-center">Horas obtenidas</TableHead>
                                <TableHead className="w-[120px] text-center">Ambitos</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="[&>tr:nth-child(even)]:bg-muted/20">
                                {data?.message.data.map((e)=>(
                                <TableRow key={e.accountNumber}>
                                <TableCell className="text-center">{e.accountNumber}</TableCell>
                                <TableCell className="font-medium">{e.name}</TableCell>
                                
                                <TableCell className="text-center">{new Date(e.entryTime).toLocaleString("es-HN")}</TableCell>
                                <TableCell className="text-center">{new Date(e.exitTime).toLocaleString("es-HN")}</TableCell>
                                <TableCell className="text-center">{e.hoursAwarded}</TableCell>
                                <TableCell>{e.Scope}</TableCell>
                                 </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                          <CustomPagination  totalPages={5}/>
                        </div>
                      </div>
                    </div>
                  </section>
  )
}
