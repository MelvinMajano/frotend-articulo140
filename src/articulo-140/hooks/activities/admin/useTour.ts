import { useState, useEffect, useCallback } from "react"

const TOUR_KEY = "app_tour_completed"

export const useTour = (tourId: string = "default") => {
  const storageKey = `${TOUR_KEY}_${tourId}`
  
  const [run, setRun] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Al montar, verificar si es la primera vez
  useEffect(() => {
    const hasSeenTour = localStorage.getItem(storageKey)
    
    if (!hasSeenTour) {
      // Pequeño delay para que los elementos del DOM estén listos
      const timer = setTimeout(() => {
        setRun(true)
        setIsReady(true)
      }, 600)
      return () => clearTimeout(timer)
    } else {
      setIsReady(true)
    }
  }, [storageKey])

  // Escuchar F1 para volver a ejecutar el tour
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault()
        setRun(true)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleTourEnd = useCallback(() => {
    setRun(false)
    localStorage.setItem(storageKey, "true")
  }, [storageKey])

  const startTour = useCallback(() => {
    setRun(true)
  }, [])

  const resetTour = useCallback(() => {
    localStorage.removeItem(storageKey)
    setRun(true)
  }, [storageKey])

  return {
    run,
    isReady,
    startTour,
    resetTour,
    handleTourEnd,
  }
}