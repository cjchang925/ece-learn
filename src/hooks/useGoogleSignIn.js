import { useState } from "react";
import { useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { API_ENDPOINTS, GOOGLE_API } from "../constants";

/**
 * Google OAuth 2.0 sign-in: opens Google's popup, reads the user's basic
 * profile, and starts a session with our backend.
 */
export default function useGoogleSignIn(onSignedIn) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  const openGooglePopup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch(
          `${GOOGLE_API.USER_INFO}?access_token=${tokenResponse.access_token}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
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

        onSignedIn();
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsSigningIn(false);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setIsSigningIn(false);
    },
    // e.g. the user closed the popup
    onNonOAuthError: () => setIsSigningIn(false),
  });

  const signIn = () => {
    // Without Google's script no popup (and so no callback) would ever come
    if (!scriptLoadedSuccessfully) {
      alert("無法載入 Google 登入服務，請檢查網路連線後重新整理頁面。");
      return;
    }
    setIsSigningIn(true);
    openGooglePopup();
  };

  return { signIn, isSigningIn };
}
