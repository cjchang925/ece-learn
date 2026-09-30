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
  if (type.includes("期中")) return "tint-orange";
  if (type.includes("期末")) return "tint-red";
  if (type.includes("小考") || type.includes("quiz")) return "tint-green";
  if (type.includes("作業") || type.includes("hw")) return "tint-blue";
  return "tint-purple";
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

  return (
    <div className="min-h-screen bg-canvas px-4 pt-10 pb-16 md:pt-14">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-end gap-x-4 gap-y-2">
        <h1 className="text-title-1 text-label">考古題列表</h1>
        <span className="badge tint-gray mb-1 tabular-nums">
          {filteredRecords.length} 筆資料
        </span>
      </div>

      {/* Table — no overflow-hidden on card so filters are not clipped; horizontal scroll is isolated */}
      <div className="max-w-6xl mx-auto surface-card animate-fade-up">
        {filteredRecords.length > 0 ? (
          <div ref={tableScrollRef} className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-separator">
                  {columns.map((column, columnIndex) => {
                    const isFilterActive = Boolean(activeFilters[column.key]);
                    const isMenuOpen = openFilterColumn === columnIndex;
                    return (
                      <th
                        key={column.key}
                        ref={(el) => {
                          filterTriggerRefs.current[columnIndex] = el;
                        }}
                        className={`${column.width} px-5 py-4 ${column.align} text-[13px] font-semibold`}
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
                            className={`inline-flex items-center gap-1.5 cursor-pointer -mx-2 px-2 py-1 rounded-md transition-colors duration-200
                              ${isMenuOpen ? "bg-fill" : ""}
                              ${isFilterActive ? "text-accent-text" : "text-label-2"}`}
                          >
                            {column.label}
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className={`text-[10px] transition-transform duration-300 ease-apple ${isMenuOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                        </div>
                      </th>
                    );
                  })}
                  <th className="w-[22%] px-5 py-4 text-left text-label-2 text-[13px] font-semibold">
                    備註
                  </th>
                  <th className="w-[20%] px-5 py-4 text-center text-label-2 text-[13px] font-semibold">
                    檔案
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, recordIndex) => (
                  <tr
                    key={recordIndex}
                    className="border-b border-separator last:border-b-0 hover:bg-[var(--row-hover)] transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-label">
                      {record[EXAM_COLUMNS.SUBJECT]}
                    </td>
                    <td className="px-5 py-3.5 text-label-2">
                      {record[EXAM_COLUMNS.TEACHER]}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="text-label tabular-nums">
                        {record[EXAM_COLUMNS.YEAR]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`badge ${getExamTypeBadgeClass(record[EXAM_COLUMNS.TYPE])}`}
                      >
                        {record[EXAM_COLUMNS.TYPE]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-label-3 text-sm">
                      {record[EXAM_COLUMNS.NOTE] || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <a
                        href={record[EXAM_COLUMNS.FILE_URL]}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="下載"
                        title="下載"
                        className="pressable inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent-tint text-accent-text hover:bg-accent hover:text-white"
                      >
                        <FontAwesomeIcon icon={faDownload} className="text-sm" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-24 text-center text-label-3">
            <FontAwesomeIcon icon={faFolderOpen} className="text-5xl mb-4 opacity-60" />
            <p>沒有找到符合條件的考古題</p>
          </div>
        )}
      </div>

      {openFilterColumn !== null && (
        <div
          key={openFilterColumn}
          className="fixed z-[200] inline-block align-top max-h-[280px] max-w-[min(22rem,calc(100vw-2rem))] overflow-y-auto overflow-x-hidden material-popover rounded-xl p-1.5 origin-top-left animate-materialize"
          style={{
            top: filterMenuStyle.top,
            left: filterMenuStyle.left,
          }}
          onMouseEnter={handleFilterMenuEnter}
          onMouseLeave={handleFilterMenuLeave}
        >
          {availableFilterOptions[openFilterColumn].map((option, optionIndex) => {
            const isSelected =
              activeFilters[columns[openFilterColumn].key] === option;
            return (
              <button
                key={optionIndex}
                type="button"
                onClick={() => {
                  applyFilter(columns[openFilterColumn].key, option);
                  setOpenFilterColumn(null);
                }}
                className={`menu-item whitespace-normal break-words ${isSelected ? "font-semibold" : ""}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExamList;
