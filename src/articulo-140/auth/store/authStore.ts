import { create } from "zustand";
import type { User } from "../pages/login/Interface/auth.interface";
import { loginAction } from "../pages/login/actions/login.action";
import { chekcAuthStatusAction } from "../actions/checkauthStatus.action";
import type { userComplete } from "../pages/register/registerInterfaces/register.interface";
import { registerActions } from "../pages/register/actions/register.action";

type state= 'authenticated' | 'no-authenticated' | 'checking'

interface authState {
    user: User | null;
    token: string | null;
    state:state;

    isAdmin:()=>boolean;
    isStudent:()=>boolean;
    isSupervisor:()=>boolean;
    
    register:(props:userComplete)=>Promise<string>;

    login:(email:string, password: string)=>Promise<boolean>;
    logout: () =>void;
    chekAuthStatus:()=>Promise<boolean>;
}

export const authStore = create<authState>()((set,get)=>({
    user: null,
    token: null,
    state:"checking",

    isAdmin:()=>{
        const role = get().user?.role;
        return role === "admin" ? true:false
    },

     isStudent:()=>{
        const role = get().user?.role;
        return role === "student" ? true:false
    },

     isSupervisor:()=>{
        const role = get().user?.role;
        return role === "supervisor" ? true:false
    },

    register:async(data:userComplete)=>{
        const message = await registerActions(data) 
        return message;
    },

    login: async(email:string, password: string) =>{

        try{
            const {data} = await loginAction(email,password);
            set({user: data.user, token:data.token, state:"authenticated"});
            localStorage.setItem('token',data.token);
            return true
        }catch(err){
            set({user: null, token:null, state:"no-authenticated",});
            localStorage.removeItem('token');
            return false
        }
        
    },

    logout:async()=>{
        localStorage.removeItem('token');
        set({user: null, token:null, state:"no-authenticated"})
    },
    chekAuthStatus:async()=>{
        try{
            const {data} = await chekcAuthStatusAction();
            set({user: data.user, token:data.token, state:"authenticated"});
            return true
        }catch(err){
            set({user: null, token:null, state:"no-authenticated"});
            return false
        } 
    },
}));