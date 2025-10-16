import { articulo140Api } from "@/articulo-140/api/articulo140Api"
import type { AuthResponse } from "../pages/login/Interface/auth.interface"


export const chekcAuthStatusAction = async():Promise<AuthResponse>=>{
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    try{
        const {data} = await articulo140Api.get<AuthResponse>('/auth/check-status');
    return data;
    }catch(error){
    console.log(error);
    localStorage.removeItem('token');
    throw new Error('Token expired or not valid');
    }
    
}