
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useParams } from "react-router"
import { getEstudentsIncriptionsActivity } from "../actions/GetstudentsInscriptionsActivity.actios"
import { DateTimePicker } from "@/components/custom/DatetimePicker"
import { useState } from "react"


export const TableIncriptionsActivty = () => {
  const {id} = useParams();
  const query = useQuery({
    queryKey: ["students",{id}],
    queryFn: () => getEstudentsIncriptionsActivity(id),
    retry:false
  })

  const {data, isLoading,isError} = query;
  const [entryTimes, setEntryTimes] = useState<Record<string, Date | undefined>>({});
  const [exitTimes, setExitTimes] = useState<Record<string, Date | undefined>>({});

  console.log(JSON.stringify(data));

  const handleEntryTimeChange = (studentId: string, date: Date | undefined) => {
    setEntryTimes(prev => ({
      ...prev,
      [studentId]: date
    }));
    console.log('Fecha de entrada para estudiante', studentId, ':', date);
  };

  const handleExitTimeChange = (studentId: string, date: Date | undefined) => {
    setExitTimes(prev => ({
      ...prev,
      [studentId]: date
    }));
    console.log('Fecha de salida para estudiante', studentId, ':', date);
  };

  const parseDate = (dateValue: any): Date | undefined => {
    if (!dateValue) return undefined;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  };


  return (
    <>
         {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-6">Error al cargar los estudiantes</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><span className="text-gray-700"># Cuenta</span></TableHead>
                    <TableHead><span className="text-gray-700">Nombre</span></TableHead>
                    <TableHead><span className="text-gray-700">Hora de llegada</span></TableHead>
                    <TableHead><span className="text-gray-700">Hora de salida</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data && data.data.length > 0 ? (
                    data.data.map((student) => (
                      <TableRow key={student.accountNumber}>
                        <TableCell>
                          <span className="font-medium">{student.accountNumber}</span>
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-center text-gray-500">
                          <DateTimePicker 
                            date={entryTimes[student.id] || parseDate(student.entryTime)}
                            setDate={(date) => handleEntryTimeChange(student.id, date)}
                            placeholder="Seleccionar fecha de entrada"
                            isModified={!!entryTimes[student.id]}
                            className={entryTimes[student.id] 
                              ? 'border-2 border-green-500 shadow-sm' 
                              : ''
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center text-gray-500">
                          <DateTimePicker 
                            date={exitTimes[student.id] || parseDate(student.exitTime)}
                            setDate={(date) => handleExitTimeChange(student.id, date)}
                            placeholder="Seleccionar fecha de salida"
                            isModified={!!exitTimes[student.id]}
                            className={exitTimes[student.id] 
                              ? 'border-2 border-blue-500 shadow-sm' 
                              : ''
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No hay estudiantes inscritos en esta actividad
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
    </>
  )
}
