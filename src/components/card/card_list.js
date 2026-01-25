import { useEffect, useState } from "react";
import Card from "./card";
import styles from "./card.module.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faInbox } from "@fortawesome/free-solid-svg-icons";

const preprocess = (obj) => {
    return obj.table.rows.map(row => (
        row.c[1]["v"]
    ))
}

const CardList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = "https://docs.google.com/spreadsheets/d/1cW-HJEbYDWIsagjmoWyrzjjRlMnBQ3feQfbsKcPi9ZU/gviz/tq?tqx=out:json&tq&gid=0";
        fetch(url)
            .then(response => response.text())
            .then(text => JSON.parse(text.substring(47).slice(0, -2)))
            .then(json => {
                setData(preprocess(json));
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch wishes:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>願望清單</h1>
                    <p className={styles.subtitle}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>願望清單</h1>
                <p className={styles.subtitle}>
                    在這裡許願你想要的考古題，我們會盡力幫你找到
                </p>
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdJdgLgRz1sczuDvSGdXdMrS4Y3aROl3HwEKD4zSUmNQCOvKQ/viewform"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.submitButton}
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    提交願望
                </a>
            </div>

            {data.length > 0 ? (
                <div className={styles.grid}>
                    {data.map((text, id) => (
                        <Card
                            key={id}
                            text={text}
                            status="pending"
                        />
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    <FontAwesomeIcon icon={faInbox} className={styles.emptyIcon} />
                    <p>目前沒有願望</p>
                </div>
            )}
        </div>
    );
};

export default CardList;
