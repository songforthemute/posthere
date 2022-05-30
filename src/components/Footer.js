import React, { useState } from "react";

const Footer = () => {
    const [faq, setFaq] = useState(false);
    const toggleFaq = () => {
        setFaq((prev) => !prev);
    };

    const onRefresh = () => {
        window.location.reload();
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
            <div>Contact | {process.env.REACT_APP_CONTACT}</div>
            <div>
                <a href={process.env.REACT_APP_BLOG}>Blog | medium</a>
            </div>
        </footer>
    );
};

export default Footer;
