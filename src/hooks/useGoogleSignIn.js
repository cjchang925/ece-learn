import { useState } from "react";
import { useGoogleLogin, useGoogleOAuth } from "@react-oauth/google";
import { API_ENDPOINTS, GOOGLE_API } from "../constants";

const NYCU_EMAIL = /@nycu\.edu\.tw$/i;
const NYCU_ONLY_MESSAGE = "請使用 @nycu.edu.tw 帳號登入。";

/**
 * Google OAuth 2.0 sign-in for NYCU accounts: opens Google's popup, checks
 * the account's domain, and starts a session with our backend (which
 * re-verifies the access token with Google).
 */
export default function useGoogleSignIn(onSignedIn) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { scriptLoadedSuccessfully } = useGoogleOAuth();

  const openGooglePopup = useGoogleLogin({
    // Only a hint for Google's account chooser; enforced below and on the server
    hosted_domain: "nycu.edu.tw",
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch(GOOGLE_API.USER_INFO, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            Accept: "application/json",
          },
        });
        const userData = await userInfoResponse.json();

        if (
          !userData.verified_email ||
          !NYCU_EMAIL.test(userData.email || "")
        ) {
          alert(NYCU_ONLY_MESSAGE);
          return;
        }

        const loginResponse = await fetch(API_ENDPOINTS.LOGIN, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });

        if (loginResponse.status === 403) {
          alert(NYCU_ONLY_MESSAGE);
          return;
        }
        if (!loginResponse.ok) {
          alert("登入失敗，請稍後再試。");
          return;
        }

        onSignedIn();
      } catch (error) {
        console.error("Authentication error:", error);
        alert("登入失敗，請稍後再試。");
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
