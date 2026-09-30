import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faDownload,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { EXAM_COLUMNS } from "../../constants";
import SelectField from "../SelectField/SelectField.jsx";

/** Record column behind each filter */
const FILTER_COLUMNS = {
  subject: EXAM_COLUMNS.SUBJECT,
  teacher: EXAM_COLUMNS.TEACHER,
  type: EXAM_COLUMNS.TYPE,
};

const NO_FILTERS = { subject: "", teacher: "", type: "" };

/** Records matching every active filter */
function filterRecords(examRecords, filters) {
  return examRecords.filter((record) =>
    Object.entries(FILTER_COLUMNS).every(
      ([key, column]) => !filters[key] || record[column] === filters[key],
    ),
  );
}

function getDistinctValues(examRecords, column) {
  return [...new Set(examRecords.map((record) => record[column]))].sort();
}

/**
 * Filter menu options, keyed by filterable column, narrowing 科目 → 教師 → 類別:
 * each menu only lists values that exist under the filters before it, so no
 * choice can leave the list empty.
 */
function getAvailableFilterOptions(examRecords, filters) {
  return {
    subject: getDistinctValues(examRecords, EXAM_COLUMNS.SUBJECT),
    teacher: getDistinctValues(
      filterRecords(examRecords, { ...NO_FILTERS, subject: filters.subject }),
      EXAM_COLUMNS.TEACHER,
    ),
    type: getDistinctValues(
      filterRecords(examRecords, { ...filters, type: "" }),
      EXAM_COLUMNS.TYPE,
    ),
  };
}

/**
 * Pixels to shift a left-aligned filter menu left of the header label box so the
 * option text lines up with the label text: menu padding (6) + item padding (12)
 * minus the label box's own horizontal padding (8).
 */
const FILTER_MENU_NUDGE_LEFT_PX = 10;

