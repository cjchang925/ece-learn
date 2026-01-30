import React, { useMemo } from "react";
import { FaBook, FaHeart, FaSearch, FaUpload, FaList } from "react-icons/fa";
import Footer from "../Footer/Footer.jsx";
import {
  GRADE_CATEGORIES,
  VIEW_TYPES,
  EXTERNAL_URLS,
  EXAM_COLUMNS,
} from "../../constants";

const HomePage = ({ onNavigate, examDataByCategory }) => {
  const handleActionClick = (action) => {
    if (onNavigate) {
      onNavigate(action);
    }
  };

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

  return (
    <>
      {/* Hero Section */}
      <div className="bg-blue-900 py-16 md:py-24 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            交大電機考古網站
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            集結學長姐的智慧結晶，助你在考試中脫穎而出
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-300">
                {statistics.exams}
              </div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                考古題
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-300">
                {statistics.courses}
              </div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                課程
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-300">
                7000+
              </div>
              <div className="text-sm text-white/60 uppercase tracking-wider">
                使用者
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-100 py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Instructions Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 flex items-center gap-4 border-b border-slate-100">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                <FaBook />
              </div>
              <h2 className="text-xl font-bold text-slate-800">使用說明</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                "考古資源是學長姐慢慢累積出來的，請不要惡意使用。",
                "右上方支援搜尋功能，搜尋到的文字會被 Highlight。",
                "如果要用 Filter，請先選科目再選其他。",
                "上傳考古題前請確認老師意願，若有侵權問題請自行負責。",
              ].map((text, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-slate-600 leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wishlist Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
                  <FaHeart />
                </div>
                <h2 className="text-xl font-bold text-slate-800">願望清單</h2>
              </div>
              <a
                href={EXTERNAL_URLS.WISH_FORM}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-200"
              >
                填寫表單
              </a>
            </div>
            <div className="p-6 space-y-4">
              {[
                "可以填想要的功能或考古，但是不一定能實現。",
                "課本的題目與解答恕不提供，有版權疑慮。",
                "不合理的要求或是已經完成的事項會被移除。",
              ].map((text, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-slate-600 leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800 mb-10">
            快速開始
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => handleActionClick(GRADE_CATEGORIES.FIRST_YEAR)}
              className="group p-8 bg-blue-500 hover:bg-blue-600 rounded-2xl text-white text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaSearch />
              </div>
              <div className="text-lg font-bold mb-2">搜尋考古題</div>
              <div className="text-white/80 text-sm">
                使用關鍵字快速找到需要的資源
              </div>
            </button>

            <button
              onClick={() => handleActionClick(VIEW_TYPES.WISH_LIST)}
              className="group p-8 bg-teal-500 hover:bg-teal-600 rounded-2xl text-white text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaList />
              </div>
              <div className="text-lg font-bold mb-2">願望清單</div>
              <div className="text-white/80 text-sm">查看大家許下的願望</div>
            </button>

            <button
              onClick={() => handleActionClick(VIEW_TYPES.UPLOAD)}
              className="group p-8 bg-purple-600 hover:bg-purple-700 rounded-2xl text-white text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <FaUpload />
              </div>
              <div className="text-lg font-bold mb-2">上傳分享</div>
              <div className="text-white/80 text-sm">
                分享你的考古題幫助學弟妹
              </div>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
