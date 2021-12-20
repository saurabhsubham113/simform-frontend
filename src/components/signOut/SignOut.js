import axios from "axios"
import { useNavigate } from "react-router-dom"
import { isAuthenticated } from "../../auth/auth"

const url = process.env.REACT_APP_BASE_URL + "signout"

const SignOut = () => {

    const navigate = useNavigate()
    const isAuth = isAuthenticated()
    const handleClick = async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        const res = await axios.get(url)
        navigate("/signin")
    }

    return (
        <>
            {isAuth && <div className='mt-3' style={{ marginLeft: "80vw", marginRight: "10vw" }}>
                <button className='btn btn-success' onClick={handleClick}>
                    Logout
                </button>
            </div>}
        </>
    )

}

export default SignOut
