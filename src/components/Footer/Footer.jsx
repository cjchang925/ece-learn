import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-surface-2 border-t border-separator text-footnote text-label-2">
      <div className="max-w-[74rem] mx-auto px-4 py-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 bg-gradient-to-b from-[#2997ff] to-[#0066cc] rounded-[8px] flex items-center justify-center text-white text-[11px] font-semibold shrink-0">
            EE
          </div>
          <span className="font-semibold text-label text-sm">
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
                    <FaGithub className="text-xs shrink-0" /> {dev.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
