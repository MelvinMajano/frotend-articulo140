import axios from "axios";

const articulo140Api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

//TODO: Crear los intersectores

export {articulo140Api};