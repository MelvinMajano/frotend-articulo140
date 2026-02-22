import { useState, useEffect } from "react"
import { GraduationCap, Target, Eye, Users, Database, Network, ChevronLeft, ChevronRight, Shield, Zap, Globe, Terminal,  Cloud, Brain, Code2, Workflow, UserCheck, Mail, Award, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

// Paleta de colores inspirada en el logo de Ingeniería en Sistemas UNAH (versión suavizada)
const UNAH_BLUE = "#1E40AF";         // Azul institucional suavizado
const UNAH_GOLD = "#FFD700";         // Dorado institucional
const UNAH_WHITE = "#F9FAFB";        // Fondo institucional
const UNAH_BLUE_SOFT = "#EFF6FF";    // Azul muy suave
const UNAH_BLUE_GRADIENT = "#2563EB"; // Azul medio
const UNAH_BLUE_LIGHT = "#60A5FA";   // Azul claro

export const AboutPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [currentLine, setCurrentLine] = useState(0)
  const [stats, setStats] = useState({
    hours: 0,
    digitalized: 0,
    paper: 0
  })

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

  const images = [
    { id: 1, placeholder: "Estudiantes trabajando en laboratorio" },
    { id: 2, placeholder: "Graduación de Ingenieros en Sistemas" },
    { id: 3, placeholder: "Actividades de vinculación VOAE" },
    { id: 4, placeholder: "Proyectos de investigación" }
  ]

  const techStack = [
    { name: "React",         iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",              fallback: "⚛️", color: "text-blue-400" },
    { name: "TypeScript",   iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",    fallback: "TS",  color: "text-blue-600" },
    { name: "Tailwind CSS", iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",   fallback: "🎨", color: "text-teal-400" },
    { name: "Node.js",      iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",             fallback: "🟢", color: "text-green-600" },
    { name: "MySQL",        iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",               fallback: "🗄️", color: "text-emerald-500" },
    { name: "Vite",         iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg",             fallback: "⚡",  color: "text-purple-500" },
    { name: "Zustand",      iconUrl: "https://cdn.simpleicons.org/zustand/443E38",                                                       fallback: "🐻",  color: "text-amber-800" },
    { name: "Shadcn/UI",   iconUrl: "https://cdn.simpleicons.org/shadcnui/06b6d4",                                                      fallback: "🎯",  color: "text-cyan-500" }
  ]

  const competencias = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: "Ingeniería de Software",
      description: "Desarrollo de soluciones tecnológicas robustas y escalables utilizando metodologías ágiles y buenas prácticas de programación.",
      skills: ["React", "TypeScript", "Node.js", "Patrones de Diseño"],
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Bases de Datos",
      description: "Modelado y gestión eficiente de datos con sistemas de bases de datos relacionales y no relacionales.",
      skills: ["PostgreSQL", "SQL", "Modelado ER", "Optimización"],
      color: "from-emerald-500 to-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Inteligencia Artificial",
      description: "Implementación de algoritmos de machine learning y análisis predictivo para soluciones inteligentes.",
      skills: ["ML", "Análisis Predictivo", "Python", "TensorFlow"],
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: <Workflow className="w-8 h-8" />,
      title: "DevOps",
      description: "Automatización de procesos de desarrollo, despliegue continuo y gestión de infraestructura.",
      skills: ["CI/CD", "Docker", "Git", "AWS"],
      color: "from-amber-500 to-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Redes y Seguridad",
      description: "Diseño e implementación de infraestructuras de red seguras y sistemas de telecomunicaciones.",
      skills: ["TCP/IP", "Firewalls", "Ciberseguridad", "VPN"],
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Computación en la Nube",
      description: "Despliegue y gestión de aplicaciones en plataformas cloud con arquitecturas escalables.",
      skills: ["AWS", "Azure", "Microservicios", "Serverless"],
      color: "from-cyan-500 to-cyan-700",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200"
    }
  ]

  const autoridades = [
    {
      name: "Ing. Nazarena Idiaquez",
      position: "Coordinadora de la Carrera y Precursora del Proyecto",
      role: "Supervisión Académica",
      department: "Ingeniería en Sistemas Computacionales",
      location: "Campus Cortés",
      email: "coord.is@unah.edu.hn",
      education: [
        "Ingeniera en Sistemas",
      ],
      initials: "N",
      accentColor: UNAH_BLUE
    },
    {
      name: "Ing. Juan Alvarenga",
      position: "Supervisor del Proyecto",
      role: "Supervisión Técnica",
      department: "Ingeniería en Sistemas Computacionales",
      location: "Campus Cortés",
      email: "proyectos.is@unah.edu.hn",
      education: [
        "Ingeniero en Sistemas",
      ],
      initials: "JA",
      accentColor: UNAH_BLUE_GRADIENT
    }
  ]

  // Animación de escritura de código
  useEffect(() => {
    if (currentLine < codeLines.length) {
      const line = codeLines[currentLine]
      let charIndex = 0
      
      const timer = setInterval(() => {
        if (charIndex <= line.length) {
          setDisplayedText(prev => {
            const lines = prev.split('\n')
            lines[currentLine] = line.slice(0, charIndex)
            return lines.join('\n')
          })
          charIndex++
        } else {
          clearInterval(timer)
          setTimeout(() => {
            setCurrentLine(prev => prev + 1)
            setDisplayedText(prev => prev + '\n')
          }, 100)
        }
      }, 30)

      return () => clearInterval(timer)
    }
  }, [currentLine])

  // Animación de estadísticas
  useEffect(() => {
    const animateCounter = (endValue: number, setter: (value: number) => void, duration: number = 2000) => {
      let startValue = 0
      const increment = endValue / (duration / 16)
      const timer = setInterval(() => {
        startValue += increment
        if (startValue >= endValue) {
          setter(endValue)
          clearInterval(timer)
        } else {
          setter(Math.floor(startValue))
        }
      }, 16)
      return () => clearInterval(timer)
    }

    const cleanups = [
      animateCounter(1250, (val) => setStats(prev => ({ ...prev, hours: val }))),
      animateCounter(100, (val) => setStats(prev => ({ ...prev, digitalized: val }))),
      animateCounter(0, (val) => setStats(prev => ({ ...prev, paper: val })), 1000)
    ]

    return () => cleanups.forEach(cleanup => cleanup())
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen" style={{ background: UNAH_WHITE }}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="rounded-2xl overflow-hidden border border-gray-200" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="grid md:grid-cols-2 gap-0 min-h-[500px]">
            {/* Lado Izquierdo - Información */}
            <div className="p-8 md:p-12 flex flex-col justify-center" style={{ borderRight: `1px solid ${UNAH_BLUE}15` }}>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border" style={{ borderColor: `${UNAH_BLUE}30`, color: UNAH_BLUE, background: `${UNAH_BLUE}08` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: UNAH_GOLD }}></span>
                  UNAH - Ingeniería en Sistemas Computacionales
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                  Sistema de Gestión{" "}
                  <span style={{ color: UNAH_BLUE }}>VOAE</span>
                </h1>
                <h2 className="text-xl md:text-2xl font-medium" style={{ color: UNAH_BLUE }}>
                  Universidad Nacional Autónoma de Honduras
                </h2>
                <p className="text-base leading-relaxed text-gray-600">
                  Sistema desarrollado por estudiantes de Ingeniería en Sistemas Computacionales 
                  para la gestión eficiente de horas VOAE, promoviendo la innovación tecnológica 
                  en nuestra universidad.
                </p>

              </div>
            </div>

            {/* Lado Derecho - Editor VS Code */}
            <div className="flex flex-col rounded-tr-2xl rounded-br-2xl overflow-hidden" style={{ background: "#EFF6FF" }}>
              
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#DBEAFE", borderBottom: "1px solid #BFDBFE" }}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300 cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer"></div>
                </div>
                <span className="mx-auto text-xs font-medium" style={{ color: "#3D5A8A" }}>sistema_voae.js — VOAE UNAH</span>
              </div>

              {/* Tab bar */}
              <div className="flex items-end" style={{ background: "#DBEAFE", borderBottom: "1px solid #BFDBFE" }}>
                <div className="flex items-center gap-2 px-4 py-2 text-xs font-mono border-t-2" style={{ background: "#EFF6FF", borderTopColor: UNAH_BLUE, color: "#0D1117" }}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#cb9b2e" }}><path d="M3 3h18v18H3V3zm16 16V5H5v14h14z"/></svg>
                  sistema_voae.js
                  <span className="ml-1 opacity-40 hover:opacity-80 cursor-pointer">×</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 text-xs font-mono opacity-50" style={{ color: "#3D5A8A" }}>
                  package.json
                </div>
              </div>

              {/* Explorer breadcrumb */}
              <div className="px-4 py-1 text-xs flex items-center gap-1" style={{ background: "#EFF6FF", color: "#7B9FC7", borderBottom: "1px solid #BFDBFE" }}>
                <span>VOAE</span>
                <span className="opacity-40">›</span>
                <span>src</span>
                <span className="opacity-40">›</span>
                <span style={{ color: "#1E3A6E" }}>sistema_voae.js</span>
              </div>

              {/* Editor area */}
              <div className="flex flex-1 overflow-hidden px-0 py-4">
                <pre className="font-mono text-sm leading-relaxed w-full">
                  {displayedText.split('\n').map((line, i) => (
                    <div key={i} className="flex group" style={{ minHeight: "1.5rem", background: i === currentLine ? "#DBEAFE" : "transparent" }}>
                      {/* Gutter */}
                      <span className="select-none text-right pr-4 pl-4 text-xs transition-colors w-12 flex-shrink-0" style={{ color: "#7B9FC7", lineHeight: "1.5rem" }}>{i + 1}</span>
                      {/* Active line indicator */}
                      <span className="w-0.5 flex-shrink-0" style={{ background: i === currentLine ? UNAH_BLUE : "transparent" }}></span>
                      {/* Code */}
                      <span className="pl-4 pr-4 w-full" style={{ lineHeight: "1.5rem" }}>
                        {line.includes('//') ? (
                          <span style={{ color: "#6B7AA0", fontStyle: "italic" }}>{line}</span>
                        ) : line.includes('//') || (line.includes('const') && !line.includes('"') && !line.includes("'")) || line.includes('function') || line.includes('return') || line.includes('new ') ? (
                          <span>
                            {line.split(/\b(const|function|return|new)\b/).map((part, pi) => (
                              /^(const|function|return|new)$/.test(part)
                                ? <span key={pi} style={{ color: "#0D2D9E", fontWeight: 500 }}>{part}</span>
                                : <span key={pi} style={{ color: line.includes('colores') || line.includes('VOAE') || line.includes('desarrollarSolucion') ? "#5C2D06" : line.includes('universidad') || line.includes('proyecto') ? "#0B4FA8" : line.includes('"') || line.includes("'") ? "#1A4D0A" : "#0D1117" }}>{part}</span>
                            ))}
                          </span>
                        ) : line.includes('colores') || line.includes('VOAE') || line.includes('desarrollarSolucion') ? (
                          <span style={{ color: "#5C2D06" }}>{line}</span>
                        ) : line.includes('"') || line.includes("'") ? (
                          <span style={{ color: "#1A4D0A" }}>{line}</span>
                        ) : line.includes('universidad') || line.includes('proyecto') ? (
                          <span style={{ color: "#0B4FA8" }}>{line}</span>
                        ) : (
                          <span style={{ color: "#0D1117" }}>{line}</span>
                        )}
                        {i === currentLine && <span className="animate-pulse" style={{ borderLeft: "2px solid #555550", marginLeft: "1px" }}></span>}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-1 text-xs" style={{ background: "#BFDBFE", color: "#1E3A6E" }}>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-4.95 11.95L13.95 3.05A6.97 6.97 0 0 0 8 1zM2.05 12.95A7 7 0 0 0 13.95 3.05L2.05 12.95z"/></svg>
                    main
                  </span>
                  <span>JavaScript</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>UTF-8</span>
                  <span style={{ color: UNAH_BLUE, fontWeight: 600 }}>VOAE UNAH</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl p-6 border transition-all duration-300" style={{ background: UNAH_BLUE_SOFT, borderColor: `${UNAH_BLUE}20`, borderLeft: `4px solid ${UNAH_BLUE}` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: UNAH_BLUE }}>Horas Gestionadas</p>
                <p className="text-4xl font-bold mt-2" style={{ color: UNAH_BLUE }}>
                  +{stats.hours.toLocaleString()}
                  <span style={{ color: UNAH_GOLD }}>+</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${UNAH_BLUE}10` }}>
                <Zap className="w-6 h-6" style={{ color: UNAH_BLUE }} />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl p-6 border transition-all duration-300" style={{ background: UNAH_BLUE_SOFT, borderColor: `${UNAH_BLUE_GRADIENT}20`, borderLeft: `4px solid ${UNAH_BLUE_GRADIENT}` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: UNAH_BLUE_GRADIENT }}>Proceso Digitalizado</p>
                <p className="text-4xl font-bold mt-2" style={{ color: UNAH_BLUE_GRADIENT }}>
                  {stats.digitalized}
                  <span style={{ color: UNAH_GOLD }}>%</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${UNAH_BLUE_GRADIENT}10` }}>
                <Globe className="w-6 h-6" style={{ color: UNAH_BLUE_GRADIENT }} />
              </div>
            </div>
          </div>
          
          <div className="rounded-xl p-6 border transition-all duration-300" style={{ background: UNAH_BLUE_SOFT, borderColor: `${UNAH_BLUE_LIGHT}30`, borderLeft: `4px solid ${UNAH_BLUE_LIGHT}` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: UNAH_BLUE }}>Papel Desperdiciado</p>
                <p className="text-4xl font-bold mt-2" style={{ color: UNAH_BLUE }}>
                  {stats.paper}
                  <span style={{ color: UNAH_GOLD }}>kg</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${UNAH_BLUE_LIGHT}15` }}>
                <Shield className="w-6 h-6" style={{ color: UNAH_BLUE_LIGHT }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="rounded-xl border border-gray-200 p-8" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="w-7 h-7" style={{ color: UNAH_BLUE }} />
            <h2 className="text-2xl font-bold text-gray-800">Stack Tecnológico</h2>
          </div>
          <p className="text-gray-600 mb-6 text-center">
            Tecnologías utilizadas en el desarrollo del sistema
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {techStack.map((tech, index) => (
              <div 
                key={tech.name} 
                className="aspect-square bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center p-4 hover:border-blue-300 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img
                  src={tech.iconUrl}
                  alt={tech.name}
                  className="w-8 h-8 mb-2"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.style.display = 'none';
                    const fallbackEl = document.createElement('span');
                    fallbackEl.className = `text-2xl mb-2 ${tech.color}`;
                    fallbackEl.textContent = tech.fallback;
                    img.parentNode?.insertBefore(fallbackEl, img);
                  }}
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-900">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel de Imágenes */}
        <div className="rounded-xl border border-gray-200 p-8" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-6 h-6" style={{ color: UNAH_BLUE }} />
            <h2 className="text-2xl font-bold text-gray-800">Galería</h2>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div className="relative h-96 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center border border-blue-100">
                <div className="text-center p-8">
                  <GraduationCap className="w-32 h-32 mx-auto mb-6 text-blue-200" />
                  <p className="text-gray-600 font-semibold text-lg mb-2">Imagen {currentSlide + 1} de {images.length}</p>
                  <p className="text-base text-gray-500">{images[currentSlide].placeholder}</p>
                </div>
              </div>
            </div>
            
            {/* Controles del carrusel */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full"
              style={{ color: UNAH_BLUE }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full"
              style={{ color: UNAH_BLUE }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 p-8 transition-shadow" style={{ background: UNAH_WHITE, borderColor: `${UNAH_BLUE}`, boxShadow: `0 4px 24px 0 ${UNAH_BLUE}20` }}>
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-7 h-7" style={{ color: UNAH_BLUE }} />
              <h2 className="text-2xl font-bold text-gray-800">Misión</h2>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              Proveer al estudiante los conocimientos teórico-prácticos necesarios en las áreas de desarrollo de software, administración de recursos, infraestructura y telecomunicaciones, con el fin de formar un profesional de clase mundial capaz de investigar, desarrollar, innovar y formular soluciones a los problemas y necesidades presentes y futuras del país.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-8 transition-shadow" style={{ background: UNAH_WHITE, borderColor: `${UNAH_BLUE_GRADIENT}`, boxShadow: `0 4px 24px 0 ${UNAH_BLUE_GRADIENT}20` }}>
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-7 h-7" style={{ color: UNAH_BLUE }} />
              <h2 className="text-2xl font-bold text-gray-800">Visión</h2>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              Proveer al país profesionales íntegros, vinculados y comprometidos con la sociedad, que posean las capacidades y habilidades tecnológicas e investigativas necesarias para garantizar el desarrollo e integración de los procesos productivos del país, a través del uso de tecnología informática de punta y estándares de clase mundial.
            </p>
          </div>
        </div>

        {/* Áreas de Competencia     */}
        <div className="rounded-xl border border-gray-200 p-8" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="flex items-center gap-3 mb-8">
            <Code2 className="w-7 h-7" style={{ color: UNAH_BLUE }} />
            <h2 className="text-2xl font-bold text-gray-800">Áreas de Competencia</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competencias.map((competencia, index) => (
              <div 
                key={index}
                className={`${competencia.bgColor} border ${competencia.borderColor} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${competencia.color} text-white`}>
                    {competencia.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{competencia.title}</h3>
                    <p className="text-gray-600 text-sm">{competencia.description}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Habilidades técnicas:</p>
                  <div className="flex flex-wrap gap-2">
                    {competencia.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1 bg-white text-gray-700 rounded-full text-xs font-medium border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Objetivos */}
        <div className="rounded-xl p-8" style={{ background: UNAH_WHITE, border: `2px solid ${UNAH_BLUE_GRADIENT}`, boxShadow: `0 4px 24px 0 ${UNAH_BLUE_GRADIENT}40` }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Objetivos de la Carrera</h2>
          <div className="space-y-5">
            <ObjectiveItem 
              text="Proporcionar una formación integral que permita al egresado resolver retos prácticos y crecer profesionalmente al ritmo de las innovaciones científicas y tecnológicas." 
              delay={0}
            />
            <ObjectiveItem 
              text="Proporcionar las bases científicas y técnicas para un desempeño exitoso en el campo de la ingeniería en sistemas." 
              delay={100}
            />
            <ObjectiveItem 
              text="Facilitar la inserción en la sociedad como profesionales de cambio positivo, innovadores y con espíritu de servicio." 
              delay={200}
            />
            <ObjectiveItem 
              text="Formar profesionales proactivos con visión estratégica en relación a su contexto social, cultural, tecnológico y ambiental." 
              delay={300}
            />
            <ObjectiveItem 
              text="Preparar ingenieros capaces de enfrentar la problemática de la ingeniería en sistemas a nivel nacional e internacional." 
              delay={400}
            />
          </div>
        </div>

        {/* Autoridades */}
        <div className="rounded-xl border border-gray-200 p-8" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-7 h-7" style={{ color: UNAH_BLUE }} />
            <h2 className="text-2xl font-bold text-gray-800">Autoridades del Proyecto</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {autoridades.map((autoridad, index) => (
              <div 
                key={index}
                className="border border-gray-200 rounded-xl p-0 overflow-hidden transition-all duration-300 h-full hover:shadow-xl" style={{ background: UNAH_WHITE, boxShadow: `0 4px 20px 0 ${UNAH_BLUE}18` }}
              >
                {/* Header con foto/avatar */}
                <div className="p-8 relative" style={{ background: UNAH_WHITE, borderBottom: `1px solid ${UNAH_BLUE}15`, borderTop: `4px solid ${autoridad.accentColor}` }}>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${autoridad.accentColor}10`, color: autoridad.accentColor }}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Avatar con iniciales */}
                    <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center" style={{ background: `${autoridad.accentColor}10`, borderColor: `${autoridad.accentColor}30` }}>
                      <span className="text-2xl font-bold" style={{ color: autoridad.accentColor }}>
                        {autoridad.initials}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{autoridad.name}</h3>
                      <p className="font-medium mb-1 text-sm" style={{ color: autoridad.accentColor }}>{autoridad.position}</p>
                      <p className="text-gray-500 text-sm">{autoridad.department}</p>
                    </div>
                  </div>
                </div>
                
                {/* Contenido */}
                <div className="p-8">
                  {/* Información de contacto */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg mt-1">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Correo Institucional</p>
                        <p className="text-sm text-gray-700 font-medium">{autoridad.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg mt-1">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Ubicación</p>
                        <p className="text-sm text-gray-700">{autoridad.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Formación Académica */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-800">Formación Académica</h4>
                    </div>
                    <ul className="space-y-3">
                      {autoridad.education.map((item, eduIndex) => (
                        <li key={eduIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Rol en el proyecto */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      <UserCheck className="w-4 h-4" />
                      {autoridad.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer institucional */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium mb-4 border" style={{ borderColor: `${UNAH_BLUE}30`, color: UNAH_BLUE, background: `${UNAH_BLUE}08` }}>
              <span className="w-2 h-2 rounded-full" style={{ background: UNAH_GOLD }}></span>
              Universidad Nacional Autónoma de Honduras
            </div>
            <p className="text-gray-700 text-base mb-4">
              Facultad de Ingeniería - Departamento de Ingenieria en Sistemas Computacionales<br />
              Proyecto desarrollado bajo supervisión académica y técnica
            </p>
            <div className="flex flex-wrap gap-6 justify-center items-center mt-6">
              <a 
                href="https://is.unah.edu.hn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-base hover:underline transition-all"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Departamento de Sistemas
              </a>
              <div className="w-px h-6 bg-gray-300"></div>
              <a 
                href="https://www.unah.edu.hn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-base hover:underline transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Portal Institucional UNAH
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ObjectiveItem({ text, delay }: { text: string, delay: number }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div className={`flex gap-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
      <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2.5" style={{ backgroundColor: UNAH_BLUE }}></div>
      <p className="text-gray-700 text-base leading-relaxed">{text}</p>
    </div>
  )
}