import { Navigate, Outlet } from "react-router-dom"
import { isAuthenticated } from "./auth"


const ProtectedRoutes = () => {
    const isAuth = isAuthenticated()

    return isAuth ? <Outlet /> : <Navigate to="/signin" />
}

export default ProtectedRoutes