import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import "./signUpAndUpdate.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL + "signup";
const updateUserUrl = process.env.REACT_APP_BASE_URL + "userdashborad/update";
const getUserUrl = process.env.REACT_APP_BASE_URL + "userdashboard";

const SignUp = () => {
  const [submitError, setSubmitError] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [user, setUser] = useState({});
  const [errorMsg, setErrorMsg] = useState("")
  const ref = useRef()
  let formData = new FormData();
  let updateData = new FormData();

  const navigate = useNavigate();
  const location = useLocation();

  //prepopulating the existing data
  const prePopulate = async () => {
    try {
      const res = await axios.get(getUserUrl, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      //adding  the user in the state
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (error) {
      if (error.response && !error.response.success) {
        alert("something went worng");
      }
    }
  };

  useEffect(() => {
    //if updating the user call prepopulate and set user found
    if (location.pathname === "/update/user") {
      setUserFound(true);
      prePopulate();
    }
  }, []);

  //handling submit for both signup and update
  const handleSignUp = async (obj, resetForm) => {
    try {
      delete obj?.confirmPassword;

      //checking if the component is reused for updating or signing up
      if (location.pathname === "/update/user") {
        // formdata for updating user
        updateData.append("firstName", obj.firstName);
        updateData.append("lastName", obj.lastName);
        updateData.append("email", obj.email);
        updateData.append("photo", obj.photo);

        // sending data to backend for updating user
        const res = await axios.put(updateUserUrl, updateData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        //if the response is success
        if (res.data.success) {
          //navigate to dashboard
          navigate("/dashboard", { replace: true });
          resetForm();
          ref.current.value = ""
        }
      } else {
        //fordata for new user
        formData.append("firstName", obj.firstName);
        formData.append("lastName", obj.lastName);
        formData.append("email", obj.email);
        formData.append("password", obj.password);
        formData.append("photo", obj.photo);

        //creating new user in the DB
        const res = await axios.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        //if response is success set token
        if (res.data.success) {
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem(
            "name",
            `${res.data.data.user?.firstName} ${res.data.data.user?.lastName}`
          );
          navigate("/dashboard", { replace: true });
          ///resetting form
          resetForm();
          ref.current.value = ""
        }
      }
    } catch (error) {
      setSubmitError(true);
      if (error.response && !error.response.data.success)
        setErrorMsg("user already exist")
      resetForm();
      ref.current.value = ""
    }
  };

  //validation schema for updating and crcreating user
  const conditinalValidation = () => {
    //if user exist use this validation schema
    if (userFound) {
      return {
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().trim().required("Last name is required"),
        email: yup
          .string()
          .email("Invalid email address")
          .required("Email is required"),
        photo: yup.string().required("Profile Photo is required"),
      }
    }
    //if no user found use this schema
    return {
      firstName: yup.string().required("First name is required"),
      lastName: yup.string().trim().required("Last name is required"),
      email: yup
        .string()
        .email("Invalid email address")
        .required("Email is required"),
      password: yup.string()
        .min(6, "Password should be minimum 6 character")
        .required("Password is required"),

      confirmPassword: yup.string()
        .oneOf(
          [yup.ref("password"), null],
          "Password and confirm password must match"
        )
        .required("confirm password is required"),
      photo: yup.string().required("Profile Photo is required"),
    }
  }

  return (
    <>
   
      <h2 className="text-center text-white font-weight-bold">{userFound ? "Update User" : "Sign Up"}</h2>
      <Formik
        enableReinitialize={true}
        initialValues={{
          firstName: user.firstName ? user.firstName : "",
          lastName: user.lastName ? user.lastName : "",
          email: user.email ? user.email : "",
          password: "",
          confirmPassword: "",
          photo: "",
        }}

        validationSchema={yup.object(conditinalValidation())}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          handleSignUp(values, resetForm);

          setSubmitting(false);
        }}>
        {(formik) => (
          <div className="form-container my-4">
            {submitError && <div className="error-text text-center">{errorMsg}</div>}
            <form onSubmit={formik.handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  className={`form-control ${formik.touched.firstName && formik.errors.firstName
                    ? "error-field"
                    : ""
                    }`}
                  type="text"
                  id="firstName"
                  name="firstName"
                  {...formik.getFieldProps("firstName")}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="error-text">{formik.errors.firstName} </div>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  className={`form-control ${formik.touched.lastName && formik.errors.lastName
                    ? "error-field"
                    : ""
                    }`}
                  type="text"
                  id="lastName"
                  name="lastName"
                  {...formik.getFieldProps("lastName")}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="error-text">{formik.errors.lastName} </div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  className={`form-control ${formik.touched.email && formik.errors.email
                    ? "error-field"
                    : ""
                    }`}
                  type="email"
                  id="email"
                  name="email"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="error-text">{formik.errors.email} </div>
                ) : null}
              </div>
              {!userFound && (
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    className={`form-control ${formik.touched.password && formik.errors.password
                      ? "error-field"
                      : ""
                      }`}
                    type="password"
                    id="password"
                    name="password"
                    {...formik.getFieldProps("password")}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="error-text">{formik.errors.password} </div>
                  ) : null}
                </div>
              )}

              {!userFound && (
                <div className="form-group">
                  <label htmlFor="password">Confirm Password</label>
                  <input
                    className={`form-control ${formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                      ? "error-field"
                      : ""
                      }`}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    {...formik.getFieldProps("confirmPassword")}
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                    <div className="error-text">
                      {formik.errors.confirmPassword}{" "}
                    </div>
                  ) : null}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="photo">Profile Photo</label>
                <input
                  className={`form-control ${formik.touched.photo && formik.errors.photo
                    ? "error-field"
                    : ""
                    }`}
                  ref={ref}
                  type="file"
                  id="photo"
                  name="photo"
                  accep="image"
                  onChange={(e) => {
                    formik.setFieldValue("photo", e.target.files[0]);
                  }}
                />
                {formik.touched.photo && formik.errors.photo ? (
                  <div className="error-text">{formik.errors.photo} </div>
                ) : null}
              </div>


              {userFound ? (
                <>
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
                </>
              ) : (<button type="submit" className="btn btn-primary w-100 mt-3">
                Submit
              </button>)}
            </form>
            {!userFound && <p>
              Already an existing user?
              <Link to="/signin">sign In</Link>
            </p>}
          </div>
        )}
      </Formik>
    </>
  );
};

export default SignUp;
