# 🎵 ConcertHub - 콘서트 예약 시스템

<div align="center">

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.12-0055FF?style=for-the-badge&logo=framer&logoColor=white)

**🎤 음악과 함께하는 특별한 순간을 예약하세요 🎤**

[데모 보기](#-주요-기능) • [설치 가이드](#-설치-및-실행) • [API 문서](#-api-연동) • [기여하기](#-기여하기)

</div>

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행](#-설치-및-실행)
- [API 연동](#-api-연동)
- [주요 컴포넌트](#-주요-컴포넌트)
- [스크린샷](#-스크린샷)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 소개

**ConcertHub**는 콘서트 예약을 위한 현대적이고 직관적인 웹 애플리케이션입니다. 
사용자들이 쉽게 콘서트를 검색하고, 좌석을 선택하며, 예약을 관리할 수 있는 완전한 솔루션을 제공합니다.

### ✨ 핵심 가치
- **🎨 아름다운 UI/UX**: Framer Motion과 Tailwind CSS로 구현된 매끄러운 애니메이션
- **📱 반응형 디자인**: 모든 디바이스에서 완벽한 사용자 경험
- **🔐 안전한 인증**: JWT 기반의 보안 시스템
- **⚡ 빠른 성능**: Vite 기반의 최적화된 빌드 시스템

---

## 🚀 주요 기능

### 👤 사용자 관리
- **회원가입 & 로그인**
  - 실시간 이메일/전화번호 중복 검증
  - 비밀번호 강도 검사
  - JWT 기반 인증 시스템
- **프로필 관리**
  - 개인정보 수정
  - 예약 내역 조회

### 🎵 콘서트 관리
- **콘서트 목록 조회**
  - 카드 형태의 직관적인 UI
  - 검색 및 필터링 기능
- **콘서트 상세 정보**
  - 공연 정보 및 좌석 배치도
  - 실시간 좌석 예약 현황

### 🎫 예약 시스템
- **좌석 선택**
  - 인터랙티브한 좌석 선택 UI
  - 실시간 좌석 상태 확인
  - 등급별 가격 정보
- **예약 관리**
  - 예약 생성/취소
  - 예약 내역 조회
  - 상태별 필터링

### 🎨 UI/UX 특징
- **다크/라이트 테마** 지원
- **부드러운 애니메이션** (Framer Motion)
- **반응형 디자인** (모바일 최적화)
- **직관적인 네비게이션**

---

## 🛠 기술 스택

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| **React** | 19.1.0 | UI 라이브러리 |
| **Vite** | 7.0.4 | 빌드 도구 |
| **React Router** | 7.7.0 | 라우팅 |
| **Tailwind CSS** | 3.4.17 | 스타일링 |
| **Framer Motion** | 12.23.12 | 애니메이션 |
| **Axios** | 1.10.0 | HTTP 클라이언트 |
| **Lucide React** | 0.534.0 | 아이콘 |

### Development Tools
- **ESLint** - 코드 품질 관리
- **PostCSS** - CSS 후처리
- **Autoprefixer** - 브라우저 호환성

---

## 📁 프로젝트 구조

```
src/
├── 📁 components/          # React 컴포넌트
│   ├── 📁 ui/             # 재사용 가능한 UI 컴포넌트
│   ├── 🎵 ConcertCard.jsx  # 콘서트 카드 컴포넌트
│   ├── 🎵 ConcertDetail.jsx # 콘서트 상세 페이지
│   ├── 🎵 ConcertList.jsx  # 콘서트 목록 페이지
│   ├── 🏠 Home.jsx         # 홈 페이지
│   ├── 🔐 Login.jsx        # 로그인 페이지
│   ├── 📝 Register.jsx     # 회원가입 페이지
│   ├── 🎫 ReservationCreate.jsx # 예약 생성 페이지
│   ├── 📋 ReservationList.jsx   # 예약 목록 페이지
│   ├── 👤 UserProfile.jsx  # 사용자 프로필 페이지
│   └── 🧭 Navbar.jsx       # 네비게이션 바
├── 📁 contexts/           # React Context
│   ├── 🔐 AuthContext.jsx  # 인증 상태 관리
│   └── 🎨 ThemeContext.jsx # 테마 상태 관리
├── 📁 services/           # API 서비스
│   └── 🌐 api.js          # API 호출 함수들
├── 📁 assets/             # 정적 자원
├── 🎨 App.css             # 전역 스타일
├── ⚛️ App.jsx             # 메인 앱 컴포넌트
├── 🎨 index.css           # 기본 스타일
└── 🚀 main.jsx            # 앱 진입점
```

---

## 🔧 설치 및 실행

### 사전 요구사항
- **Node.js** 18.0.0 이상
- **npm** 또는 **yarn**
- **백엔드 서버** (Spring Boot) 실행 중

### 1️⃣ 저장소 클론
```bash
git clone https://github.com/your-username/concerthub-frontend.git
cd concerthub-frontend
```

### 2️⃣ 의존성 설치
```bash
npm install
# 또는
yarn install
```

### 3️⃣ 환경 설정
백엔드 서버가 `http://localhost:8080`에서 실행되고 있는지 확인하세요.

### 4️⃣ 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

### 5️⃣ 빌드 (프로덕션)
```bash
npm run build
# 또는
yarn build
```

### 6️⃣ 빌드 미리보기
```bash
npm run preview
# 또는
yarn preview
```

---

## 🌐 API 연동

### 백엔드 서버 설정
- **Base URL**: `http://localhost:8080`
- **인증 방식**: JWT (httpOnly 쿠키)
- **CORS**: 활성화 필요

### 주요 API 엔드포인트

#### 🔐 인증 관련
```javascript
POST /auth/api/v1/login          # 로그인
POST /auth/api/v1/register       # 회원가입
POST /auth/api/v1/logout         # 로그아웃
POST /auth/api/v1/email/valid    # 이메일 중복 검증
POST /auth/api/v1/phone/valid    # 전화번호 중복 검증
```

#### 👤 사용자 관련
```javascript
GET  /user/api/v1/me             # 내 정보 조회
GET  /user/api/v1/profile        # 프로필 조회
PUT  /user/api/v1/profile        # 프로필 수정
```

#### 🎵 콘서트 관련
```javascript
GET  /reserve/api/concerts/all           # 콘서트 목록 조회
GET  /reserve/api/concerts/detail/{id}   # 콘서트 상세 조회
```

#### 🎫 예약 관련
```javascript
POST /reserve/api/reservations/create    # 예약 생성
GET  /reserve/api/reservations/mine      # 내 예약 목록
PUT  /reserve/api/reservations/cancel/{id} # 예약 취소
DELETE /reserve/api/reservations/{id}    # 예약 삭제
```

---

## 🧩 주요 컴포넌트

### 🎨 UI 컴포넌트 (`src/components/ui/`)
- **Button**: 다양한 스타일의 버튼 컴포넌트
- **Input**: 폼 입력 컴포넌트
- **Card**: 카드 레이아웃 컴포넌트
- **Modal**: 모달 다이얼로그 컴포넌트
- **Badge**: 상태 표시 배지 컴포넌트
- **LoadingSpinner**: 로딩 스피너 컴포넌트

### 🔐 인증 시스템
- **AuthContext**: 전역 인증 상태 관리
- **Login/Register**: 로그인/회원가입 폼
- **실시간 검증**: 이메일/전화번호 중복 검사

### 🎵 콘서트 시스템
- **ConcertList**: 콘서트 목록 (검색/필터링)
- **ConcertDetail**: 상세 정보 및 좌석 선택
- **좌석 선택**: 인터랙티브 좌석 UI

### 🎫 예약 시스템
- **ReservationCreate**: 예약 생성 플로우
- **ReservationList**: 예약 관리 대시보드
- **상태 관리**: 예약 상태별 필터링

---

## 📱 스크린샷

### 🏠 홈 페이지
```
┌─────────────────────────────────────┐
│  🎵 ConcertHub                      │
│  ────────────────────────────────   │
│  🎤 음악과 함께하는 특별한 순간      │
│                                     │
│  [🎫 콘서트 둘러보기]               │
└─────────────────────────────────────┘
```

### 🎵 콘서트 목록
```
┌─────────────────────────────────────┐
│  🔍 [검색창]              [필터]    │
│  ────────────────────────────────   │
│  📅 BTS 월드투어    ⭐ VIP석 150,000원│
│  📍 올림픽공원      🎫 [예약하기]    │
│  ────────────────────────────────   │
│  📅 아이유 콘서트   ⭐ R석 120,000원 │
│  📍 KSPO DOME      🎫 [예약하기]    │
└─────────────────────────────────────┘
```

### 🎫 좌석 선택
```
┌─────────────────────────────────────┐
│  🎤 BTS 월드투어 - 좌석 선택        │
│  ────────────────────────────────   │
│      🟢🟢🟢 VIP석 (150,000원)      │
│    🟢🟢🟢🟢🟢 R석 (100,000원)     │
│  🟢🟢🟢🟢🟢🟢🟢 S석 (70,000원)    │
│                                     │
│  🟢 예약가능 🔵 선택됨 🔴 예약완료   │
│  [🎫 선택한 좌석으로 예약하기]       │
└─────────────────────────────────────┘
```

---

## 🤝 기여하기

프로젝트에 기여해주셔서 감사합니다! 다음 단계를 따라주세요:

### 1️⃣ 이슈 확인
- [Issues](https://github.com/your-username/concerthub-frontend/issues)에서 기존 이슈를 확인하세요
- 새로운 기능이나 버그를 발견하면 이슈를 생성해주세요

### 2️⃣ 포크 및 브랜치 생성
```bash
git fork https://github.com/your-username/concerthub-frontend.git
git checkout -b feature/새로운-기능
```

### 3️⃣ 개발 및 테스트
```bash
npm run dev    # 개발 서버 실행
npm run lint   # 코드 품질 검사
npm run build  # 빌드 테스트
```

### 4️⃣ 커밋 및 푸시
```bash
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin feature/새로운-기능
```

### 5️⃣ Pull Request 생성
- 명확한 제목과 설명을 작성해주세요
- 변경사항과 테스트 결과를 포함해주세요

---

## 📄 라이선스

이 프로젝트는 개인 프로젝트 입니다.

---

## 👥 팀

<div align="center">

**🎵 ConcertHub 개발팀**

| 역할 | 담당자 | 연락처 |
|------|--------|--------|
| 🎨 Frontend | [@YeongBee](https://github.com/YeongBee) | cyeongbb@gmail.com |
| 🔧 Backend | [@YeongBee](https://github.com/YeongBee) | cyeongbb@gmail.com |
| 🎨 UI/UX | [@YeongBee](https://github.com/YeongBee) | cyeongbb@gmail.com |

</div>

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 라이브러리들의 도움으로 만들어졌습니다:

- [React](https://reactjs.org/) - UI 라이브러리
- [Vite](https://vitejs.dev/) - 빌드 도구
- [Tailwind CSS](https://tailwindcss.com/) - CSS 프레임워크
- [Framer Motion](https://www.framer.com/motion/) - 애니메이션 라이브러리
- [Lucide](https://lucide.dev/) - 아이콘 라이브러리

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! ⭐**

[🔝 맨 위로 돌아가기](#-concerthub---콘서트-예약-시스템)

</div>
