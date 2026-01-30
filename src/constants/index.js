// API Configuration
export const API_BASE_URL = 'https://prevexam.dece.nycu.edu.tw/api';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  LOGOUT: `${API_BASE_URL}/logout`,
  LOGIN_STATUS_CHECK: `${API_BASE_URL}/login-status-check`,
  FIRST_YEAR_EXAMS: `${API_BASE_URL}/get-one-data`,
  SECOND_YEAR_EXAMS: `${API_BASE_URL}/get-two-data`,
  ADVANCED_EXAMS: `${API_BASE_URL}/get-advance-data`,
  OTHER_EXAMS: `${API_BASE_URL}/get-other-data`,
  UPLOAD_FILE: '/api/user-upload-file',
};

export const GOOGLE_API = {
  USER_INFO: 'https://www.googleapis.com/oauth2/v1/userinfo',
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  FILTERED_EXAMS: 'display_data',
  CURRENT_VIEW: 'showList',
  LOGIN_STATE: 'loginState',
  USER_NAME: 'name',
};

// View Types for Navigation
export const VIEW_TYPES = {
  HOME: 'readme',
  WISH_LIST: 'hope',
  UPLOAD: 'uploadfile',
  EXAM_LIST: 'list',
};

// Grade Categories
export const GRADE_CATEGORIES = {
  FIRST_YEAR: 'first',
  SECOND_YEAR: 'second',
  ADVANCED: 'advance',
  OTHER: 'other',
};

// Exam Data Column Indices (for array-based data from API)
export const EXAM_COLUMNS = {
  SUBJECT: 0,
  TEACHER: 1,
  YEAR: 2,
  TYPE: 3,
  NOTE: 4,
  FILENAME: 5,
  FILE_URL: 6,
};

// External URLs
export const EXTERNAL_URLS = {
  WISH_FORM: 'https://docs.google.com/forms/d/e/1FAIpQLSfn5uEo1MefhezayHOvvfWoIlAKJ7XvnKiUSaXXdDE0cLPAag/viewform?usp=pp_url',
  WISH_SPREADSHEET: 'https://docs.google.com/spreadsheets/d/1cW-HJEbYDWIsagjmoWyrzjjRlMnBQ3feQfbsKcPi9ZU/gviz/tq?tqx=out:json&tq&gid=0',
};

// API Response Messages
export const API_MESSAGES = {
  HAS_RECORD: 'Has record!',
  NO_RECORD: 'No record!',
  SUCCESS: 'Success!',
  INVALID_FILE: 'Invalid file!',
  INVALID_USER: 'Invalid user!',
};
