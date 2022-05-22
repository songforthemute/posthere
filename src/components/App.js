import React, { useEffect, useState } from "react";
import Finder from "./Finder";
import { authService } from "../firebase";

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // user | null
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
                setUserObj(user);
            } else setIsLoggedIn(false);
            setInit(true);
        });
    }, []);

    return (
        <>
            {init ? (
                <Finder isLoggedIn={isLoggedIn} userObj={userObj} />
            ) : (
                "Initializing..."
            )}
            <footer>&copy; {new Date().getFullYear()} Rwitter</footer>
        </>
    );
}

export default App;
