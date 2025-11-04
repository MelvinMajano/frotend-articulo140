import { useState, useEffect } from "react"
import { toast } from "sonner"
import { articulo140Api } from "@/articulo-140/api/articulo140Api"

export interface CloudinaryImage {
  publicId: string
  url: string
  secureUrl: string
  thumbnail: string
  createdAt: string
  format?: string
  width?: number
  height?: number
}

export const useCloudinaryGallery = () => {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<CloudinaryImage | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<CloudinaryImage | null>(null)

  const loadImages = async () => {
    setIsLoading(true)
    try {
      const { data } = await articulo140Api.get("/activities/images/files", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      })
      setImages(
        data.data.map((img: any) => ({
          publicId: img.public_id,
          url: img.url,
          secureUrl: img.secure_url,
          thumbnail: img.secure_url.replace("/upload/", "/upload/c_thumb,w_300,h_300/"),
          createdAt: img.created_at,
          format: img.format,
          width: img.width,
          height: img.height,
        }))
      )
      toast.success(`${data.data.length} imágenes cargadas`)
    } catch (error) {
      toast.error("Error al cargar las imágenes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (file: File | null) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen no debe superar 10MB")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const { data } = await articulo140Api.post("/activities/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      })

      const result = data.data
      const uploadedImage: CloudinaryImage = {
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        thumbnail: result.secure_url.replace("/upload/", "/upload/c_thumb,w_300,h_300/"),
        createdAt: result.created_at,
        format: result.format,
        width: result.width,
        height: result.height,
      }

      setImages(prev => [uploadedImage, ...prev])
      toast.success("Imagen subida correctamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al subir la imagen")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!imageToDelete) return
    try {
      const response = await articulo140Api.delete(`/activities/images/delete`, {
        data: { public_id: imageToDelete.publicId },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (response.status !== 200) throw new Error(response.data?.message || "No se pudo eliminar la imagen")

      setImages(prev => prev.filter(img => img.publicId !== imageToDelete.publicId))
      toast.success("Imagen eliminada exitosamente")
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Error al eliminar la imagen")
    } finally {
      setConfirmOpen(false)
      setImageToDelete(null)
    }
  }

  useEffect(() => { loadImages() }, [])

  return {
    images,
    isLoading,
    isUploading,
    selectedImage,
    setSelectedImage,
    confirmOpen,
    setConfirmOpen,
    imageToDelete,
    setImageToDelete,
    loadImages,
    handleUpload,
    handleDelete,
  }
}
