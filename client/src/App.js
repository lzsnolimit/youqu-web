import Home from './pages/Home'
import React, {useEffect} from 'react';
import {useCookies} from 'react-cookie';
import Login from "./pages/Login";
import Register from './pages/Register'
import { redirect, createHashRouter, RouterProvider} from 'react-router-dom';
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";


const App = () => {
    const [cookies] = useCookies(['Authorization']);
    const router = createHashRouter([
        {
            path: "/",
            element: <Home />,
            loader: ({params}) => {
                if(!cookies.Authorization||cookies.Authorization=='undefined'){
                    return redirect("/login")
                }
                return null
            }
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            path: "/reset_password",
            element: <ResetPassword />,
        },
        {
            path: "/forget_password",
            element: <ForgetPassword />,
        },
    ]);
    return <RouterProvider router={router} />
}


export default App