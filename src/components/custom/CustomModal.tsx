import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface MinimalModalProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  overlayClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const MinimalModal = ({
  trigger,
  children,
  className,
  //overlayClassName,
  open,
  onOpenChange,
}: MinimalModalProps)=> {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn("max-w-2xl w-[90vw] p-0 border-0 bg-transparent shadow-none", className)}
        showCloseButton={false}
      >
        <div className="relative">{children}</div>
      </DialogContent>
    </Dialog>
  )
}