import { articulo140Api } from "@/articulo-140/api/articulo140Api";

export const deleteCareer = async (id: number) => {
    const data = await articulo140Api.put(`/activities/degrees/disable/${id}`);
    return data.data.message
}

export const restoreCareer = async (id: number) => {
    const data = await articulo140Api.put(`/activities/degrees/restore/${id}`);
    return data.data.message
}

