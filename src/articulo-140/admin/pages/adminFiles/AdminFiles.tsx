import { useCloudinaryGallery } from "@/articulo-140/hooks/activities/admin/useClaudinaryImage"
import { GalleryHeader, GalleryGrid, GalleryPreviewModal } from "../../components/custom/CloudinaryGallery"
import { ConfirmActionModal } from "../../components/custom/ConfirmActionModal"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload } from "lucide-react"
import { UNAH_BLUE } from "@/lib/colors"
import { GuidedTour } from "../../components/custom/GuidedTour"
import type { TourStep } from "../../components/custom/GuidedTour"

// ─── Pasos del tour ───────────────────────────────────────────────────────────

const FILES_STEPS: TourStep[] = [
  {
    target: "body",
    title: "🖼️ ¡Bienvenido!",
    content: "Esta es la Galería de Imágenes. Aquí puedes subir, visualizar y administrar las imágenes que se asignarán a las actividades VOAE.",
    placement: "center",
    disableBeacon: true,
    pumaMood: "wave",
    pumaLabel: "¡Hola!",
  },
  {
    target: '[data-tour="gallery-reload"]',
    title: "Recargar Galería",
    content: "Usa este botón para refrescar la galería y ver las imágenes más recientes subidas al sistema.",
    placement: "bottom",
    disableBeacon: true,
    pumaMood: "search",
    pumaLabel: "Recargar",
  },
  {
    target: '[data-tour="gallery-upload"]',
    title: "Subir Imagen",
    content: "Haz clic aquí para seleccionar una imagen desde tu dispositivo y subirla a la galería.",
    placement: "bottom",
    disableBeacon: true,
    pumaPosition: "right",
    pumaMood: "point",
    pumaLabel: "¡Sube aquí!",
  },
  {
    target: '[data-tour="gallery-grid"]',
    title: "Galería de Imágenes",
    content: "Aquí se muestran todas las imágenes disponibles. Cada tarjeta tiene dos acciones: asignarla a una actividad o eliminarla.",
    placement: "top",
    disableBeacon: true,
    pumaMood: "inspect",
    pumaLabel: "¡Aquí están tus imágenes!",
  },
  {
    target: '[data-tour="gallery-add-activity"]',
    title: "Agregar a Actividad",
    content: "Presiona este botón para asignar la imagen a una actividad VOAE. Se te redirigirá al módulo de actividades para elegir cuál.",
    placement: "top",
    disableBeacon: true,
    pumaMood: "look_left",
    pumaPosition: "right",
    pumaLabel: "¡Asignar!",
  },
  {
    target: '[data-tour="gallery-delete"]',
    title: "Eliminar Imagen",
    content: "Usa este botón para eliminar la imagen de la galería. Se pedirá confirmación antes de borrarla definitivamente.",
    placement: "top",
    disableBeacon: true,
    pumaMood: "look_left",
    pumaPosition: "right",
    pumaLabel: "Eliminar",
  },
  {
    target: "body",
    title: "¡Todo listo! 🎉",
    content: "Ya conoces la galería. Sube imágenes y asígnalas a tus actividades VOAE cuando las necesites.",
    placement: "center",
    disableBeacon: true,
    pumaMood: "celebrate",
    pumaLabel: "¡Listo!",
  },
]

export const AdminFilesPage = () => {
  const {
    images, isLoading, isUploading, selectedImage, setSelectedImage,
    confirmOpen, setConfirmOpen,
    loadImages, handleUpload, handleDelete, requestDelete, deletingId
  } = useCloudinaryGallery({lazy: false, showToast: true})

  return (
    <div className="w-full space-y-6">

      {/* ✅ Tour guiado — primera vez automático, F1 para repetir */}
      <GuidedTour tourId="admin-files" steps={FILES_STEPS} />

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
        <GalleryGrid images={images} requestDelete={requestDelete} deletingId={deletingId} />
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
