import { ImportActivityAttendance } from "@/articulo-140/admin/actions/ImportActivityAttendance";
import type { AttendanceImportResponse, AttendanceImportSummary } from "@/articulo-140/interfaces/admin.attendanceImport.response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useImportActivityAttendance = (activityId: string | undefined) => {
    const queryClient = useQueryClient();
    const [lastImport, setLastImport] = useState<AttendanceImportSummary | null>(null)
    
    const importMutation = useMutation<AttendanceImportResponse, unknown, File>({
        mutationFn: (file: File) => {
            if (!activityId) {
                return Promise.reject(new Error("No se encontro el id de la actividad"))
            }
            return ImportActivityAttendance(activityId, file)
        },
        onSuccess: (response) => {
            const summary = response.data ?? null;
            setLastImport(summary ? { ...summary, errors: summary.errors ?? [] } : null)
            const criticalErrors = summary?.errors?.filter(err =>
                err.message?.includes("actividad debe estar finalizada") ||
                err.message?.includes("Actividad no encontrada") ||
                err.message?.includes("no admite nuevas inscripciones")
            ) ?? [];

            if (criticalErrors.length > 0) {
                toast.error(criticalErrors[0].message || "Error en la importación", {
                    description: "Revisa el estado de la actividad antes de importar"
                });
            } else if (summary && (summary.registered > 0 || summary.attendanceSaved > 0)) {
                const rowErrors = summary.errors?.length ?? 0;
                toast.success("Importación completada exitosamente", {
                    description: rowErrors > 0
                        ? `${summary.attendanceSaved} asistencias registradas. ${rowErrors} filas con errores de formato (ver detalles abajo)`
                        : `Nuevos: ${summary.created} - Inscritos: ${summary.registered} - Asistencias: ${summary.attendanceSaved}`
                });
            } else {
                toast.warning("No se procesaron registros", {
                    description: "Verifica el formato del archivo y el estado de la actividad"
                });
            }

            queryClient.invalidateQueries({ queryKey: ["attendance", { activityId }] });
        },
        onError: (error: unknown) => {
            const message = typeof error === "object" && error !== null && "response" in error && typeof (error as any).response?.data?.message === "string"
                ? (error as any).response.data.message
                : error instanceof Error
                    ? error.message
                    : "Error al importar asistencias";
            toast.error(message);
        }
    });

    const validateAndImport = (file: File): boolean => {
        const lowerName = file.name.toLowerCase();
        const isAllowedType = lowerName.endsWith(".xlsx") ||
            lowerName.endsWith(".xls") ||
            lowerName.endsWith(".csv") ||
            file.type.includes('spreadsheet') ||
            file.type === "text/csv";

        if (!isAllowedType) {
            toast.error("Selecciona un archivo .xlsx, .xls o .csv");
            return false;
        }

        if (file.size > 8 * 1024 * 1024) {
            toast.error("El archivo no debe superar 8 MB");
            return false;
        }

        importMutation.mutate(file);
        return true
    };

    return {
    importMutation,
    lastImport,
    validateAndImport
  };
};