import { createBrowserRouter, Navigate } from "react-router";
import { DashboardActivitiesLayout } from "../layout/DashboardActivitiesLayout";
import { AuthLayout } from "../layout/AuthLayout";
import { AboutPage } from "../home/aboutPage/AboutPage";
import { HomePage } from "../home/HomePage";
import { LoginPage } from "../auth/pages/login/LoginPage";
import { RegisterPage } from "../auth/pages/register/RegisterPage";

{/* Importaciones para Admin Page y Students */}
import { AdminPage } from "../admin/AdminPage";
import { AdminStudents } from "../admin/pages/adminStudents/AdminStudents";
import { AdminStudentDetail } from "../admin/pages/adminStudents/AdminStudentsResume";
import { AdminAddActivityToStudent } from "../admin/pages/adminStudents/AdminStudentsActivity";

{/* Importaciones para Admin Supervisors */}
import { AdminSupervisor } from "../admin/pages/adminSupervisor/AdminSupervisor";
import { AdminSupervisorForm } from "../admin/components/AdminSupervisorForm";
import { AdminSupervisorEdit } from "../admin/components/AdminSupervisorEdit";

{/* Importaciones para Admin Careers */}
import { AdminCareers } from "../admin/pages/adminCareers/AdminCareers";
import { AdminCareerForm } from "../admin/components/AdminCareerForm";
import { AdminCareerEdit } from "../admin/components/AdminCareersEdit";

{/* Importaciones para Admin Files */}
import { AdminFilesPage } from "../admin/pages/adminFiles/adminFiles";

{/* Importaciones para Admin Activities */}
import { AdminActivities } from "../admin/pages/adminActivities/AdminActivities";
import { ActivityAttendance } from "../admin/pages/adminActivities/AdminActivitiesAttendance";
import { GestionAcivitiesPage } from "../utils/gestionActivitiesPage/GestionAcivitiesPage";
import { ActivitiesDeletedPage } from "../admin/pages/activitiesDeleted/ActivitiesDeletedPage";
import { AuthenticatedRoute,NotAuthenticatedRoute, AdminRoute,SupervisorRoute} from "./ProtetedRoutes";
import { InscriptionsAttendacePage } from "../supervisor/InscriptionsAttendacePage";


export const router = createBrowserRouter([
    {
        path:"/",
        element: <DashboardActivitiesLayout/>
        ,
        children:[
            {
                index:true,
                element:<AboutPage/>
            },
            {
                path:"activities/",
                element:
                <AuthenticatedRoute>
                    <HomePage/>
                </AuthenticatedRoute>
                ,
            },
            {
                path:"activities-details/:id",
                element:
                <AuthenticatedRoute>
                    <GestionAcivitiesPage/>
                </AuthenticatedRoute>
                ,
            },
        ]
    },
    {
        path:"auth/",
        element: 
        <NotAuthenticatedRoute>
            <AuthLayout/>
        </NotAuthenticatedRoute>,
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
        element: 
        <AdminRoute>
            <DashboardActivitiesLayout/>
        </AdminRoute>
        ,
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
                path:"activities/:id/attendance",
                element: <ActivityAttendance/>
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
                path:"students/create",
                // element: 
            },
            {
                path:"students/:id",
                element:<AdminStudentDetail/>
            },
            {
                path:"students/:id/addActivity",
                element:<AdminAddActivityToStudent/>
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
              path:"supervisor/edit/:id",
              element:<AdminSupervisorEdit/>
            },
            {
                path: "careers/",
                element: <AdminCareers/>,
            },
            {
                path: "careers/create",
                element: <AdminCareerForm/>,
            },
            {
                path: "careers/edit/:id",
                element: <AdminCareerEdit/>,
            },
            {
                path: "files/",
                element: <AdminFilesPage />,
            }
        ]
    },
    {
        path:"supervisor/",
        element: 
        <SupervisorRoute>
            <DashboardActivitiesLayout/>
        </SupervisorRoute>,
        children:[
            {
                path:"incriptions-attendance/:id",
                element:<InscriptionsAttendacePage/>,
            },
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" />
    },
    
]);