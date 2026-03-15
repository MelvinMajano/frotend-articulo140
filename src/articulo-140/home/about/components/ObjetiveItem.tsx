import { useState, useEffect } from "react"
import { UNAH_BLUE } from "@/lib/colors"

interface Props {
  text: string
  delay: number
}

export const ObjectiveItem = ({ text, delay }: Props) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className={`flex gap-4 transition-all duration-500 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}>
      <div className="flex-shrink-0 w-2 h-2 rounded-full mt-2.5" style={{ background: UNAH_BLUE }} />
      <p className="text-gray-700 text-base leading-relaxed">{text}</p>
    </div>
  )
}