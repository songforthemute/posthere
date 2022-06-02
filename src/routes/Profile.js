import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService, storageService } from "../firebase";
import {
    query,
    collection,
    where,
    onSnapshot,
    orderBy,
    updateDoc,
    doc,
} from "firebase/firestore";
import { updateProfile, signOut } from "firebase/auth";
import Post from "../components/Post";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const Profile = ({ refreshUser, userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [myPosts, setMyPosts] = useState([]);
    // const [userPhotoURL, setUserPhotoURL] = useState(userObj.photoURL)
    const [newPhotoURL, setNewPhotoURL] = useState(userObj.photoURL);
    const [showPhotoForm, setShowPhotoForm] = useState(false);

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

    // displayName 업데이트 제출 파트
    const onSubmit = async (e) => {
        e.preventDefault();

        if (userObj.displayName !== newDisplayName) {
            const ok = window.confirm(
                `변경하실 닉네임은 '${newDisplayName}' 입니다.\n맞습니까?`
            );
            if (ok) {
                await updateProfile(authService.currentUser, {
                    displayName: newDisplayName,
                });
                refreshUser(); // 닉네임 먼저 갱신 후,
                // 작성한 기존의 포스트들 닉네임 업데이트
                myPosts.map(async (myPost) => {
                    const postRef = doc(dbService, "posts", `${myPost.id}`);
                    await updateDoc(postRef, {
                        creatorDisplayName: newDisplayName,
                    });
                });
            }
        }
    };

    // 프로필 수정 폼 토글
    const togglePhoto = () => setShowPhotoForm((prev) => !prev);

    // 폼 - 파일 업로드 감지 파트 & 파일 용량제한 5MB
    const onChangePhoto = (e) => {
        const {
            target: { files },
        } = e;
        const file = files[0]; // 한 개 이상의 파일을 받을 수 있지만 input에서 하나의 파일만 받고있음.
        if (file && file.size > 10485760 / 2) {
            // 파일 클리어 했을때 콘솔에 에러 이슈 있음!!
            alert("5MB 이하의 파일만 업로드 가능합니다.");
            onClearPhoto();
        } else {
            const reader = new FileReader(); // from fileReader & file api by MDN
            reader.onloadend = (loaded) =>
                setNewPhotoURL(loaded.currentTarget.result);
            reader.readAsDataURL(file);
        }
    };

    // 프로필사진 업데이트
    const onUpdatePhoto = async () => {
        if (newPhotoURL !== userObj.photoURL) {
            const photoRef = ref(storageService, `${userObj.uid}/profile`);
            const res = await uploadString(photoRef, newPhotoURL, "data_url");
            const storagePhotoURL = await getDownloadURL(res.ref);

            // 프로필 정보 업데이트
            setNewPhotoURL(storagePhotoURL);
            await updateProfile(authService.currentUser, {
                photoURL: storagePhotoURL,
            });
            // refreshUser();
            // 작성한 기존의 포스트들 프로필사진 업데이트
            myPosts.map(async (myPost) => {
                const postRef = doc(dbService, "posts", `${myPost.id}`);
                await updateDoc(postRef, {
                    creatorPhotoURL: storagePhotoURL,
                });
            });
        }
    };

    // 프로필사진 원본으로 클리어 파트
    const onClearPhoto = () => {
        setNewPhotoURL(userObj.photoURL);
        togglePhoto();
    };

    // logout시, redirect 파트
    const navigate = useNavigate();
    const onLogOutClick = () => {
        signOut(authService);
        navigate("/", { replace: true });
    };

    return (
        <div className="container">
            {/* 프로필 닉네임 업데이트 폼 */}
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
            {/* 프로필사진 업데이트 on & off */}
            {!showPhotoForm && (
                <div
                    className="formBtn profileForm__show"
                    onClick={togglePhoto}
                >
                    프로필 사진 업데이트
                </div>
            )}
            {/* 프로필사진 업데이트 폼 */}
            {showPhotoForm && (
                <div className="profileForm">
                    <input
                        id="attach-file"
                        type="file"
                        accept="image/*"
                        onChange={onChangePhoto}
                        style={{ opacity: 0 }}
                    />
                    <div className="profileForm__file">
                        <img
                            src={newPhotoURL}
                            alt="profile"
                            style={{ backgroundImage: newPhotoURL }}
                        />
                        <label
                            htmlFor="attach-file"
                            className="profileForm__lable"
                        >
                            <span>프로필 사진 업로드</span>
                        </label>
                        <div
                            onClick={onUpdatePhoto}
                            className="profileForm__lable"
                        >
                            <span>업데이트하기</span>
                        </div>
                        <div
                            onClick={onClearPhoto}
                            className="profileForm__lable"
                        >
                            <span>취소</span>
                        </div>
                    </div>
                </div>
            )}
            <hr
                style={{
                    width: "100%",
                    border: "0.1px solid #ffffff",
                    marginTop: 15,
                }}
            />
            {/* 내 포스트 */}
            <div style={{ marginTop: 30 }}>
                {myPosts.map((post) => (
                    <Post
                        key={post.id}
                        postObj={post}
                        isOwner={true}
                        userObj={userObj}
                    />
                ))}
            </div>
            <span className="formBtn logOut" onClick={onLogOutClick}>
                로그아웃
            </span>
        </div>
    );
};

export default Profile;
