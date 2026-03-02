import { useCallback, useState, useEffect, useRef } from "react"
import Joyride, {
  type CallBackProps,
  type Step,
  STATUS,
  EVENTS,
  type TooltipRenderProps,
} from "react-joyride"
import { useTour } from "@/articulo-140/hooks/activities/admin/useTour"
import { X, ChevronLeft, ChevronRight, CheckCheck, Keyboard } from "lucide-react"
import logoPuma from "@/assest/puma_unah.png"

// ─── Tipos ────────────────────────────────────────────────────────────────────

type PumaMood = "wave" | "point" | "search" | "inspect" | "look_left" | "look_right" | "celebrate"

/** Extiende Step de react-joyride para definir comportamiento del puma por paso */
export interface TourStep extends Step {
  /** Lado donde aparece el puma. Default: "left" */
  pumaPosition?: "left" | "right"
  /** Animación del puma. Sobreescribe el mood por defecto del índice */
  pumaMood?: PumaMood
  /** Texto de la burbuja encima del puma. Sobreescribe el label por defecto del índice */
  pumaLabel?: string
}

interface GuidedTourProps {
  tourId?: string
  steps: TourStep[]
  onFinish?: () => void
  /** Posición global del puma si el paso no define la suya. Default: "left" */
  defaultPumaPosition?: "left" | "right"
}

// ─── Emociones del puma por paso ──────────────────────────────────────────────

interface StepMood {
  mood: PumaMood
  label: string
}

const STEP_MOODS: StepMood[] = [
  { mood: "wave",        label: "¡Hola!" },
  { mood: "search",      label: "Busca aquí" },
  { mood: "look_right",  label: "Clic aquí" },   
  { mood: "inspect",     label: "La tabla" },
  { mood: "look_right",  label: "Consultar" },    
  { mood: "look_right",  label: "Agregar" },
  { mood: "celebrate",   label: "¡Listo!" },
]

// ─── CSS de animaciones ───────────────────────────────────────────────────────

const ANIMATIONS_CSS = `
  @keyframes puma-enter {
    0%   { opacity: 0; transform: translateY(30px) scale(0.7); }
    60%  { transform: translateY(-8px) scale(1.05); }
    80%  { transform: translateY(4px) scale(0.97); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes puma-exit {
    0%   { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-20px) scale(0.8); }
  }
  @keyframes puma-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-7px); }
  }
  @keyframes puma-wave {
    0%,100% { transform: rotate(0deg) translateY(0px); }
    20%     { transform: rotate(-12deg) translateY(-4px); }
    40%     { transform: rotate(10deg) translateY(-6px); }
    60%     { transform: rotate(-8deg) translateY(-4px); }
    80%     { transform: rotate(6deg) translateY(-2px); }
  }
  @keyframes puma-point {
    0%,100% { transform: translateX(0) translateY(0); }
    30%     { transform: translateX(6px) translateY(-3px); }
    60%     { transform: translateX(3px) translateY(-5px); }
  }
  @keyframes puma-search {
    0%,100% { transform: rotate(0deg) translateY(0); }
    25%     { transform: rotate(-5deg) translateY(-3px); }
    75%     { transform: rotate(5deg) translateY(-3px); }
  }
  @keyframes puma-inspect {
    0%,100% { transform: translateY(0); }
    25%     { transform: translateY(-5px); }
    50%     { transform: translateY(-8px); }
    75%     { transform: translateY(-5px); }
  }
  @keyframes puma-look-left {
    0%,100% { transform: translateX(0) rotate(0deg); }
    40%     { transform: translateX(-6px) rotate(-4deg); }
    70%     { transform: translateX(-4px) rotate(-2deg); }
  }
  @keyframes puma-look-right {
    0%,100% { transform: scaleX(-1) translateX(0) rotate(0deg); }
    40%     { transform: scaleX(-1) translateX(-6px) rotate(-4deg); }
    70%     { transform: scaleX(-1) translateX(-4px) rotate(-2deg); }
  }
  @keyframes puma-celebrate {
    0%,100% { transform: translateY(0) rotate(0deg) scale(1); }
    20%     { transform: translateY(-12px) rotate(-8deg) scale(1.08); }
    40%     { transform: translateY(-16px) rotate(6deg) scale(1.1); }
    60%     { transform: translateY(-10px) rotate(-4deg) scale(1.05); }
    80%     { transform: translateY(-5px) rotate(2deg) scale(1.02); }
  }
  @keyframes speech-pop {
    0%   { opacity: 0; transform: scale(0.5) translateY(6px); }
    70%  { transform: scale(1.08) translateY(-2px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes sparkle {
    0%,100% { opacity: 0; transform: scale(0) rotate(0deg); }
    50%     { opacity: 1; transform: scale(1) rotate(180deg); }
  }
  @keyframes shadow-pulse {
    0%,100% { transform: scaleX(1); opacity: 0.5; }
    50%     { transform: scaleX(0.7); opacity: 0.2; }
  }
`

