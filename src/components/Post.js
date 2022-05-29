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

const Post = ({ postObj, isOwner, uid }) => {
    const [editMode, setEditMode] = useState(false);
    const [edited, setEdited] = useState(postObj.text);
    const [like, setLike] = useState(postObj.likeList.includes(uid));

    const onLike = async () => {
        const postLikesRef = doc(dbService, "posts", `${postObj.id}`);
        await updateDoc(postLikesRef, {
            likeCount: increment(1),
            likeList: arrayUnion(uid),
        });
    };

    const onDislike = async () => {
        const postLikesRef = doc(dbService, "posts", `${postObj.id}`);
        await updateDoc(postLikesRef, {
            likeCount: increment(-1),
            likeList: arrayRemove(uid),
        });
    };

    // 좋아요 클릭 파트
    const toggleLike = () => {
        if (!like) onLike();
        else onDislike();
        setLike((prev) => !prev);
    };

    // 편집모드 토글 파트
    const toggleEditMode = () => setEditMode((prev) => !prev);

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

    // 사진 새 탭에서 열기 => 모달 폼에서 열기로 변경 예정
    const onFileClick = (e) => {
        const {
            target: { currentSrc },
        } = e;

        window.open(currentSrc, "_black");
    };

    return (
        <div className="post">
            {isOwner && editMode ? (
                <>
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
                    <h4>{postObj.text}</h4>
                    {postObj.storageUrl && (
                        <img
                            src={postObj.storageUrl}
                            alt={
                                postObj.text > 10
                                    ? postObj.text.slice(0, 10)
                                    : postObj.text
                            }
                            onClick={onFileClick}
                        />
                    )}
                    <div className="post__like">
                        <span
                            className="material-symbols-outlined post__likeBtn"
                            onClick={toggleLike}
                            style={
                                like
                                    ? { color: "#04aaff" }
                                    : { color: "rgba(0,0,0,0.5)" }
                            }
                        >
                            favorite
                        </span>
                        <span className="post__likeCount">
                            {postObj.likeCount}
                        </span>
                    </div>
                    {isOwner && (
                        <div className="post__actions">
                            <span
                                onClick={onDeleteClick}
                                className="material-symbols-outlined"
                            >
                                delete_forever
                            </span>
                            <span
                                onClick={toggleEditMode}
                                className="material-symbols-outlined"
                            >
                                edit_note
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Post;
