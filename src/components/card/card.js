import styles from "./card.module.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";

const Card = ({ text, status }) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardIcon}>
                <FontAwesomeIcon icon={faLightbulb} />
            </div>
            <p className={styles.cardText}>{text}</p>
            <div className={styles.cardMeta}>
                <span className={styles.cardStatus}>
                    <span className={`${styles.statusDot} ${status === 'completed' ? styles.completed : ''}`}></span>
                    {status === 'completed' ? '已完成' : '處理中'}
                </span>
            </div>
        </div>
    );
};

export default Card;
