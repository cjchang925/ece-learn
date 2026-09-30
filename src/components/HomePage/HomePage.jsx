import React, { useMemo } from "react";
import { FaBook, FaHeart } from "react-icons/fa";
import Footer from "../Footer/Footer.jsx";
import { EXTERNAL_URLS, EXAM_COLUMNS } from "../../constants";

const HomePage = ({ examDataByCategory }) => {
  // Calculate statistics from exam data
  const statistics = useMemo(() => {
    const allExams = Object.values(examDataByCategory).flat();
    const totalExams = allExams.length;

    // Get unique courses (subject + teacher combination)
    const uniqueCourses = new Set(
      allExams.map(
        (exam) => `${exam[EXAM_COLUMNS.SUBJECT]}_${exam[EXAM_COLUMNS.TEACHER]}`,
      ),
    );
    const totalCourses = uniqueCourses.size;

    // Round to nearest hundred for exams
    const roundedExams = Math.round(totalExams / 100) * 100;

    // Round to nearest ten for courses
    const roundedCourses = Math.round(totalCourses / 10) * 10;

    return {
      exams: roundedExams > 0 ? `${roundedExams}+` : "0",
      courses: roundedCourses > 0 ? `${roundedCourses}+` : "0",
    };
  }, [examDataByCategory]);

  const stats = [
    { value: statistics.exams, label: "考古題" },
    { value: statistics.courses, label: "課程" },
    { value: "7000+", label: "使用者" },
  ];

  const infoCards = [
    {
      title: "使用說明",
      icon: <FaBook />,
      iconClass: "from-[#2997ff] to-[#0066cc]",
      items: [
        "考古資源是學長姐慢慢累積出來的，請不要惡意使用。",
        "如果要用 Filter，請先選科目再選其他。",
        "上傳考古題前請確認老師意願，若有侵權問題請自行負責。",
      ],
    },
    {
      title: "願望清單",
      icon: <FaHeart />,
      iconClass: "from-[#ff9f0a] to-[#ff6b00]",
      action: { label: "填寫表單", href: EXTERNAL_URLS.WISH_FORM },
      items: [
        "可以填想要的功能或考古，但是不一定能實現。",
        "課本的題目與解答恕不提供，有版權疑慮。",
        "不合理的要求或是已經完成的事項會被移除。",
      ],
    },
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
          <p className="text-accent-text font-semibold mb-4">NYCU EE · Previous Exams</p>
          <h1 className="text-large-title text-label mb-5">
            交大電機
            <span className="bg-gradient-to-r from-[#2997ff] via-[#7a5cff] to-[#ff6b9d] bg-clip-text text-transparent">
              考古網站
            </span>
          </h1>
          <p className="text-lg md:text-2xl leading-snug tracking-tight text-label-2 max-w-2xl mx-auto mb-14 text-balance">
            集結學長姐的智慧結晶，助你在考試中脫穎而出
          </p>

          <dl className="grid grid-cols-3 max-w-xl mx-auto divide-x divide-separator">
            {stats.map((stat) => (
              <div key={stat.label} className="px-2">
                <dd className="text-3xl md:text-5xl font-bold tracking-[-0.03em] text-label tabular-nums">
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
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5 md:gap-6">
          {infoCards.map((card) => (
            <article
              key={card.title}
              className="surface-card overflow-hidden animate-fade-up"
            >
              <header className="px-6 pt-6 pb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 bg-gradient-to-b ${card.iconClass} rounded-xl flex items-center justify-center text-white text-lg shadow-sm`}
                  >
                    {card.icon}
                  </div>
                  <h2 className="text-title-2 text-label">{card.title}</h2>
                </div>
                {card.action && (
                  <a
                    href={card.action.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-tinted text-sm"
                  >
                    {card.action.label}
                  </a>
                )}
              </header>
              <ol className="px-6 pb-3">
                {card.items.map((text, index) => (
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
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
