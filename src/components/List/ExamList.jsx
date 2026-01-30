import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faDownload,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { EXAM_COLUMNS } from "../../constants";

function getAvailableFilterOptions(examRecords) {
  return [
    [
      ...new Set(
        examRecords.map((record) => record[EXAM_COLUMNS.SUBJECT]).sort(),
      ),
    ],
    [
      ...new Set(
        examRecords.map((record) => record[EXAM_COLUMNS.TEACHER]).sort(),
      ),
    ],
    [
      ...new Set(
        examRecords
          .map((record) => record[EXAM_COLUMNS.YEAR])
          .sort((a, b) => {
            const numA = Number(a.replace(/[^\d.]/g, ""));
            const numB = Number(b.replace(/[^\d.]/g, ""));
            return numA - numB;
          }),
      ),
    ],
    [...new Set(examRecords.map((record) => record[EXAM_COLUMNS.TYPE]).sort())],
  ];
}

function getExamTypeBadgeClass(examType) {
  const type = String(examType).toLowerCase();
  if (type.includes("期中")) return "bg-amber-100 text-amber-700";
  if (type.includes("期末")) return "bg-rose-100 text-rose-700";
  if (type.includes("小考") || type.includes("quiz"))
    return "bg-emerald-100 text-emerald-700";
  if (type.includes("作業") || type.includes("hw"))
    return "bg-blue-100 text-blue-700";
  return "bg-purple-100 text-purple-700";
}

const ExamList = ({ examRecords: initialExamRecords }) => {
  const [filteredRecords, setFilteredRecords] = useState(initialExamRecords);
  const [availableFilterOptions, setAvailableFilterOptions] = useState(
    getAvailableFilterOptions(initialExamRecords),
  );
  const [activeFilters, setActiveFilters] = useState({
    subject: "",
    teacher: "",
    year: "",
    type: "",
  });

  useEffect(() => {
    setFilteredRecords(initialExamRecords);
    setAvailableFilterOptions(getAvailableFilterOptions(initialExamRecords));
    setActiveFilters({ subject: "", teacher: "", year: "", type: "" });
  }, [initialExamRecords]);

  const applyFilter = (filterCategory, filterValue) => {
    let filtered;

    if (filterCategory === "subject") {
      filtered = initialExamRecords.filter(
        (record) => record[EXAM_COLUMNS.SUBJECT] === filterValue,
      );
      const newOptions = getAvailableFilterOptions(filtered);
      newOptions[0] = [
        ...new Set(
          initialExamRecords
            .map((record) => record[EXAM_COLUMNS.SUBJECT])
            .sort(),
        ),
      ];
      setAvailableFilterOptions(newOptions);
      setActiveFilters({
        subject: filterValue,
        teacher: "",
        year: "",
        type: "",
      });
    } else if (filterCategory === "teacher") {
      filtered = initialExamRecords.filter((record) => {
        if (
          activeFilters.subject &&
          record[EXAM_COLUMNS.SUBJECT] !== activeFilters.subject
        )
          return false;
        return record[EXAM_COLUMNS.TEACHER] === filterValue;
      });
      setActiveFilters((prev) => ({ ...prev, teacher: filterValue }));
    } else if (filterCategory === "year") {
      filtered = initialExamRecords.filter((record) => {
        if (
          activeFilters.subject &&
          record[EXAM_COLUMNS.SUBJECT] !== activeFilters.subject
        )
          return false;
        if (
          activeFilters.teacher &&
          record[EXAM_COLUMNS.TEACHER] !== activeFilters.teacher
        )
          return false;
        return record[EXAM_COLUMNS.YEAR] === filterValue;
      });
      setActiveFilters((prev) => ({ ...prev, year: filterValue }));
    } else if (filterCategory === "type") {
      filtered = initialExamRecords.filter((record) => {
        if (
          activeFilters.subject &&
          record[EXAM_COLUMNS.SUBJECT] !== activeFilters.subject
        )
          return false;
        if (
          activeFilters.teacher &&
          record[EXAM_COLUMNS.TEACHER] !== activeFilters.teacher
        )
          return false;
        if (
          activeFilters.year &&
          record[EXAM_COLUMNS.YEAR] !== activeFilters.year
        )
          return false;
        return record[EXAM_COLUMNS.TYPE] === filterValue;
      });
      setActiveFilters((prev) => ({ ...prev, type: filterValue }));
    }

    setFilteredRecords(filtered);
  };

  const columns = [
    { key: "subject", label: "科目", width: "w-[22%]" },
    { key: "teacher", label: "教師", width: "w-[14%]" },
    { key: "year", label: "年份", width: "w-[10%]" },
    { key: "type", label: "類別", width: "w-[12%]" },
  ];

  const getDownloadButtonLabel = (filename) => {
    if (!filename) return "下載";
    const extension = filename.split(".").pop();
    return extension?.toUpperCase() || "下載";
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">考古題列表</h1>
        <span className="px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
          {filteredRecords.length} 筆資料
        </span>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-900">
                  {columns.map((column, columnIndex) => (
                    <th
                      key={column.key}
                      className={`${column.width} px-4 py-4 text-left text-white text-sm font-medium relative group`}
                    >
                      <div className="flex items-center gap-2 cursor-pointer">
                        {column.label}
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="text-xs opacity-70"
                        />
                      </div>
                      {/* Dropdown */}
                      <div className="absolute left-0 top-full mt-1 min-w-[180px] max-h-[250px] overflow-y-auto bg-white rounded-lg shadow-xl z-50 hidden group-hover:block">
                        {availableFilterOptions[columnIndex].map(
                          (option, optionIndex) => (
                            <button
                              key={optionIndex}
                              onClick={() => applyFilter(column.key, option)}
                              className="w-full text-left px-4 py-2 text-slate-700 text-sm hover:bg-slate-100 transition-colors"
                            >
                              {option}
                            </button>
                          ),
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-[22%] px-4 py-4 text-left text-white text-sm font-medium">
                    備註
                  </th>
                  <th className="w-[20%] px-4 py-4 text-center text-white text-sm font-medium">
                    檔案
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, recordIndex) => (
                  <tr
                    key={recordIndex}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {record[EXAM_COLUMNS.SUBJECT]}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {record[EXAM_COLUMNS.TEACHER]}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full">
                        {record[EXAM_COLUMNS.YEAR]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getExamTypeBadgeClass(record[EXAM_COLUMNS.TYPE])}`}
                      >
                        {record[EXAM_COLUMNS.TYPE]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-sm">
                      {record[EXAM_COLUMNS.NOTE] || "-"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <a
                        href={record[EXAM_COLUMNS.FILE_URL]}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        {getDownloadButtonLabel(record[EXAM_COLUMNS.FILENAME])}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">
            <FontAwesomeIcon icon={faFolderOpen} className="text-5xl mb-4" />
            <p>沒有找到符合條件的考古題</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamList;
