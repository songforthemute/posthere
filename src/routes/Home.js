import React, { useEffect, useState } from "react";
import { dbService } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Post from "../components/Post";
import PostForm from "../components/PostForm";

const Home = ({ userObj }) => {
    const [posts, setPosts] = useState([]); // setState에 함수를 전달하면 이전 값에 접근할 수 있음.

    // 포스트 리얼타임 렌더 파트
    useEffect(() => {
        // 쿼리 & getDocs를 이용하지 않고 snapshot을 이용하면 실시간 렌더 가능
        const q = query(
            collection(dbService, "posts"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const postArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(postArr);
        });
    }, []);

    return (
        <div className="container">
            <PostForm userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {posts.map((post) => (
                    <Post
                        key={post.id}
                        postObj={post}
                        isOwner={post.creatorId === userObj.uid}
                        uid={userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
