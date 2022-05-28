import React, { useState } from "react";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [newAccount, setNewAccount] = useState(true);

    // sign-in <=> sign-up 토글 파트
    const toggleAccount = () => setNewAccount((prev) => !prev);

    // 인풋 감지 파트
    const onChange = (e) => {
        const {
            target: { name, value },
        } = e;

        if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
    };

    // 폼 제출 파트
    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const auth = getAuth();
            if (newAccount) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            setError(error.message.slice(9));
        }
    };

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input
                    className="authInput"
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="이메일"
                    required
                />
                <input
                    className="authInput"
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="비밀번호"
                    required
                />
                <input
                    className="authInput authSubmit"
                    type="submit"
                    value={newAccount ? "지금 계정 생성" : "로그인"}
                />
                {error && <span className="authError">{error}</span>}
            </form>
            <div>
                <button
                    onClick={toggleAccount}
                    className="authInput authSwitch"
                >
                    {newAccount ? "로그인하기" : "지금 계정 생성하기"}
                </button>
            </div>
        </>
    );
};

export default AuthForm;
