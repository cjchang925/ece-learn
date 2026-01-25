import React, { useLayoutEffect, useState } from 'react';
import styles from './Login.module.css';
import { FcGoogle } from "react-icons/fc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { useGoogleLogin } from '@react-oauth/google';

const Login = (props) => {
    const [user, setUser] = useState();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (err) => console.log(err)
    });

    useLayoutEffect(() => {
        if (user) {
            fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    Accept: 'application/json'
                }
            }).then((res) => {
                return res.json();
            }).then(async (data) => {
                await fetch('https://prevexam.dece.nycu.edu.tw/api/login', {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(() => {
                    props.handleUser(data.given_name)
                    window.localStorage.setItem('name', data.given_name)
                    props.handleLoginState(true)
                })
            })
        }
    }, [user, props]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Left Side - Brand */}
                <div className={styles.imageSection}>
                    <div className={styles.brandIcon}>
                        <FontAwesomeIcon icon={faGraduationCap} />
                    </div>
                    <h1 className={styles.brandTitle}>NYCU EE</h1>
                    <p className={styles.brandSubtitle}>Previous Exam Archive</p>
                </div>

                {/* Right Side - Login Form */}
                <div className={styles.formSection}>
                    <h2 className={styles.welcomeTitle}>Welcome</h2>
                    <p className={styles.welcomeSubtitle}>
                        Sign in to access exam archives
                    </p>

                    <button
                        className={styles.googleButton}
                        onClick={() => login()}
                    >
                        <FcGoogle className={styles.googleIcon} />
                        Continue with Google
                    </button>

                    <p className={styles.infoText}>
                        Sign in with your Google account to continue
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
