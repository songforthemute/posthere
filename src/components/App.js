import React, { useEffect, useState } from "react";
import Finder from "./Finder";
import { authService } from "../firebase";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);

    // displayName === null 해결 파트
    const displayNameGenerator = (email) => {
        const idLocation = email.indexOf("@");
        return email.slice(0, idLocation);
    };

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) setUserObj(user);
            // social이 아닌 local login시 null 문제 해결
            if (user && user.displayName === null)
                setUserObj({
                    ...user,
                    displayName: displayNameGenerator(user.email),
                });
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
