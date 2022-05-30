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
            <div className="main">
                <Routes>
                    {isLoggedIn ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <Route exact path="/" element={<Auth />} />
                        </>
                    )}
                </Routes>
            </div>
        </HashRouter>
    );
};

export default Finder;
