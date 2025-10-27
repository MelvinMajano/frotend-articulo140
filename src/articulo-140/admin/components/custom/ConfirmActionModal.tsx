import type { FC, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { MinimalModal } from "@/components/custom/CustomModal"
import { AlertTriangle } from "lucide-react"

interface ConfirmActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
}

export const ConfirmActionModal: FC<ConfirmActionModalProps> = ({
  open,
  onOpenChange,
  title = "Confirmar acción",
  message,
  confirmText = "Sí",
  cancelText = "Cancelar",
  onConfirm
}) => {
  return (
    <MinimalModal open={open} onOpenChange={onOpenChange} trigger={<></>}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-red-100 text-red-600 p-4 rounded-full">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </MinimalModal>
  )
}
