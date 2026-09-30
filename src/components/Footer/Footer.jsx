import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-surface-2 border-t border-separator text-[15px] leading-relaxed text-label-2">
      <div className="max-w-[74rem] mx-auto px-4 py-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-gradient-to-b from-[#2997ff] to-[#0066cc] rounded-[9px] flex items-center justify-center text-white text-xs font-semibold shrink-0">
            EE
          </div>
          <span className="font-semibold text-label text-base">
            交大電機考古網站
          </span>
        </div>

        {/* Team — label and links on one row */}
        <div className="mb-4 pb-4 border-b border-separator">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h4 className="font-semibold text-label shrink-0">開發團隊</h4>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 min-w-0">
              {[
                { name: "Justin", url: "https://github.com/Justin900429" },
                { name: "Joyce", url: "https://github.com/JoyceFang1213" },
                {
                  name: "Chi-Chun Chang",
                  url: "https://github.com/cjchang925",
                },
              ].map((dev) => (
                <li key={dev.name}>
                  <a
                    href={dev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-label-2 hover:text-accent-text hover:underline transition-colors"
                  >
                    <FaGithub className="text-sm shrink-0" /> {dev.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Privacy policy — linked from the Google OAuth consent screen as /#privacy-policy */}
        <section
          id="privacy-policy"
          aria-labelledby="privacy-policy-title"
          className="mb-4 pb-4 border-b border-separator scroll-mt-20"
        >
          <h4
            id="privacy-policy-title"
            className="font-semibold text-label mb-2"
          >
            隱私權政策
          </h4>
          <div className="max-w-3xl space-y-2">
            <p>
              瀏覽與下載考古題不需要登入。僅在您上傳考古題時，本網站會透過
              Google OAuth 2.0 請您登入，並取得您 Google
              帳戶的基本資料（姓名、電子郵件地址與大頭貼）。
            </p>
            <p>
              這些資料僅用於確認您是否為陽明交大成員，以及管理考古題的上傳；不會出售、出租或提供給第三方，也不會用於廣告。登入狀態以
              Cookie 保存於您的瀏覽器。
            </p>
            <p>
              您可以隨時登出，或至{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-text hover:underline"
              >
                Google 帳戶設定
              </a>
              撤銷本網站的存取權限。本網站另使用 Google Analytics
              收集匿名的瀏覽統計資料。如需刪除您的資料或有任何疑問，請透過{" "}
              <a
                href="https://github.com/cjchang925/ece-learn/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-text hover:underline"
              >
                GitHub
              </a>{" "}
              與我們聯絡。
            </p>
          </div>
        </section>

        {/* Bottom */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-label-3">
          <span className="inline-flex items-center gap-1">
            <span>&copy;</span>
            <span>
              {new Date().getFullYear()} NYCU EESA. All rights reserved.
            </span>
          </span>
          <a
            href="https://github.com/cjchang925/ece-learn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-label-3 hover:text-accent-text hover:underline transition-colors"
          >
            Source code released under MIT license.
          </a>
          <a
            href="#privacy-policy"
            className="text-label-3 hover:text-accent-text hover:underline transition-colors"
          >
            隱私權政策
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
