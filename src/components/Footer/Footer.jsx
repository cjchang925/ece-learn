import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-surface-2 border-t border-separator text-[15px] leading-relaxed text-label-2">
      <div className="max-w-[50rem] mx-auto px-4 py-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-gradient-to-b from-[#2997ff] to-[#0066cc] rounded-[9px] flex items-center justify-center text-white text-xs font-semibold shrink-0">
            EE
          </div>
          <span className="font-semibold text-label text-base">
            NYCU EE Previous Exams
          </span>
        </div>

        {/* Team — label and links on one row */}
        <div className="mb-4 pb-4 border-b border-separator">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h4 className="font-semibold text-label shrink-0">Developers</h4>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 min-w-0">
              {[
                {
                  name: "Chi-Chun Chang",
                  url: "https://github.com/cjchang925",
                },
                { name: "Justin", url: "https://github.com/Justin900429" },
                { name: "Joyce", url: "https://github.com/JoyceFang1213" },
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
            Privacy Policy
          </h4>
          <p>
            No account is needed to browse or download exams. To upload, you
            sign in with Google OAuth 2.0 and we receive your name, email
            address and profile picture, used only to verify NYCU membership
            and manage uploads. We never sell or share this data. A cookie
            keeps you signed in, and Google Analytics collects anonymous usage
            statistics. You can revoke access in your{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-text hover:underline"
            >
              Google Account
            </a>{" "}
            at any time; for questions or data deletion, contact us on{" "}
            <a
              href="https://github.com/cjchang925/ece-learn/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-text hover:underline"
            >
              GitHub
            </a>
            .
          </p>
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
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
