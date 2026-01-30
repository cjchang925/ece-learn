import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { useGoogleLogin } from "@react-oauth/google";
import { API_ENDPOINTS, GOOGLE_API, STORAGE_KEYS } from "../../constants";

const Login = ({ onLoginSuccess, onUserNameChange }) => {
  const [googleAuthResponse, setGoogleAuthResponse] = useState(null);

  const initiateGoogleLogin = useGoogleLogin({
    onSuccess: (response) => setGoogleAuthResponse(response),
    onError: (error) => console.error("Google login error:", error),
  });

  useEffect(() => {
    if (!googleAuthResponse) return;

    const authenticateWithBackend = async () => {
      try {
        const userInfoResponse = await fetch(
          `${GOOGLE_API.USER_INFO}?access_token=${googleAuthResponse.access_token}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${googleAuthResponse.access_token}`,
              Accept: "application/json",
            },
          },
        );

        const userData = await userInfoResponse.json();

        await fetch(API_ENDPOINTS.LOGIN, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(userData),
        });

        const userName = userData.given_name;
        window.localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
        onUserNameChange(userName);
        onLoginSuccess(true);
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };

    authenticateWithBackend();
  }, [googleAuthResponse, onLoginSuccess, onUserNameChange]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Brand */}
        <div className="bg-blue-800 p-8 md:p-12 flex flex-col items-center justify-center text-white md:w-1/2">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
            <FontAwesomeIcon
              icon={faGraduationCap}
              className="text-4xl md:text-5xl"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">NYCU EE</h1>
          <p className="text-white/80 text-center">Previous Exam Archive</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 md:p-12 flex flex-col items-center justify-center md:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Welcome
          </h2>
          <p className="text-slate-500 mb-8 text-center">
            Sign in to access exam archives
          </p>

          <button
            onClick={initiateGoogleLogin}
            className="w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:border-blue-800 hover:bg-blue-50 transition-all duration-200"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          <p className="mt-6 text-sm text-slate-400 text-center">
            Sign in with your Google account to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
