import { CustomHeaderAdmin } from "@/articulo-140/admin/components/CustomHeaderAdmin"
import { CardAdminActions } from "@/articulo-140/admin/components/CardAdminActions"
import { CustomMainCardAdmin } from "@/articulo-140/admin/components/custom/CustomMainCard"

export const AdminActions = () => {
  return (
    <CustomMainCardAdmin
      HeaderAdmin={<CustomHeaderAdmin />}
      CardAdmin={<CardAdminActions />}
    />
  )
}