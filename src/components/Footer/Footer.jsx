import React from "react";
import { FaGithub, FaHeart, FaBook, FaUpload, FaListAlt } from "react-icons/fa";
import { EXTERNAL_URLS } from "../../constants";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                EE
              </div>
              <span className="font-bold text-lg">交大電機考古網站</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              集結學長姐的智慧結晶，提供電機系學生最完整的考古題資源庫，助你在考試中脫穎而出。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">快速連結</h4>
            <ul className="space-y-2">
              {["大一課程", "大二課程", "大三以上", "通識與其他"].map(
                (item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="flex items-center gap-2 text-white/60 hover:text-primary-400 transition-colors text-sm bg-transparent border-0 p-0 cursor-pointer"
                    >
                      <FaBook className="text-xs" /> {item}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4">功能</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  className="flex items-center gap-2 text-white/60 hover:text-primary-400 transition-colors text-sm bg-transparent border-0 p-0 cursor-pointer"
                >
                  <FaUpload className="text-xs" /> 上傳考古
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="flex items-center gap-2 text-white/60 hover:text-primary-400 transition-colors text-sm bg-transparent border-0 p-0 cursor-pointer"
                >
                  <FaListAlt className="text-xs" /> 願望清單
                </button>
              </li>
              <li>
                <a
                  href={EXTERNAL_URLS.WISH_FORM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-primary-300 transition-colors text-sm"
                >
                  <FaHeart className="text-xs" /> 許願表單
                </a>
              </li>
            </ul>
          </div>

          {/* Team */}
          <div>
            <h4 className="font-semibold mb-4">開發團隊</h4>
            <ul className="space-y-2">
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
                    className="flex items-center gap-2 text-white/60 hover:text-primary-400 transition-colors text-sm"
                  >
                    <FaGithub className="text-xs" /> {dev.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <a
                href="https://github.com/cjchang925/ece-learn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 bg-white/10 rounded-lg hover:bg-blue-500 transition-all duration-200"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <div className="flex items-center gap-1">
            <span>&copy;</span>
            <span>
              {new Date().getFullYear()} NYCU EESA. All rights reserved.
            </span>
          </div>
          <div>Source code released under MIT license</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
