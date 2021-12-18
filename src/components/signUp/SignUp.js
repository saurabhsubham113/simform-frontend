import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import "./signUp.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const url = process.env.REACT_APP_BASE_URL + "signup";

const SignUp = () => {
  const [submitError, setSubmitError] = useState(false);
  let errorMsg = "";
  let formData = new FormData();
  const navigate = useNavigate();

  const handleSignUp = async (obj, resetForm) => {
    try {
      delete obj?.confirmPassword;
      console.log(obj);
      formData.append("firstName", obj.firstName);
      formData.append("lastName", obj.lastName);
      formData.append("email", obj.email);
      formData.append("password", obj.password);
      formData.append("photo", obj.photo);
      
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem(
          "name",
          `${res.data.data.user?.firstName} ${res.data.data.user?.lastName}`
        );
        navigate("/dashboard", { replace: true });
        resetForm();
      }
    } catch (error) {
      setSubmitError(true);
      console.log(error.response.data);
      if (error.response && !error.response.data.success)
        errorMsg = error.response.data.error;
      resetForm();
    }
  };
  return (
    <>
      <h2 className="text-center text-white font-weight-bold">Sign Up</h2>
      <Formik
        initialValues={{
          firstName: "subham",
          lastName: "saurabh",
          email: "subham1@mail.com",
          password: "123456",
          confirmPassword: "123456",
          photo: "",
        }}
        validationSchema={yup.object({
          firstName: yup.string().required("First name is required"),
          lastName: yup.string().trim().required("Last name is required"),
          email: yup
            .string()
            .email("Invalid email address")
            .required("Email is required"),
          password: yup
            .string()
            .min(6, "Password should be minimum 6 character")
            .required("Password is required"),
          confirmPassword: yup
            .string()
            .min(6, "Password should be minimum 6 character")
            .oneOf(
              [yup.ref("password"), null],
              "Password and confirm password must match"
            )
            .required("confirm password is required"),
          photo: yup.string().required("Profile Photo is required"),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true)
          handleSignUp(values, resetForm);
          setSubmitting(false);
        }}>
        {(formik) => (
          <div className="form-container my-4">
            {submitError && <div>{errorMsg}</div>}
            <form onSubmit={formik.handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  className={`form-control ${
                    formik.touched.firstName && formik.errors.firstName
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
                  className={`form-control ${
                    formik.touched.lastName && formik.errors.lastName
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
                  className={`form-control ${
                    formik.touched.email && formik.errors.email
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

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
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

              <div className="form-group">
                <label htmlFor="password">Confirm Password</label>
                <input
                  className={`form-control ${
                    formik.touched.confirmPassword &&
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
              <div className="form-group">
                <label htmlFor="photo">Profile Photo</label>
                <input
                  className={`form-control ${
                    formik.touched.photo && formik.errors.photo
                      ? "error-field"
                      : ""
                  }`}
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
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={!formik.isValid}>
                Submit
              </button>
            </form>
            <p>
              Already an existing user?
              <Link to="/signin">sign In</Link>
            </p>
          </div>
        )}
      </Formik>
    </>
  );
};

export default SignUp;
