import {z} from 'zod';

export const activitySchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres").max(500, "La descripción no puede exceder 500 caracteres"),
  voaeHours: z.coerce.number<number>().min(0), 
  availableSpots: z.coerce.number<number>().min(1),
  startDate: z.date(),
  endDate: z.date(),
  scopesId: z.array(z.enum(["1", "2", "3", "4"])).min(1, "Debes seleccionar al menos un ámbito"),
  supervisorId: z.string()
}).refine((data) => data.endDate > data.startDate, {
  message: "La fecha de fin debe ser posterior a la de inicio",
  path: ["endDate"],
});

// Esto extrae el tipo exacto que Zod genera
export type ActivityFormValues = z.infer<typeof activitySchema>;