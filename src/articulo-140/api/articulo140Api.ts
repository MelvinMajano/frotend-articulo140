import axios from "axios";

const articulo140Api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

//TODO: Crear los intersectores
articulo140Api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export {articulo140Api};