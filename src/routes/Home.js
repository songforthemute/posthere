import React, { useEffect, useState } from "react";
import { dbService } from "../firebase";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import Rweet from "../components/Rweet";

const Home = ({ userObj }) => {
    const [rweet, setRweet] = useState("");
    const [rweets, setRweets] = useState([]); // setState에 함수를 전달하면 이전 값에 접근할 수 있음.

    useEffect(() => {
        // 쿼리 & getDocs를 이용하지 않고 snapshot을 이용하면 실시간 렌더 가능
        const q = query(
            collection(dbService, "rweets"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const rweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRweets(rweetArr);
        });
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(dbService, "rweets"), {
                text: rweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
            });
            setRweet("");
        } catch (error) {
            console.warn(error);
        }
    };

    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setRweet(value);
    };

    // console.log(rweets);

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    value={rweet}
                    onChange={onChange}
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="Rweet" />
            </form>
            <div>
                {rweets.map((rweet) => (
                    <Rweet
                        key={rweet.id}
                        rweetObj={rweet}
                        isOwner={rweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
