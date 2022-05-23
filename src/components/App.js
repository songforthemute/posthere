import React, { useEffect, useState } from "react";
import Finder from "./Finder";
import { authService } from "../firebase";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) setUserObj(user);
            setInit(true);
        });
    }, []);

    return (
        <>
            {init ? (
                <Finder isLoggedIn={Boolean(userObj)} userObj={userObj} />
            ) : (
                "Initializing..."
            )}
            <footer>&copy; {new Date().getFullYear()} Rwitter</footer>
        </>
    );
}

export default App;
