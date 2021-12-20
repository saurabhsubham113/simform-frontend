import React, { useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";
import "./signIn.scss";
import { Link, useNavigate } from "react-router-dom";

const url = process.env.REACT_APP_BASE_URL + "signin";

const SignIn = () => {
  const [submitError, setSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (obj, resetForm) => {
    try {
      const res = await axios.post(url, obj);
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
      if (error.response && !error.response.data.success)
        setErrorMsg(error.response.data.error)
      resetForm();
    }
  };
  return (
    <>
      <h2 className="text-center text-white font-weight-bold">Sign In</h2>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={yup.object({
          email: yup
            .string()
            .email("Invalid email address")
            .required("Email is required"),
          password: yup
            .string()
            .min(6, "Password should be minimum 6 character")
            .required("Password is required"),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          handleSignIn(values, resetForm);
          setSubmitting(false);
        }}>
        {(formik) => (
          <div className="form-container my-4">
            {submitError && (
              <div className="error-text text-center">{errorMsg}</div>
            )}
            <form onSubmit={formik.handleSubmit} className="form">
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

              <button
                type="submit"
                className="btn btn-primary w-100 my-3"
                disabled={!formik.isValid}>
                Submit
              </button>
            </form>
            <p className="text-center">
              New to this application?
              <Link to="/signup">sign Up</Link>
            </p>
          </div>
        )}
      </Formik>

    </>
  );
};

export default SignIn;
