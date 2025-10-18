"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data - reemplazar con datos reales del sistema
const supervisores = [
  { id: "1", nombre: "Dr. Juan Pérez" },
  { id: "2", nombre: "Dra. María González" },
  { id: "3", nombre: "Lic. Carlos Rodríguez" },
  { id: "4", nombre: "Prof. Ana Martínez" },
]

const ambitos = [
  { id: "cultural", label: "Cultural" },
  { id: "cientificoAcademico", label: "Científico-Académico" },
  { id: "social", label: "Social" },
  { id: "deporte", label: "Deporte" },
]

export const ActivityForm=()=> {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    horaInicio: "",
    horaFinalizacion: "",
    horasVoae: "",
    cuposTotales: "",
    supervisorId: "",
    ambitos: [] as string[],
  })

  const handleAmbitoChange = (ambitoId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      ambitos: checked ? [...prev.ambitos, ambitoId] : prev.ambitos.filter((id) => id !== ambitoId),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Datos del formulario:", formData)
    // Aquí iría la lógica para enviar los datos al servidor
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Información de la Actividad</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-1.5">
            <Label htmlFor="titulo" className="text-sm">
              Título
            </Label>
            <Input
              id="titulo"
              placeholder="Ingrese el título de la actividad"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <Label htmlFor="descripcion" className="text-sm">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              placeholder="Describa la actividad"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              required
            />
          </div>

          {/* Horas */}
          <div className="grid gap-3 grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="horaInicio" className="text-sm">
                Hora de Inicio
              </Label>
              <Input
                id="horaInicio"
                type="time"
                value={formData.horaInicio}
                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="horaFinalizacion" className="text-sm">
                Hora de Finalización
              </Label>
              <Input
                id="horaFinalizacion"
                type="time"
                value={formData.horaFinalizacion}
                onChange={(e) => setFormData({ ...formData, horaFinalizacion: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Horas VOAE y Cupos */}
          <div className="grid gap-3 grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="horasVoae" className="text-sm">
                Horas VOAE
              </Label>
              <Input
                id="horasVoae"
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={formData.horasVoae}
                onChange={(e) => setFormData({ ...formData, horasVoae: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cuposTotales" className="text-sm">
                Cupos Totales
              </Label>
              <Input
                id="cuposTotales"
                type="number"
                min="1"
                placeholder="0"
                value={formData.cuposTotales}
                onChange={(e) => setFormData({ ...formData, cuposTotales: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Supervisor */}
          <div className="space-y-1.5">
            <Label htmlFor="supervisor" className="text-sm">
              Supervisor
            </Label>
            <Select
              value={formData.supervisorId}
              onValueChange={(value) => setFormData({ ...formData, supervisorId: value })}
              required
            >
              <SelectTrigger id="supervisor">
                <SelectValue placeholder="Seleccione un supervisor" />
              </SelectTrigger>
              <SelectContent>
                {supervisores.map((supervisor) => (
                  <SelectItem key={supervisor.id} value={supervisor.id}>
                    {supervisor.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ámbitos */}
          <div className="space-y-2">
            <Label className="text-sm">Ámbitos</Label>
            <p className="text-xs text-muted-foreground">
              Seleccione uno o más ámbitos a los que pertenece la actividad
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ambitos.map((ambito) => (
                <div key={ambito.id} className="flex items-center gap-2">
                  <Checkbox
                    id={ambito.id}
                    checked={formData.ambitos.includes(ambito.id)}
                    onCheckedChange={(checked) => handleAmbitoChange(ambito.id, checked as boolean)}
                  />
                  <Label htmlFor={ambito.id} className="cursor-pointer font-normal text-sm">
                    {ambito.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm">
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Guardar Actividad
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
