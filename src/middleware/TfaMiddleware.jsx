import { Navigate, Outlet } from "react-router-dom"

export function TfaMiddleware(){
    const pendingLoginStatus = localStorage.getItem('pendingLogin')
    const email = localStorage.getItem('loginEmail')
    if(pendingLoginStatus && email){
        return <Outlet />
    }else{
        return <Navigate to={'/'} replace/>
    }
}