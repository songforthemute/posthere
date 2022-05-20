import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../firebase";

const Profile = () => {
    // const history = useHistory();
    // history.push("/home");
    // history.replace("/home");
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;
