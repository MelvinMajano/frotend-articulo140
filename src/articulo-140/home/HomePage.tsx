import { useState, useRef, useEffect } from "react"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { ActivitiesPage } from "./activitiesPage/ActivitiesPage"
import { authStore } from "../auth/store/authStore"
import { MinimalModal } from "@/components/custom/CustomModal"
import { ActivityForm } from "./activitiesPage/components/custom/CustomFormActivities"

export const HomePage = () => {
  const { state, isAdmin } = authStore()
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {state === "authenticated" && (
        <div>
          <div className="flex justify-between ml-2 mr-4 mb-2">
            <CustomImput
              ref={searchInputRef}
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar actividades por título, descripción, ámbitos, cupos o horas VOAE"
            />
            {isAdmin() && (
              <MinimalModal
                trigger={<Button>Agregar actividad</Button>}
                title="Agregar nueva actividad"
                description="Formulario para crear una nueva actividad con todos los detalles requeridos"
              >
                <ActivityForm />
              </MinimalModal>
            )}
          </div>
          <ActivitiesPage searchQuery={searchQuery} />
        </div>
      )}
    </>
  )
}