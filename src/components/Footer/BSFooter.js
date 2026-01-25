import React from 'react';
import { FaGithub, FaHeart, FaBook, FaUpload, FaListAlt } from 'react-icons/fa';
import { AiOutlineCopyright } from 'react-icons/ai';
import styles from './BSFooter.module.css';

const BSFooter = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerTop}>
                    {/* Brand Section */}
                    <div className={styles.footerBrand}>
                        <div className={styles.brandTitle}>
                            <div className={styles.brandIcon}>EE</div>
                            <span className={styles.brandName}>交大電機考古網站</span>
                        </div>
                        <p className={styles.brandDesc}>
                            集結學長姐的智慧結晶，提供電機系學生最完整的考古題資源庫，助你在考試中脫穎而出。
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.footerSection}>
                        <h4>快速連結</h4>
                        <ul className={styles.footerLinks}>
                            <li>
                                <a href="#first"><FaBook /> 大一課程</a>
                            </li>
                            <li>
                                <a href="#second"><FaBook /> 大二課程</a>
                            </li>
                            <li>
                                <a href="#advance"><FaBook /> 大三以上</a>
                            </li>
                            <li>
                                <a href="#other"><FaBook /> 通識與其他</a>
                            </li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div className={styles.footerSection}>
                        <h4>功能</h4>
                        <ul className={styles.footerLinks}>
                            <li>
                                <a href="#upload"><FaUpload /> 上傳考古</a>
                            </li>
                            <li>
                                <a href="#wish"><FaListAlt /> 願望清單</a>
                            </li>
                            <li>
                                <a href="https://docs.google.com/forms/d/e/1FAIpQLSfn5uEo1MefhezayHOvvfWoIlAKJ7XvnKiUSaXXdDE0cLPAag/viewform" target="_blank" rel="noopener noreferrer">
                                    <FaHeart /> 許願表單
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className={styles.footerSection}>
                        <h4>開發團隊</h4>
                        <ul className={styles.footerLinks}>
                            <li>
                                <a href="https://github.com/Justin900429" target="_blank" rel="noopener noreferrer">
                                    <FaGithub /> Justin
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/JoyceFang1213" target="_blank" rel="noopener noreferrer">
                                    <FaGithub /> Joyce
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/cjchang925" target="_blank" rel="noopener noreferrer">
                                    <FaGithub /> Chi-Chun Chang
                                </a>
                            </li>
                        </ul>
                        <div className={styles.socialLinks}>
                            <a
                                href="https://github.com/cjchang925/ece-learn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                            >
                                <FaGithub />
                            </a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.copyright}>
                        <AiOutlineCopyright />
                        {new Date().getFullYear()} NYCU EESA. All rights reserved.
                    </div>
                    <div className={styles.developers}>
                        Source code released under MIT license
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default BSFooter;
