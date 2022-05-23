import React, { useEffect, useState, useRef } from "react";
import { dbService, storageService } from "../firebase";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import Rweet from "../components/Rweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Home = ({ userObj }) => {
    const [rweet, setRweet] = useState("");
    const [rweets, setRweets] = useState([]); // setState에 함수를 전달하면 이전 값에 접근할 수 있음.
    const [fileUrl, setFileUrl] = useState("");

    // 포스트 리얼타임 렌더 파트
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

    // 폼 제출
    const onSubmit = async (e) => {
        e.preventDefault();
        let storageUrl = "";
        if (fileUrl !== "") {
            // 업로드된 파일이 존재한다면
            const fileRef = ref(storageService, `${userObj.uid}/${Date.now()}`);
            const res = await uploadString(fileRef, fileUrl, "data_url");
            storageUrl = await getDownloadURL(res.ref);
        }
        // try {
        await addDoc(collection(dbService, "rweets"), {
            text: rweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            storageUrl,
        });
        setRweet("");
        setFileUrl("");
        // } catch (error) {
        // console.warn(error);
        // }
    };

    // 폼 - 텍스트 감지
    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setRweet(value);
    };

    // 파일 & 파일 미리보기 클리어 파트
    const fileInput = useRef();
    const onClearFile = () => {
        fileInput.current.value = "";
        setFileUrl(null);
    };

    // 폼 - 파일 업로드 감지 파트 & 파일 용량제한 10MB
    const onFileChange = (e) => {
        const {
            target: { files },
        } = e;
        const file = files[0]; // 한 개 이상의 파일을 받을 수 있지만 input에서 하나의 파일만 받고있음.
        if (file.size > 10485760 / 11) {
            alert("File size exceeded. Please upload a file less then 10MB.");
            onClearFile();
        } else {
            const reader = new FileReader(); // from fileReader & file api by MDN
            reader.onloadend = (loaded) => {
                const {
                    currentTarget: { result },
                } = loaded;
                setFileUrl(result);
            };
            reader.readAsDataURL(file);
        }
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
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    ref={fileInput}
                />
                <input type="submit" value="Rweet" />
                {fileUrl && (
                    <div>
                        <img src={fileUrl} alt="Attached" />
                        <button onClick={onClearFile}>Clear</button>
                    </div>
                )}
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
