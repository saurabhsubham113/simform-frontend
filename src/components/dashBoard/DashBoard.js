import axios from "axios";
import './dashBoard.scss'
import { useEffect, useState } from "react";

const url = process.env.REACT_APP_BASE_URL + "userdashboard";

const DashBoard = () => {
    const [user, setUser] = useState({});
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
        getUserDetails()
    }, []);
    return (
        <>
            {Object.keys(user).length > 0 ? (
                <div className="dashboard-container my-4">
                    <div className="header">
                        <img src={user?.photo.secure_url} alt="profile" />
                    </div>

                    <div className="content">
                        <div className="name text-capitalize">
                            <p>{`${user.firstName} ${user.lastName}`}</p>
                            <span className="age"> 26</span>
                        </div>
                        <div className="city">{user.email}</div>

                        <div className="divider"></div>
                        <div className="card-foot">
                            <div className="detail">
                                <div className="value">80K</div>
                                <div className="title">Followers</div>
                            </div>
                            <div className="detail">
                                <div className="value">803K</div>
                                <div className="title">Likes</div>
                            </div>
                            <div className="detail">
                                <div className="value"><strong>1.4k</strong></div>
                                <div className="title">Photos</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : <h2>Loading...</h2>}

        </>
    )
}

export default DashBoard
