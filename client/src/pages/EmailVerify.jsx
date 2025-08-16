import React, { useContext, useEffect, useState } from "react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../index.css";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContent);
  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const [loading, setLoading] = useState(false);

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const otpArray = inputRefs.current.map((el) => el.value);
      const otp = otpArray.join("");
      const { data } = await axios.post(backendUrl + "/api/auth/verify-account", {
        otp,
      });

      if (data.success) {
        toast.success(data.message);
        if (getUserData) getUserData();
        location.reload();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-5"
      style={{ backgroundColor: "#171717" }}
    >
      {/* Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-200 font-semibold">Verifying...</p>
        </div>
      )}

      {/* Card */}
      <form
        onSubmit={onSubmitHandler}
        className={`relative bg-[#1f1f1f]/90 backdrop-blur-xl border border-white/20 shadow-2xl p-10 rounded-3xl w-full sm:w-[400px] z-10 animate-fadeUp ${
          loading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* Title */}
        <h1 className="text-white text-2xl font-bold text-center mb-4">
          Email Verification
        </h1>
        <p className="text-center mb-6 text-gray-400">
          Enter the 6-digit code sent to your email
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                disabled={loading}
                className="w-12 h-12 border border-white/20 bg-[#262626] text-center text-xl text-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-500"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full py-2 bg-[#333333] hover:bg-[#444444] border border-white/20 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          {loading ? "Please Wait..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
