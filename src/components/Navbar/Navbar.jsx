import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { VIEW_TYPES, GRADE_CATEGORIES } from "../../constants";

const Navbar = ({
  onCategorySelect,
  onLogout,
  isLoggedIn,
  activeNavItemId,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  /** Geometry of the sliding selection pill in the desktop segmented control */
  const [indicator, setIndicator] = useState(null);
  const navItemRefs = useRef({});

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCategoryClick = (category) => {
    setIsMobileMenuOpen(false);
    onCategorySelect(category);
  };

  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false);
    onLogout();
  };

  const navItems = [
    { id: VIEW_TYPES.HOME, label: "首頁" },
    { id: GRADE_CATEGORIES.FIRST_YEAR, label: "大一" },
    { id: GRADE_CATEGORIES.SECOND_YEAR, label: "大二" },
    { id: GRADE_CATEGORIES.ADVANCED, label: "大三以上" },
    { id: GRADE_CATEGORIES.OTHER, label: "通識與其他" },
    { id: VIEW_TYPES.UPLOAD, label: "上傳考古" },
  ];

  const measureIndicator = useCallback(() => {
    const el = navItemRefs.current[activeNavItemId];
    if (!el || el.offsetParent === null) {
      setIndicator(null);
      return;
    }
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeNavItemId]);

  useLayoutEffect(() => {
    measureIndicator();
    // Web fonts can change label widths after first paint
    document.fonts?.ready.then(measureIndicator);
    window.addEventListener("resize", measureIndicator);
    return () => window.removeEventListener("resize", measureIndicator);
  }, [measureIndicator]);

  return (
    <nav className="sticky top-0 z-50 material-chrome border-b border-separator">
      <div className="max-w-[74rem] mx-auto px-4">
        {/* 1fr | auto | 1fr keeps the nav cluster truly centered regardless of brand / greeting width */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 gap-4">
          {/* Brand + greeting (left column) */}
          <div className="flex items-center gap-2.5 min-w-0 justify-self-start">
            <div className="w-8 h-8 bg-gradient-to-b from-[#2997ff] to-[#0066cc] rounded-[9px] flex items-center justify-center text-white text-xs font-semibold tracking-tight shrink-0 shadow-sm">
              EE
            </div>
            <span className="text-label text-[15px] font-semibold tracking-tight truncate">
              Previous Exams
            </span>
          </div>

          {/* Center column: wrapper stays in DOM so grid placement is stable on mobile (nav inner is lg-only) */}
          <div className="col-start-2 flex items-center justify-center min-w-0 max-w-full">
            <div className="hidden lg:flex items-center gap-3 min-w-0 max-w-full">
              {/* Segmented control */}
              <div className="relative flex items-center p-[3px] rounded-full bg-fill">
                {indicator && (
                  <span
                    aria-hidden="true"
                    className="nav-indicator absolute top-[3px] bottom-[3px] left-0 rounded-full bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_1px_rgba(0,0,0,0.04)] transition-[transform,width] duration-[420ms] ease-apple"
                    style={{
                      width: indicator.width,
                      transform: `translateX(${indicator.left}px)`,
                    }}
                  />
                )}
                {navItems.map((item) => {
                  const isActive = activeNavItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      ref={(el) => {
                        navItemRefs.current[item.id] = el;
                      }}
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => handleCategoryClick(item.id)}
                      className={`pressable relative z-10 px-3.5 py-1.5 rounded-full text-[13px] whitespace-nowrap
                        ${
                          isActive
                            ? "text-label font-semibold"
                            : "text-label-2 font-medium hover:text-label"
                        }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column (mirrors the left one, so the tabs stay truly centred): 登出 on desktop, menu button on mobile */}
          <div className="flex justify-end items-center justify-self-end min-w-0">
            {isLoggedIn && (
              <button
                type="button"
                onClick={handleLogoutClick}
                className="pressable hidden lg:inline-flex px-3 py-1.5 rounded-full text-[13px] font-medium text-destructive hover:bg-[var(--tint-red-bg)]"
              >
                登出
              </button>
            )}
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "關閉選單" : "開啟選單"}
              aria-expanded={isMobileMenuOpen}
              className="pressable lg:hidden w-9 h-9 flex items-center justify-center text-label rounded-full hover:bg-fill shrink-0"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="text-lg"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — floating glass panel anchored to its trigger (top-right) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute right-3 left-3 sm:left-auto sm:w-72 top-full mt-2">
          {/* Solid surface: a backdrop-filter nested inside the glass nav has nothing to blur */}
          <div className="bg-surface shadow-[var(--shadow-float)] rounded-2xl p-1.5 origin-top-right animate-materialize">
            {navItems.map((item) => {
              const isActive = activeNavItemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handleCategoryClick(item.id)}
                  className={`pressable w-full flex items-center justify-between text-left px-4 py-3 rounded-xl text-[15px]
                    ${
                      isActive
                        ? "bg-accent-tint text-accent-text font-semibold"
                        : "text-label font-medium hover:bg-fill"
                    }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
            {isLoggedIn && (
              <>
                <div className="h-px bg-separator mx-3 my-1.5" />
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="pressable w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium text-destructive hover:bg-fill"
                >
                  登出
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
