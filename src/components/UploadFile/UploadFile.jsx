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
import SelectField from "./SelectField.jsx";

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

const GRADE_OPTIONS = [
  { value: "大一", label: "大一" },
  { value: "大二", label: "大二" },
  { value: "大三以上選修", label: "大三以上" },
  { value: "通識與其他", label: "通識與其他" },
];

const TYPE_OPTIONS = ["小考", "期中考", "期末考", "上機", "講義", "作業", "其他"].map(
  (type) => ({ value: type, label: type }),
);

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

  const handleSelectChange = (fieldName) => (value) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
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
    <div className="min-h-screen bg-canvas px-4 pt-10 pb-16 md:pt-14">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10 animate-fade-up">
        <h1 className="text-title-1 text-label mb-3">上傳考古題</h1>
        <p className="text-label-2 text-lg">分享你的考古題，幫助更多同學</p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto surface-card p-6 md:p-8 animate-fade-up">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Grade */}
            <SelectField
              id="upload-grade"
              label="年級"
              placeholder="請選擇年級"
              options={GRADE_OPTIONS}
              value={formData.grade}
              onChange={handleSelectChange("grade")}
            />

            {/* Subject — prefix suggestions from all exam records */}
            <div className="relative">
              <label
                htmlFor="upload-subject"
                className="field-label"
              >
                科目全名 <span className="text-destructive">*</span>
              </label>
              <input
                id="upload-subject"
                type="text"
                autoComplete="off"
                className="field"
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
                  <ul className="absolute z-30 left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto material-popover rounded-xl p-1.5 origin-top animate-materialize">
                    {subjectSuggestions.map((name) => (
                      <li key={name}>
                        <button
                          type="button"
                          className="menu-item"
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
                className="field-label"
              >
                教師姓名 <span className="text-destructive">*</span>
              </label>
              <input
                id="upload-teacher"
                type="text"
                autoComplete="off"
                className="field"
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
                  <ul className="absolute z-30 left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto material-popover rounded-xl p-1.5 origin-top animate-materialize">
                    {teacherSuggestions.map((name) => (
                      <li key={name}>
                        <button
                          type="button"
                          className="menu-item"
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
              <label className="field-label">
                學年度 <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                className="field"
                placeholder="例如：112"
                value={formData.year}
                onChange={handleFieldChange("year")}
              />
            </div>

            {/* Type */}
            <div className="md:col-span-2">
              <SelectField
                id="upload-type"
                label="類別"
                placeholder="請選擇類別"
                options={TYPE_OPTIONS}
                value={formData.type}
                onChange={handleSelectChange("type")}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="flex gap-3 p-4 bg-accent-tint rounded-xl">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-accent-text mt-0.5"
            />
            <p className="text-sm text-label">
              請確保上傳的檔案不包含個人資訊，並且您有權分享此檔案。
            </p>
          </div>

          {/* File Upload Area */}
          <div
            onClick={handleDropAreaClick}
            onDragOver={handleDragOver}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors duration-200 ease-apple
              ${
                selectedFile
                  ? "border-accent bg-accent-tint"
                  : "border-[var(--fill-2)] hover:border-accent hover:bg-[var(--row-hover)]"
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
              className={`text-4xl mb-4 transition-colors duration-300 ${selectedFile ? "text-accent" : "text-label-3"}`}
            />
            {selectedFile ? (
              <>
                <p className="text-accent-text font-semibold mb-2">檔案已選擇</p>
                <p className="text-label-2 text-sm flex items-center justify-center gap-2 break-all">
                  <FontAwesomeIcon icon={faFile} />
                  {selectedFile.name}
                </p>
              </>
            ) : (
              <>
                <p className="text-label font-medium mb-1">
                  點擊或拖曳檔案至此處上傳
                </p>
                <p className="text-label-3 text-sm">支援各種常見檔案格式</p>
              </>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isUploading}
            className="btn-filled w-full py-3.5 text-[17px]"
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
