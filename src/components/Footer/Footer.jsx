import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-8 text-left">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
            EE
          </div>
          <span className="font-bold text-lg">交大電機考古網站</span>
        </div>

        {/* Team — label and links on one row */}
        <div className="mb-4 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h4 className="font-semibold text-white/90 shrink-0">開發團隊</h4>
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
                    className="inline-flex items-center gap-2 text-white/60 hover:text-primary-400 transition-colors text-sm"
                  >
                    <FaGithub className="text-xs shrink-0" /> {dev.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/50">
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
            className="text-white/50 hover:text-primary-400 transition-colors"
          >
            Source code released under MIT license.
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
