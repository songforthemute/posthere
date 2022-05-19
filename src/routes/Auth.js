import React, { useState } from "react";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const onChange = (e) => {
        const {
            target: { name, value },
        } = e;
        if (name === "email") setEmail(value);
        else if (name === "password") setPassword(value);
    };
    const onSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <span>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
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
                <input type="submit" value="Log In" />
            </form>
        </span>
    );
};
export default Auth;
