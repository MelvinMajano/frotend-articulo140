import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { CareersResponse} from "@/articulo-140/interfaces/admin.careers.response";


export const postCareer = async( formData: { code: string; name: string; faculty: string } ) => {
    const data = await articulo140Api.post<CareersResponse>('/activities/degrees', formData);
    return data.data.message
}

