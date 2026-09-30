import React from "react";
import { FaBook } from "react-icons/fa";
import Footer from "../Footer/Footer.jsx";

// Hardcoded so the page does not have to count the exam records on every visit
const STATS = [
  { value: "2,200+", label: "考古題" },
  { value: "190+", label: "課程" },
  { value: "40,000+", label: "使用者" },
];

const HomePage = () => {
  const instructions = [
    "考古資源是學長姐慢慢累積出來的，請不要惡意使用。",
    "如果要用 Filter，請先選科目再選其他。",
    "上傳考古題前請確認老師意願，若有侵權問題請自行負責。",
  ];

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[56rem] h-[40rem] rounded-full opacity-50 blur-3xl bg-[radial-gradient(closest-side,rgba(41,151,255,0.25),transparent)]"
        />
        <div className="relative max-w-4xl mx-auto animate-fade-up">
          <p className="text-accent-text font-semibold mb-4">
            NYCU EE · Previous Exams
          </p>
          <h1 className="text-large-title text-label mb-5">
            交大電機
            <span className="bg-gradient-to-r from-[#2997ff] via-[#7a5cff] to-[#ff6b9d] bg-clip-text text-transparent">
              考古網站
            </span>
          </h1>
          <p className="text-lg md:text-2xl leading-snug tracking-tight text-label-2 max-w-2xl mx-auto mb-14 text-balance">
            集結學長姐的智慧結晶，助你在考試中脫穎而出
          </p>

          <dl className="grid grid-cols-3 max-w-3xl mx-auto divide-x divide-separator">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-2">
                <dd className="text-[clamp(1rem,5.2vw,3rem)] leading-tight font-bold tracking-[-0.03em] text-label tabular-nums whitespace-nowrap">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-sm text-label-2">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-16 md:pb-24 flex-1">
        <article className="max-w-3xl mx-auto surface-card overflow-hidden animate-fade-up">
          <header className="px-6 pt-6 pb-4 flex items-center gap-3.5">
            <div className="w-11 h-11 bg-gradient-to-b from-[#2997ff] to-[#0066cc] rounded-xl flex items-center justify-center text-white text-lg shadow-sm">
              <FaBook />
            </div>
            <h2 className="text-title-2 text-label">使用說明</h2>
          </header>
          <ol className="px-6 pb-3">
            {instructions.map((text, index) => (
              <li
                key={index}
                className="flex items-start gap-3.5 py-3.5 border-t border-separator first:border-t-0"
              >
                <span className="w-6 h-6 rounded-full bg-fill text-label-2 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-px tabular-nums">
                  {index + 1}
                </span>
                <span className="text-label leading-relaxed text-[15px]">
                  {text}
                </span>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