/** Characters not allowed in file names on Windows/macOS */
const UNSAFE_FILENAME_CHARS = /[\\/:*?"<>|]/g;

/** Download name "subject-teacher-year-type.ext" instead of the server's stored name */
function getDownloadFileName(record) {
  const baseName = [
    record[EXAM_COLUMNS.SUBJECT],
    record[EXAM_COLUMNS.TEACHER],
    record[EXAM_COLUMNS.YEAR],
    record[EXAM_COLUMNS.TYPE],
  ]
    .map((part) => String(part ?? "").replace(UNSAFE_FILENAME_CHARS, "_").trim())
    .filter(Boolean)
    .join("-");
  // Keep the stored file's real extension so it opens with the right app
  const extension = String(record[EXAM_COLUMNS.FILE_URL] ?? "").match(/\.([a-z0-9]+)$/i);
  return extension ? `${baseName}.${extension[1].toLowerCase()}` : baseName;
}

function getExamTypeBadgeClass(examType) {
  const type = String(examType).toLowerCase();
  if (type.includes("期中")) return "tint-orange";
  if (type.includes("期末")) return "tint-red";
  if (type.includes("小考") || type.includes("quiz")) return "tint-green";
  if (type.includes("作業") || type.includes("hw")) return "tint-blue";
  return "tint-purple";
}

const columns = [
  {
    key: "subject",
    label: "科目",
    width: "w-[34%]",
    align: "text-left",
    filterable: true,
  },
  {
    key: "teacher",
    label: "教師",
    width: "w-[13.2%]",
    align: "text-left",
    filterable: true,
  },
  {
    key: "year",
    label: "學年度",
    width: "w-[13.2%]",
    align: "text-center",
    filterable: false,
  },
  {
    key: "type",
    label: "類別",
    width: "w-[13.2%]",
    align: "text-center",
    filterable: true,
  },
];

const ExamList = ({ examRecords: initialExamRecords }) => {
  const [activeFilters, setActiveFilters] = useState(NO_FILTERS);
  const filteredRecords = useMemo(
    () => filterRecords(initialExamRecords, activeFilters),
    [initialExamRecords, activeFilters],
  );
  const availableFilterOptions = useMemo(
    () => getAvailableFilterOptions(initialExamRecords, activeFilters),
    [initialExamRecords, activeFilters],
  );
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
    // Option text starts where the label's first character does
    const anchorLeft = labelRect?.left ?? thRect.left;
    return {
      top: thRect.bottom,
      left: Math.max(8, anchorLeft - FILTER_MENU_NUDGE_LEFT_PX),
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
    setActiveFilters(NO_FILTERS);
    setOpenFilterColumn(null);
  }, [initialExamRecords]);

  useEffect(
    () => () => {
      clearFilterLeaveTimer();
    },
    [],
  );

  const applyFilter = (filterCategory, filterValue) => {
    // Picking a filter resets the ones after it (科目 → 教師 → 類別)
    setActiveFilters((prev) => {
      if (filterCategory === "subject") {
        return { ...NO_FILTERS, subject: filterValue };
      }
      if (filterCategory === "teacher") {
        return { ...prev, teacher: filterValue, type: "" };
      }
      return { ...prev, [filterCategory]: filterValue };
    });
  };

  // A button (not a link) so hovering does not show the file URL in the
  // browser's status bar; the click triggers a temporary, never-rendered link.
  // No target="_blank": Chromium drops the download name in a new tab.
  const downloadRecord = (record) => {
    const link = document.createElement("a");
    link.href = record[EXAM_COLUMNS.FILE_URL];
    link.download = getDownloadFileName(record);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const renderDownloadLink = (record) => (
    <button
      type="button"
      onClick={() => downloadRecord(record)}
      aria-label="下載"
      title="下載"
      className="pressable inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-accent-tint text-accent-text hover:bg-accent hover:text-white"
    >
      <FontAwesomeIcon icon={faDownload} className="text-sm" />
    </button>
  );

  return (
    <div className="flex-1 bg-canvas px-4 pt-10 pb-16 md:pt-14">
      {/* Header */}
      <div className="max-w-[56rem] mx-auto mb-6 flex flex-wrap items-end gap-x-4 gap-y-2">
        <h1 className="text-title-1 text-label">考古題列表</h1>
        <span className="badge tint-gray mb-1 tabular-nums">
          {filteredRecords.length} 筆資料
        </span>
      </div>

      {/* Phone filters — the desktop table uses hover menus on its column headers instead */}
      {initialExamRecords.length > 0 && (
        <div className="md:hidden max-w-[56rem] mx-auto mb-4 grid grid-cols-2 gap-3">
          {columns
            .filter((column) => column.filterable)
            .map((column) => (
              // 科目 names are long, so it gets the full row; 教師 and 類別 share the next
              <div
                key={column.key}
                className={column.key === "subject" ? "col-span-2" : undefined}
              >
                <SelectField
                  id={`filter-${column.key}`}
                  label={column.label}
                  placeholder="全部"
                  options={availableFilterOptions[column.key].map(
                    (option) => ({
                      value: option,
                      label: option,
                    }),
                  )}
                  value={activeFilters[column.key]}
                  onChange={(value) => applyFilter(column.key, value)}
                />
              </div>
            ))}
        </div>
      )}

      {/* Table — no overflow-hidden on card so filters are not clipped; horizontal scroll is isolated */}
      <div className="max-w-[56rem] mx-auto surface-card animate-fade-up">
        {filteredRecords.length > 0 ? (
          <>
            <div
              ref={tableScrollRef}
              className="hidden md:block overflow-x-auto"
            >
              <table className="w-full min-w-[720px] table-fixed">
                <thead>
                  <tr className="border-b border-separator">
                    {columns.map((column, columnIndex) => {
                      if (!column.filterable) {
                        return (
                          <th
                            key={column.key}
                            className={`${column.width} px-5 py-4 ${column.align} text-label-2 text-[13px] font-semibold`}
                          >
                            {column.label}
                          </th>
                        );
                      }
                      const isFilterActive = Boolean(activeFilters[column.key]);
                      const isMenuOpen = openFilterColumn === columnIndex;
                      return (
                        <th
                          key={column.key}
                          ref={(el) => {
                            filterTriggerRefs.current[columnIndex] = el;
                          }}
                          className={`${column.width} px-5 py-4 ${column.align} text-[13px] font-semibold`}
                          onMouseEnter={() =>
                            handleFilterTriggerEnter(columnIndex)
                          }
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
                    <th className="w-[13.2%] px-5 py-4 text-center text-label-2 text-[13px] font-semibold">
                      副檔名
                    </th>
                    <th className="w-[13.2%] px-5 py-4 text-center text-label-2 text-[13px] font-semibold">
                      下載
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
                      <td className="px-5 py-3.5 text-label-2 whitespace-nowrap">
                        {record[EXAM_COLUMNS.TEACHER]}
                      </td>
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <span className="text-label tabular-nums">
                          {record[EXAM_COLUMNS.YEAR]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`badge whitespace-nowrap ${getExamTypeBadgeClass(record[EXAM_COLUMNS.TYPE])}`}
                        >
                          {record[EXAM_COLUMNS.TYPE]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center text-label-3 text-sm">
                        {record[EXAM_COLUMNS.FILE_EXTENSION] || "-"}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {renderDownloadLink(record)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phone list — every row keeps its download button in view */}
            <ul className="md:hidden">
              {filteredRecords.map((record, recordIndex) => (
                <li
                  key={recordIndex}
                  className="flex items-center gap-3 px-4 py-3.5 border-b border-separator last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-label leading-snug">
                      {record[EXAM_COLUMNS.SUBJECT]}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-label-2">
                      <span className="whitespace-nowrap">
                        {record[EXAM_COLUMNS.TEACHER]}
                      </span>
                      <span aria-hidden="true" className="text-label-3">
                        ·
                      </span>
                      <span className="whitespace-nowrap tabular-nums">
                        {record[EXAM_COLUMNS.YEAR]}
                      </span>
                      <span
                        className={`badge whitespace-nowrap !text-xs ${getExamTypeBadgeClass(record[EXAM_COLUMNS.TYPE])}`}
                      >
                        {record[EXAM_COLUMNS.TYPE]}
                      </span>
                    </div>
                    {record[EXAM_COLUMNS.FILE_EXTENSION] && (
                      <p className="mt-1 text-sm text-label-3">
                        副檔名：{record[EXAM_COLUMNS.FILE_EXTENSION]}
                      </p>
                    )}
                  </div>
                  {renderDownloadLink(record)}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="py-24 text-center text-label-3">
            <FontAwesomeIcon
              icon={faFolderOpen}
              className="text-5xl mb-4 opacity-60"
            />
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
          {availableFilterOptions[columns[openFilterColumn].key].map(
            (option, optionIndex) => {
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
            },
          )}
        </div>
      )}
    </div>
  );
};

export default ExamList;
