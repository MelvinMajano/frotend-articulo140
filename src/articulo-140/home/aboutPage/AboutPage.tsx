import { useState, useEffect } from "react"
import { GraduationCap, Target, Eye, Users, Database, Network, ChevronLeft, ChevronRight, Shield, Zap, Globe, Terminal,  Cloud, Brain, Code2, Workflow, UserCheck, Mail, Award, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

// Colores institucionales UNAH
const UNAH_BLUE = "#002D72"
const UNAH_GOLD = "#FFD700"

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
    { name: "React", icon: "⚛️", color: "text-blue-400" },
    { name: "TypeScript", icon: "TS", color: "text-blue-600" },
    { name: "Tailwind CSS", icon: "🎨", color: "text-teal-400" },
    { name: "Node.js", icon: "🟢", color: "text-green-600" },
    { name: "My SQL", icon: "🗄️", color: "text-emerald-500" },
    { name: "Vite", icon: "⚡", color: "text-purple-500" },
    { name: "Lucide Icons", icon: "✨", color: "text-pink-400" },
    { name: "Shadcn/UI", icon: "🎯", color: "text-cyan-500" }
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
      bgColor: "from-blue-600 to-blue-800"
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
      bgColor: "from-slate-700 to-slate-900"
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section - Estilo Código con colores UNAH */}
        <div className="bg-gradient-to-br from-slate-900 via-[#001a4d] to-slate-900 shadow-2xl rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0 min-h-[500px]">
            {/* Lado Izquierdo - Información */}
            <div className="p-8 md:p-12 flex flex-col justify-center relative">
              <div className="absolute top-6 left-6 flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              <div className="mt-8 space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-900/30 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-2 border border-blue-700/30">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                  UNAH - Ingeniería en Sistemas Computacionales
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Sistema de Gestión <span className="text-[#FFD700]">VOAE</span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-blue-300">
                  Universidad Nacional Autónoma de Honduras
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Sistema desarrollado por estudiantes de Ingeniería en Sistemas Computacionales 
                  para la gestión eficiente de horas VOAE, promoviendo la innovación tecnológica 
                  en nuestra universidad.
                </p>
              </div>
            </div>

            {/* Lado Derecho - Código */}
            <div className="bg-slate-950/50 p-8 md:p-12 flex items-center border-l border-slate-700/50">
              <div className="w-full">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-mono">sistema_voae.js</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="w-2 h-2 rounded-full bg-[#FFD700]"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-800"></div>
                  </div>
                </div>
                <pre className="font-mono text-base leading-relaxed">
                  {displayedText.split('\n').map((line, i) => (
                    <div key={i} className="flex hover:bg-slate-800/30 px-2 -mx-2 rounded">
                      <span className="text-gray-600 select-none w-8 text-right mr-4 text-sm">{i + 1}</span>
                      <span className={
                        line.includes('//') ? 'text-gray-500 italic' :
                        line.includes('colores') ? 'text-[#FFD700]' :
                        line.includes('const') || line.includes('function') || line.includes('return') || line.includes('new') ? 'text-purple-400 font-semibold' :
                        line.includes('"') || line.includes("'") ? 'text-emerald-400' :
                        line.includes('universidad') || line.includes('proyecto') ? 'text-blue-400' :
                        line.includes('VOAE') || line.includes('desarrollarSolucion') ? 'text-[#FFD700]' :
                        'text-gray-300'
                      }>
                        {line}
                        {i === currentLine && <span className="animate-pulse text-[#FFD700]">|</span>}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Banner de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Horas Gestionadas</p>
                <p className="text-4xl font-bold text-white mt-2">
                  +{stats.hours.toLocaleString()}
                  <span className="text-[#FFD700]">+</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-700/50 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#FFD700]" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-800 to-blue-700 rounded-2xl p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Proceso Digitalizado</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.digitalized}
                  <span className="text-[#FFD700]">%</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600/50 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#FFD700]" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Papel Desperdiciado</p>
                <p className="text-4xl font-bold text-white mt-2">
                  {stats.paper}
                  <span className="text-[#FFD700]">kg</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/50 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#FFD700]" />
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
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
                <span className={`text-2xl mb-2 ${tech.color}`}>{tech.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-900">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel de Imágenes */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
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
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-7 h-7" style={{ color: UNAH_BLUE }} />
              <h2 className="text-2xl font-bold text-gray-800">Misión</h2>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              Proveer al estudiante los conocimientos teórico-prácticos necesarios en las áreas de desarrollo de software, administración de recursos, infraestructura y telecomunicaciones, con el fin de formar un profesional de clase mundial capaz de investigar, desarrollar, innovar y formular soluciones a los problemas y necesidades presentes y futuras del país.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
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
        <div className="bg-white rounded-2xl shadow-lg p-8">
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
        <div className="bg-white rounded-2xl shadow-lg p-8">
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
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-7 h-7" style={{ color: UNAH_BLUE }} />
            <h2 className="text-2xl font-bold text-gray-800">Autoridades del Proyecto</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {autoridades.map((autoridad, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-0 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full"
              >
                {/* Header con foto/avatar */}
                <div className={`p-8 bg-gradient-to-r ${autoridad.bgColor} relative`}>
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white/80" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Avatar con iniciales */}
                    <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/30 flex items-center justify-center shadow-xl">
                      <span className="text-4xl font-bold text-white">
                        {autoridad.initials}
                      </span>
                    </div>
                    
                    <div className="text-white">
                      <h3 className="text-2xl font-bold mb-2">{autoridad.name}</h3>
                      <p className="text-blue-200 font-medium mb-1">{autoridad.position}</p>
                      <p className="text-gray-300 text-sm">{autoridad.department}</p>
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-full text-sm font-medium mb-4 shadow-lg">
              <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
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