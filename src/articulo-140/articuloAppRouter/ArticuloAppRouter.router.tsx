import { createBrowserRouter } from "react-router";
import { DashboardActivitiesLayout } from "../layout/DashboardActivitiesLayout";
import { AuthLayout } from "../layout/AuthLayout";
import { AboutPage } from "../home/aboutPage/AboutPage";
import { HomePage } from "../home/HomePage";
import { LoginPage } from "../auth/pages/login/LoginPage";
import { RegisterPage } from "../auth/pages/register/RegisterPage";
import { AdminPage } from "../admin/AdminPage";
import { AdminStudents } from "../admin/pages/adminStudents/AdminStudents";
import { AdminSupervisor } from "../admin/pages/adminSupervisor/AdminSupervisor";
import { AdminSupervisorForm } from "../admin/components/AdminSupervisorForm";
import { AdminActivities } from "../admin/pages/adminActivities/AdminActivities";
import { GestionAcivitiesPage } from "../utils/gestionActivitiesPage/GestionAcivitiesPage";
import { ActivitiesDeletedPage } from "../admin/pages/activitiesDeleted/ActivitiesDeletedPage";


export const router = createBrowserRouter([
    {
        path:"/",
        element: <DashboardActivitiesLayout/>,
        children:[
            {
                index:true,
                element:<AboutPage/>
            },
            {
                path:"activities/",
                element:<HomePage/>,
            },
            {
                path:"activities-details/:id",
                element:<GestionAcivitiesPage/>,
            },
        ]
    },
    {
        path:"auth/",
        element: <AuthLayout/>,
        children:[
            {
                path:"login/",
                element:<LoginPage/>
            },
            {
                path:"register/",
                element:<RegisterPage/>
            },
        ]
    },
        {
        path:"admin/",
        element: <DashboardActivitiesLayout/>,
        children:[
            {
                index:true,
                element:<AdminPage/>
            },
            {
                path:"activities/",
                element:<AdminActivities/>
            },
            {
                path:"activities-deleted/",
                element:<ActivitiesDeletedPage/>
            },
            {
                path:"students/",
                element:<AdminStudents/>
            },
            {
                path:"supervisor/",
                element:<AdminSupervisor/>
            },
            {
                path:"supervisor/create",
                element:<AdminSupervisorForm/>
            },
            {
              path:"supervisor/edit/:id"  
            }
        ]
    },
]);