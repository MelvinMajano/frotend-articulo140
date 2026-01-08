import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { useSupervisors } from "@/articulo-140/hooks/activities/admin/useSupervisors"

interface ComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const CustomCombobox=({value: externalValue, onChange}: ComboboxProps)=> {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(externalValue || "")

  const {query} = useSupervisors()

  const supervisors = query?.data?.data || []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {(externalValue || value)
            ? supervisors.find((supervisor) => supervisor.id === (externalValue || value))?.name
            : "Seleccione un supervisor"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar supervisor..." />
          <CommandList>
            <CommandEmpty>No se encontró supervisor.</CommandEmpty>
            <CommandGroup>
              {supervisors.map((supervisor) => (
                <CommandItem
                  key={supervisor.id}
                  value={supervisor.name}
                  keywords={[supervisor.name, supervisor.id]}
                  onSelect={() => {
                    setValue(supervisor.id)
                    onChange?.(supervisor.id)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      (externalValue || value) === supervisor.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {supervisor.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}