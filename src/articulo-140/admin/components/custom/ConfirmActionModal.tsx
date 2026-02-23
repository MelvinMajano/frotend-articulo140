import type { FC, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { MinimalModal } from "@/components/custom/CustomModal"
import { AlertTriangle } from "lucide-react"
import { UNAH_BLUE } from "@/lib/colors"

interface ConfirmActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: "default" | "danger"
}

export const ConfirmActionModal: FC<ConfirmActionModalProps> = ({
  open,
  onOpenChange,
  title = "Confirmar acción",
  message,
  confirmText = "Sí",
  cancelText = "Cancelar",
  onConfirm,
  variant = "default"
}) => {
  const isDanger = variant === "danger"
  const accentColor = isDanger ? "#dc2626" : UNAH_BLUE
  const iconBg = isDanger ? "#fee2e2" : `${UNAH_BLUE}18`

  return (
    <MinimalModal open={open} onOpenChange={onOpenChange} trigger={null}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center justify-center text-center space-y-6">
        <div className="p-4 rounded-full" style={{ background: iconBg, color: accentColor }}>
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="text-gray-600">{message}</div>
        <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto text-white font-semibold"
            style={{ background: accentColor }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </MinimalModal>
  )
}
