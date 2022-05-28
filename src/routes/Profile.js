import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "../firebase";
import {
    query,
    collection,
    where,
    onSnapshot,
    orderBy,
} from "firebase/firestore";
import { updateProfile, signOut } from "firebase/auth";
import Post from "../components/Post";

const Profile = ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [myPosts, setMyPosts] = useState([]);

    // 내 포스트 가져오기
    useEffect(() => {
        const q = query(
            collection(dbService, "posts"),
            where("creatorId", "==", `${userObj.uid}`),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const myPostArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMyPosts(myPostArr);
        });
    }, [myPosts, userObj]);

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
                    placeholder="어떻게 보이고 싶나요?"
                    value={newDisplayName}
                    onChange={onChange}
                    autoFocus
                />
                <input
                    type="submit"
                    value="닉네임 업데이트"
                    className="formBtn"
                    style={{ marginTop: 15 }}
                />
            </form>
            <div style={{ marginTop: 30 }}>
                {myPosts.map((post) => (
                    <Post key={post.id} postObj={post} isOwner={true} />
                ))}
            </div>
            <span className="formBtn logOut" onClick={onLogOutClick}>
                로그아웃
            </span>
        </div>
    );
};

export default Profile;
