import { useState, useRef, useEffect } from "react"
import { CustomImput } from "@/components/custom/CustomImput"
import { Button } from "@/components/ui/button"
import { ActivitiesPage } from "./activitiesPage/ActivitiesPage"
import { authStore } from "../auth/store/authStore"
import { MinimalModal } from "@/components/custom/CustomModal"
import { ActivityForm } from "./activitiesPage/components/custom/CustomFormActivities"
import { UNAH_BLUE, UNAH_GOLD_DARK } from "@/lib/colors"
import { Plus } from "lucide-react"

export const HomePage = () => {
  const { state, isAdmin } = authStore()
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [formOpen, setFormOpen] = useState(false)

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
                open={formOpen}
                onOpenChange={setFormOpen}
                trigger={
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 font-medium transition-all duration-200"
                    style={{ borderColor: UNAH_BLUE, color: UNAH_BLUE, background: "white", boxShadow: `0 2px 10px 0 ${UNAH_BLUE}25` }}
                    onMouseEnter={e => {
                      const btn = e.currentTarget;
                      btn.style.background = UNAH_BLUE;
                      btn.style.color = "white";
                      btn.style.boxShadow = `0 4px 16px 0 ${UNAH_BLUE}45`;
                    }}
                    onMouseLeave={e => {
                      const btn = e.currentTarget;
                      btn.style.background = "white";
                      btn.style.color = UNAH_BLUE;
                      btn.style.boxShadow = `0 2px 10px 0 ${UNAH_BLUE}25`;
                    }}
                  >
                    <Plus className="w-4 h-4" style={{ color: UNAH_GOLD_DARK }} strokeWidth={2.5} />
                    Agregar actividad
                  </Button>
                }
                title="Agregar nueva actividad"
                description="Formulario para crear una nueva actividad con todos los detalles requeridos"
              >
                <ActivityForm onClose={() => setFormOpen(false)} />
              </MinimalModal>
            )}
          </div>
          <ActivitiesPage searchQuery={searchQuery} />
        </div>
      )}
    </>
  )
}