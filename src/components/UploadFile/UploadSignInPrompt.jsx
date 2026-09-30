import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import GoogleSignInButton from "../Auth/GoogleSignInButton.jsx";

const UploadSignInPrompt = ({ onSignIn, isSigningIn }) => (
  <div className="flex-1 bg-canvas px-4 pt-10 pb-16 md:pt-14">
    <div className="max-w-md mx-auto surface-card px-8 py-12 flex flex-col items-center text-center animate-fade-up">
      <div className="w-16 h-16 rounded-[18px] bg-gradient-to-b from-[#2997ff] to-[#0055d4] flex items-center justify-center text-white text-2xl shadow-[0_8px_24px_rgba(0,113,227,0.3)] mb-6">
        <FontAwesomeIcon icon={faLock} />
      </div>
      <h1 className="text-title-2 text-label mb-2">登入以上傳考古題</h1>
      <p className="text-label-2 mb-8 text-balance">
        上傳考古題前，請先使用陽明交大 Google 帳號登入，以確認您的身分。
      </p>
      <GoogleSignInButton onClick={onSignIn} isSigningIn={isSigningIn} />
      <p className="mt-5 text-footnote text-label-3">
        瀏覽與下載考古題不需要登入。
      </p>
    </div>
  </div>
);

export default UploadSignInPrompt;
