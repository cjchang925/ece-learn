import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { VIEW_TYPES, GRADE_CATEGORIES } from "../../constants";

const Navbar = ({ onCategorySelect, onLogout, userName, activeNavItemId }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCategoryClick = (category) => {
    setIsMobileMenuOpen(false);
    onCategorySelect(category);
  };

  const navItems = [
    { id: VIEW_TYPES.HOME, label: "首頁" },
    { id: GRADE_CATEGORIES.FIRST_YEAR, label: "大一" },
    { id: GRADE_CATEGORIES.SECOND_YEAR, label: "大二" },
    { id: GRADE_CATEGORIES.ADVANCED, label: "大三以上" },
    { id: GRADE_CATEGORIES.OTHER, label: "通識與其他" },
    { id: VIEW_TYPES.WISH_LIST, label: "願望清單" },
    { id: VIEW_TYPES.UPLOAD, label: "上傳考古" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* 1fr | auto | 1fr keeps the nav cluster truly centered regardless of brand / greeting width */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 gap-4">
          {/* Brand + greeting (left column) */}
          <div className="flex items-center gap-3 min-w-0 justify-self-start">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
              EE
            </div>
            <span className="text-white font-medium hidden sm:block truncate">
              Hi, {userName}
            </span>
          </div>

          {/* Center column: wrapper stays in DOM so grid placement is stable on mobile (nav inner is lg-only) */}
          <div className="col-start-2 flex items-center justify-center min-w-0 max-w-full">
            <div className="hidden lg:flex items-center justify-center gap-1 min-w-0 max-w-full">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleCategoryClick(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      activeNavItemId === item.id
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={onLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 ml-2"
              >
                登出
              </button>
            </div>
          </div>

          {/* Mobile menu button (right column mirrors left for balanced centering on desktop) */}
          <div className="flex justify-end items-center justify-self-end min-w-0">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="text-xl"
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleCategoryClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      activeNavItemId === item.id
                        ? "bg-blue-500 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={onLogout}
                className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              >
                登出
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
