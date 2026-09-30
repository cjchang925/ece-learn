import { FcGoogle } from "react-icons/fc";

const GoogleSignInButton = ({ onClick, isSigningIn }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isSigningIn}
    className="pressable w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-label text-canvas font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-wait"
  >
    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
      <FcGoogle className="text-lg" />
    </span>
    {isSigningIn ? "登入中…" : "使用 Google 帳號登入"}
  </button>
);

export default GoogleSignInButton;
