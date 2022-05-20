import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navi from "./Navi";
// Switch => Routes

const Finder = ({ isLoggedIn }) => {
    return (
        <HashRouter>
            {isLoggedIn && <Navi />}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/profile" element={<Profile />} />
                    </>
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
