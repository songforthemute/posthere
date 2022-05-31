import React, { useState } from "react";
import { authService } from "../firebase";
import { deleteUser, signOut } from "firebase/auth";

const Footer = ({ uid }) => {
    const [faq, setFaq] = useState(false);
    const [withdraw, setWithdraw] = useState(false);

    // faq on & off 토글 파트
    const toggleFaq = () => setFaq((prev) => !prev);
    // faq 클릭시 새로고침
    const onRefresh = () => window.location.reload();

    // 회원탈퇴 on & off 토글 파트
    const toggleWithdraw = () => setWithdraw((prev) => !prev);
    // 회원탈퇴 기능
    const onWithdraw = async () => {
        const ok = window.confirm(
            "정말 탈퇴하시겠습니까?\n탈퇴 시 기존에 작성했던 포스트는 삭제할 수 없습니다."
        );
        if (ok) {
            alert("그동안 서비스를 이용해주셔서 감사합니다.");
            deleteUser(authService.currentUser);
            signOut(authService);
            window.location.href = "/";
        } else {
            toggleWithdraw();
        }
    };

    return (
        <footer className="footer">
            <div>&copy; {new Date().getFullYear()} Posthere.</div>
            <div className="footer__faq footer__faqBtn" onClick={toggleFaq}>
                FAQ | 느리거나 잘 작동하지 않아요.
            </div>
            {faq && (
                <div className="footer__faqContent">
                    <div className="footer__faqBtn" onClick={onRefresh}>
                        서버에 문제가 있거나, 트래픽 혹은 대역폭에 문제가 생겨
                        느려질 수 있습니다. 여기를 누르시거나 페이지를 새로고침
                        후 다시 시도해주세요.
                    </div>
                    <div className="footer__faqBtn" onClick={toggleFaq}>
                        - 닫기 -
                    </div>
                </div>
            )}
            <div
                className="footer__faq footer__faqBtn"
                onClick={toggleWithdraw}
            >
                FAQ | 서비스를 그만 이용하고 싶어요.
            </div>
            {withdraw && (
                <div className="footer__faqContent">
                    <div>
                        탈퇴 이후에는 이미 작성한 포스트는 삭제할 수 없으며,
                        <br />
                        계정의 정보가 전부 삭제됩니다.
                        <br />
                        정말 탈퇴하시겠습니까?
                    </div>
                    <div className="footer__faqBtn" onClick={onWithdraw}>
                        네. 탈퇴할래요.
                    </div>
                    <div className="footer__faqBtn" onClick={toggleWithdraw}>
                        조금 더 생각해볼래요.
                    </div>
                </div>
            )}
            <div>Contact | {process.env.REACT_APP_CONTACT}</div>
            <div>
                <a href={process.env.REACT_APP_BLOG}>Blog | medium</a>
            </div>
        </footer>
    );
};

export default Footer;
