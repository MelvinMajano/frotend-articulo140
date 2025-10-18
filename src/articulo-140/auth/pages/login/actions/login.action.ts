import { articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { AuthResponse } from "../Interface/auth.interface";





export const loginAction= async (email:string, password:string ):Promise<AuthResponse>=>{
    try {
        const {data} = await articulo140Api.post<AuthResponse>('/auth/login',
        {
            email,
            password
        }
    )
    
    return data;
    } catch (error:any) {
          console.error('Error response:', error.response?.data);
          return error.response?.data
    }
}