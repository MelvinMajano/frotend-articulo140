import { useState, useEffect, useRef } from "react"
import {
  GraduationCap, Target, Eye, Users, Database, Network,
  ChevronLeft, ChevronRight, Shield, Zap, Globe, Terminal,
  Cloud, Brain, Code2, Workflow, UserCheck, Mail, Award,
  Briefcase, X, Image, Type, Trash2, Settings,
  GripVertical, FileText, ChevronDown, ChevronUp, Upload,
  LayoutDashboard, Blocks, EyeOff, Check,
  Loader2, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  UNAH_BLUE, UNAH_GOLD, UNAH_WHITE, UNAH_BLUE_SOFT,
  UNAH_BLUE_GRADIENT, UNAH_BLUE_LIGHT
} from "@/lib/colors"
import { authStore } from "@/articulo-140/auth/store/authStore"
import { useCloudinaryGallery } from "@/articulo-140/hooks/activities/admin/useClaudinaryImage"

//Tipos 
type BlockType = "text" | "image"

interface CustomBlock {
  id: string
  type: BlockType
  title: string
  content: string
  createdAt: number
}

type SectionKey = "carousel" | "misionVision" | "competencias" | "objetivos"

interface SectionVisibility {
  carousel: boolean
  misionVision: boolean
  competencias: boolean
  objetivos: boolean
}

const BLOCKS_KEY   = "voae_about_blocks"
const SECTIONS_KEY = "voae_about_sections"

const DEFAULT_SECTIONS: SectionVisibility = {
  carousel: true, misionVision: true, competencias: true, objetivos: true,
}

function loadBlocks(): CustomBlock[] {
  try { return JSON.parse(localStorage.getItem(BLOCKS_KEY) || "[]") } catch { return [] }
}
function loadSections(): SectionVisibility {
  try { return { ...DEFAULT_SECTIONS, ...JSON.parse(localStorage.getItem(SECTIONS_KEY) || "{}") } }
  catch { return DEFAULT_SECTIONS }
}

// Modal Galería Cloudinary 
interface CloudinaryPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

