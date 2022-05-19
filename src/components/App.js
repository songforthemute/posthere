import React, { useState } from "react";
import Finder from "./Finder";
import { authService } from "../firebase";

function App() {
    // user | null
    const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

    return (
        <>
            <Finder isLoggedIn={isLoggedIn} />
            <footer>&copy; {new Date().getFullYear()} Rwitter</footer>
        </>
    );
}

export default App;
