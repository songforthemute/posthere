import React, { useEffect, useState } from "react";
import Finder from "./Finder";
import { authService } from "../firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import Footer from "./Footer";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);

    // displayName === null 해결 파트
    const displayNameGenerator = (email) => {
        const idLocation = email.indexOf("@");
        return email.slice(0, idLocation);
    };

    // 유저 인증 파트
    useEffect(() => {
        onAuthStateChanged(authService, (user) => {
            if (user) {
                // social이 아닌 local login시 null 문제 해결 - 기본 email id로 설정.
                if (user.displayName === null)
                    updateProfile(user, {
                        displayName: displayNameGenerator(user.email),
                    });
                if (!user.photoURL)
                    updateProfile(user, {
                        photoURL: process.env.REACT_APP_PHOTO_URL,
                    });
                setUserObj({
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    update: () =>
                        updateProfile(user, {
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                        }),
                });
            } else {
                setUserObj(null);
            }
            setInit(true);
        });
    }, []);

    const refreshUser = () => {
        // react의 re-rendering은 너무 방대한 object를 rendering하기 어려워함.
        const user = authService.currentUser;
        setUserObj({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            update: () =>
                updateProfile(user, {
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }),
        });
    };

    return (
        <>
            {init ? (
                <Finder
                    isLoggedIn={Boolean(authService.currentUser)}
                    userObj={userObj}
                    refreshUser={refreshUser}
                />
            ) : (
                <div className="main loading">Initializing...</div>
            )}
            <Footer />
        </>
    );
}

export default App;
