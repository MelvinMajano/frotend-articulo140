import { Command, Search } from "lucide-react"
import { Input } from "../ui/input"

export const CustomImput = () => {
  return (
    <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full md:w-[300px] lg:w-[400px] pl-8 bg-muted/50 border-0 focus-visible:ring-1"
              />
              <div className="absolute right-2.5 top-2.5 hidden lg:flex items-center space-x-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <Command className="h-3 w-3" />K
                </kbd>
              </div>
            </div>
    </div>
  )
}
