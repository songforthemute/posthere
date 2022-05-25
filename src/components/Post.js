import React, { useState } from "react";
import { dbService, storageService } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Post = ({ postObj, isOwner }) => {
    const [editMode, setEditMode] = useState(false);
    const [edited, setEdited] = useState(postObj.text);

    const toggleEditMode = () => setEditMode((prev) => !prev);

    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setEdited(value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const postTextRef = doc(dbService, "posts", `${postObj.id}`);
        await updateDoc(postTextRef, { text: edited });
        setEditMode(false);
    };

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this?");
        if (ok) {
            await deleteDoc(doc(dbService, "posts", `${postObj.id}`));
            await deleteObject(ref(storageService, postObj.storageUrl));
        }
    };

    return (
        <div className="post">
            {isOwner && editMode ? (
                <>
                    <form onSubmit={onSubmit} className="container postEdit">
                        <input
                            type="text"
                            placeholder="Edit your new post."
                            value={edited}
                            onChange={onChange}
                            required
                            autoFocus
                            className="formInput"
                        />
                        <input
                            type="submit"
                            value="Update Post"
                            className="formBtn"
                        />
                    </form>
                    <span
                        onClick={toggleEditMode}
                        className="formBtn cancelBtn"
                    >
                        Cancel
                    </span>
                </>
            ) : (
                <>
                    <h4>{postObj.text}</h4>
                    {postObj.storageUrl && (
                        <img
                            src={postObj.storageUrl}
                            alt={
                                postObj.text > 20
                                    ? postObj.text.slice(0, 20)
                                    : postObj.text
                            }
                        />
                    )}
                    {isOwner && (
                        <div className="post__actions">
                            <span onClick={onDeleteClick}>Delete</span>
                            <span onClick={toggleEditMode}>Edit</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Post;
