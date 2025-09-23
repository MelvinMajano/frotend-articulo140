import { createBrowserRouter } from "react-router";
import { DashboardActivitiesLayout } from "../layout/DashboardActivitiesLayout";
import { HomePage } from "../pages/homePages/HomePage";
import { LoginPage } from "../pages/loginPages/LoginPage";
import { AboutPage } from "../pages/aboutPages/AboutPage";
import { AdminAcivitiesPage } from "../pages/homePages/activities/components/adminActivitiesPage/AdminAcivitiesPage";



export const router = createBrowserRouter([
    {
    path: "/",
    element: <DashboardActivitiesLayout/>,
    children:
    [
        {
            path: "activities",
            element: <HomePage/>
        },
        {
            path: "activities/admin-activities",
            element: <AdminAcivitiesPage/>
        },
    ]
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
    {
        path: "/about",
        element: <AboutPage/>,
    }
]);