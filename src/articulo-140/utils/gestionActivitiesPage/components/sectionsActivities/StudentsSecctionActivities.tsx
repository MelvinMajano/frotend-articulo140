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
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"

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
                        <div className="rounded-lg overflow-visible [&_[data-slot=table-container]]:overflow-visible" style={{ border: `1.5px solid ${UNAH_BLUE}20`, boxShadow: `0 2px 12px 0 ${UNAH_BLUE}10` }}>
                          <Table className="min-w-full">
                            <TableCaption className="text-xs">Tabla de asistencias</TableCaption>
                            <TableHeader style={{ background: UNAH_BLUE_SOFT }}>
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[140px] text-center text-black font-semibold">Número de cuenta</TableHead>
                                <TableHead className="w-[180px] text-left text-black font-semibold">Nombre</TableHead>
                                <TableHead className="w-[150px] text-center text-black font-semibold">Hora de entrada</TableHead>
                                <TableHead className="w-[150px] text-center text-black font-semibold">Hora de salida</TableHead>
                                <TableHead className="w-[120px] text-center text-black font-semibold">Horas obtenidas</TableHead>
                                <TableHead className="w-[120px] text-center text-black font-semibold">Ambitos</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.message.data.map((e)=>(
                                <TableRow key={e.accountNumber} style={{ background: UNAH_BLUE_SOFT }}>
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
