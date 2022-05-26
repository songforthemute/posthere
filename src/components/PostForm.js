import React, { useRef, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "../firebase";

const PostForm = ({ userObj }) => {
    const [post, setPost] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    // 폼 - 텍스트 감지
    const onChange = (e) => {
        const {
            target: { value },
        } = e;
        setPost(value);
    };

    // 폼 제출
    const onSubmit = async (e) => {
        if (post === "") return;

        e.preventDefault();
        let storageUrl = "";
        if (fileUrl !== "") {
            // 업로드된 파일이 존재한다면
            const fileRef = ref(storageService, `${userObj.uid}/${Date.now()}`);
            const res = await uploadString(fileRef, fileUrl, "data_url");
            storageUrl = await getDownloadURL(res.ref);
        }
        await addDoc(collection(dbService, "posts"), {
            text: post,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            storageUrl,
        });
        setPost("");
        setFileUrl("");
    };

    // 폼 - 파일 업로드 감지 파트 & 파일 용량제한 10MB
    const onFileChange = (e) => {
        const {
            target: { files },
        } = e;
        const file = files[0]; // 한 개 이상의 파일을 받을 수 있지만 input에서 하나의 파일만 받고있음.
        if (file.size > 10485760 / 11) {
            // 파일 클리어 했을때 콘솔에 에러 이슈 있음!!
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

    // 파일 & 파일 미리보기 클리어 파트
    const fileInput = useRef();
    const onClearFile = () => {
        fileInput.current.value = "";
        setFileUrl("");
    };

    return (
        <form onSubmit={onSubmit} className="postForm">
            <div className="postInput__container">
                <input
                    className="postInput__input"
                    type="text"
                    value={post}
                    onChange={onChange}
                    placeholder="지금 무슨 일이 벌어지고 있나요?"
                    maxLength={120}
                />
                <input
                    type="submit"
                    value="&rarr;"
                    className="postInput__arrow"
                />
            </div>
            <label htmlFor="attach-file" className="postInput__lable">
                <span>Add photos</span>
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                ref={fileInput}
                style={{ opacity: 0 }}
            />
            {fileUrl && (
                <div className="postForm__file">
                    <img
                        src={fileUrl}
                        alt="Attached"
                        style={{ backgroundImage: fileUrl }}
                    />
                    <div onClick={onClearFile} className="postForm__clear">
                        <span>Clear</span>
                    </div>
                </div>
            )}
        </form>
    );
};

export default PostForm;
