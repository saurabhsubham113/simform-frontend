import axios from "axios";
import './dashBoard.scss'
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const url = process.env.REACT_APP_BASE_URL + "userdashboard";

const DashBoard = () => {
    const [user, setUser] = useState({});
    //getting user details function
    const getUserDetails = async () => {
        try {
            const res = await axios.get(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            })
            if (res.data.success) {
                setUser(res.data.data)
            }
        } catch (error) {
            if (error.response && !error.response.success) {
                alert("something went worng")
            }
        }
    }
    useEffect(() => {
        //setting user on component mount
        getUserDetails()
    }, []);
    return (
        <>

            {Object.keys(user).length <= 0 ? <h2>Loading...</h2> : (
                <>
                    <h2 className="text-center text-capitalize text-white">Welcome {`${user.firstName} ${user.lastName}`}</h2>
                    <div className="dashboard-container my-4">
                        <div className="header">
                            <img src={user?.photo.secure_url} alt="profile" />
                        </div>

                        <div className="content">
                            <div className="name text-capitalize">
                                <p>{`${user.firstName} ${user.lastName}`}</p>
                            </div>
                            <div className="email">{user.email}</div>

                            <div className="divider"></div>
                            <div className="card-foot pb-3">
                                <div className="detail">
                                    <Link to="/update/user">Update User</Link>
                                </div>
                                <div className="detail">
                                    <Link to="/update/password">Update Password</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}

export default DashBoard
