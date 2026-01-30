import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

import Navbar from "./components/Navbar/Navbar.jsx";
import ExamList from "./components/List/ExamList.jsx";
import WishCardList from "./components/card/WishCardList.jsx";
import UploadFile from "./components/UploadFile/UploadFile.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import Login from "./components/Login/Login.jsx";

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
  const [currentCategoryExams, setCurrentCategoryExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState(
    JSON.parse(window.localStorage.getItem(STORAGE_KEYS.FILTERED_EXAMS)) || [],
  );
  const [currentView, setCurrentView] = useState(
    JSON.parse(window.localStorage.getItem(STORAGE_KEYS.CURRENT_VIEW)) ||
      VIEW_TYPES.HOME,
  );
  const [isLoggedIn, setIsLoggedIn] = useState(
    UI_TEST_MODE ||
      JSON.parse(window.localStorage.getItem(STORAGE_KEYS.LOGIN_STATE)) ||
      false,
  );
  const [userName, setUserName] = useState(
    window.localStorage.getItem(STORAGE_KEYS.USER_NAME) || "Test User",
  );

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

    const nonExamViews = [
      VIEW_TYPES.HOME,
      VIEW_TYPES.WISH_LIST,
      VIEW_TYPES.UPLOAD,
    ];

    if (nonExamViews.includes(category)) {
      setCurrentView(category);
      window.localStorage.setItem(
        STORAGE_KEYS.CURRENT_VIEW,
        JSON.stringify(category),
      );
    } else {
      setCurrentView(VIEW_TYPES.EXAM_LIST);
      window.localStorage.setItem(
        STORAGE_KEYS.CURRENT_VIEW,
        JSON.stringify(VIEW_TYPES.EXAM_LIST),
      );

      const categoryData = examDataByCategory[category] || [];
      setFilteredExams(categoryData);
      setCurrentCategoryExams(categoryData);
      window.localStorage.setItem(
        STORAGE_KEYS.FILTERED_EXAMS,
        JSON.stringify(categoryData),
      );
    }
  };

  const handleSearchFilter = (searchQuery) => {
    setCurrentView(VIEW_TYPES.EXAM_LIST);
    window.localStorage.setItem(
      STORAGE_KEYS.CURRENT_VIEW,
      JSON.stringify(VIEW_TYPES.EXAM_LIST),
    );

    if (searchQuery === "") {
      setFilteredExams(currentCategoryExams);
      window.localStorage.setItem(
        STORAGE_KEYS.FILTERED_EXAMS,
        JSON.stringify(currentCategoryExams),
      );
      return;
    }

    const searchRegex = new RegExp(searchQuery, "gi");

    const highlightedResults = currentCategoryExams.reduce(
      (results, examRecord) => {
        let hasMatch = false;

        for (let i = 0; i < examRecord.length - 1 && !hasMatch; ++i) {
          if (examRecord[i].match(searchRegex)) {
            hasMatch = true;
          }
        }

        if (hasMatch) {
          const highlightedRecord = examRecord.map((column, columnIndex) => {
            if (columnIndex === 6) return column;

            const matchResult = searchRegex.exec(column);
            if (matchResult) {
              return (
                <span key={columnIndex}>
                  {column.substr(0, matchResult.index)}
                  <span className="bg-yellow-200 px-0.5 rounded">
                    {column.substr(matchResult.index, matchResult[0].length)}
                  </span>
                  {column.substr(matchResult.index + matchResult[0].length)}
                </span>
              );
            }
            return column;
          });

          results.push(highlightedRecord);
        }

        return results;
      },
      [],
    );

    setFilteredExams(highlightedResults);
    window.localStorage.setItem(
      STORAGE_KEYS.FILTERED_EXAMS,
      JSON.stringify(highlightedResults),
    );
  };

  const handleLogout = () => {
    fetch(API_ENDPOINTS.LOGOUT, {
      method: "GET",
      credentials: "include",
    });

    window.localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    window.localStorage.removeItem(STORAGE_KEYS.FILTERED_EXAMS);
    window.localStorage.removeItem(STORAGE_KEYS.CURRENT_VIEW);
    window.localStorage.removeItem(STORAGE_KEYS.LOGIN_STATE);
    setIsLoggedIn(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case VIEW_TYPES.HOME:
        return (
          <HomePage
            onNavigate={handleCategorySelect}
            examDataByCategory={examDataByCategory}
          />
        );
      case VIEW_TYPES.WISH_LIST:
        return <WishCardList />;
      case VIEW_TYPES.UPLOAD:
        return <UploadFile />;
      case VIEW_TYPES.EXAM_LIST:
      default:
        return <ExamList examRecords={filteredExams} />;
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50">
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
          onSearchChange={handleSearchFilter}
          onLogout={handleLogout}
          userName={userName}
        />
        {renderCurrentView()}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Login - 交大電機考古網站</title>
        <meta
          name="description"
          content="交大電機專用考古網站，您考前的好幫手"
        />
      </Helmet>
      <Login onLoginSuccess={setIsLoggedIn} onUserNameChange={setUserName} />
    </div>
  );
}

export default App;
