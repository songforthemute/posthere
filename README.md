# 0. Posthere

이 프로젝트는 '`Twitter`'에서 인스퍼레이션을 얻어 진행하게 되었습니다.

포스팅 기반의 Social Network Service Application을 목표로 계획했으며, 모바일 환경에 최적화되게끔 설계했습니다.

프로젝트 링크 : [https://songforthemute.github.io/posthere/]("https://songforthemute.github.io/posthere/")

미디엄 블로그 링크 : [https://medium.com/@songforthemute]("https://medium.com/@songforthemute")

---

## 목차

1. 기술 스택
2. 프로젝트 기능
3. 프로젝트 스크립트
4. 프로젝트 디자인

---

## 1. 기술 스택

-   Language : `HTML`, `CSS`, `JavaScript` (추후 TypeScript로 마이그레이션 예정)

-   Frontend : `React.js`

-   Backend : `Firebase`

-   Database : `Firebase` (Firestore)

-   Distribution : `gh-pages`

---

## 2. 프로젝트 기능

-   포스팅 실시간 렌더링 - 최신순으로 위에서부터 렌더링

-   기존 자신의 포스팅 수정 기능

-   기존 자신의 포스팅 삭제 기능

-   포스팅 이미지 첨부 & 업로드 기능

-   포스팅 좋아요 및 좋아요 취소, 좋아요 갯수 카운트 기능

-   포스팅한 사람과 포스팅 작성 시각 표시

-   로딩 페이지 구현

-   회원 가입 & 탈퇴 기능

-   로그인 & 로그아웃 기능

-   닉네임 실시간 업데이트 기능

-   프로필 사진 실시간 업데이트 기능

-   채널 개설 및 폐쇄, 채널 내 포스팅 필터링과 채널 관리자의 어드민 기능 (미구현, 추후 구현 예정)

---

## 3. 프로젝트 스크립트

### `npm start`

프로젝트를 개발 모드로 실행할 수 있습니다. [http://localhost:3000]("http://localhost:3000") 환경에서 실행되며, 기본 포트 넘버는 3000입니다.

### `npm build`

애플리케이션이 `build` 폴더에 빌드됩니다.

### `npm predeploy`

애플리케이션의 `gh-pages`를 이용한 배포를 하기 위한 사전 빌드 작업입니다. `npm run build`와 같습니다.

### `npm deploy`

`-d 디렉토리명` 폴더의 애플리케이션을 gh-pages를 통해 배포합니다. Github repository에서도 확인할 수 있습니다.

---

## 4. 프로젝트 디자인

### 아이덴티티 컬러

-   #FF6464
-   #171717

### 프로젝트 로고

![logoOG](https://user-images.githubusercontent.com/105373350/173884719-c5ff7148-a26e-45a8-a7e7-5257d5530c31.png)

### 기본 사용자 프로필 사진

![basicPhotoUrl](https://user-images.githubusercontent.com/105373350/173884713-51d65e55-9b98-49b1-8a1b-4db890487ad6.svg)

---

# 봐주셔서 감사합니다!
