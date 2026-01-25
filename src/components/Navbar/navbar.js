import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'
import classes from "./navbar.module.css"
import { useState } from "react";
import React from "react";

const NavbarCustom = (props) => {
    const [inputText, setInputText] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeButton, setActiveButton] = useState("readme");

    const ToggleHandler = () => {
        setIsOpen(!isOpen);
    }

    const gradeClickHandler = (e) => {
        const value = e.target.value;
        setActiveButton(value);
        setIsOpen(false);
        props.gradeClick(value);
    }

    const inputTextChangeHandler = (e) => {
        setInputText(e.target.value);
        props.textChange(e.target.value);
    }

    const logoutHandler = () => {
        props.logoutHandler()
    }

    const getButtonClass = (value) => {
        let className = classes.navButton;
        if (activeButton === value) {
            className += ` ${classes.active}`;
        }
        return className;
    }

    return (
        <nav className={`${classes.topNav} ${isOpen ? classes.responsive : ''}`} id="myTopNav">
            {/* Brand */}
            <div className={classes.brand}>
                <div className={classes.brandIcon}>EE</div>
                <span className={classes.brandText}>Hi, {props.userName}</span>
            </div>

            {/* Navigation Links */}
            <div className={classes.navLinks}>
                <button
                    value="readme"
                    onClick={gradeClickHandler}
                    className={getButtonClass("readme")}
                >
                    首頁
                </button>
                <button
                    value="first"
                    onClick={gradeClickHandler}
                    className={getButtonClass("first")}
                >
                    大一
                </button>
                <button
                    value="second"
                    onClick={gradeClickHandler}
                    className={getButtonClass("second")}
                >
                    大二
                </button>
                <button
                    value="advance"
                    onClick={gradeClickHandler}
                    className={getButtonClass("advance")}
                >
                    大三以上
                </button>
                <button
                    value="other"
                    onClick={gradeClickHandler}
                    className={getButtonClass("other")}
                >
                    通識與其他
                </button>
                <button
                    value="hope"
                    onClick={gradeClickHandler}
                    className={getButtonClass("hope")}
                >
                    願望清單
                </button>
                <button
                    value="uploadfile"
                    onClick={gradeClickHandler}
                    className={getButtonClass("uploadfile")}
                >
                    上傳考古
                </button>
                <button
                    onClick={logoutHandler}
                    className={`${classes.navButton} ${classes.logout}`}
                >
                    登出
                </button>
            </div>

            {/* Search */}
            <div className={classes.searchContainer}>
                <FontAwesomeIcon icon={faSearch} className={classes.searchIcon} />
                <input
                    type="text"
                    placeholder="搜尋課程或老師..."
                    value={inputText}
                    onChange={inputTextChangeHandler}
                    className={classes.searchInput}
                />
            </div>

            {/* Mobile Menu Toggle */}
            <button className={classes.menuToggle} onClick={ToggleHandler}>
                <FontAwesomeIcon icon={faBars} />
            </button>
        </nav>
    )
};

export default NavbarCustom;
