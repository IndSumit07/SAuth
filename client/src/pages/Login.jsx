import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import "../index.css";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, userData, isLoggedIn } =
    useContext(AppContent);

  const [state, setState] = useState("Log In");
  const [fullname, setfullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 Loader state

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          fullname,
          username,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          location.reload();
          navigate("/");
          toast.success(data.message)
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });

        if (data.success) {
          toast.success(data.message)
          setIsLoggedIn(true);
          navigate("/");
          location.reload();
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div
      className="relative min-h-screen min-w-full flex items-center justify-center overflow-hidden px-5"
      style={{ backgroundColor: "#171717" }}
    >
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-200 font-semibold">Processing...</p>
        </div>
      )}

      {/* Glassmorphism Form Card */}
      <div
        key={state}
        className={`relative bg-[#1f1f1f]/90 backdrop-blur-xl border border-white/20 shadow-2xl p-10 rounded-3xl w-full sm:w-[400px] z-10 animate-fadeUp ${
          loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Logo/Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#262626] rounded-full flex items-center justify-center shadow-lg border border-white/20">
            <img src={assets.person_icon} alt="User" className="w-8 h-8 invert" />
          </div>
          <span className="mt-2 text-xl font-extrabold text-white tracking-wide">
            SAuth
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mt-2 text-center">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          {state === "Sign Up" ? "Create your account" : "Login to your account"}
        </p>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === "Sign Up" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setfullname(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-white/20 rounded-xl bg-[#262626] text-gray-200 placeholder-gray-500 focus:bg-[#2f2f2f] outline-none focus:ring-2 focus:ring-gray-500 transition-all shadow-sm"
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-white/20 rounded-xl bg-[#262626] text-gray-200 placeholder-gray-500 focus:bg-[#2f2f2f] outline-none focus:ring-2 focus:ring-gray-500 transition-all shadow-sm"
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-white/20 rounded-xl bg-[#262626] text-gray-200 placeholder-gray-500 focus:bg-[#2f2f2f] outline-none focus:ring-2 focus:ring-gray-500 transition-all shadow-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-white/20 rounded-xl bg-[#262626] text-gray-200 placeholder-gray-500 focus:bg-[#2f2f2f] outline-none focus:ring-2 focus:ring-gray-500 transition-all shadow-sm"
            required
          />

          <p
            onClick={() => !loading && navigate("/reset-password")}
            className="text-gray-400 text-sm cursor-pointer hover:underline hover:text-gray-200 transition"
          >
            Forgot password?
          </p>

          <button
            disabled={loading}
            className="w-full py-2 bg-[#333333] hover:bg-[#444444] text-white font-semibold rounded-xl shadow-lg transition-all duration-200 border border-white/20"
          >
            {loading
              ? "Please wait..."
              : state === "Sign Up"
              ? "Register"
              : "Login"}
          </button>
        </form>

        {/* Toggle Link */}
        {state === "Sign Up" ? (
          <p className="mt-4 text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <span
              onClick={() => !loading && setState("Login")}
              className="text-white cursor-pointer underline hover:text-gray-300 transition"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="mt-4 text-sm text-gray-400 text-center">
            Don't have an account?{" "}
            <span
              onClick={() => !loading && setState("Sign Up")}
              className="text-white cursor-pointer underline hover:text-gray-300 transition"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
