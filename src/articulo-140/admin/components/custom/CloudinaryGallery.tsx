import { type FC, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Trash2, Loader2, X, RefreshCw, ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { type CloudinaryImage } from "@/articulo-140/hooks/activities/admin/useClaudinaryImage"

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
                className="text-gray-600 hover:text-teal-600 hover:bg-teal-50"
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
    <div className="flex gap-2">
      <Button onClick={onReload} disabled={isLoading} variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
        {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Cargando...</> : <><RefreshCw className="w-4 h-4 mr-2"/>Recargar</>}
      </Button>

      <input type="file" accept="image/*" className="hidden" id="cloudinary-upload" onChange={onFileChange} disabled={isUploading}/>
      <label htmlFor="cloudinary-upload">
        <Button asChild disabled={isUploading} className="bg-teal-600 hover:bg-teal-700 text-white cursor-pointer">
          <span>{isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Subiendo...</> : <><Upload className="w-4 h-4 mr-2"/>Subir Imagen</>}</span>
        </Button>
      </label>
    </div>
  </div>
)

interface GalleryGridProps {
  images: CloudinaryImage[]
  onImageClick: (img: CloudinaryImage) => void
  onDeleteClick: (img: CloudinaryImage) => void
}

export const GalleryGrid: FC<GalleryGridProps> = ({ images, onImageClick, onDeleteClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {images.map(img => (
      <Card key={img.publicId} className="group relative overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => onImageClick(img)}>
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <img src={img.thumbnail || img.secureUrl} alt={img.publicId} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button variant="destructive" size="icon" onClick={e => { e.stopPropagation(); onDeleteClick(img) }} className="bg-red-500 hover:bg-red-600">
                <Trash2 className="w-4 h-4"/>
              </Button>
            </div>
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs uppercase">{img.format || "IMG"}</div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

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
