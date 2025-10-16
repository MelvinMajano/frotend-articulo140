import { articulo140Api } from "@/articulo-140/api/articulo140Api";
import type { userComplete } from "../registerInterfaces/register.interface";
import type { AuthResponse } from "../../login/Interface/auth.interface";





export const registerActions = async(dataUser:userComplete):Promise<string>=>{
    console.log('Datos de registro:', dataUser)
    try {
        const {data} = await articulo140Api.post<AuthResponse>('/auth/register', dataUser, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('Respuesta exitosa:', data)
        return data.message 
    } catch (error:any) {
        console.error('Error response:', error.response?.data)

        return "Error en el registro" 
    }
    
};