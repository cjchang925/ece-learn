import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

import Navbar from "./components/Navbar/Navbar.jsx";
import ExamList from "./components/List/ExamList.jsx";
import UploadFile from "./components/UploadFile/UploadFile.jsx";
import UploadSignInPrompt from "./components/UploadFile/UploadSignInPrompt.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import Footer from "./components/Footer/Footer.jsx";
import useGoogleSignIn from "./hooks/useGoogleSignIn.js";

import {
  API_ENDPOINTS,
  STORAGE_KEYS,
  VIEW_TYPES,
  GRADE_CATEGORIES,
  API_MESSAGES,
} from "./constants";

// Set to true to bypass login for UI testing (remember to set back to false!)
const UI_TEST_MODE = false;

function App() {
  const [examDataByCategory, setExamDataByCategory] = useState({
    [GRADE_CATEGORIES.FIRST_YEAR]: [],
    [GRADE_CATEGORIES.SECOND_YEAR]: [],
    [GRADE_CATEGORIES.ADVANCED]: [],
    [GRADE_CATEGORIES.OTHER]: [],
  });
  const [filteredExams, setFilteredExams] = useState(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEYS.FILTERED_EXAMS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [currentView, setCurrentView] = useState(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEYS.CURRENT_VIEW);
      const view = raw ? JSON.parse(raw) : VIEW_TYPES.HOME;
      // Views saved by older versions (e.g. the removed wish list) fall back to home
      return Object.values(VIEW_TYPES).includes(view) ? view : VIEW_TYPES.HOME;
    } catch {
      return VIEW_TYPES.HOME;
    }
  });
  const [selectedGradeCategory, setSelectedGradeCategory] = useState(() => {
    try {
      const raw = window.sessionStorage.getItem(
        STORAGE_KEYS.SELECTED_GRADE_CATEGORY,
      );
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(
    UI_TEST_MODE ||
      JSON.parse(window.localStorage.getItem(STORAGE_KEYS.LOGIN_STATE)) ||
      false,
  );
  const [isCheckingAuth, setIsCheckingAuth] = useState(!UI_TEST_MODE);

  const handleSignedIn = () => {
    setIsLoggedIn(true);
    window.localStorage.setItem(STORAGE_KEYS.LOGIN_STATE, true);
  };
  const { signIn, isSigningIn } = useGoogleSignIn(handleSignedIn);

  // Links like /#privacy-policy: scroll once the React tree has rendered
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  useEffect(() => {
    // Legacy keys from older versions
    window.localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    window.localStorage.removeItem(STORAGE_KEYS.CURRENT_VIEW);
    window.localStorage.removeItem(STORAGE_KEYS.FILTERED_EXAMS);
  }, []);

  useEffect(() => {
    const fetchAllExamData = async () => {
      try {
        const [firstYear, secondYear, advanced, other] = await Promise.all([
          axios.get(API_ENDPOINTS.FIRST_YEAR_EXAMS),
          axios.get(API_ENDPOINTS.SECOND_YEAR_EXAMS),
          axios.get(API_ENDPOINTS.ADVANCED_EXAMS),
          axios.get(API_ENDPOINTS.OTHER_EXAMS),
        ]);

        setExamDataByCategory({
          [GRADE_CATEGORIES.FIRST_YEAR]: firstYear.data,
          [GRADE_CATEGORIES.SECOND_YEAR]: secondYear.data,
          [GRADE_CATEGORIES.ADVANCED]: advanced.data,
          [GRADE_CATEGORIES.OTHER]: other.data,
        });
      } catch (error) {
        console.error("Failed to fetch exam data:", error);
      }
    };

    fetchAllExamData();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (UI_TEST_MODE) return;

      try {
        const response = await fetch(API_ENDPOINTS.LOGIN_STATUS_CHECK, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.message === API_MESSAGES.HAS_RECORD) {
            setIsLoggedIn(true);
            window.localStorage.setItem(STORAGE_KEYS.LOGIN_STATE, true);
          } else if (data.message === API_MESSAGES.NO_RECORD) {
            setIsLoggedIn(false);
            window.localStorage.setItem(STORAGE_KEYS.LOGIN_STATE, false);
          }
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleCategorySelect = (category) => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    const nonExamViews = [VIEW_TYPES.HOME, VIEW_TYPES.UPLOAD];

    if (nonExamViews.includes(category)) {
      setCurrentView(category);
      setSelectedGradeCategory(null);
      window.sessionStorage.setItem(
        STORAGE_KEYS.CURRENT_VIEW,
        JSON.stringify(category),
      );
      window.sessionStorage.removeItem(STORAGE_KEYS.SELECTED_GRADE_CATEGORY);
    } else {
      setCurrentView(VIEW_TYPES.EXAM_LIST);
      setSelectedGradeCategory(category);
      window.sessionStorage.setItem(
        STORAGE_KEYS.CURRENT_VIEW,
        JSON.stringify(VIEW_TYPES.EXAM_LIST),
      );
      window.sessionStorage.setItem(
        STORAGE_KEYS.SELECTED_GRADE_CATEGORY,
        JSON.stringify(category),
      );

      const categoryData = examDataByCategory[category] || [];
      setFilteredExams(categoryData);
      window.sessionStorage.setItem(
        STORAGE_KEYS.FILTERED_EXAMS,
        JSON.stringify(categoryData),
      );
    }
  };

  const activeNavItemId =
    currentView === VIEW_TYPES.EXAM_LIST ? selectedGradeCategory : currentView;

  const handleSessionExpired = () => {
    window.localStorage.removeItem(STORAGE_KEYS.LOGIN_STATE);
    setIsLoggedIn(false);
  };

  const handleLogout = () => {
    fetch(API_ENDPOINTS.LOGOUT, {
      method: "POST",
      credentials: "include",
    });

    window.localStorage.removeItem(STORAGE_KEYS.LOGIN_STATE);
    setIsLoggedIn(false);
  };

  const renderUploadView = () => {
    if (isCheckingAuth) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div
            className="activity-indicator"
            role="status"
            aria-label="Loading"
          />
        </div>
      );
    }
    if (!isLoggedIn) {
      return <UploadSignInPrompt onSignIn={signIn} isSigningIn={isSigningIn} />;
    }
    return <UploadFile onSessionExpired={handleSessionExpired} />;
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case VIEW_TYPES.HOME:
        return <HomePage />;
      case VIEW_TYPES.UPLOAD:
        return renderUploadView();
      case VIEW_TYPES.EXAM_LIST:
      default:
        return <ExamList examRecords={filteredExams} />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <Helmet>
        <title>交大電機考古網站</title>
        <meta
          name="description"
          content="交大電機專用考古網站，您考前的好幫手"
        />
        <meta
          name="og:description"
          content="交大電機專用考古網站，您考前的好幫手"
        />
        <meta property="og:site_name" content="Learn with NYCU EE" />
        <meta property="og:locale" content="zh_tw" />
        <meta property="og:url" content="prevexam.dece.nycu.edu.tw" />
        <meta
          property="og:image:secure_url"
          content="https://storage.googleapis.com/ece-files/og.jpeg"
        />
        <meta property="og:image:type" content="image/jpeg" />
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </Helmet>
      <Navbar
        onCategorySelect={handleCategorySelect}
        onLogout={handleLogout}
        // A stale localStorage value must not flash 登出 before the server confirms
        isLoggedIn={isLoggedIn && !isCheckingAuth}
        activeNavItemId={activeNavItemId}
      />
      <main className="flex-1 flex flex-col">{renderCurrentView()}</main>
      <Footer />
    </div>
  );
}

export default App;
