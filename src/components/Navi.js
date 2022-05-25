import React from "react";
import { Link } from "react-router-dom";

const Navi = ({ userObj }) => {
    return (
        <nav>
            <ul
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 50,
                }}
            >
                <li>
                    <Link to="/" style={{ marginRight: 10 }}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/profile"
                        style={{
                            marginLeft: 10,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            fontSize: 12,
                        }}
                    >
                        <span style={{ marginTop: 10 }}>
                            {userObj.displayName}의 Profile
                        </span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navi;
