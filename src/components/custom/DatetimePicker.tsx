
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"

interface DateTimePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  isModified?: boolean
}

export function DateTimePicker({ date, setDate, placeholder = "Seleccionar fecha y hora", className, isModified = false }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [timeStep, setTimeStep] = useState<"calendar" | "hour" | "minute">("calendar")
  const [selectedHour, setSelectedHour] = useState(date instanceof Date ? date.getHours() : 12)
  const [selectedMinute, setSelectedMinute] = useState(date instanceof Date ? date.getMinutes() : 0)
  const [period, setPeriod] = useState<"AM" | "PM">(
    date instanceof Date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM"
  )

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      if (date instanceof Date) {
        newDate.setHours(date.getHours())
        newDate.setMinutes(date.getMinutes())
      } else {
        const hour24 =
          period === "PM" && selectedHour !== 12
            ? selectedHour + 12
            : period === "AM" && selectedHour === 12
              ? 0
              : selectedHour
        newDate.setHours(hour24)
        newDate.setMinutes(selectedMinute)
      }
      setDate(newDate)
      setTimeStep("hour")
    }
  }

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour)
  }

  const handleTimeConfirm = () => {
    if (date instanceof Date) {
      const newDate = new Date(date)
      const hour24 =
        period === "PM" && selectedHour !== 12
          ? selectedHour + 12
          : period === "AM" && selectedHour === 12
            ? 0
            : selectedHour
      newDate.setHours(hour24)
      newDate.setMinutes(selectedMinute)
      setDate(newDate)
    }
    setIsOpen(false)
    setTimeStep("calendar")
  }

  const handleMinuteClick = (minute: number) => {
    setSelectedMinute(minute)
  }

  const getMinutePosition = (minute: number) => {
    const angle = (minute * 6 - 90) * (Math.PI / 180)
    const radius = 95
    return {
      x: 120 + radius * Math.cos(angle),
      y: 120 + radius * Math.sin(angle),
    }
  }

  const getHourPosition = (hour: number) => {
    const hourIndex = hour === 12 ? 0 : hour
    const angle = (hourIndex * 30 - 90) * (Math.PI / 180)
    const radius = 75
    return {
      x: 120 + radius * Math.cos(angle),
      y: 120 + radius * Math.sin(angle),
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left", 
            isModified ? "font-bold" : "font-normal",
            !date && "text-muted-foreground", 
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date instanceof Date ? format(date, "PPP 'a las' p", { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-h-[350px] overflow-y-auto" align="start">
        {timeStep === "calendar" ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            captionLayout="dropdown"
            fromYear={2020}
            toYear={2030}
          />
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTimeStep(timeStep === "minute" ? "hour" : "calendar")}
              >
                ← Volver
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{timeStep === "hour" ? "Seleccionar hora" : "Seleccionar minutos"}</span>
              </div>
            </div>

            {/* Display Time */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="text-5xl font-light tabular-nums">{selectedHour.toString().padStart(2, "0")}</div>
              <div className="text-5xl font-light">:</div>
              <div className="text-5xl font-light tabular-nums">{selectedMinute.toString().padStart(2, "0")}</div>
              <div className="flex flex-col gap-1 ml-2">
                <button
                  onClick={() => setPeriod("AM")}
                  className={cn(
                    "text-sm px-2 py-0.5 rounded transition-colors",
                    period === "AM"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  AM
                </button>
                <button
                  onClick={() => setPeriod("PM")}
                  className={cn(
                    "text-sm px-2 py-0.5 rounded transition-colors",
                    period === "PM"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  PM
                </button>
              </div>
            </div>

            <div className="relative w-60 h-60 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 240 240">
                {/* Clock circle */}
                <circle
                  cx="120"
                  cy="120"
                  r="110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border"
                />

                {timeStep === "hour" &&
                  [...Array(12)].map((_, i) => {
                    const hour = i === 0 ? 12 : i
                    const pos = getHourPosition(hour)
                    return (
                      <g key={`hour-${i}`}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="18"
                          className={cn(
                            "cursor-pointer transition-all",
                            selectedHour === hour ? "fill-primary" : "fill-muted hover:fill-accent",
                          )}
                          onClick={() => handleHourSelect(hour)}
                        />
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={cn(
                            "text-base font-medium pointer-events-none select-none",
                            selectedHour === hour ? "fill-primary-foreground" : "fill-foreground",
                          )}
                        >
                          {hour}
                        </text>
                      </g>
                    )
                  })}

                {timeStep === "minute" &&
                  [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => {
                    const pos = getMinutePosition(minute)
                    return (
                      <g key={`minute-${minute}`}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="16"
                          className={cn(
                            "cursor-pointer transition-all",
                            selectedMinute === minute ? "fill-primary" : "fill-muted hover:fill-accent",
                          )}
                          onClick={() => handleMinuteClick(minute)}
                        />
                        <text
                          x={pos.x}
                          y={pos.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className={cn(
                            "text-sm font-medium pointer-events-none select-none",
                            selectedMinute === minute ? "fill-primary-foreground" : "fill-muted-foreground",
                          )}
                        >
                          {minute.toString().padStart(2, "0")}
                        </text>
                      </g>
                    )
                  })}

                {/* Center dot */}
                <circle cx="120" cy="120" r="3" className="fill-foreground" />

                {timeStep === "hour" &&
                  (() => {
                    const hourIndex = selectedHour === 12 ? 0 : selectedHour
                    const angle = (hourIndex * 30 - 90) * (Math.PI / 180)
                    const radius = 75
                    const x = 120 + radius * Math.cos(angle)
                    const y = 120 + radius * Math.sin(angle)
                    return (
                      <line
                        x1="120"
                        y1="120"
                        x2={x}
                        y2={y}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                      />
                    )
                  })()}

                {timeStep === "minute" &&
                  (() => {
                    const angle = (selectedMinute * 6 - 90) * (Math.PI / 180)
                    const radius = 95
                    const x = 120 + radius * Math.cos(angle)
                    const y = 120 + radius * Math.sin(angle)
                    return (
                      <line
                        x1="120"
                        y1="120"
                        x2={x}
                        y2={y}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                      />
                    )
                  })()}
              </svg>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsOpen(false)
                  setTimeStep("calendar")
                }}
              >
                Cancelar
              </Button>
              {timeStep === "hour" && <Button onClick={() => setTimeStep("minute")}>Continuar</Button>}
              {timeStep === "minute" && <Button onClick={handleTimeConfirm}>Confirmar</Button>}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
