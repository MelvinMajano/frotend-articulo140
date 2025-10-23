import { CustomPagination } from "@/components/custom/CustomPagination"
import { Button } from "@/components/ui/button"


export const CustomFooterInscription = () => {
  return (
    <footer className="sticky bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40 transition-all duration-300 ease-in-out transform translate-y-0 animate-in slide-in-from-bottom-2">
      <CustomPagination></CustomPagination>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-end gap-3">
          <Button
            className="flex items-center gap-2 text-white transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Guardar
          </Button>
        </div>
      </div>
    </footer>
  )
}
