import type { PropsWithChildren } from "react";
import { authStore } from "../auth/store/authStore";
import { Navigate } from "react-router";


export const AuthenticatedRoute = ({children}:PropsWithChildren)=>{
    const {state} = authStore();

    if(state === "checking") return null;

    if(state === "no-authenticated") return <Navigate to={"/auth/login"}/>

    return children;
};

export const NotAuthenticatedRoute = ({children}:PropsWithChildren)=>{
    const {state} = authStore();

    if(state === "checking") return null;

    if(state === "authenticated") return <Navigate to={"/activities"}/>

    return children;
};

export const AdminRoute = ({children}:PropsWithChildren)=>{
    const {state,isAdmin} = authStore();

    if(state === "checking") return null;

    if(state === "no-authenticated") return <Navigate to={"/auth/login"}/>

    if(!isAdmin()) return <Navigate to={"/activities"} /> 

    return children;
};

export const SupervisorRoute = ({children}:PropsWithChildren)=>{
    const {state,isSupervisor} = authStore();

    if(state === "checking") return null;

    if(state === "no-authenticated") return <Navigate to={"/auth/login"}/>

    if(!isSupervisor()) return <Navigate to={"/activities"} /> 

    return children;
};

export const StudentAdminRoute = ({children}:PropsWithChildren)=>{
    const {state,isStudent} = authStore();

    if(state === "checking") return null;

    if(state === "no-authenticated") return <Navigate to={"/auth/login"}/>

    if(!isStudent()) return <Navigate to={"/activities"} /> 

    return children;
};