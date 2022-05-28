import React from "react";
import { Link } from "react-router-dom";

const Navi = ({ userObj }) => {
    return (
        <nav>
            <ul className="navi">
                <li>
                    <Link to="/" className="homeBtn">
                        <span className="material-symbols-outlined">home</span>
                    </Link>
                </li>
                <li>
                    <Link to="/profile" className="profileBtn">
                        <span className="material-symbols-outlined">
                            account_circle
                        </span>
                        <span>{userObj.displayName}의 프로필</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navi;
