import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faFile,
  faPaperPlane,
  faInfoCircle,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  API_ENDPOINTS,
  API_MESSAGES,
  EXAM_COLUMNS,
} from "../../constants";

const MAX_SUGGESTIONS = 40;

function collectUniqueColumnValues(rows, columnIndex) {
  const set = new Set();
  for (const row of rows) {
    const raw = row[columnIndex];
    if (raw == null) continue;
    const s = String(raw).trim();
    if (s) set.add(s);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "zh-Hant"));
}

function filterByPrefix(candidates, query) {
  const q = query.trim();
  if (!q) return [];
  const lower = q.toLowerCase();
  return candidates
    .filter((name) => name.toLowerCase().startsWith(lower))
    .slice(0, MAX_SUGGESTIONS);
}

const INITIAL_FORM_STATE = {
  grade: "",
  subject: "",
  teacher: "",
  year: "",
  type: "",
};

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [referenceSubjects, setReferenceSubjects] = useState([]);
  const [referenceTeachers, setReferenceTeachers] = useState([]);
  const [subjectSuggestionsActive, setSubjectSuggestionsActive] =
    useState(false);
  const [teacherSuggestionsActive, setTeacherSuggestionsActive] =
    useState(false);
  const fileInputRef = useRef(null);
  const subjectBlurTimerRef = useRef(null);
  const teacherBlurTimerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [one, two, adv, other] = await Promise.all([
          axios.get(API_ENDPOINTS.FIRST_YEAR_EXAMS),
          axios.get(API_ENDPOINTS.SECOND_YEAR_EXAMS),
          axios.get(API_ENDPOINTS.ADVANCED_EXAMS),
          axios.get(API_ENDPOINTS.OTHER_EXAMS),
        ]);
        if (cancelled) return;
        const allRows = [
          ...one.data,
          ...two.data,
          ...adv.data,
          ...other.data,
        ];
        setReferenceSubjects(
          collectUniqueColumnValues(allRows, EXAM_COLUMNS.SUBJECT),
        );
        setReferenceTeachers(
          collectUniqueColumnValues(allRows, EXAM_COLUMNS.TEACHER),
        );
      } catch (e) {
        console.error("Failed to load exam names for upload hints:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const subjectSuggestions = useMemo(
    () => filterByPrefix(referenceSubjects, formData.subject),
    [referenceSubjects, formData.subject],
  );

  const teacherSuggestions = useMemo(
    () => filterByPrefix(referenceTeachers, formData.teacher),
    [referenceTeachers, formData.teacher],
  );

  const clearSubjectBlurTimer = useCallback(() => {
    if (subjectBlurTimerRef.current) {
      clearTimeout(subjectBlurTimerRef.current);
      subjectBlurTimerRef.current = null;
    }
  }, []);

  const clearTeacherBlurTimer = useCallback(() => {
    if (teacherBlurTimerRef.current) {
      clearTimeout(teacherBlurTimerRef.current);
      teacherBlurTimerRef.current = null;
    }
  }, []);

  const handleSubjectFieldChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      subject: event.target.value,
    }));
    setSubjectSuggestionsActive(true);
  };

  const handleTeacherFieldChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      teacher: event.target.value,
    }));
    setTeacherSuggestionsActive(true);
  };

  const selectSubjectSuggestion = (value) => {
    setFormData((prev) => ({ ...prev, subject: value }));
    setSubjectSuggestionsActive(false);
  };

  const selectTeacherSuggestion = (value) => {
    setFormData((prev) => ({ ...prev, teacher: value }));
    setTeacherSuggestionsActive(false);
  };

  const isFormValid = () => {
    return (
      selectedFile &&
      formData.grade &&
      formData.subject &&
      formData.teacher &&
      formData.year &&
      formData.type
    );
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFieldChange = (fieldName) => (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: event.target.value,
    }));
  };

  useEffect(
    () => () => {
      clearSubjectBlurTimer();
      clearTeacherBlurTimer();
    },
    [clearSubjectBlurTimer, clearTeacherBlurTimer],
  );

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !isFormValid()) return;

    setIsUploading(true);

    const uploadPayload = new FormData();
    uploadPayload.append("files", selectedFile);
    uploadPayload.append("grade", formData.grade);
    uploadPayload.append("subject", formData.subject);
    uploadPayload.append("teacher", formData.teacher);
    uploadPayload.append("year", formData.year);
    uploadPayload.append("type", formData.type);
    uploadPayload.append("filename", selectedFile.name);

    try {
      const response = await fetch(API_ENDPOINTS.UPLOAD_FILE, {
        method: "POST",
        body: uploadPayload,
      });
      const result = await response.json();

      if (result.message === API_MESSAGES.INVALID_FILE) {
        alert("Invalid file type!");
      } else if (result.message === API_MESSAGES.SUCCESS) {
        alert("Upload successfully!");
        window.location.reload();
      } else if (result.message === API_MESSAGES.INVALID_USER) {
        alert("Invalid user! Maybe you are not using an NYCU account.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("上傳失敗，請稍後再試");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDropAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
          上傳考古題
        </h1>
        <p className="text-slate-500">分享你的考古題，幫助更多同學</p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                年級 <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                value={formData.grade}
                onChange={handleFieldChange("grade")}
              >
                <option value="">請選擇年級</option>
                <option value="大一">大一</option>
                <option value="大二">大二</option>
                <option value="大三以上選修">大三以上</option>
                <option value="通識與其他">通識與其他</option>
              </select>
            </div>

            {/* Subject — prefix suggestions from all exam records */}
            <div className="relative">
              <label
                htmlFor="upload-subject"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                科目全名 <span className="text-red-500">*</span>
              </label>
              <input
                id="upload-subject"
                type="text"
                autoComplete="off"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="例如：微積分(一)"
                value={formData.subject}
                onChange={handleSubjectFieldChange}
                onFocus={() => {
                  clearSubjectBlurTimer();
                  setSubjectSuggestionsActive(true);
                }}
                onBlur={() => {
                  clearSubjectBlurTimer();
                  subjectBlurTimerRef.current = setTimeout(() => {
                    setSubjectSuggestionsActive(false);
                  }, 200);
                }}
              />
              {subjectSuggestionsActive &&
                formData.subject.trim().length > 0 &&
                subjectSuggestions.length > 0 && (
                  <ul className="absolute z-30 left-0 right-0 top-full mt-0.5 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                    {subjectSuggestions.map((name) => (
                      <li key={name}>
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-800 hover:bg-slate-100 transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectSubjectSuggestion(name);
                          }}
                        >
                          {name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            {/* Teacher — same prefix logic */}
            <div className="relative">
              <label
                htmlFor="upload-teacher"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                教師姓名 <span className="text-red-500">*</span>
              </label>
              <input
                id="upload-teacher"
                type="text"
                autoComplete="off"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="例如：莊重"
                value={formData.teacher}
                onChange={handleTeacherFieldChange}
                onFocus={() => {
                  clearTeacherBlurTimer();
                  setTeacherSuggestionsActive(true);
                }}
                onBlur={() => {
                  clearTeacherBlurTimer();
                  teacherBlurTimerRef.current = setTimeout(() => {
                    setTeacherSuggestionsActive(false);
                  }, 200);
                }}
              />
              {teacherSuggestionsActive &&
                formData.teacher.trim().length > 0 &&
                teacherSuggestions.length > 0 && (
                  <ul className="absolute z-30 left-0 right-0 top-full mt-0.5 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg py-1">
                    {teacherSuggestions.map((name) => (
                      <li key={name}>
                        <button
                          type="button"
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-800 hover:bg-slate-100 transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectTeacherSuggestion(name);
                          }}
                        >
                          {name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                學年度 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="例如：112"
                value={formData.year}
                onChange={handleFieldChange("year")}
              />
            </div>

            {/* Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                類別 <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                value={formData.type}
                onChange={handleFieldChange("type")}
              >
                <option value="">請選擇類別</option>
                <option value="小考">小考</option>
                <option value="期中考">期中考</option>
                <option value="期末考">期末考</option>
                <option value="上機">上機</option>
                <option value="講義">講義</option>
                <option value="作業">作業</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>

          {/* Info Box */}
          <div className="flex gap-3 p-4 bg-primary-50 rounded-lg">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-primary-500 mt-0.5"
            />
            <p className="text-sm text-primary-700">
              請確保上傳的檔案不包含個人資訊，並且您有權分享此檔案。
            </p>
          </div>

          {/* File Upload Area */}
          <div
            onClick={handleDropAreaClick}
            onDragOver={handleDragOver}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              ${
                selectedFile
                  ? "border-primary-400 bg-primary-50"
                  : "border-slate-200 hover:border-primary-300 hover:bg-slate-50"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />
            <FontAwesomeIcon
              icon={selectedFile ? faCheckCircle : faCloudUploadAlt}
              className={`text-4xl mb-4 ${selectedFile ? "text-primary-500" : "text-slate-300"}`}
            />
            {selectedFile ? (
              <>
                <p className="text-primary-600 font-medium mb-2">檔案已選擇</p>
                <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faFile} />
                  {selectedFile.name}
                </p>
              </>
            ) : (
              <>
                <p className="text-slate-600 font-medium mb-1">
                  點擊或拖曳檔案至此處上傳
                </p>
                <p className="text-slate-400 text-sm">支援各種常見檔案格式</p>
              </>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isUploading}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                上傳中...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} />
                上傳檔案
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
