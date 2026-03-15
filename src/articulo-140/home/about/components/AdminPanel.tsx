import { Settings, X, PlusCircle, LayoutDashboard, EyeOff, Loader2 } from "lucide-react"
import { UNAH_BLUE, UNAH_BLUE_SOFT, UNAH_WHITE } from "@/lib/colors"

const SECTION_LABELS = {
  carousel:     "Carrusel / Galería",
  misionVision: "Misión y Visión",
  competencias: "Áreas de Competencia",
  objetivos:    "Objetivos de la Carrera",
} as const

export type SectionKey = keyof typeof SECTION_LABELS

interface Props {
  open: boolean
  onClose: () => void
  sections: Record<SectionKey, boolean>
  onToggleSection: (k: SectionKey) => void
  onNewPost: () => void
  postCount: number
  isSavingSections: boolean
}

export const AdminPanel = ({
  open, onClose, sections, onToggleSection,
  onNewPost, postCount, isSavingSections,
}: Props) => (
  <>
    {open && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />}
    <div
      className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl transition-transform duration-300"
      style={{
        width: 360, background: UNAH_WHITE,
        borderLeft: `3px solid ${UNAH_BLUE}`,
        transform: open ? "translateX(0)" : "translateX(100%)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ background: UNAH_BLUE, color: "#fff" }}>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          <span className="font-bold">Panel de Administración</span>
        </div>
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Acceso rápido */}
      <div className="p-4 border-b border-gray-100" style={{ background: UNAH_BLUE_SOFT }}>
        <button
          onClick={() => { onNewPost(); onClose() }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: UNAH_BLUE, color: "#fff" }}
        >
          <PlusCircle className="w-4 h-4" /> Nueva publicación
        </button>
        {postCount > 0 && (
          <p className="text-xs text-center text-gray-500 mt-2">
            {postCount} publicación{postCount !== 1 ? "es" : ""} en el tablón
          </p>
        )}
      </div>

      {/* Secciones */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Visibilidad de secciones
          </p>
          {isSavingSections && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
            </div>
          )}
        </div>

        {(Object.keys(SECTION_LABELS) as SectionKey[]).map((key) => (
          <div
            key={key}
            className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all"
            style={{
              borderColor: sections[key] ? `${UNAH_BLUE}30` : "#e5e7eb",
              background: sections[key] ? UNAH_BLUE_SOFT : "#f9fafb",
            }}
          >
            <span className="text-sm font-medium text-gray-700">{SECTION_LABELS[key]}</span>
            <button
              onClick={() => onToggleSection(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={sections[key]
                ? { background: UNAH_BLUE, color: "#fff" }
                : { background: "#e5e7eb", color: "#6b7280" }
              }
            >
              {sections[key]
                ? <><LayoutDashboard className="w-3.5 h-3.5" />Visible</>
                : <><EyeOff className="w-3.5 h-3.5" />Oculto</>
              }
            </button>
          </div>
        ))}

        <p className="text-xs text-gray-400 pt-2 text-center">
          Los cambios se guardan automáticamente
        </p>
      </div>
    </div>
  </>
)