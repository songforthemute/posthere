import React from "react";
import AuthForm from "../components/AuthForm";

const Auth = () => {
    return (
        <div className="authContainer">
            <img src={process.env.REACT_APP_LOGO} alt="posthere" />
            <AuthForm />
        </div>
    );
};

export default Auth;
