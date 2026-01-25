import { useState, useRef } from "react";
import React from "react";
import styles from "./UploadFile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCloudUploadAlt,
    faFile,
    faPaperPlane,
    faInfoCircle,
    faCheckCircle,
    faSpinner
} from "@fortawesome/free-solid-svg-icons";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        grade: "",
        subject: "",
        teacher: "",
        year: "",
        type: ""
    });

    const isFormValid = () => {
        return file &&
            formData.grade && formData.grade !== "pleaseChoose" &&
            formData.subject &&
            formData.teacher &&
            formData.year &&
            formData.type && formData.type !== "pleaseChoose";
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleUploadClick = async (e) => {
        e.preventDefault();
        if (!file || !isFormValid()) return;

        setUploading(true);

        const uploadData = new FormData();
        uploadData.append('files', file);
        uploadData.append('grade', formData.grade);
        uploadData.append('subject', formData.subject);
        uploadData.append('teacher', formData.teacher);
        uploadData.append('year', formData.year);
        uploadData.append('type', formData.type);
        uploadData.append('filename', file.name);

        try {
            const response = await fetch('/api/user-upload-file', {
                method: 'POST',
                body: uploadData
            }).then(res => res.json());

            if (response.message === 'Invalid file!') {
                alert('Invalid file type!');
            } else if (response.message === 'Success!') {
                alert('Upload successfully!');
                window.location.reload();
            } else if (response.message === 'Invalid user!') {
                alert('Invalid user! Maybe you are not using an NYCU account.');
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('上傳失敗，請稍後再試');
        } finally {
            setUploading(false);
        }
    };

    const handleDropAreaClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>上傳考古題</h1>
                <p className={styles.subtitle}>
                    分享你的考古題，幫助更多同學
                </p>
            </div>

            <div className={styles.formCard}>
                <form onSubmit={handleUploadClick}>
                    <div className={styles.formGrid}>
                        {/* Grade Select */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                年級
                                <span className={styles.required}>*</span>
                            </label>
                            <select
                                className={styles.select}
                                value={formData.grade}
                                onChange={handleInputChange('grade')}
                            >
                                <option value="">請選擇年級</option>
                                <option value="大一">大一</option>
                                <option value="大二">大二</option>
                                <option value="大三以上選修">大三以上</option>
                                <option value="通識與其他">通識與其他</option>
                            </select>
                        </div>

                        {/* Subject Input */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                科目全名
                                <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="例如：微積分(一)"
                                value={formData.subject}
                                onChange={handleInputChange('subject')}
                            />
                        </div>

                        {/* Teacher Input */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                教師姓名
                                <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="例如：莊重"
                                value={formData.teacher}
                                onChange={handleInputChange('teacher')}
                            />
                        </div>

                        {/* Year Input */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                學年度
                                <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="例如：112"
                                value={formData.year}
                                onChange={handleInputChange('year')}
                            />
                        </div>

                        {/* Type Select */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                類別
                                <span className={styles.required}>*</span>
                            </label>
                            <select
                                className={styles.select}
                                value={formData.type}
                                onChange={handleInputChange('type')}
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

                        {/* Info Box */}
                        <div className={styles.infoBox}>
                            <FontAwesomeIcon icon={faInfoCircle} className={styles.infoIcon} />
                            <p className={styles.infoText}>
                                請確保上傳的檔案不包含個人資訊，並且您有權分享此檔案。
                                支援的檔案格式：PDF、圖片、Word、壓縮檔等。
                            </p>
                        </div>

                        {/* File Upload Area */}
                        <div
                            className={`${styles.fileUploadArea} ${file ? styles.hasFile : ''}`}
                            onClick={handleDropAreaClick}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                className={styles.hiddenInput}
                                onChange={handleFileChange}
                            />
                            <FontAwesomeIcon
                                icon={file ? faCheckCircle : faCloudUploadAlt}
                                className={`${styles.uploadIcon} ${file ? styles.hasFile : ''}`}
                            />
                            {file ? (
                                <>
                                    <p className={styles.uploadText}>檔案已選擇</p>
                                    <p className={styles.fileName}>
                                        <FontAwesomeIcon icon={faFile} className={styles.fileIcon} />
                                        {file.name}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className={styles.uploadText}>
                                        點擊或拖曳檔案至此處上傳
                                    </p>
                                    <p className={styles.uploadHint}>
                                        支援各種常見檔案格式
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className={styles.submitSection}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={!isFormValid() || uploading}
                        >
                            {uploading ? (
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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadFile;
