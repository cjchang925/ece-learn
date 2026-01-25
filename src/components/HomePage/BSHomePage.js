import React from "react"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import BSFooter from "../Footer/BSFooter";
import { FaBook, FaHeart, FaSearch, FaUpload, FaList } from "react-icons/fa";
import styles from "./BSHomePage.module.css";

const BSHomePage = ({ onNavigate }) => {
    const handleActionClick = (action) => {
        if (onNavigate) {
            onNavigate(action);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>交大電機考古網站</h1>
                    <p className={styles.heroSubtitle}>
                        集結學長姐的智慧結晶，助你在考試中脫穎而出
                    </p>
                    <div className={styles.heroStats}>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>500+</div>
                            <div className={styles.statLabel}>考古題</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>50+</div>
                            <div className={styles.statLabel}>課程</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statNumber}>1000+</div>
                            <div className={styles.statLabel}>使用者</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <Container>
                    <Row className="g-4">
                        <Col lg={6}>
                            <div className={styles.featureCard}>
                                <div className={styles.cardHeader}>
                                    <div className={`${styles.cardIcon} ${styles.cardIconInfo}`}>
                                        <FaBook />
                                    </div>
                                    <h2 className={styles.cardTitle}>使用說明</h2>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.listItem}>
                                        <span className={styles.listNumber}>1</span>
                                        <span className={styles.listText}>
                                            考古資源是學長姐慢慢累積出來的，請不要惡意使用。
                                        </span>
                                    </div>
                                    <div className={styles.listItem}>
                                        <span className={styles.listNumber}>2</span>
                                        <span className={styles.listText}>
                                            右上方支援搜尋功能，搜尋到的文字會被 Highlight。
                                        </span>
                                    </div>
                                    <div className={styles.listItem}>
                                        <span className={styles.listNumber}>3</span>
                                        <span className={styles.listText}>
                                            如果要用 Filter，請先選科目再選其他。
                                        </span>
                                    </div>
                                    <div className={styles.listItem}>
                                        <span className={styles.listNumber}>4</span>
                                        <span className={styles.listText}>
                                            上傳考古題前請確認老師意願，若有侵權問題請自行負責。
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className={styles.featureCard}>
                                <div className={styles.cardHeader}>
                                    <div className={`${styles.cardIcon} ${styles.cardIconWish}`}>
                                        <FaHeart />
                                    </div>
                                    <h2 className={styles.cardTitle}>願望清單</h2>
                                    <Button
                                        className={styles.formButton}
                                        href="https://docs.google.com/forms/d/e/1FAIpQLSfn5uEo1MefhezayHOvvfWoIlAKJ7XvnKiUSaXXdDE0cLPAag/viewform?usp=pp_url"
                                        target="_blank"
                                    >
                                        填寫表單
                                    </Button>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.listItem}>
                                        <span className={`${styles.listNumber} ${styles.listNumberWish}`}>1</span>
                                        <span className={styles.listText}>
                                            可以填想要的功能或考古，但是不一定能實現。
                                        </span>
                                    </div>
                                    <div className={styles.listItem}>
                                        <span className={`${styles.listNumber} ${styles.listNumberWish}`}>2</span>
                                        <span className={styles.listText}>
                                            課本的題目與解答恕不提供，有版權疑慮。
                                        </span>
                                    </div>
                                    <div className={styles.listItem}>
                                        <span className={`${styles.listNumber} ${styles.listNumberWish}`}>3</span>
                                        <span className={styles.listText}>
                                            不合理的要求或是已經完成的事項會被移除。
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <Container>
                    <h2 className={styles.sectionTitle}>快速開始</h2>
                    <Row className="g-4">
                        <Col md={4}>
                            <div
                                className={styles.actionCard}
                                onClick={() => handleActionClick("first")}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && handleActionClick("first")}
                            >
                                <div className={styles.actionIcon}>
                                    <FaSearch />
                                </div>
                                <div className={styles.actionTitle}>搜尋考古題</div>
                                <div className={styles.actionDesc}>使用關鍵字快速找到需要的資源</div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div
                                className={`${styles.actionCard} ${styles.secondary}`}
                                onClick={() => handleActionClick("hope")}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && handleActionClick("hope")}
                            >
                                <div className={styles.actionIcon}>
                                    <FaList />
                                </div>
                                <div className={styles.actionTitle}>願望清單</div>
                                <div className={styles.actionDesc}>查看大家許下的願望</div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div
                                className={`${styles.actionCard} ${styles.tertiary}`}
                                onClick={() => handleActionClick("uploadfile")}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && handleActionClick("uploadfile")}
                            >
                                <div className={styles.actionIcon}>
                                    <FaUpload />
                                </div>
                                <div className={styles.actionTitle}>上傳分享</div>
                                <div className={styles.actionDesc}>分享你的考古題幫助學弟妹</div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <BSFooter />
        </>
    )
}

export default BSHomePage
