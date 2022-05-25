import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "../firebase";
import { query, collection, where, getDocs, orderBy } from "firebase/firestore";
import { updateProfile, signOut } from "firebase/auth";

const Profile = ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    // 내 포스트 가져오기
    const getMyPosts = async () => {
        const q = query(
            collection(dbService, "posts"),
            where("creatorId", "==", `${userObj.uid}`),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
        });
    };

    useEffect(() => {
        getMyPosts();
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
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {
                displayName: newDisplayName,
            });
            refreshUser();
        }
    };

    // logout시, redirect 파트
    const navigate = useNavigate();
    const onLogOutClick = () => {
        signOut(authService);
        navigate("/", { replace: true });
    };

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    className="formInput"
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName}
                    onChange={onChange}
                    autoFocus
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{ marginTop: 10 }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};

export default Profile;
