import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "../firebase";
import { query, collection, where, getDocs, orderBy } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Profile = ({ userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    // 내 포스트 가져오기
    const getMyRweets = async () => {
        const q = query(
            collection(dbService, "rweets"),
            where("creatorId", "==", `${userObj.uid}`),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
        });
    };

    useEffect(() => {
        getMyRweets();
    }, [userObj]);

    // displayName 변경 파트
    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setNewDisplayName(value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (userObj.displayName !== newDisplayName)
            await updateProfile(userObj, { displayName: newDisplayName });
    };

    // logout시, redirect 파트
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName}
                    onChange={onChange}
                />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;
