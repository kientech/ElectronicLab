import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../../database/db";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const formik = useFormik({
    initialValues: {
      fullname: "",
      username: "",
      email: "",
      password: "",
      role: "user",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Fullname is required"),
      username: Yup.string().required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true); // Start loading
      try {
        // Tạo người dùng mới với email và mật khẩu
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: values.fullname,
        });

        localStorage.setItem("displayName", values.fullname);

        await setDoc(doc(db, "users", user.uid), {
          fullname: values.fullname,
          username: values.username,
          email: values.email,
          role: values.role,
          password: values.password,
        });

        toast.success("Registration Successful!", {
          position: "top-center",
          autoClose: 3000, // Closes after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        toast.error("Registration failed. " + error.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
      } finally {
        setLoading(false); // Stop loading
      }
    },
  });

  return (
    <div className="min-h-screen md:grid md:grid-cols-2 p-4 rounded-lg bg-[#f4f5f9] grid-cols-1">
      <div className="w-full md:h-[730px] h-[150px] rounded-lg overflow-hidden">
        <img
          src="https://cdn.dribbble.com/userupload/12102403/file/original-14b44fb83041a72959313ef92592e116.jpg?resize=1504x1128"
          alt=""
          className="h-full w-full rounded-lg object-cover overflow-hidden"
        />
      </div>
      <div className="p-4">
        <div className="text-right flex items-center justify-end">
          <p>Already a member?</p>
          <Link to="/login" className="text-buttonColor ml-1">
            Login Now
          </Link>
        </div>
        <div className="w-full mx-auto md:mt-16 mt-10">
          <h2 className="text-center font-semibold md:text-3xl text-2xl text-gray-800 mb-2">
            Register
          </h2>
          <p className="text-center font-base my-2 md:text-lg text-sm">
            Create an account to get started!
          </p>
          <form
            onSubmit={formik.handleSubmit}
            className="md:w-[70%] w-full mx-auto mt-10"
          >
            <div>
              <input
                type="text"
                name="fullname"
                placeholder="Fullname"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`px-4 py-4 w-full mt-4 outline-none rounded-xl shadow-sm ${
                  formik.touched.fullname && formik.errors.fullname
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.fullname && formik.errors.fullname ? (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.fullname}
                </p>
              ) : null}
            </div>
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`px-4 py-4 w-full mt-4 outline-none rounded-xl shadow-sm ${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.username && formik.errors.username ? (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.username}
                </p>
              ) : null}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`px-4 py-4 w-full mt-4 outline-none rounded-xl shadow-sm ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </p>
              ) : null}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`px-4 py-4 w-full mt-4 outline-none rounded-xl shadow-sm ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`my-4 mt-16 py-4 w-full rounded-lg bg-[#ff726f] text-white shadow-md hover:bg-[#ff6764] transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Registering..." : "Register Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
