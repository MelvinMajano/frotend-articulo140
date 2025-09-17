import { createBrowserRouter } from "react-router";
import { DashboardActivitiesLayout } from "../layout/DashboardActivitiesLayout";
import { HomePage } from "../pages/homePages/HomePage";
import { LoginPage } from "../pages/loginPages/LoginPage";
import { AboutPage } from "../pages/aboutPages/AboutPage";


export const router = createBrowserRouter([
    {
    path: "/",
    element: <DashboardActivitiesLayout/>,
    children:
    [
        {
            path: "",
            element: <HomePage/>
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