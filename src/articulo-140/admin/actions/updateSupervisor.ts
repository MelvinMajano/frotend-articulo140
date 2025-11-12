import { articulo140Api } from "@/articulo-140/api/articulo140Api";

export const updateSupervisor = async (id: string, data: any) => {
  try {
    const response = await articulo140Api.put(`/auth/data/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating supervisor:", error);
    throw error;
  }
};
