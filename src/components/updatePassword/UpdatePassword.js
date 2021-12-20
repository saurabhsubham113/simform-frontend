import axios from 'axios'
import { Formik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import './updatePassword.scss'

const url = process.env.REACT_APP_BASE_URL + "password/update"

const UpdatePassword = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const navigate = useNavigate()

    const handleUpdate = async (obj, resetForm) => {
        try {
            //deleting confirm password so that obj can be passed directly
            delete obj.confirmPassword
            const res = await axios.post(url, obj, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                alert("password updated succesffuly!")
                resetForm()
                navigate("/dashboard")
            }
            resetForm()
        } catch (error) {
            if (error.response && !error.response.success) {
                setSubmitError(true)
                setErrorMsg(error.response.data.error)
            }
            resetForm()
        }
    }
    return (
        <>
            <h2 className="text-center text-white mt-5">Update Password</h2>
            <Formik
                initialValues={{
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ''
                }}
                validationSchema={yup.object({
                    oldPassword: yup.string().required('Old Password is required'),
                    newPassword: yup.string().required('New Password is required'),
                    confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], "New Password and Confirm Password must match").required('confirm password is required')
                })}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    handleUpdate(values, resetForm)
                    setSubmitting(false);
                }}
            >{(formik) => (
                <div className="form-container my-4">
                    {submitError && (
                        <div className="error-text text-center">{errorMsg}</div>
                    )}
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="oldPassword">Old Password</label>
                            <input
                                className={`form-control ${formik.touched.oldPassword && formik.errors.oldPassword
                                    ? "error-field"
                                    : ""
                                    }`}
                                type="password"
                                id='oldPassword'
                                name='oldPassword'
                                {...formik.getFieldProps("oldPassword")}
                            />
                            {formik.touched.oldPassword && formik.errors.oldPassword ? (
                                <div className="error-text">{formik.errors.oldPassword} </div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                className={`form-control ${formik.touched.newPassword && formik.errors.newPassword
                                    ? "error-field"
                                    : ""
                                    }`}
                                type="password"
                                id='newPassword'
                                name='newPassword'
                                {...formik.getFieldProps("newPassword")}
                            />
                            {formik.touched.newPassword && formik.errors.newPassword ? (
                                <div className="error-text">{formik.errors.newPassword} </div>
                            ) : null}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword
                                    ? "error-field"
                                    : ""
                                    }`}
                                type="password"
                                id='confirmPassword'
                                name='confirmPassword'
                                {...formik.getFieldProps("confirmPassword")}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="error-text">{formik.errors.confirmPassword} </div>
                            ) : null}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-25 my-3"
                            disabled={!formik.isValid}>
                            Submit
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary w-25 my-3 float-end"
                            onClick={() => (navigate("/dashboard"))}
                        >
                            Back
                        </button>


                    </form>
                </div>
            )
                }
            </Formik >
        </>
    )
}

export default UpdatePassword
