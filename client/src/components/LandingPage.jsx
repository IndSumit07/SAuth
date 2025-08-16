import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const GreetingPage = () => {
  const { backendUrl, isLoggedIn, userData, setIsLoggedIn } = useContext(AppContent);

  // Logout API handler
  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout", {}, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);
        setIsLoggedIn(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  const verifyEmail = async()=>{
    try {
      const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp")
      if (data.success) {
        toast.success(data.message);
        setIsLoggedIn(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  
  }
  

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-gray-200 text-center"
      style={{ backgroundColor: "#171717" }}
    >
      <h1 className="text-5xl mb-5 font-black">SAuth</h1>
      {/* Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-8"
      >
        {!isLoggedIn
          ? "Hey Developer, good to see you"
          : `Hey ${userData?.fullname || "User"}`}
      </motion.h1>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        {!isLoggedIn && (
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#2c2c2c" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-[#262626] text-gray-100 font-semibold rounded-lg shadow-md transition-all"
            >
              Login to Continue
            </motion.button>
          </Link>
        )}

        {isLoggedIn && !userData?.isAccountVerified && (
          <>
            <Link to="/email-verify" onClick={verifyEmail}>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#2c2c2c" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#262626] text-gray-100 font-semibold rounded-lg shadow-md transition-all"
              >
                Verify Email
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05, borderColor: "#555555", color: "#bbb" }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="px-6 py-3 border-2 border-gray-500 text-gray-300 font-semibold rounded-lg transition-all"
            >
              Logout
            </motion.button>
          </>
        )}

        {isLoggedIn && userData?.isAccountVerified && (
          <motion.button
            whileHover={{ scale: 1.05, borderColor: "#555555", color: "#bbb" }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="px-6 py-3 border-2 border-gray-500 text-gray-300 font-semibold rounded-lg transition-all"
          >
            Logout
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default GreetingPage;
