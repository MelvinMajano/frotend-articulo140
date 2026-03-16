import { useEffect, useRef, useState } from "react"
import { Image, RefreshCw, X, Upload, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UNAH_BLUE } from "@/lib/colors"
import { useCloudinaryGallery } from "@/articulo-140/hooks/activities/admin/useClaudinaryImage"

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export const CloudinaryPicker = ({ open, onClose, onSelect }: Props) => {
  const { images, isLoading, isUploading, handleUpload, loadImages } = useCloudinaryGallery({lazy: true, showToast: false})
  const fileRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (open && images.length === 0) {
      loadImages()
    }
  }, [open])
  
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
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
            <button onClick={loadImages} className="p-1.5 rounded hover:bg-white/20">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <input
            ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleUpload(e.target.files?.[0] || null)}
          />
          <button
            onClick={() => fileRef.current?.click()} disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            style={{ background: UNAH_BLUE, color: "#fff" }}
          >
            {isUploading
              ? <><Loader2 className="w-4 h-4 animate-spin" />Subiendo...</>
              : <><Upload className="w-4 h-4" />Subir imagen</>
            }
          </button>
          <p className="text-xs text-gray-400">Máximo 10MB · JPG, PNG, WEBP</p>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: UNAH_BLUE }} />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Image className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No hay imágenes</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <button
                  key={img.publicId} onClick={() => setSelected(img.secureUrl)}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105"
                  style={{ borderColor: selected === img.secureUrl ? UNAH_BLUE : "transparent" }}
                >
                  <img src={img.thumbnail} alt="" className="w-full h-full object-cover" />
                  {selected === img.secureUrl && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: `${UNAH_BLUE}60` }}>
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
            <Button
              size="sm" disabled={!selected} style={{ background: UNAH_BLUE, color: "#fff" }}
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