import { articulo140Api } from "@/articulo-140/api/articulo140Api"

interface AddImageToActivityProps {
  activityId: string
  imagePublicId: string
  imageUrl: string
  imageName: string
}

interface AddImageResponse {
  success: boolean
  message: string
  data: any
}

export const addImageToActivity = async (data: AddImageToActivityProps)=>
{
    const response = await articulo140Api.post<AddImageResponse>('/activities/images/link', data)
    return response.data.message
}

export const replaceImageActivity = async (
    activityId: string,
    imageData: Omit<AddImageToActivityProps, 'activityId'>
): Promise<string> => 
{
const response = await articulo140Api.put<AddImageResponse>(
    `/activities/images/by-activity/${activityId}`,
    imageData
  )
  return response.data.message
}