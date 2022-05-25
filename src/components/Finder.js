import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navi from "./Navi";
// react-router v6: Switch => Routes

const Finder = ({ refreshUser, isLoggedIn, userObj }) => {
    return (
        <HashRouter>
            {isLoggedIn && <Navi userObj={userObj} />}
            <Routes>
                {isLoggedIn ? (
                    <div
                        style={{
                            maxWidth: 890,
                            width: "100%",
                            margin: "0 auto",
                            marginTop: 80,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Route
                            exact
                            path="/"
                            element={<Home userObj={userObj} />}
                        />
                        <Route
                            exact
                            path="/profile"
                            element={
                                <Profile
                                    refreshUser={refreshUser}
                                    userObj={userObj}
                                />
                            }
                        />
                    </div>
                ) : (
                    <>
                        <Route exact path="/" element={<Auth />} />
                    </>
                )}
            </Routes>
        </HashRouter>
    );
};

export default Finder;
