import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface MinimalModalProps {
  trigger: React.ReactNode
  children: React.ReactNode
  className?: string
  overlayClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
}

export const MinimalModal = ({
  trigger,
  children,
  className,
  //overlayClassName,
  open,
  onOpenChange,
  title = "Modal",
  description = "Modal content",
}: MinimalModalProps)=> {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn("!max-w-3xl !w-[768px] !min-h-[600px] p-0 border-0 bg-transparent shadow-none", className)}
        showCloseButton={false}
      >
        {/* Títulos ocultos visualmente pero accesibles para screen readers */}
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </VisuallyHidden>
        <div className="relative">{children}</div>
      </DialogContent>
    </Dialog>
  )
}