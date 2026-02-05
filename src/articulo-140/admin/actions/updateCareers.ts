import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { CareersResponse } from "@/articulo-140/interfaces/admin.careers.response";

export const updateCareer = async (FormData: { code: string; name: string; faculty: string }, id: number) => {
    const data = await articulo140Api.put<CareersResponse>(`/activities/degrees/${id}`, FormData);
    return data.data.message
}