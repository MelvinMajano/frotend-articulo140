import { articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { AuthResponse } from "../Interface/auth.interface";





export const loginAction= async (email:string, password:string ):Promise<AuthResponse>=>{
    const {data} = await articulo140Api.post<AuthResponse>('/auth/login',
        {
            email,
            password
        }
    )
    console.log(data.message)
    return data;
}