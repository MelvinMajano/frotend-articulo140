import { type FC, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Trash2, Loader2, X, RefreshCw, ArrowLeft, Plus } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { type CloudinaryImage } from "@/articulo-140/hooks/activities/admin/useClaudinaryImage"
import { UNAH_BLUE } from "@/lib/colors"

interface GalleryHeaderProps {
  imagesCount: number
  isLoading: boolean
  onReload: () => void
  isUploading: boolean
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const GalleryHeader: FC<GalleryHeaderProps> = ({
  imagesCount, isLoading, onReload, isUploading, onFileChange
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <Link to="/admin">
        <Button
          variant="ghost"
          className="text-gray-600"
          style={{ color: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.color = UNAH_BLUE; e.currentTarget.style.background = `${UNAH_BLUE}10` }}
          onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = '' }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Regresar
        </Button>
      </Link>
      <h2 className="text-2xl font-bold text-gray-800 mt-4">Galería de Imágenes</h2>
      <p className="text-sm text-gray-600 mt-1">
        {imagesCount} {imagesCount === 1 ? "imagen" : "imágenes"}
      </p>
    </div>

    {/*data-tour en el grupo de acciones del header */}
    <div className="flex gap-2">
      <Button
        onClick={onReload}
        disabled={isLoading}
        variant="outline"
        style={{ borderColor: UNAH_BLUE, color: UNAH_BLUE }}
        data-tour="gallery-reload"
      >
        {isLoading
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Cargando...</>
          : <><RefreshCw className="w-4 h-4 mr-2" />Recargar</>
        }
      </Button>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="cloudinary-upload"
        onChange={onFileChange}
        disabled={isUploading}
      />
      {/* data-tour en el botón subir */}
      <label htmlFor="cloudinary-upload" data-tour="gallery-upload">
        <Button asChild disabled={isUploading} className="text-white cursor-pointer" style={{ background: UNAH_BLUE }}>
          <span>
            {isUploading
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Subiendo...</>
              : <><Upload className="w-4 h-4 mr-2" />Subir Imagen</>
            }
          </span>
        </Button>
      </label>
    </div>
  </div>
)

interface GalleryGridProps {
  images: CloudinaryImage[]
  requestDelete: (img: CloudinaryImage) => void
  deletingId: string | null
}

export const GalleryGrid = ({ images, requestDelete, deletingId }: GalleryGridProps) => {
  
  const navigate = useNavigate()

  const handleAddtoActivity = (img: any) => {
    localStorage.setItem('selectedImage', JSON.stringify({
      publicId: img.publicId,
      secureUrl: img.secureUrl,
      name: img.displayName || img.publicId,
    }))
    navigate('/admin/activities?from=files')
  }

  return (
    <div className="w-full">
      {/* data-tour en el grid de imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="gallery-grid">
        {images.map((img, index) => (
          <div key={img.publicId} className="flex flex-col gap-3">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={img.thumbnail || img.secureUrl}
                alt={img.publicId}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              {/* data-tour en el primer botón Agregar a actividad */}
              <Button
                onClick={e => { e.stopPropagation(); handleAddtoActivity(img) }}
                className="w-full text-white font-medium transition-colors"
                style={{ background: UNAH_BLUE }}
                disabled={deletingId === img.publicId}
                {...(index === 0 ? { "data-tour": "gallery-add-activity" } : {})}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar a actividad
              </Button>

              <Button
                onClick={() => requestDelete(img)}
                variant="destructive"
                className="w-full"
                disabled={deletingId === img.publicId}
                {...(index === 0 ? { "data-tour": "gallery-delete" } : {})}
              >
                {deletingId === img.publicId ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Eliminando...</>
                ) : (
                  <><Trash2 className="w-4 h-4 mr-2" />Eliminar</>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface GalleryPreviewModalProps {
  image: CloudinaryImage | null
  onClose: () => void
}

export const GalleryPreviewModal: FC<GalleryPreviewModalProps> = ({ image, onClose }) => {
  if (!image) return null
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full">
        <Button variant="ghost" size="icon" className="absolute -top-12 right-0 text-white hover:bg-white/20" onClick={onClose}>
          <X className="w-6 h-6"/>
        </Button>
        <img src={image.secureUrl} alt={image.publicId} className="w-full h-auto rounded-lg" onClick={e => e.stopPropagation()}/>
        <div className="mt-4 text-white text-center">
          <p className="text-sm opacity-80">{image.publicId}</p>
        </div>
      </div>
    </div>
  )
}