const MOOD_ANIMATION: Record<PumaMood, string> = {
  wave:        "puma-wave 1.2s ease-in-out infinite",
  point:       "puma-point 1s ease-in-out infinite",
  search:      "puma-search 1.4s ease-in-out infinite",
  inspect:     "puma-inspect 1.6s ease-in-out infinite",
  look_left:   "puma-look-left 1.5s ease-in-out infinite",
  look_right:  "puma-look-right 1.5s ease-in-out infinite",
  celebrate:   "puma-celebrate 0.9s ease-in-out infinite",
}

// ─── Componente Puma companion ────────────────────────────────────────────────

interface PumaCompanionProps {
  stepIndex: number
  isTransitioning: boolean
  pumaPosition: "left" | "right"
  pumaMood?: PumaMood
  pumaLabel?: string
}

const PumaCompanion = ({ stepIndex, isTransitioning, pumaPosition, pumaMood, pumaLabel }: PumaCompanionProps) => {
  const defaultMood = STEP_MOODS[stepIndex] ?? STEP_MOODS[0]
  const currentMood = {
    mood: pumaMood ?? defaultMood.mood,
    label: pumaLabel ?? defaultMood.label,  
  }
  const isCelebrate = currentMood.mood === "celebrate"

  const sparkles = [
    { top: "-4px",  left: "10px",  delay: "0s",   size: "16px", color: "#FFD700" },
    { top: "6px",   right: "8px",  delay: "0.3s", size: "12px", color: "#FF6B6B" },
    { top: "28px",  left: "0px",   delay: "0.6s", size: "14px", color: "#00C7B4" },
    { top: "22px",  right: "0px",  delay: "0.9s", size: "10px", color: "#FFD700" },
  ]

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "150px",
        marginRight: pumaPosition === "left" ? "10px" : "0px",
        marginLeft: pumaPosition === "right" ? "10px" : "0px",
        flexShrink: 0,
        alignSelf: "flex-end",
        paddingBottom: "4px",
        position: "relative",
      }}
    >
      {/* Destellos solo en celebrate */}
      {isCelebrate && sparkles.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left ?? "auto",
            right: (s as any).right ?? "auto",
            width: s.size,
            height: s.size,
            background: s.color,
            clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
            animation: `sparkle 0.8s ${s.delay} ease-in-out infinite`,
            zIndex: 2,
          }}
        />
      ))}

      {/* Burbuja de diálogo */}
      <div
        key={`bubble-${stepIndex}`}
        style={{
          background: "#ffffff",
          border: "2px solid #0052A5",
          borderRadius: "12px",
          padding: "6px 14px",
          fontSize: "13px",
          fontWeight: "700",
          color: "#0052A5",
          whiteSpace: "nowrap",
          marginBottom: "10px",
          position: "relative",
          animation: "speech-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
          boxShadow: "0 2px 8px rgba(0,82,165,0.15)",
          fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
          zIndex: 1,
        }}
      >
        {currentMood.label}
        {/* Flecha inferior del bubble */}
        <span style={{
          position: "absolute",
          bottom: "-9px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "9px solid #0052A5",
          display: "block",
        }} />
        <span style={{
          position: "absolute",
          bottom: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: "7px solid #ffffff",
          display: "block",
        }} />
      </div>

      {/* Imagen del puma */}
      <div
        key={`puma-img-${stepIndex}`}
        style={{
          width: "150px",
          height: "150px",
          animation: isTransitioning
            ? "puma-exit 0.25s ease-in forwards"
            : `puma-enter 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards`,
        }}
      >
        <img
          src={logoPuma}
          alt="Puma UNAH"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            userSelect: "none",
            pointerEvents: "none",
            animation: isTransitioning
              ? "none"
              : `${MOOD_ANIMATION[currentMood.mood]}`,
            animationDelay: "0.52s",
            // look_right se logra con scaleX en la animación keyframe
          }}
        />
      </div>

      {/* Sombra suave bajo el puma */}
      <div style={{
        width: "65px",
        height: "9px",
        background: "radial-gradient(ellipse, rgba(0,82,165,0.18) 0%, transparent 70%)",
        borderRadius: "50%",
        marginTop: "2px",
        animation: isTransitioning ? "none" : "shadow-pulse 2s ease-in-out infinite",
        animationDelay: "0.52s",
      }} />
    </div>
  )
}

