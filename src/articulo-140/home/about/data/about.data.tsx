import { Database, Network, Cloud, Brain, Code2, Workflow } from "lucide-react"
import { UNAH_BLUE, UNAH_BLUE_GRADIENT } from "@/lib/colors"

// ─── Tech Stack ───────────────────────────────────────────────────────────────
export const TECH_STACK = [
  { name: "React",        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "TypeScript",   iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "Tailwind CSS", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Node.js",      iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
  { name: "MySQL",        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: "Vite",         iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" },
  { name: "Zustand",      iconUrl: "https://cdn.simpleicons.org/zustand/443E38" },
  { name: "Shadcn/UI",    iconUrl: "https://cdn.simpleicons.org/shadcnui/06b6d4" },
]

// ─── Competencias ─────────────────────────────────────────────────────────────
export const COMPETENCIAS = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "Ingeniería de Software",
    description: "Desarrollo de soluciones tecnológicas robustas y escalables utilizando metodologías ágiles y buenas prácticas.",
    skills: ["React", "TypeScript", "Node.js", "Patrones de Diseño"],
    color: "from-blue-500 to-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200",
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Bases de Datos",
    description: "Modelado y gestión eficiente de datos con sistemas relacionales y no relacionales.",
    skills: ["PostgreSQL", "SQL", "Modelado ER", "Optimización"],
    color: "from-emerald-500 to-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200",
  },
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Inteligencia Artificial",
    description: "Implementación de algoritmos de machine learning y análisis predictivo.",
    skills: ["ML", "Análisis Predictivo", "Python", "TensorFlow"],
    color: "from-purple-500 to-purple-700", bgColor: "bg-purple-50", borderColor: "border-purple-200",
  },
  {
    icon: <Workflow className="w-8 h-8" />,
    title: "DevOps",
    description: "Automatización de procesos de desarrollo y gestión de infraestructura.",
    skills: ["CI/CD", "Docker", "Git", "AWS"],
    color: "from-amber-500 to-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-200",
  },
  {
    icon: <Network className="w-8 h-8" />,
    title: "Redes y Seguridad",
    description: "Diseño e implementación de infraestructuras de red seguras.",
    skills: ["TCP/IP", "Firewalls", "Ciberseguridad", "VPN"],
    color: "from-red-500 to-red-700", bgColor: "bg-red-50", borderColor: "border-red-200",
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Computación en la Nube",
    description: "Despliegue y gestión de aplicaciones en plataformas cloud escalables.",
    skills: ["AWS", "Azure", "Microservicios", "Serverless"],
    color: "from-cyan-500 to-cyan-700", bgColor: "bg-cyan-50", borderColor: "border-cyan-200",
  },
]

// ─── Autoridades ──────────────────────────────────────────────────────────────
export const AUTORIDADES = [
  {
    name: "Ing. Nazarena Idiaquez",
    position: "Coordinadora de la Carrera y Precursora del Proyecto",
    role: "Supervisión Académica",
    department: "Ingeniería en Sistemas Computacionales",
    email: "coord.is@unah.edu.hn",
    education: ["Ingeniera en Sistemas"],
    initials: "N",
    accentColor: UNAH_BLUE,
  },
  {
    name: "Ing. Juan Alvarenga",
    position: "Supervisor del Proyecto",
    role: "Supervisión Técnica",
    department: "Ingeniería en Sistemas Computacionales",
    email: "proyectos.is@unah.edu.hn",
    education: ["Ingeniero en Sistemas"],
    initials: "JA",
    accentColor: UNAH_BLUE_GRADIENT,
  },
]

// ─── Objetivos ────────────────────────────────────────────────────────────────
export const OBJETIVOS = [
  { text: "Proporcionar una formación integral que permita al egresado resolver retos prácticos y crecer profesionalmente al ritmo de las innovaciones científicas y tecnológicas.", delay: 0 },
  { text: "Proporcionar las bases científicas y técnicas para un desempeño exitoso en el campo de la ingeniería en sistemas.", delay: 100 },
  { text: "Facilitar la inserción en la sociedad como profesionales de cambio positivo, innovadores y con espíritu de servicio.", delay: 200 },
  { text: "Formar profesionales proactivos con visión estratégica en relación a su contexto social, cultural, tecnológico y ambiental.", delay: 300 },
  { text: "Preparar ingenieros capaces de enfrentar la problemática de la ingeniería en sistemas a nivel nacional e internacional.", delay: 400 },
]

// ─── Galería placeholder ──────────────────────────────────────────────────────
export const GALLERY_IMAGES = [
  { id: 1, placeholder: "Estudiantes trabajando en laboratorio" },
  { id: 2, placeholder: "Graduación de Ingenieros en Sistemas" },
  { id: 3, placeholder: "Actividades de vinculación VOAE" },
  { id: 4, placeholder: "Proyectos de investigación" },
]

// ─── Código animado ───────────────────────────────────────────────────────────
export const getCodeLines = (blue: string, gold: string) => [
  "// Sistema de Gestión VOAE - UNAH",
  "const universidad = {",
  `  nombre: "Universidad Nacional Autónoma de Honduras",`,
  `  colores: ["${blue}", "${gold}"],`,
  '  facultad: "Ingeniería",',
  '  carrera: "Sistemas Computacionales"',
  "};",
  "",
  "function desarrollarSolucion() {",
  "  const proyecto = new VOAE();",
  "  proyecto.gestionarHoras();",
  "  proyecto.facilitarSupervision();",
  "  return 'Orientación a asuntos estudiantiles';",
  "}",
]