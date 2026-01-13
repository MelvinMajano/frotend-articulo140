import { articulo140Api } from "@/articulo-140/api/articulo140Api";

export const restoreDeletedActivity = async (activityId: string) => {
    try {

        const { data } = await articulo140Api.put(`activities/restore/${activityId}`);
        return data

    } catch (error) {
        console.error("Error restoring activity:", error);
        throw error;
    }
}