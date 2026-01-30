import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { VIEW_TYPES, GRADE_CATEGORIES } from "../../constants";

const Navbar = ({ onCategorySelect, onSearchChange, onLogout, userName }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(VIEW_TYPES.HOME);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCategoryClick = (category) => {
    setActiveButton(category);
    setIsMobileMenuOpen(false);
    onCategorySelect(category);
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearchChange(query);
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
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
              EE
            </div>
            <span className="text-white font-medium hidden sm:block">
              Hi, {userName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleCategoryClick(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    activeButton === item.id
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 ml-2"
            >
              登出
            </button>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                type="text"
                placeholder="搜尋課程或老師..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-48 lg:w-56 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white/15 transition-all duration-200"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faTimes : faBars}
              className="text-xl"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            {/* Mobile Search */}
            <div className="relative mb-4 md:hidden">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
              />
              <input
                type="text"
                placeholder="搜尋課程或老師..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>

            {/* Mobile Nav Items */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleCategoryClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      activeButton === item.id
                        ? "bg-blue-500 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {item.label}
                </button>
              ))}
              <button
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
