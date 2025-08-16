import React, { useContext, useState, useRef } from "react";
import assets from "../assets/assets";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const inputRefs = useRef([]);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/send-reset-otp", {
        email,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value).join("");

    if (otpArray.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-reset-otp",
        { email, otp: otpArray }
      );
      if (data.success) {
        setOtp(otpArray);
        setIsOtpSubmitted(true);
        toast.success(data.message || "OTP verified successfully");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-0"
      style={{ backgroundColor: "#171717" }}
    >
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-200 font-semibold">Processing...</p>
        </div>
      )}

      {/* Email Form */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className={`relative bg-[#1f1f1f]/90 backdrop-blur-xl border border-white/20 shadow-2xl p-10 rounded-3xl w-full sm:w-[400px] z-10 animate-fadeUp ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <h1 className="text-white text-2xl font-bold text-center mb-4">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-gray-400">
            Enter your registered email address
          </p>
          <div className="mb-5 flex items-center gap-3 w-full px-5 py-3 rounded-xl bg-[#262626] border border-white/20 focus-within:border-gray-400 transition">
            <img src={assets.mail_icon} alt="email" className="w-5 h-5 opacity-70 invert" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email ID"
              className="bg-transparent outline-none w-full text-gray-200 placeholder-gray-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#333333] hover:bg-[#444444] text-white py-3 rounded-xl font-semibold transition duration-200 shadow-md border border-white/20 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            Submit
          </button>
        </form>
      )}

      {/* OTP Form */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOtp}
          className={`relative bg-[#1f1f1f]/90 backdrop-blur-xl border border-white/20 shadow-2xl p-10 rounded-3xl w-full sm:w-[400px] z-10 animate-fadeUp ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <h1 className="text-white text-2xl font-bold text-center mb-4">Reset Password OTP</h1>
          <p className="text-center mb-6 text-gray-400">
            Enter the 6-digit code sent to your email
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 border border-white/20 bg-[#262626] text-center text-xl text-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-500"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button
            className={`w-full py-2.5 bg-[#333333] hover:bg-[#444444] text-white rounded-lg transition border border-white/20 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            Submit
          </button>
        </form>
      )}

      {/* New Password Form */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className={`relative bg-[#1f1f1f]/90 backdrop-blur-xl border border-white/20 shadow-2xl p-10 rounded-3xl w-full sm:w-[400px] z-10 animate-fadeUp ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <h1 className="text-white text-2xl font-bold text-center mb-4">New Password</h1>
          <p className="text-center mb-6 text-gray-400">Enter your new password</p>
          <div className="mb-5 flex items-center gap-3 w-full px-5 py-3 rounded-xl bg-[#262626] border border-white/20 focus-within:border-gray-400 transition">
            <img src={assets.lock_icon} alt="lock" className="w-5 h-5 opacity-70 invert" />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none w-full text-gray-200 placeholder-gray-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#333333] hover:bg-[#444444] text-white py-3 rounded-xl font-semibold transition duration-200 shadow-md border border-white/20 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
