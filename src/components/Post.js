import React, { useState } from "react";
import { dbService, storageService } from "../firebase";
import {
    doc,
    deleteDoc,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Post = ({ postObj, isOwner, userObj }) => {
    const [editMode, setEditMode] = useState(false);
    const [edited, setEdited] = useState(postObj.text);
    const [like, setLike] = useState(postObj.likeList.includes(userObj.uid));

    // 편집모드 토글 파트
    const toggleEditMode = () => setEditMode((prev) => !prev);

    // 좋아요 on
    const onLike = async () => {
        const postLikesRef = doc(dbService, "posts", `${postObj.id}`);
        await updateDoc(postLikesRef, {
            likeCount: increment(1),
            likeList: arrayUnion(userObj.uid),
        });
    };

    // 좋아요 off
    const onDislike = async () => {
        const postLikesRef = doc(dbService, "posts", `${postObj.id}`);
        await updateDoc(postLikesRef, {
            likeCount: increment(-1),
            likeList: arrayRemove(userObj.uid),
        });
    };

    // 좋아요 클릭 파트
    const toggleLike = () => {
        if (!like) onLike();
        else onDislike();
        setLike((prev) => !prev);
    };

    // 포스트 업데이트 input value 인식 파트
    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setEdited(value);
    };

    // 포스트 갱신 파트
    const onSubmit = async (e) => {
        e.preventDefault();
        const postTextRef = doc(dbService, "posts", `${postObj.id}`);
        await updateDoc(postTextRef, { text: edited });
        setEditMode(false);
    };

    // 포스트 삭제 파트
    const onDeleteClick = async () => {
        const ok = window.confirm("이 포스트를 정말 삭제할까요?");
        if (ok) {
            await deleteDoc(doc(dbService, "posts", `${postObj.id}`));
            if (postObj.storageUrl !== "") {
                await deleteObject(ref(storageService, postObj.storageUrl));
            }
        }
    };

    // 메타데이터 - 시간 표시
    const timeConversion = (t) => {
        const d = new Date(t).toLocaleString("ko-KR");
        return d.slice(0, -3);
    };

    // 사진 새 탭에서 열기 => 모달 폼에서 열기로 변경 예정
    const onFileClick = () => {
        // const {
        //     target: { currentSrc },
        // } = e;

        window.open(postObj.storageUrl, "_blank");
    };

    return (
        <div className="post">
            {isOwner && editMode ? (
                <>
                    {/* editMode true 일때  */}
                    <form onSubmit={onSubmit} className="container postEdit">
                        <input
                            type="text"
                            placeholder="새 포스트를 작성해주세요."
                            value={edited}
                            onChange={onChange}
                            required
                            autoFocus
                            className="formInput"
                        />
                        <input
                            type="submit"
                            value="포스트 업데이트"
                            className="formBtn"
                        />
                    </form>
                    <span
                        onClick={toggleEditMode}
                        className="formBtn cancelBtn"
                    >
                        돌아가기
                    </span>
                </>
            ) : (
                <>
                    {/* 포스트 */}
                    <h4>{postObj.text}</h4>
                    {/* {postObj.storageUrl && (
                        <img
                            className="post__file"
                            src={postObj.storageUrl}
                            alt={
                                postObj.text > 10
                                    ? postObj.text.slice(0, 10)
                                    : postObj.text
                            }
                            onClick={onFileClick}
                        />
                    )} */}
                    {/* 좋아요 기능 */}
                    <div className="post__like">
                        <span
                            className="material-symbols-outlined post__likeBtn"
                            onClick={toggleLike}
                            style={
                                like
                                    ? { color: "#6464ff" }
                                    : { color: "rgba(0,0,0,0.5)" }
                            }
                        >
                            favorite
                        </span>
                        <span className="post__likeCount">
                            {postObj.likeCount}
                        </span>
                    </div>
                    {/* 포스트 메타데이터 */}
                    <div className="post__meta">
                        <span className="post__meta__postedBy">
                            <span>posted by </span>
                            <img
                                src={postObj.creatorPhotoURL}
                                alt="profile"
                                className="post__meta__photo"
                            />{" "}
                            <span>{postObj.creatorDisplayName}, </span>
                            <span>{timeConversion(postObj.createdAt)}</span>
                        </span>
                    </div>
                    {/* 포스트 부가기능 - 삭제 & 수정 */}
                    <div className="post__actions">
                        {postObj.storageUrl && (
                            <span
                                onClick={onFileClick}
                                className="material-symbols-outlined post__img"
                                style={{ color: "#6464ff" }}
                            >
                                image
                            </span>
                        )}
                        {isOwner && (
                            <>
                                <span
                                    onClick={toggleEditMode}
                                    className="material-symbols-outlined"
                                >
                                    edit_note
                                </span>
                                <span
                                    onClick={onDeleteClick}
                                    className="material-symbols-outlined"
                                >
                                    delete_forever
                                </span>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Post;
