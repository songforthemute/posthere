import React, { useState } from "react";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (e) => {
        const {
            target: { name, value },
        } = e;
        if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
    };

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

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Password"
                    required
                />
                <input
                    type="submit"
                    value={newAccount ? "Sign Up Now" : "Sign In"}
                />
                {error}
            </form>
            <button onClick={toggleAccount}>
                {newAccount ? "Sign In" : "Sign Up"}
            </button>
        </div>
    );
};
export default Auth;
