import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import { ExistingActivitySelector } from "./custom/ActivitySelector"

interface AddActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId: string
}

export const AddActivityModal = ({ open, onOpenChange, studentId }: AddActivityModalProps) => {
  const handleClose = () => {
    onOpenChange(false)
  }

  const handleBack = () => {
    // No hacemos nada, ya que no hay vista previa a la que volver
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-teal-600" />
            Asignar Actividad al Estudiante
          </DialogTitle>
        </DialogHeader>

        {/* Selector de actividad existente */}
        <ExistingActivitySelector 
          studentId={studentId}
          onBack={handleBack}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  )
}