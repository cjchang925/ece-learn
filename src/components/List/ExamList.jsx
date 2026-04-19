import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
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

/** Pixels to shift the filter menu left so list text lines up with the header label text. */
const FILTER_MENU_NUDGE_LEFT_PX = 16;

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
  /** 0–3 = filter column index; fixed-position menu escapes overflow clipping */
  const [openFilterColumn, setOpenFilterColumn] = useState(null);
  const [filterMenuStyle, setFilterMenuStyle] = useState({ top: 0, left: 0 });
  const filterTriggerRefs = useRef([]);
  /** Narrow label+icon row — used for dropdown horizontal alignment (th is full width; centered columns need this). */
  const filterLabelRefs = useRef([]);
  const tableScrollRef = useRef(null);
  const filterLeaveTimerRef = useRef(null);

  const clearFilterLeaveTimer = () => {
    if (filterLeaveTimerRef.current) {
      clearTimeout(filterLeaveTimerRef.current);
      filterLeaveTimerRef.current = null;
    }
  };

  const getFilterMenuGeometry = (columnIndex) => {
    const th = filterTriggerRefs.current[columnIndex];
    const labelEl = filterLabelRefs.current[columnIndex];
    if (!th) return null;
    const thRect = th.getBoundingClientRect();
    const labelRect = labelEl?.getBoundingClientRect();
    const anchorLeft = labelRect?.left ?? thRect.left;
    const left = Math.max(8, anchorLeft - FILTER_MENU_NUDGE_LEFT_PX);
    return {
      top: thRect.bottom,
      left,
    };
  };

  const updateFilterMenuPosition = useCallback(() => {
    if (openFilterColumn === null) return;
    const geom = getFilterMenuGeometry(openFilterColumn);
    if (!geom) return;
    setFilterMenuStyle(geom);
  }, [openFilterColumn]);

  useLayoutEffect(() => {
    updateFilterMenuPosition();
  }, [updateFilterMenuPosition]);

  useEffect(() => {
    if (openFilterColumn === null) return;
    const onScrollOrResize = () => updateFilterMenuPosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    const scrollEl = tableScrollRef.current;
    if (scrollEl) scrollEl.addEventListener("scroll", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      if (scrollEl) scrollEl.removeEventListener("scroll", onScrollOrResize);
    };
  }, [openFilterColumn, updateFilterMenuPosition]);

  const handleFilterTriggerEnter = (columnIndex) => {
    clearFilterLeaveTimer();
    const geom = getFilterMenuGeometry(columnIndex);
    if (!geom) return;
    setFilterMenuStyle(geom);
    setOpenFilterColumn(columnIndex);
  };

  const handleFilterTriggerLeave = () => {
    filterLeaveTimerRef.current = setTimeout(() => {
      setOpenFilterColumn(null);
    }, 150);
  };

  const handleFilterMenuEnter = () => {
    clearFilterLeaveTimer();
  };

  const handleFilterMenuLeave = () => {
    setOpenFilterColumn(null);
  };

  useEffect(() => {
    setFilteredRecords(initialExamRecords);
    setAvailableFilterOptions(getAvailableFilterOptions(initialExamRecords));
    setActiveFilters({ subject: "", teacher: "", year: "", type: "" });
    setOpenFilterColumn(null);
  }, [initialExamRecords]);

  useEffect(
    () => () => {
      clearFilterLeaveTimer();
    },
    [],
  );

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
    { key: "subject", label: "科目", width: "w-[22%]", align: "text-left" },
    { key: "teacher", label: "教師", width: "w-[14%]", align: "text-left" },
    { key: "year", label: "年份", width: "w-[10%]", align: "text-center" },
    { key: "type", label: "類別", width: "w-[12%]", align: "text-center" },
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

      {/* Table — no overflow-hidden on card so filters are not clipped; horizontal scroll is isolated */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg">
        {filteredRecords.length > 0 ? (
          <div ref={tableScrollRef} className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-900">
                  {columns.map((column, columnIndex) => (
                    <th
                      key={column.key}
                      ref={(el) => {
                        filterTriggerRefs.current[columnIndex] = el;
                      }}
                      className={`${column.width} px-4 py-4 ${column.align} text-white text-sm font-medium`}
                      onMouseEnter={() => handleFilterTriggerEnter(columnIndex)}
                      onMouseLeave={handleFilterTriggerLeave}
                    >
                      <div
                        className={
                          column.align === "text-center"
                            ? "flex justify-center"
                            : undefined
                        }
                      >
                        <div
                          ref={(el) => {
                            filterLabelRefs.current[columnIndex] = el;
                          }}
                          className="inline-flex items-center gap-2 cursor-pointer"
                        >
                          {column.label}
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className="text-xs opacity-70"
                          />
                        </div>
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

      {openFilterColumn !== null && (
        <div
          className="fixed z-[200] inline-block align-top max-h-[250px] max-w-[min(22rem,calc(100vw-2rem))] overflow-y-auto overflow-x-hidden bg-white rounded-lg shadow-xl border border-slate-100"
          style={{
            top: filterMenuStyle.top,
            left: filterMenuStyle.left,
          }}
          onMouseEnter={handleFilterMenuEnter}
          onMouseLeave={handleFilterMenuLeave}
        >
          {availableFilterOptions[openFilterColumn].map((option, optionIndex) => (
            <button
              key={optionIndex}
              type="button"
              onClick={() => {
                applyFilter(columns[openFilterColumn].key, option);
                setOpenFilterColumn(null);
              }}
              className="block max-w-full text-left px-4 py-2 text-slate-700 text-sm whitespace-normal break-words hover:bg-slate-100 transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamList;
