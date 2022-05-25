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
        let data;
        try {
            const auth = getAuth();
            if (newAccount) {
                data = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
            } else {
                data = await signInWithEmailAndPassword(auth, email, password);
            }
            console.log(data);
        } catch (error) {
            // console.log({ error });
            setError(error.message);
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
                    placeholder="Email"
                    required
                />
                <input
                    className="authInput"
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Password"
                    required
                />
                <input
                    className="authInput authSubmit"
                    type="submit"
                    value={newAccount ? "Sign Up Now" : "Sign In"}
                />
                {error && <span className="authError">{error}</span>}
            </form>
            <div>
                <button onClick={toggleAccount} className="authSwitch">
                    {newAccount ? "Sign In" : "Sign Up Now"}
                </button>
            </div>
        </>
    );
};

export default AuthForm;
