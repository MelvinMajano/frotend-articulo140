import { articulo140Api } from "@/articulo-140/api/articulo140Api"

export const deleteSupervisor = async (accountNumber: number | string): Promise<{ message: string }> => {
  const { data } = await articulo140Api.put(`users/supervisor/${accountNumber}/disable`)
  return data
}

export const restoreSupervisor = async (accountNumber: number | string): Promise<{ message: string }> => {
  const { data } = await articulo140Api.put(`users/supervisor/${accountNumber}/enable`)
  return data
}