const CloudinaryPicker = ({ open, onClose, onSelect }: CloudinaryPickerProps) => {
  const { images, isLoading, isUploading, handleUpload, loadImages } = useCloudinaryGallery()
  const fileRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<string | null>(null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
        style={{ border: `2px solid ${UNAH_BLUE}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ background: UNAH_BLUE, color: "#fff" }}>
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            <span className="font-bold">Seleccionar imagen</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadImages} className="p-1.5 rounded hover:bg-white/20 transition-colors" title="Recargar">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-white/20 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subir nueva */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleUpload(e.target.files?.[0] || null)} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: UNAH_BLUE, color: "#fff" }}
          >
            {isUploading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo...</>
              : <><Upload className="w-4 h-4" /> Subir nueva imagen</>
            }
          </button>
          <p className="text-xs text-gray-400">Máximo 10MB · JPG, PNG, WEBP</p>
        </div>

        {/* Grid imágenes */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: UNAH_BLUE }} />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Image className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No hay imágenes aún</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <button
                  key={img.publicId}
                  onClick={() => setSelected(img.secureUrl)}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105"
                  style={{ borderColor: selected === img.secureUrl ? UNAH_BLUE : "transparent" }}
                >
                  <img src={img.thumbnail} alt="" className="w-full h-full object-cover" />
                  {selected === img.secureUrl && (
                    <div className="absolute inset-0 flex items-center justify-center"
                      style={{ background: `${UNAH_BLUE}60` }}>
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">{selected ? "Imagen seleccionada" : "Selecciona una imagen"}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
            <Button size="sm" disabled={!selected}
              style={{ background: UNAH_BLUE, color: "#fff" }}
              onClick={() => { if (selected) { onSelect(selected); onClose(); setSelected(null) } }}
            >
              Usar imagen
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Panel lateral 
const SECTION_LABELS: Record<SectionKey, string> = {
  carousel:     "Carrusel / Galería",
  misionVision: "Misión y Visión",
  competencias: "Áreas de Competencia",
  objetivos:    "Objetivos de la Carrera",
}

interface AdminPanelProps {
  open: boolean
  onClose: () => void
  blocks: CustomBlock[]
  sections: SectionVisibility
  onToggleSection: (k: SectionKey) => void
  onAddBlock: (t: BlockType) => void
  onDeleteBlock: (id: string) => void
  onUpdateBlock: (id: string, field: "title" | "content", value: string) => void
}

const AdminPanel = ({
  open, onClose, blocks, sections, onToggleSection,
  onAddBlock, onDeleteBlock, onUpdateBlock,
}: AdminPanelProps) => {
  const [tab, setTab]         = useState<"sections" | "blocks">("sections")
  const [expandedId, setExpanded] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen]   = useState(false)
  const [pickingFor, setPickingFor]   = useState<string | null>(null)

  const openPicker = (blockId: string) => { setPickingFor(blockId); setPickerOpen(true) }
  const handleImageSelect = (url: string) => {
    if (pickingFor) { onUpdateBlock(pickingFor, "content", url); setPickingFor(null) }
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onClose} />}

      <CloudinaryPicker
        open={pickerOpen}
        onClose={() => { setPickerOpen(false); setPickingFor(null) }}
        onSelect={handleImageSelect}
      />

      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl transition-transform duration-300"
        style={{
          width: 380, background: UNAH_WHITE,
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
          <button onClick={onClose} className="hover:opacity-70 transition-opacity"><X className="w-5 h-5" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {([
            { key: "sections", label: "Secciones", icon: <LayoutDashboard className="w-4 h-4" /> },
            { key: "blocks",   label: "Bloques",   icon: <Blocks className="w-4 h-4" /> },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors"
              style={tab === t.key
                ? { color: UNAH_BLUE, borderBottom: `2px solid ${UNAH_BLUE}`, background: UNAH_BLUE_SOFT }
                : { color: "#6b7280", borderBottom: "2px solid transparent" }
              }
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/*Tab Secciones*/}
        {tab === "sections" && (
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Visibilidad de secciones
            </p>
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
                    ? <><Eye className="w-3.5 h-3.5" /> Visible</>
                    : <><EyeOff className="w-3.5 h-3.5" /> Oculto</>
                  }
                </button>
              </div>
            ))}
            <p className="text-xs text-gray-400 pt-2 text-center">
              Las secciones ocultas se restauran al volver a activarlas
            </p>
          </div>
        )}

        {/*Tab Bloques*/}
        {tab === "blocks" && (
          <>
            <div className="p-5 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Agregar nuevo bloque
              </p>
              <div className="flex gap-2">
                <button onClick={() => onAddBlock("text")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 text-sm font-medium hover:scale-105 transition-all"
                  style={{ borderColor: UNAH_BLUE, color: UNAH_BLUE, background: UNAH_BLUE_SOFT }}
                >
                  <Type className="w-4 h-4" /> Texto
                </button>
                <button onClick={() => onAddBlock("image")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 text-sm font-medium hover:scale-105 transition-all"
                  style={{ borderColor: UNAH_GOLD, color: UNAH_GOLD, background: `${UNAH_GOLD}15` }}
                >
                  <Image className="w-4 h-4" /> Imagen
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {blocks.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No hay bloques personalizados</p>
                  <p className="text-xs mt-1">Agrega uno desde arriba</p>
                </div>
              ) : (
                blocks.map((block) => (
                  <div key={block.id} className="rounded-xl border border-gray-200 overflow-hidden" style={{ background: "#FAFAFA" }}>
                    <div
                      className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setExpanded(expandedId === block.id ? null : block.id)}
                    >
                      <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: block.type === "text" ? UNAH_BLUE_SOFT : `${UNAH_GOLD}20` }}>
                        {block.type === "text"
                          ? <Type className="w-3 h-3" style={{ color: UNAH_BLUE }} />
                          : <Image className="w-3 h-3" style={{ color: UNAH_GOLD }} />
                        }
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-700 truncate">
                        {block.title || "Bloque sin título"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteBlock(block.id) }}
                          className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {expandedId === block.id
                          ? <ChevronUp className="w-4 h-4 text-gray-400" />
                          : <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </div>
                    </div>

                    {expandedId === block.id && (
                      <div className="px-3 pb-3 space-y-2 border-t border-gray-100 pt-3">
                        <div>
                          <label className="text-xs text-gray-500 font-medium">Título</label>
                          <input
                            className="w-full mt-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2"
                            value={block.title}
                            onChange={(e) => onUpdateBlock(block.id, "title", e.target.value)}
                            placeholder="Título del bloque"
                          />
                        </div>
                        {block.type === "text" ? (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Contenido</label>
                            <textarea
                              className="w-full mt-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none resize-none"
                              rows={4}
                              value={block.content}
                              onChange={(e) => onUpdateBlock(block.id, "content", e.target.value)}
                              placeholder="Escribe el contenido aquí..."
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="text-xs text-gray-500 font-medium">Imagen</label>
                            {block.content && (
                              <div className="mt-1 mb-2 rounded-lg overflow-hidden border border-gray-200 aspect-video">
                                <img src={block.content} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <button
                              onClick={() => openPicker(block.id)}
                              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-dashed text-sm font-medium transition-all hover:opacity-80 mt-1"
                              style={{ borderColor: UNAH_GOLD, color: UNAH_GOLD, background: `${UNAH_GOLD}08` }}
                            >
                              <Image className="w-4 h-4" />
                              {block.content ? "Cambiar imagen" : "Seleccionar imagen"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-3 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                {blocks.length} bloque{blocks.length !== 1 ? "s" : ""} personalizado{blocks.length !== 1 ? "s" : ""}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}

// Renderizador bloques personalizados 
const CustomBlockRenderer = ({ block }: { block: CustomBlock }) => {
  if (block.type === "text") {
    return (
      <div className="rounded-xl border border-gray-200 p-8"
        style={{ background: UNAH_WHITE, borderLeft: `4px solid ${UNAH_BLUE}` }}>
        {block.title && (
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5" style={{ color: UNAH_BLUE }} />
            <h2 className="text-xl font-bold text-gray-800">{block.title}</h2>
          </div>
        )}
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
      </div>
    )
  }
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden" style={{ background: UNAH_BLUE_SOFT }}>
      {block.title && (
        <div className="flex items-center gap-2 px-8 py-5 border-b border-gray-200">
          <Image className="w-5 h-5" style={{ color: UNAH_BLUE }} />
          <h2 className="text-xl font-bold text-gray-800">{block.title}</h2>
        </div>
      )}
      {block.content ? (
        <div className="p-4">
          <img src={block.content} alt={block.title || "Imagen"} className="w-full rounded-lg object-contain max-h-[600px]"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/800x400?text=Imagen+no+disponible" }} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-48 text-gray-400">
          <div className="text-center">
            <Image className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Selecciona una imagen desde el panel</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente principal 
export const AboutPage = () => {
  const isAdmin = authStore((s) => s.isAdmin)()

  const [panelOpen,    setPanelOpen]    = useState(false)
  const [customBlocks, setCustomBlocks] = useState<CustomBlock[]>(loadBlocks)
  const [sections,     setSections]     = useState<SectionVisibility>(loadSections)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [currentLine, setCurrentLine] = useState(0)
  const [stats, setStats] = useState({ 
    hours: 0, 
    digitalized: 0, 
    paper: 0 
  })

  useEffect(() => { localStorage.setItem(BLOCKS_KEY,   JSON.stringify(customBlocks)) }, [customBlocks])
  useEffect(() => { localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections))     }, [sections])

  const handleAddBlock      = (type: BlockType) =>
    setCustomBlocks(p => [...p, { id: crypto.randomUUID(), type, title: type === "text" ? "Nuevo bloque de texto" : "Nueva imagen", content: "", createdAt: Date.now() }])
  const handleDeleteBlock   = (id: string) => setCustomBlocks(p => p.filter(b => b.id !== id))
  const handleUpdateBlock   = (id: string, field: "title" | "content", value: string) =>
    setCustomBlocks(p => p.map(b => b.id === id ? { ...b, [field]: value } : b))
  const handleToggleSection = (key: SectionKey) => setSections(p => ({ ...p, [key]: !p[key] }))


  const codeLines = [
    "// Sistema de Gestión VOAE - UNAH",
    "const universidad = {",
    `  nombre: "Universidad Nacional Autónoma de Honduras",`,
    `  colores: ["${UNAH_BLUE}", "${UNAH_GOLD}"],`,
    '  facultad: "Ingeniería",',
    '  carrera: "Sistemas Computacionales"',
    "};",
    "",
    "function desarrollarSolucion() {",
    "  const proyecto = new VOAE();",
    "  proyecto.gestionarHoras();",
    "  proyecto.facilitarSupervision();",
    "  return 'Orientación a asuntos estudiantiles';",
    "}"
  ]

  useEffect(() => {
    if (currentLine >= codeLines.length) return
    const line = codeLines[currentLine]; let charIndex = 0
    const timer = setInterval(() => {
      if (charIndex <= line.length) {
        setDisplayedText(prev => { const lines = prev.split('\n'); lines[currentLine] = line.slice(0, charIndex); return lines.join('\n') })
        charIndex++
      } else {
        clearInterval(timer)
        setTimeout(() => { setCurrentLine(p => p + 1); setDisplayedText(p => p + '\n') }, 100)
      }
    }, 30)
    return () => clearInterval(timer)
  }, [currentLine])

  useEffect(() => {
    const anim = (end: number, setter: (v: number) => void, dur = 2000) => {
      let v = 0; const inc = end / (dur / 16)
      const t = setInterval(() => { v += inc; if (v >= end) { setter(end); clearInterval(t) } else setter(Math.floor(v)) }, 16)
      return () => clearInterval(t)
    }
    const c1 = anim(1250, (v) => setStats(p => ({ ...p, hours: v })))
    const c2 = anim(100,  (v) => setStats(p => ({ ...p, digitalized: v })))
    const c3 = anim(0,    (v) => setStats(p => ({ ...p, paper: v })), 1000)
    return () => { c1(); c2(); c3() }
  }, [])

  const images = [
    { id: 1, placeholder: "Estudiantes trabajando en laboratorio" },
    { id: 2, placeholder: "Graduación de Ingenieros en Sistemas" },
    { id: 3, placeholder: "Actividades de vinculación VOAE" },
    { id: 4, placeholder: "Proyectos de investigación" }
  ]

  const techStack = [
    { name: "React",         iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
    { name: "TypeScript",   iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
    { name: "Tailwind CSS", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    { name: "Node.js",      iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
    { name: "MySQL",        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
    { name: "Vite",         iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" },
    { name: "Zustand",      iconUrl: "https://cdn.simpleicons.org/zustand/443E38" },
    { name: "Shadcn/UI",   iconUrl: "https://cdn.simpleicons.org/shadcnui/06b6d4" },
  ]

  const competencias = [
    { icon: <Code2 className="w-8 h-8" />, title: "Ingeniería de Software", description: "Desarrollo de soluciones tecnológicas robustas y escalables utilizando metodologías ágiles y buenas prácticas.", skills: ["React", "TypeScript", "Node.js", "Patrones de Diseño"], color: "from-blue-500 to-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { icon: <Database className="w-8 h-8" />, title: "Bases de Datos", description: "Modelado y gestión eficiente de datos con sistemas relacionales y no relacionales.", skills: ["PostgreSQL", "SQL", "Modelado ER", "Optimización"], color: "from-emerald-500 to-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
    { icon: <Brain className="w-8 h-8" />, title: "Inteligencia Artificial", description: "Implementación de algoritmos de machine learning y análisis predictivo.", skills: ["ML", "Análisis Predictivo", "Python", "TensorFlow"], color: "from-purple-500 to-purple-700", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
    { icon: <Workflow className="w-8 h-8" />, title: "DevOps", description: "Automatización de procesos de desarrollo y gestión de infraestructura.", skills: ["CI/CD", "Docker", "Git", "AWS"], color: "from-amber-500 to-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
    { icon: <Network className="w-8 h-8" />, title: "Redes y Seguridad", description: "Diseño e implementación de infraestructuras de red seguras.", skills: ["TCP/IP", "Firewalls", "Ciberseguridad", "VPN"], color: "from-red-500 to-red-700", bgColor: "bg-red-50", borderColor: "border-red-200" },
    { icon: <Cloud className="w-8 h-8" />, title: "Computación en la Nube", description: "Despliegue y gestión de aplicaciones en plataformas cloud escalables.", skills: ["AWS", "Azure", "Microservicios", "Serverless"], color: "from-cyan-500 to-cyan-700", bgColor: "bg-cyan-50", borderColor: "border-cyan-200" },
  ]

  const autoridades = [
    { name: "Ing. Nazarena Idiaquez", position: "Coordinadora de la Carrera y Precursora del Proyecto", role: "Supervisión Académica", department: "Ingeniería en Sistemas Computacionales", email: "coord.is@unah.edu.hn", education: ["Ingeniera en Sistemas"], initials: "N", accentColor: UNAH_BLUE },
    { name: "Ing. Juan Alvarenga", position: "Supervisor del Proyecto", role: "Supervisión Técnica", department: "Ingeniería en Sistemas Computacionales", email: "proyectos.is@unah.edu.hn", education: ["Ingeniero en Sistemas"], initials: "JA", accentColor: UNAH_BLUE_GRADIENT },
  ]

  return (
    <div className="min-h-screen" style={{ background: UNAH_WHITE }}>

      {/* Botón flotante admin */}
      {isAdmin && (
        <button
          onClick={() => setPanelOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl font-semibold text-sm transition-all hover:scale-105"
          style={{ background: UNAH_BLUE, color: "#fff" }}
        >
          <Settings className="w-5 h-5" />
          Administrar tablón
        </button>
      )}

      {isAdmin && (
        <AdminPanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          blocks={customBlocks}
          sections={sections}
          onToggleSection={handleToggleSection}
          onAddBlock={handleAddBlock}
          onDeleteBlock={handleDeleteBlock}
          onUpdateBlock={handleUpdateBlock}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Hero Section */}
        <div className="rounded-2xl overflow-hidden border border-gray-200" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="grid md:grid-cols-2 gap-0 min-h-[500px]">
            <div className="p-8 md:p-12 flex flex-col justify-center" style={{ borderRight: `1px solid ${UNAH_BLUE}15` }}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
                  style={{ borderColor: `${UNAH_BLUE}30`, color: UNAH_BLUE, background: `${UNAH_BLUE}08` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: UNAH_GOLD }} />
                  UNAH - Ingeniería en Sistemas Computacionales
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                  Sistema de Gestión <span style={{ color: UNAH_BLUE }}>VOAE</span>
                </h1>
                <h2 className="text-xl md:text-2xl font-medium" style={{ color: UNAH_BLUE }}>
                  Universidad Nacional Autónoma de Honduras
                </h2>
                <p className="text-base leading-relaxed text-gray-600">
                  Sistema desarrollado por estudiantes de Ingeniería en Sistemas Computacionales para la gestión eficiente de horas VOAE.
                </p>
              </div>
            </div>
            {/* Lado Derecho - Editor VS Code */}
            <div className="flex flex-col rounded-tr-2xl rounded-br-2xl overflow-hidden" style={{ background: "#EFF6FF" }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#DBEAFE", borderBottom: "1px solid #BFDBFE" }}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="mx-auto text-xs font-medium" style={{ color: "#3D5A8A" }}>sistema_voae.js</span>
              </div>
              <div className="flex flex-1 overflow-hidden py-4">
                <pre className="font-mono text-sm leading-relaxed w-full">
                  {displayedText.split('\n').map((line, i) => (
                    <div key={i} className="flex" style={{ minHeight: "1.5rem", background: i === currentLine ? "#DBEAFE" : "transparent" }}>
                      <span className="select-none text-right pr-4 pl-4 text-xs w-12 flex-shrink-0" style={{ color: "#7B9FC7", lineHeight: "1.5rem" }}>{i + 1}</span>
                      <span className="w-0.5 flex-shrink-0" style={{ background: i === currentLine ? UNAH_BLUE : "transparent" }} />
                      <span className="pl-4 pr-4 w-full" style={{ lineHeight: "1.5rem", color: line.includes('//') ? "#6B7AA0" : "#0D1117", fontStyle: line.includes('//') ? "italic" : "normal" }}>
                        {line}{i === currentLine && <span className="animate-pulse" style={{ borderLeft: "2px solid #555550", marginLeft: "1px" }} />}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
              <div className="flex justify-between px-4 py-1 text-xs" style={{ background: "#BFDBFE", color: "#1E3A6E" }}>
                <span>main · JavaScript</span><span style={{ color: UNAH_BLUE, fontWeight: 600 }}>VOAE UNAH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Horas Gestionadas",    value: `+${stats.hours.toLocaleString()}`, suffix: "+",  icon: <Zap className="w-6 h-6" />,    accent: UNAH_BLUE },
            { label: "Proceso Digitalizado", value: stats.digitalized,                  suffix: "%",  icon: <Globe className="w-6 h-6" />,  accent: UNAH_BLUE_GRADIENT },
            { label: "Papel Desperdiciado",  value: stats.paper,                         suffix: "kg", icon: <Shield className="w-6 h-6" />, accent: UNAH_BLUE_LIGHT },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-6 border" style={{ background: UNAH_BLUE_SOFT, borderColor: `${s.accent}20`, borderLeft: `4px solid ${s.accent}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: s.accent }}>{s.label}</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: s.accent }}>
                    {s.value}<span style={{ color: UNAH_GOLD }}>{s.suffix}</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${s.accent}10`, color: s.accent }}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="rounded-xl border border-gray-200 p-8" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-7 h-7" style={{ color: UNAH_BLUE }} />
            <h2 className="text-2xl font-bold text-gray-800">Stack Tecnológico</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {techStack.map((t) => (
              <div key={t.name} className="aspect-square bg-white border border-blue-100 rounded-xl flex flex-col items-center justify-center p-4 hover:shadow-lg hover:scale-105 transition-all duration-300">
                <img src={t.iconUrl} alt={t.name} className="w-8 h-8 mb-2"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                <span className="text-xs font-medium text-gray-700 text-center">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel */}
        {sections.carousel && (
          <div className="rounded-xl border border-gray-200 p-8" style={{ background: UNAH_BLUE_SOFT }}>
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-6 h-6" style={{ color: UNAH_BLUE }} />
              <h2 className="text-2xl font-bold text-gray-800">Galería</h2>
            </div>
            <div className="relative">
              <div className="h-72 bg-gradient-to-br from-blue-50 to-white rounded-lg flex items-center justify-center border border-blue-100">
                <div className="text-center p-8">
                  <GraduationCap className="w-24 h-24 mx-auto mb-4 text-blue-200" />
                  <p className="text-gray-600 font-semibold">{images[currentSlide].placeholder}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCurrentSlide((p) => (p - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full shadow-lg" style={{ color: UNAH_BLUE }}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentSlide((p) => (p + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full shadow-lg" style={{ color: UNAH_BLUE }}>
                <ChevronRight className="w-5 h-5" />
              </Button>
              <div className="flex justify-center gap-2 mt-4">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} className="h-2 rounded-full transition-all"
                    style={{ background: currentSlide === i ? UNAH_BLUE : "#d1d5db", width: currentSlide === i ? 32 : 8 }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Misión y Visión */}
        {sections.misionVision && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-8" style={{ background: UNAH_WHITE, borderColor: UNAH_BLUE, boxShadow: `0 4px 24px 0 ${UNAH_BLUE}20` }}>
              <div className="flex items-center gap-3 mb-6"><Target className="w-7 h-7" style={{ color: UNAH_BLUE }} /><h2 className="text-2xl font-bold text-gray-800">Misión</h2></div>
              <p className="text-gray-700 leading-relaxed">Proveer al estudiante los conocimientos teórico-prácticos necesarios en las áreas de desarrollo de software, administración de recursos, infraestructura y telecomunicaciones, con el fin de formar un profesional de clase mundial capaz de investigar, desarrollar, innovar y formular soluciones a los problemas y necesidades presentes y futuras del país.</p>
            </div>
            <div className="rounded-xl border p-8" style={{ background: UNAH_WHITE, borderColor: UNAH_BLUE_GRADIENT, boxShadow: `0 4px 24px 0 ${UNAH_BLUE_GRADIENT}20` }}>
              <div className="flex items-center gap-3 mb-6"><Eye className="w-7 h-7" style={{ color: UNAH_BLUE }} /><h2 className="text-2xl font-bold text-gray-800">Visión</h2></div>
              <p className="text-gray-700 leading-relaxed">Proveer al país profesionales íntegros, vinculados y comprometidos con la sociedad, que posean las capacidades y habilidades tecnológicas e investigativas necesarias para garantizar el desarrollo e integración de los procesos productivos del país.</p>
            </div>
          </div>
        )}

        {/* Competencias */}
        {sections.competencias && (
          <div className="rounded-xl border border-gray-200 p-8" style={{ background: UNAH_BLUE_SOFT }}>
            <div className="flex items-center gap-3 mb-8"><Code2 className="w-7 h-7" style={{ color: UNAH_BLUE }} /><h2 className="text-2xl font-bold text-gray-800">Áreas de Competencia</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competencias.map((c, i) => (
                <div key={i} className={`${c.bgColor} border ${c.borderColor} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${c.color} text-white`}>{c.icon}</div>
                    <div><h3 className="font-bold text-gray-800 text-lg mb-1">{c.title}</h3><p className="text-gray-600 text-sm">{c.description}</p></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                    {c.skills.map((sk, si) => <span key={si} className="px-3 py-1 bg-white text-gray-700 rounded-full text-xs font-medium border border-gray-200">{sk}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Objetivos */}
        {sections.objetivos && (
          <div className="rounded-xl p-8" style={{ background: UNAH_WHITE, border: `2px solid ${UNAH_BLUE_GRADIENT}`, boxShadow: `0 4px 24px 0 ${UNAH_BLUE_GRADIENT}40` }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Objetivos de la Carrera</h2>
            <div className="space-y-5">
              {[
                { text: "Proporcionar una formación integral que permita al egresado resolver retos prácticos y crecer profesionalmente al ritmo de las innovaciones científicas y tecnológicas.", delay: 0 },
                { text: "Proporcionar las bases científicas y técnicas para un desempeño exitoso en el campo de la ingeniería en sistemas.", delay: 100 },
                { text: "Facilitar la inserción en la sociedad como profesionales de cambio positivo, innovadores y con espíritu de servicio.", delay: 200 },
                { text: "Formar profesionales proactivos con visión estratégica en relación a su contexto social, cultural, tecnológico y ambiental.", delay: 300 },
                { text: "Preparar ingenieros capaces de enfrentar la problemática de la ingeniería en sistemas a nivel nacional e internacional.", delay: 400 },
              ].map((o, i) => <ObjectiveItem key={i} text={o.text} delay={o.delay} />)}
            </div>
          </div>
        )}

        {/* Autoridades */}
        <div className="rounded-xl border border-gray-200 p-8" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="flex items-center gap-3 mb-8"><Users className="w-7 h-7" style={{ color: UNAH_BLUE }} /><h2 className="text-2xl font-bold text-gray-800">Autoridades del Proyecto</h2></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {autoridades.map((a, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all" style={{ background: UNAH_WHITE }}>
                <div className="p-8 relative" style={{ borderTop: `4px solid ${a.accentColor}`, borderBottom: `1px solid ${UNAH_BLUE}15` }}>
                  <div className="absolute top-4 right-4"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${a.accentColor}10`, color: a.accentColor }}><Briefcase className="w-5 h-5" /></div></div>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center" style={{ background: `${a.accentColor}10`, borderColor: `${a.accentColor}30` }}>
                      <span className="text-2xl font-bold" style={{ color: a.accentColor }}>{a.initials}</span>
                    </div>
                    <div><h3 className="text-xl font-bold text-gray-900 mb-1">{a.name}</h3><p className="font-medium text-sm mb-1" style={{ color: a.accentColor }}>{a.position}</p><p className="text-gray-500 text-sm">{a.department}</p></div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-start gap-3 mb-6"><div className="p-2 bg-blue-50 rounded-lg"><Mail className="w-5 h-5 text-blue-600" /></div><div><p className="text-xs text-gray-500 font-medium">Correo Institucional</p><p className="text-sm text-gray-700 font-medium">{a.email}</p></div></div>
                  <div className="pt-4 border-t border-gray-200"><div className="flex items-center gap-2 mb-3"><Award className="w-5 h-5 text-blue-600" /><h4 className="font-semibold text-gray-800">Formación Académica</h4></div>
                    {a.education.map((item, ei) => <div key={ei} className="flex items-start gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full mt-2" /><span className="text-sm text-gray-700">{item}</span></div>)}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200"><div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"><UserCheck className="w-4 h-4" />{a.role}</div></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium mb-4 border" style={{ borderColor: `${UNAH_BLUE}30`, color: UNAH_BLUE, background: `${UNAH_BLUE}08` }}>
              <span className="w-2 h-2 rounded-full" style={{ background: UNAH_GOLD }} />Universidad Nacional Autónoma de Honduras
            </div>
            <p className="text-gray-700 mb-4">Facultad de Ingeniería - Departamento de Ingeniería en Sistemas Computacionales</p>
            <div className="flex flex-wrap gap-6 justify-center mt-4">
              <a href="https://is.unah.edu.hn/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold hover:underline"><GraduationCap className="w-5 h-5 mr-2" />Departamento de Sistemas</a>
              <div className="w-px h-6 bg-gray-300" />
              <a href="https://www.unah.edu.hn/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold hover:underline"><Globe className="w-5 h-5 mr-2" />Portal Institucional UNAH</a>
            </div>
          </div>
        </div>

        {/* Bloques personalizados */}
        {customBlocks.length > 0 && (
          <div className="space-y-6">
            {customBlocks.map((block) => <CustomBlockRenderer key={block.id} block={block} />)}
          </div>
        )}

      </div>
    </div>
  )
}

// ObjectiveItem 
function ObjectiveItem({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])
  return (
    <div className={`flex gap-4 transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
      <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2.5" style={{ background: UNAH_BLUE }} />
      <p className="text-gray-700 text-base leading-relaxed">{text}</p>
    </div>
  )
}