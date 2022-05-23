import React, { useState } from "react";
import { dbService } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Rweet = ({ rweetObj, isOwner }) => {
    const [editMode, setEditMode] = useState(false);
    const [edited, setEdited] = useState(rweetObj.text);

    const toggleEditMode = () => setEditMode((prev) => !prev);

    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setEdited(value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const rweetTextRef = doc(dbService, "rweets", `${rweetObj.id}`);
        await updateDoc(rweetTextRef, { text: edited });
        setEditMode(false);
    };

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this?");
        if (ok) {
            const rweetTextRef = doc(dbService, "rweets", `${rweetObj.id}`);
            await deleteDoc(rweetTextRef);
        }
    };

    return (
        <div>
            {isOwner && editMode ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edit your new message."
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
                    <h4>{rweetObj.text}</h4>
                    <>
                        <button onClick={onDeleteClick}>Delete</button>
                        <button onClick={toggleEditMode}>Edit</button>
                    </>
                </>
            )}
        </div>
    );
};

export default Rweet;
