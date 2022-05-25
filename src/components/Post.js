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
        <div>
            {isOwner && editMode ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edit your new post."
                            value={edited}
                            onChange={onChange}
                            required
                        />
                        <input type="submit" value="Update" />
                    </form>
                    <button onClick={toggleEditMode}>Cancel</button>
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
                        <>
                            <button onClick={onDeleteClick}>Delete</button>
                            <button onClick={toggleEditMode}>Edit</button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Post;
