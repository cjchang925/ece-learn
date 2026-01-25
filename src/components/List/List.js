import React, { useState, useEffect } from 'react';
import styles from "./List.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faDownload, faFolderOpen } from "@fortawesome/free-solid-svg-icons";

function getUniqueValues(items) {
    return [
        [...new Set(items.map(arr => arr[0]).sort())],
        [...new Set(items.map(arr => arr[1]).sort())],
        [...new Set(items.map(arr => arr[2]).sort((a, b) => {
            const numA = Number(a.replace(/[^\d.]/g, ''));
            const numB = Number(b.replace(/[^\d.]/g, ''));
            return numA - numB;
        }))],
        [...new Set(items.map(arr => arr[3]).sort())],
    ];
}

function getTypeBadgeClass(type) {
    const t = String(type).toLowerCase();
    if (t.includes('期中')) return styles.typeMidterm;
    if (t.includes('期末')) return styles.typeFinal;
    if (t.includes('小考') || t.includes('quiz')) return styles.typeQuiz;
    if (t.includes('作業') || t.includes('hw')) return styles.typeHomework;
    return styles.typeOther;
}

const List = ({ items: propItems, stickyTop }) => {
    const [items, setItems] = useState(propItems);
    const [options, setOptions] = useState(getUniqueValues(propItems));
    const [filters, setFilters] = useState({ subject: '', teacher: '', year: '', type: '' });

    useEffect(() => {
        setItems(propItems);
        setOptions(getUniqueValues(propItems));
        setFilters({ subject: '', teacher: '', year: '', type: '' });
    }, [propItems]);

    const handleFilter = (category, value) => {
        let filtered;

        if (category === 'subject') {
            filtered = propItems.filter(item => item[0] === value);
            const newOptions = getUniqueValues(filtered);
            newOptions[0] = [...new Set(propItems.map(arr => arr[0]).sort())];
            setOptions(newOptions);
            setFilters({ subject: value, teacher: '', year: '', type: '' });
        } else if (category === 'teacher') {
            filtered = propItems.filter(item => {
                if (filters.subject && item[0] !== filters.subject) return false;
                return item[1] === value;
            });
            setFilters(prev => ({ ...prev, teacher: value }));
        } else if (category === 'year') {
            filtered = propItems.filter(item => {
                if (filters.subject && item[0] !== filters.subject) return false;
                if (filters.teacher && item[1] !== filters.teacher) return false;
                return item[2] === value;
            });
            setFilters(prev => ({ ...prev, year: value }));
        } else if (category === 'type') {
            filtered = propItems.filter(item => {
                if (filters.subject && item[0] !== filters.subject) return false;
                if (filters.teacher && item[1] !== filters.teacher) return false;
                if (filters.year && item[2] !== filters.year) return false;
                return item[3] === value;
            });
            setFilters(prev => ({ ...prev, type: value }));
        }

        setItems(filtered);
    };

    const columns = [
        { key: 'subject', label: '科目', className: styles.colSubject },
        { key: 'teacher', label: '教師', className: styles.colTeacher },
        { key: 'year', label: '年份', className: styles.colYear },
        { key: 'type', label: '類別', className: styles.colType },
    ];

    const getFileExtension = (filename) => {
        if (!filename) return '下載';
        const ext = filename.split('.').pop();
        return ext || '下載';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>考古題列表</h1>
                <span className={styles.count}>{items.length} 筆資料</span>
            </div>

            <div className={styles.tableContainer}>
                {items.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={col.key} className={`${styles.filterCell} ${col.className}`}>
                                        <span className={styles.filterLabel}>
                                            {col.label}
                                            <FontAwesomeIcon icon={faChevronDown} className={styles.filterIcon} />
                                        </span>
                                        <div className={styles.dropdown}>
                                            {options[idx].map((opt, i) => (
                                                <button key={i} onClick={() => handleFilter(col.key, opt)}>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </th>
                                ))}
                                <th className={styles.colNote}>備註</th>
                                <th className={styles.colFile}>檔案</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className={`${styles.colSubject} ${styles.subjectCell}`}>{item[0]}</td>
                                    <td className={`${styles.colTeacher} ${styles.teacherCell}`}>{item[1]}</td>
                                    <td className={`${styles.colYear} ${styles.yearCell}`}>
                                        <span className={styles.yearBadge}>{item[2]}</span>
                                    </td>
                                    <td className={`${styles.colType} ${styles.typeCell}`}>
                                        <span className={`${styles.typeBadge} ${getTypeBadgeClass(item[3])}`}>
                                            {item[3]}
                                        </span>
                                    </td>
                                    <td className={`${styles.colNote} ${styles.noteCell}`}>{item[4] || '-'}</td>
                                    <td className={`${styles.colFile} ${styles.fileCell}`}>
                                        <a href={item[6]} target="_blank" rel="noreferrer" className={styles.fileLink}>
                                            <FontAwesomeIcon icon={faDownload} />
                                            {getFileExtension(item[5])}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.empty}>
                        <FontAwesomeIcon icon={faFolderOpen} className={styles.emptyIcon} />
                        <p>沒有找到符合條件的考古題</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default List;
