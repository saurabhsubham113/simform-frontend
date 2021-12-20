export const  isAuthenticated = () => {
    if (typeof window == undefined)
        return false

    if (localStorage.getItem("token"))
        return true

    return false
}