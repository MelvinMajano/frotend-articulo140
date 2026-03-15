import { Newspaper, Pin, PinOff, Calendar, MapPin, Tag, Pencil, EyeOff, Eye as EyeIcon } from "lucide-react"
import { UNAH_BLUE, UNAH_BLUE_SOFT, UNAH_GOLD, UNAH_WHITE } from "@/lib/colors"
import { usePostView } from "@/articulo-140/hooks/activities/admin/useAboutViews"
import type { Post, PostCategory } from "@/articulo-140/interfaces/about.response"

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const toBool = (val: unknown): boolean => Boolean(Number(val))

export const CATEGORY_CONFIG: Record<PostCategory, { label: string; color: string; bg: string }> = {
  VOAE:         { label: "VOAE",         color: UNAH_BLUE,  bg: UNAH_BLUE_SOFT },
  Academico:    { label: "Académico",    color: "#7c3aed",  bg: "#f5f3ff"      },
  General:      { label: "General",      color: "#374151",  bg: "#f9fafb"      },
  Convocatoria: { label: "Convocatoria", color: "#b45309",  bg: "#fffbeb"      },
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return "Hoy"
  if (days === 1) return "Ayer"
  if (days < 7)  return `Hace ${days} días`
  return new Date(iso).toLocaleDateString("es-HN", { day: "numeric", month: "short", year: "numeric" })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("es-HN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  })
}

// ─── CategoryBadge ────────────────────────────────────────────────────────────
export const CategoryBadge = ({ category }: { category: PostCategory }) => {
  const cfg = CATEGORY_CONFIG[category]
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Tag className="w-3 h-3" />{cfg.label}
    </span>
  )
}

// ─── PostCard ─────────────────────────────────────────────────────────────────
interface Props {
  post: Post
  isAdmin: boolean
  onEdit: (p: Post) => void
  onTogglePin: (id: string) => void
  onToggleVisible: (id: string) => void
}

export const PostCard = ({ post, isAdmin, onEdit, onTogglePin, onToggleVisible }: Props) => {
  usePostView(post.id)

  const isPinned  = toBool(post.is_pinned)
  const isVisible = toBool(post.is_visible)

  return (
    <div
      className="rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group"
      style={{ background: UNAH_WHITE, opacity: isVisible ? 1 : 0.55 }}
    >
      {/* Imagen o header simple */}
      {post.image_url ? (
        <div className="h-44 overflow-hidden relative">
          <img
            src={post.image_url} alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {isPinned && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow"
              style={{ background: UNAH_GOLD, color: "#fff" }}>
              <Pin className="w-3 h-3" /> Fijado
            </div>
          )}
          <div className="absolute top-3 right-3"><CategoryBadge category={post.category} /></div>
        </div>
      ) : (
        <div className="h-16 flex items-center justify-between px-5" style={{ background: UNAH_BLUE_SOFT }}>
          <div className="flex items-center gap-2">
            {isPinned && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: UNAH_GOLD, color: "#fff" }}>
                <Pin className="w-3 h-3" /> Fijado
              </span>
            )}
            <CategoryBadge category={post.category} />
          </div>
          <Newspaper className="w-6 h-6 opacity-20" style={{ color: UNAH_BLUE }} />
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.content}</p>
        {post.event_date && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 text-xs font-medium" style={{ color: UNAH_BLUE }}>
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              {formatDateTime(post.event_date)}
            </div>
            {post.event_place && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {post.event_place}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between" style={{ background: "#fafafa" }}>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{timeAgo(post.created_at)}</span>
          <span className="flex items-center gap-1">
            <EyeIcon className="w-3.5 h-3.5" />{post.view_count ?? 0}
          </span>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleVisible(post.id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
              title={isVisible ? "Ocultar" : "Mostrar"}
            >
              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onTogglePin(post.id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: isPinned ? UNAH_GOLD : "#9ca3af" }}
              title={isPinned ? "Desfijar" : "Fijar"}
            >
              {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onEdit(post)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: UNAH_BLUE }} title="Editar"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}