import { useState, useEffect } from "react"
import { Newspaper, X, Calendar, Image, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UNAH_BLUE, UNAH_BLUE_SOFT } from "@/lib/colors"
import { toBool, CATEGORY_CONFIG } from "./PostCard"
import type { Post, PostCategory, CreatePostBody } from "@/articulo-140/interfaces/about.response"

interface Props {
  open: boolean
  post: Post | null
  onClose: () => void
  onSave: (data: CreatePostBody, id?: string) => void
  onDelete: (id: string) => void
  onOpenPicker: (cb: (url: string) => void) => void
  isSaving: boolean
}

export const PostModal = ({ open, post, onClose, onSave, onDelete, onOpenPicker, isSaving }: Props) => {
  const [form, setForm] = useState<CreatePostBody>({
    title: "", content: "", image_url: null, category: "General",
    is_pinned: false, is_visible: true, event_date: null, event_place: null,
  })

  useEffect(() => {
    if (post) {
      setForm({
        title:       post.title,
        content:     post.content,
        image_url:   post.image_url,
        category:    post.category,
        is_pinned:   toBool(post.is_pinned),
        is_visible:  toBool(post.is_visible),
        event_date:  post.event_date,
        event_place: post.event_place,
      })
    } else {
      setForm({
        title: "", content: "", image_url: null, category: "General",
        is_pinned: false, is_visible: true, event_date: null, event_place: null,
      })
    }
  }, [post, open])

  if (!open) return null

  const set = (field: string, value: unknown) => setForm(p => ({ ...p, [field]: value }))

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        style={{ border: `2px solid ${UNAH_BLUE}` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ background: UNAH_BLUE, color: "#fff" }}>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            <span className="font-bold">{post ? "Editar publicación" : "Nueva publicación"}</span>
          </div>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity"><X className="w-5 h-5" /></button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Título *</label>
            <input
              className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="Título de la publicación..."
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contenido *</label>
            <textarea
              className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              rows={4} value={form.content} onChange={e => set("content", e.target.value)}
              placeholder="Escribe el contenido..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</label>
              <select
                className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                value={form.category} onChange={e => set("category", e.target.value as PostCategory)}
              >
                {(Object.keys(CATEGORY_CONFIG) as PostCategory[]).map(c => (
                  <option key={c} value={c}>{CATEGORY_CONFIG[c].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Opciones</label>
              <div className="mt-1.5 flex flex-col gap-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(form.is_pinned)}
                    onChange={e => set("is_pinned", e.target.checked)}
                    className="w-4 h-4 rounded accent-yellow-500" />
                  <span className="text-sm text-gray-700">Fijar publicación</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(form.is_visible)}
                    onChange={e => set("is_visible", e.target.checked)}
                    className="w-4 h-4 rounded" style={{ accentColor: UNAH_BLUE }} />
                  <span className="text-sm text-gray-700">Visible</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Imagen (opcional)</label>
            <div className="mt-1.5 space-y-2">
              {form.image_url && (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video">
                  <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => set("image_url", null)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <button
                onClick={() => onOpenPicker((url) => set("image_url", url))}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium transition-all hover:opacity-80"
                style={{ borderColor: UNAH_BLUE, color: UNAH_BLUE, background: UNAH_BLUE_SOFT }}
              >
                <Image className="w-4 h-4" />
                {form.image_url ? "Cambiar imagen" : "Seleccionar imagen"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-4 space-y-3" style={{ background: "#fafafa" }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Datos de evento (opcional)
            </p>
            <div>
              <label className="text-xs text-gray-500">Fecha y hora</label>
              <input type="datetime-local"
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={form.event_date ? new Date(form.event_date).toISOString().slice(0, 16) : ""}
                onChange={e => set("event_date", e.target.value ? new Date(e.target.value).toISOString() : null)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Lugar</label>
              <input
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={form.event_place || ""} onChange={e => set("event_place", e.target.value || null)}
                placeholder="Ej: Auditorio Central, Edificio F3"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            {post && (
              <button
                onClick={() => { onDelete(post.id); onClose() }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
            <Button
              size="sm"
              disabled={!form.title.trim() || !form.content.trim() || isSaving}
              style={{ background: UNAH_BLUE, color: "#fff" }}
              onClick={() => onSave(form, post?.id)}
            >
              {isSaving
                ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Guardando...</>
                : post ? "Guardar cambios" : "Publicar"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}