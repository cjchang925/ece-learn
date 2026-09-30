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
    <div className="relative min-h-screen bg-canvas flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Soft ambient glow behind the sign-in card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[48rem] h-[48rem] rounded-full opacity-40 blur-3xl bg-[radial-gradient(closest-side,rgba(41,151,255,0.35),transparent)]"
      />

      <div className="relative w-full max-w-md surface-card px-8 py-12 md:px-12 md:py-14 flex flex-col items-center text-center animate-fade-up">
        {/* App icon */}
        <div className="w-20 h-20 rounded-[22px] bg-gradient-to-b from-[#2997ff] to-[#0055d4] flex items-center justify-center text-white shadow-[0_8px_24px_rgba(0,113,227,0.35)] mb-8">
          <FontAwesomeIcon icon={faGraduationCap} className="text-4xl" />
        </div>

        <p className="text-sm font-semibold text-accent-text mb-1">NYCU EE</p>
        <h1 className="text-title-1 text-label mb-2">Welcome</h1>
        <p className="text-label-2 mb-10">
          Previous Exam Archive
          <br />
          Sign in to access exam archives
        </p>

        <button
          type="button"
          onClick={initiateGoogleLogin}
          className="pressable w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-label text-canvas font-medium hover:opacity-90"
        >
          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <FcGoogle className="text-lg" />
          </span>
          Continue with Google
        </button>

        <p className="mt-6 text-footnote text-label-3">
          Sign in with your Google account to continue
        </p>
      </div>
    </div>
  );
};

export default Login;
