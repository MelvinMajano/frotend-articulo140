import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle, ListChecks } from "lucide-react"
import { ExistingActivitySelector } from "./custom/ActivitySelector"
import { useNavigate } from "react-router"

interface AddActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId: string
}

export const AddActivityModal = ({ open, onOpenChange, studentId }: AddActivityModalProps) => {
  const [mode, setMode] = useState<"selection" | "existing" | "new">("selection")
  const navigate = useNavigate()

  const handleNewActivity = () => {
    navigate(`/admin/students/${studentId}/addActivity`)
    onOpenChange(false)
  }

  const handleBackToSelection = () => {
    setMode("selection")
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset mode when closing
    setTimeout(() => setMode("selection"), 200)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {mode === "selection" && "Agregar Actividad al Estudiante"}
            {mode === "existing" && "Seleccionar Actividad Existente"}
            {mode === "new" && "Nueva Actividad"}
          </DialogTitle>
        </DialogHeader>

        {mode === "selection" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6">
            <button
              onClick={() => setMode("existing")}
              className="group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all duration-200"
            >
              <ListChecks className="w-12 h-12 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 mb-1">Actividad Existente</h3>
              <p className="text-sm text-gray-600 text-center">
                Seleccionar de actividades ya registradas
              </p>
            </button>

            <button
              onClick={() => setMode("new")}
              className="group flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-teal-600 hover:bg-teal-50 transition-all duration-200"
            >
              <PlusCircle className="w-12 h-12 text-teal-600 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 mb-1">Nueva Actividad</h3>
              <p className="text-sm text-gray-600 text-center">
                Crear y registrar una nueva actividad
              </p>
            </button>
          </div>
        )}

        {mode === "existing" && (
          <ExistingActivitySelector 
            studentId={studentId}
            onBack={handleBackToSelection}
            onClose={handleClose}
          />
        )}

        {mode === "new" && (
          <div className="py-6">
            <p className="text-gray-600 mb-6">
              Serás redirigido al formulario para crear una nueva actividad.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleBackToSelection}
                className="border-gray-300"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleNewActivity}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