// ─── Tooltip wrapper con estado ───────────────────────────────────────────────

interface ExtendedTooltipProps extends TooltipRenderProps {
  currentStep: number
  isTransitioning: boolean
  steps: TourStep[]
  defaultPumaPosition: "left" | "right"
}

const CustomTooltip = ({
  backProps,
  closeProps,
  index,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  size,
  currentStep,
  isTransitioning,
  steps,
  defaultPumaPosition,
}: ExtendedTooltipProps) => {
  // La posición y mood del puma se leen del paso actual, con fallback al default global
  const pumaPosition = steps[currentStep]?.pumaPosition ?? defaultPumaPosition
  const pumaMood = steps[currentStep]?.pumaMood
  const pumaLabel = steps[currentStep]?.pumaLabel

  const pumaEl = (
    <PumaCompanion
      stepIndex={currentStep}
      isTransitioning={isTransitioning}
      pumaPosition={pumaPosition}
      pumaMood={pumaMood}
      pumaLabel={pumaLabel}
    />
  )

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "0px" }}>

      {/* Puma a la izquierda o derecha según prop */}
      {pumaPosition === "left" && pumaEl}

      {/* Tooltip */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 82, 165, 0.15), 0 4px 16px rgba(0, 82, 165, 0.1)",
          maxWidth: "320px",
          minWidth: "250px",
          overflow: "hidden",
          fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0052A5 0%, #0072CE 100%)",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: "20px",
              padding: "4px 10px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#ffffff",
              letterSpacing: "0.5px",
            }}>
              {index + 1} / {size}
            </div>
            {step.title && (
              <span style={{ color: "#ffffff", fontWeight: "700", fontSize: "14px" }}>
                {step.title as string}
              </span>
            )}
          </div>

          <button
            {...closeProps}
            title="Cerrar tour"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: "8px",
              color: "#ffffff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.3)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)")}
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: "3px", background: "#e8f0f9", position: "relative" }}>
          <div style={{
            position: "absolute", left: 0, top: 0,
            height: "100%",
            width: `${((index + 1) / size) * 100}%`,
            background: "linear-gradient(90deg, #0052A5, #00C7B4)",
            borderRadius: "0 2px 2px 0",
            transition: "width 0.4s ease",
          }} />
        </div>

        {/* Contenido */}
        <div style={{ padding: "18px 20px" }}>
          <p style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            {step.content as string}
          </p>
        </div>

        {/* Footer botones */}
        <div style={{
          padding: "12px 18px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #f0f4f8",
        }}>
          <button
            {...skipProps}
            style={{
              background: "transparent",
              border: "none",
              color: "#9CA3AF",
              cursor: "pointer",
              fontSize: "13px",
              padding: "6px 10px",
              borderRadius: "6px",
              transition: "color 0.2s, background 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.color = "#6B7280"; b.style.background = "#F3F4F6"
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.color = "#9CA3AF"; b.style.background = "transparent"
            }}
          >
            Saltar tour
          </button>

          <div style={{ display: "flex", gap: "8px" }}>
            {index > 0 && (
              <button
                {...backProps}
                style={{
                  background: "#F3F4F6", border: "none", borderRadius: "8px",
                  color: "#374151", cursor: "pointer", display: "flex",
                  alignItems: "center", gap: "4px", fontSize: "13px",
                  fontWeight: "500", padding: "8px 14px",
                  transition: "background 0.2s", fontFamily: "inherit",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#E5E7EB")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#F3F4F6")}
              >
                <ChevronLeft size={15} /> Atrás
              </button>
            )}

            <button
              {...primaryProps}
              style={{
                background: "linear-gradient(135deg, #0052A5 0%, #0072CE 100%)",
                border: "none", borderRadius: "8px", color: "#ffffff",
                cursor: "pointer", display: "flex", alignItems: "center",
                gap: "4px", fontSize: "13px", fontWeight: "600",
                padding: "8px 16px", transition: "opacity 0.2s, transform 0.1s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              onMouseDown={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)")}
              onMouseUp={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
            >
              {isLastStep
                ? <><CheckCheck size={15} /> Finalizar</>
                : <>Siguiente <ChevronRight size={15} /></>
              }
            </button>
          </div>
        </div>

        {/* Hint F1 en el último paso */}
        {isLastStep && (
          <div style={{
            background: "#F0F7FF",
            borderTop: "1px solid #DBEAFE",
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <Keyboard size={14} style={{ color: "#0052A5", flexShrink: 0 }} />
            <span style={{ color: "#0052A5", fontSize: "12px" }}>
              Presiona{" "}
              <kbd style={{
                background: "#ffffff",
                border: "1px solid #BFDBFE",
                borderRadius: "4px",
                padding: "1px 5px",
                fontSize: "11px",
                fontFamily: "monospace",
                fontWeight: "600",
              }}>F1</kbd>{" "}
              en cualquier momento para volver a ver este tour
            </span>
          </div>
        )}
      </div>

      {/* Puma a la derecha si corresponde */}
      {pumaPosition === "right" && pumaEl}
    </div>
  )
}

// ─── Componente GuidedTour ────────────────────────────────────────────────────

export const GuidedTour = ({ tourId = "default", steps, onFinish, defaultPumaPosition = "left" }: GuidedTourProps) => {
  const { run, isReady, handleTourEnd } = useTour(tourId)
  const [stepIndex, setStepIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const styleRef = useRef(false)

  // Inyectar CSS de animaciones una sola vez en el <head>
  useEffect(() => {
    if (styleRef.current) return
    const tag = document.createElement("style")
    tag.id = "guided-tour-animations"
    tag.textContent = ANIMATIONS_CSS
    document.head.appendChild(tag)
    styleRef.current = true
    return () => {
      const el = document.getElementById("guided-tour-animations")
      if (el) document.head.removeChild(el)
      styleRef.current = false
    }
  }, [])

  const handleCallback = useCallback(
    (data: CallBackProps) => {
      const { status, type, action } = data

      if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
        // Primero animar la salida del puma (250ms), luego cambiar paso
        setIsTransitioning(true)
        setTimeout(() => {
          setStepIndex((prev) => (action === "prev" ? prev - 1 : prev + 1))
          setIsTransitioning(false)
        }, 250)
      }

      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        handleTourEnd()
        setStepIndex(0)
        setIsTransitioning(false)
        onFinish?.()
      }
    },
    [handleTourEnd, onFinish]
  )

  // Wrapper que inyecta estado al tooltip
  const TooltipWithState = useCallback(
    (props: TooltipRenderProps) => (
      <CustomTooltip
        {...props}
        currentStep={stepIndex}
        isTransitioning={isTransitioning}
        steps={steps}
        defaultPumaPosition={defaultPumaPosition}
      />
    ),
    [stepIndex, isTransitioning, steps, defaultPumaPosition]
  )

  if (!isReady) return null

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      callback={handleCallback}
      tooltipComponent={TooltipWithState}
      continuous
      showSkipButton
      disableOverlayClose
      spotlightPadding={8}
      styles={{
        options: {
          arrowColor: "transparent",
          overlayColor: "rgba(0, 30, 70, 0.55)",
          zIndex: 9999,
        },
        spotlight: {
          borderRadius: "12px",
          boxShadow: "0 0 0 3px rgba(0, 82, 165, 0.4)",
        },
      }}
      floaterProps={{
        disableAnimation: false,
        styles: {
          floater: {
            filter: "drop-shadow(0 8px 32px rgba(0,82,165,0.18))",
          },
        },
      }}
    />
  )
}