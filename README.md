# 잡코리아 빌보드 - 프리랜서 매칭 플랫폼

프리랜서와 프로젝트를 연결하는 현대적이고 매력적인 매칭 플랫폼입니다. 사용자 친화적인 인터페이스와 다양한 인터랙티브 요소를 통해 최적의 사용자 경험을 제공합니다.

![잡코리아 빌보드](https://via.placeholder.com/1200x630/3b82f6/FFFFFF?text=잡코리아+빌보드)

## 📋 프로젝트 개요

본 프로젝트는 Next.js, React, TypeScript를 기반으로 구축된 SPA(Single Page Application)입니다. 프리랜서와 기업이 쉽게 만날 수 있도록 설계되었으며, 다양한 카테고리의 프로젝트와 검증된 프리랜서를 제공합니다.

## 🛠 기술 스택

- **프레임워크**: Next.js 14
- **언어**: TypeScript
- **UI/스타일링**: Tailwind CSS
- **상태 관리**: React Hooks
- **애니메이션**: Framer Motion
- **인증**: 로컬 스토리지 기반 간단한 인증

## ✨ 주요 기능

- **인터랙티브 UI**: 모던한 디자인과 애니메이션으로 사용자 경험 향상
- **3D 회전 캐러셀**: 히어로 섹션에서 주요 프로젝트를 시각적으로 효과적인 방법으로 표시
- **글래스모피즘 효과**: 최신 디자인 트렌드를 반영한 UI 요소
- **로그인/회원가입**: 사용자 인증 기능
- **검색 기능**: 프로젝트 및 프리랜서 검색
- **카테고리 탐색**: 다양한 분야별 프로젝트 브라우징 기능
- **로딩 애니메이션**: 페이지 전환 시 부드러운 로딩 상태 제공

## 📁 프로젝트 구조

```
/
├── public/               # 정적 파일 (이미지 등)
│   └── images/           # 이미지 파일 저장소
├── src/                  # 소스 코드
│   ├── app/              # Next.js 앱 디렉토리
│   │   ├── page.tsx      # 메인 페이지 컴포넌트
│   │   ├── layout.tsx    # 앱 레이아웃
│   │   ├── register/     # 회원가입 페이지
│   │   │   └── page.tsx  # 회원가입 페이지 컴포넌트
│   │   ├── login/        # 로그인 페이지
│   │   │   └── page.tsx  # 로그인 페이지 컴포넌트
│   │   ├── freelancer/   # 프리랜서 관련 페이지
│   │   │   ├── page.tsx  # 프리랜서 목록 페이지
│   │   │   └── [id]/     # 프리랜서 상세 페이지
│   │   │       └── page.tsx
│   │   ├── project/      # 프로젝트 관련 페이지
│   │   │   ├── page.tsx  # 프로젝트 목록 페이지
│   │   │   └── [id]/     # 프로젝트 상세 페이지
│   │   │       └── page.tsx
│   │   ├── search/       # 검색 결과 페이지
│   │   │   └── page.tsx
│   │   └── categories/   # 카테고리 목록 페이지
│   │       ├── page.tsx
│   │       └── [id]/     # 카테고리별 상세 페이지
│   │           └── page.tsx
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── common/       # 공통 UI 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Input.tsx
│   │   ├── layout/       # 레이아웃 관련 컴포넌트
│   │   │   ├── Header.tsx     # 헤더 컴포넌트
│   │   │   ├── Bottom.tsx     # 푸터 컴포넌트
│   │   │   └── Loading.tsx    # 로딩 컴포넌트
│   │   ├── home/         # 홈페이지 전용 컴포넌트
│   │   │   ├── HeroCarousel.tsx   # 히어로 섹션 캐러셀
│   │   │   ├── CategorySection.tsx # 카테고리 섹션
│   │   │   └── TestimonialCard.tsx # 후기 카드
│   │   ├── freelancer/   # 프리랜서 관련 컴포넌트
│   │   │   ├── FreelancerCard.tsx
│   │   │   └── FreelancerProfile.tsx
│   │   └── project/      # 프로젝트 관련 컴포넌트
│   │       ├── ProjectCard.tsx
│   │       └── ProjectDetail.tsx
│   ├── lib/              # 서드파티 라이브러리 설정 및 확장
│   │   ├── framer-motion.ts  # Framer Motion 설정
│   │   └── tailwind.ts       # Tailwind 유틸리티 설정
│   ├── services/         # 외부 API 통신 및 비즈니스 로직
│   │   ├── api.ts        # API 클라이언트 설정
│   │   ├── freelancer.ts # 프리랜서 관련 API 호출
│   │   ├── project.ts    # 프로젝트 관련 API 호출
│   │   ├── category.ts   # 카테고리 관련 API 호출
│   │   └── auth.ts       # 인증 관련 API 호출
│   ├── store/            # 상태 관리
│   │   ├── auth/         # 인증 관련 상태
│   │   │   ├── atoms.ts  # 인증 상태 atoms
│   │   │   └── hooks.ts  # 인증 커스텀 훅
│   │   ├── loading/      # 로딩 상태 관리
│   │   │   ├── atoms.ts  # 로딩 상태 atoms
│   │   │   └── hooks.ts  # 로딩 관련 커스텀 훅
│   │   └── index.ts      # 스토어 설정 및 내보내기
│   ├── types/            # 타입 정의
│   │   ├── freelancer.ts # 프리랜서 관련 타입
│   │   ├── project.ts    # 프로젝트 관련 타입
│   │   ├── category.ts   # 카테고리 관련 타입
│   │   ├── auth.ts       # 인증 관련 타입
│   │   └── index.ts      # 공통 타입 및 내보내기
│   └── utils/            # 유틸리티 함수
│       ├── formatting.ts # 데이터 포맷팅 함수
│       ├── validation.ts # 유효성 검사 함수
│       ├── storage.ts    # 로컬 스토리지 관련 함수
│       ├── animations.ts # 애니메이션 관련 유틸리티
│       └── helpers.ts    # 기타 헬퍼 함수
├── tailwind.config.js    # Tailwind CSS 설정
├── tsconfig.json         # TypeScript 설정
└── package.json          # 프로젝트 의존성 및 스크립트
```

각 디렉토리 및 파일의 역할:

### src/app
Next.js 13+ 앱 라우터 방식으로 각 페이지가 구성되어 있습니다. 각 폴더는 라우트를 나타내며, 해당 폴더 내의 `page.tsx` 파일이 해당 라우트의 페이지 컴포넌트입니다.

### src/components
재사용 가능한 UI 컴포넌트들을 담고 있습니다. 기능과 관심사에 따라 하위 폴더로 구분되어 있습니다.
- **common**: 범용적으로 사용되는 버튼, 카드 등의 기본 UI 컴포넌트
- **layout**: 페이지 레이아웃을 구성하는 헤더, 푸터 등의 컴포넌트
- **home/freelancer/project**: 각 섹션별 전용 컴포넌트

### src/lib
서드파티 라이브러리 설정 및 확장 코드를 포함합니다. Framer Motion, Tailwind CSS 같은 라이브러리의 커스텀 설정이 여기에 위치합니다.

### src/services
외부 API와의 통신을 담당하는 서비스 레이어입니다. 각 도메인별로 구분되어 있어 API 호출 및 데이터 처리 로직을 캡슐화합니다.

### src/store
애플리케이션의 상태 관리 로직을 담당합니다. 인증, 로딩 상태 등 전역적으로 사용되는 상태들이 여기에서 관리됩니다.

### src/types
TypeScript 타입 정의 파일들을 포함합니다. 도메인별로 구분되어 있어 각 영역에서 사용되는 인터페이스와 타입이 명확하게 정의되어 있습니다.

### src/utils
애플리케이션 전반에서 사용되는 유틸리티 함수들을 포함합니다. 데이터 포맷팅, 유효성 검사, 로컬 스토리지 접근 등의 기능을 제공합니다.

## 🚀 설치 및 실행 방법

```bash
# 저장소 복제
git clone [저장소 URL]

# 프로젝트 디렉토리로 이동
cd aiproject02

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버는 기본적으로 http://localhost:3000 에서 실행됩니다.

## 📝 주요 변경 사항

### 히어로 섹션
- 3D 회전 캐러셀 구현 (5개의 프로젝트 카드)
- 회전 효과, 깊이감 및 그라데이션 효과 적용
- 자동 회전 및 사용자 컨트롤 기능 추가

### 주요 카테고리 섹션
- 모던한 디자인과 인터랙티브 요소 업데이트
- 글래스모피즘 효과 추가
- 호버 시 3D 효과 및 애니메이션
- 카테고리별 아이콘 추가
- 전체보기 버튼 추가

### CTA(회원가입/로그인) 섹션
- 로그인 상태에 따른 조건부 렌더링 구현
- 로컬 스토리지 기반의 간단한 인증 상태 관리

### 페이지 전환 및 인터랙션
- 페이지 이동 시 로딩 상태 관리
- 메뉴 링크 클릭 시 로딩 컴포넌트 활성화

## 🔧 기능 구현 방법

### 로그인 상태 관리
```typescript
// 로컬 스토리지를 사용한 간단한 인증 상태 확인
useEffect(() => {
  const token = localStorage.getItem('auth_token');
  setIsLoggedIn(!!token);
}, []);
```

### 3D 회전 캐러셀
```typescript
// 각 카드의 위치와 회전을 계산하여 3D 공간에 배치
const isActive = index === activeCardIndex;
const isPrev = index === (activeCardIndex === 0 ? heroProjects.length - 1 : activeCardIndex - 1);
// ... 위치 및 변환 계산 로직 ...
```

### 페이지 이동 시 로딩 처리
```typescript
const navigateTo = (href: string) => {
  setLoading(true);
  window.location.href = href;
  
  setTimeout(() => {
    setLoading(false);
  }, 1000);
};
```

## 📃 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

## 👥 기여자

- 김개발 (kim@example.com)

# .env.local 파일에 추가
NEXT_PUBLIC_USE_MOCK_API=true
