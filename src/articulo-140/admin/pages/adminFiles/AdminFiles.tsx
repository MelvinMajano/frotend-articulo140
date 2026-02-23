import { useCloudinaryGallery } from "@/articulo-140/hooks/activities/admin/useClaudinaryImage"
import { GalleryHeader, GalleryGrid, GalleryPreviewModal } from "../../components/custom/CloudinaryGallery"
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import { UNAH_BLUE } from "@/lib/colors"

export const AdminFilesPage = () => {
  const {
    images, isLoading, isUploading, selectedImage, setSelectedImage,
    confirmOpen, setConfirmOpen,
    loadImages, handleUpload, handleDelete
  } = useCloudinaryGallery()

  return (
    <div className="w-full space-y-6">
      <GalleryHeader
        imagesCount={images.length}
        isLoading={isLoading}
        onReload={loadImages} 
        isUploading={isUploading}
        onFileChange={e => handleUpload(e.target.files?.[0] || null)}
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: UNAH_BLUE }} />
        </div>
      ) : images.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Upload className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No hay imágenes</p>
            <p className="text-gray-500 text-sm">Sube tu primera imagen para comenzar</p>
          </CardContent>
        </Card>
        ) : (
          <GalleryGrid/>
        )}


      <GalleryPreviewModal image={selectedImage} onClose={() => setSelectedImage(null)} />

      <ConfirmActionModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar imagen"
        message="¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
      />
    </div>
  )
}
