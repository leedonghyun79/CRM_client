# Connectivity CRM System

웹사이트 및 앱 개발 업체를 위한 고객 관계 관리 시스템(CRM)입니다. 고객, 프로젝트, 문의, 거래를 효율적으로 관리하고 비즈니스 분석 데이터를 한눈에 파악할 수 있습니다.

## 주요 기능

### 📊 대시보드 (Dashboard)
- **방문자 분석**: 월별 방문자 추이 차트
- **성과 지표**: 주요 비즈니스 지표 모니터링
- **유입 경로**: 웹사이트 방문자의 출처 분석
- **일일 요약**: 매일의 주요 데이터 한눈에 보기
- **최근 작업**: 진행 중인 프로젝트 현황

### 👥 고객 관리 (Customers)
- 고객 정보 등록 및 관리
- 고객 상태 추적 (대기, 진행, 종료)
- 고객별 프로젝트 및 거래 내역 연동
- 페이지네이션을 통한 효율적인 고객 조회

### 💼 프로젝트 관리
- 고객별 프로젝트 생성 및 추적
- 프로젝트 상태 관리 (대기, 진행, 휴중, 완료)
- 유지보수 작업 기록 및 비용 추적

### 📬 문의 관리 (Inquiries)
- 고객으로부터 들어온 문의 처리
- 문의 타입 분류 (기술지원, 일반문의, 결제/환불)
- 문의 상태 추적 (대기, 답변, 종료)

### 💰 판매 관리 (Sales)
- 거래 기록 및 추적
- 서비스별 매출 분석
- 거래 상태 모니터링 (대기, 완료)
- PDF 내보내기 기능

## 기술 스택

| 분야 | 사용 기술 |
|------|---------|
| **프레임워크** | Next.js 14 |
| **UI 라이브러리** | React 18 |
| **언어** | TypeScript |
| **스타일링** | Tailwind CSS, PostCSS |
| **데이터베이스** | PostgreSQL + Prisma ORM |
| **상태관리** | TanStack React Query |
| **UI 컴포넌트** | Lucide React (아이콘) |
| **시각화** | Recharts (차트) |
| **기타** | Sonner (토스트), clsx (조건부 클래스) |

## 프로젝트 구조

```
src/
├── app/                           # Next.js App Router
│   ├── page.tsx                   # 대시보드 홈페이지
│   ├── customers/                 # 고객 관리 페이지
│   ├── inquiries/                 # 문의 관리 페이지
│   ├── sales/                     # 판매 관리 페이지
│   ├── settings/                  # 설정 페이지
│   └── layout.tsx                 # 메인 레이아웃
├── components/
│   ├── dashboard/                 # 대시보드 컴포넌트
│   ├── layout/                    # 레이아웃 컴포넌트 (Header, Sidebar)
│   ├── modals/                    # 모달 컴포넌트
│   ├── settings/                  # 설정 페이지 컴포넌트
│   └── common/                    # 공용 컴포넌트 (Spinner, PageLoader)
├── types/                         # TypeScript 타입 정의
├── lib/
│   ├── prisma.ts                  # Prisma 클라이언트
│   ├── actions.ts                 # 서버 액션
│   └── sync.ts                    # 데이터 동기화
└── app/
    └── globals.css                # 전역 스타일

prisma/
└── schema.prisma                  # 데이터베이스 스키마
```

## 데이터 모델

### Customer (고객)
- id, name, email, company, phone, address
- status: `pending` | `processing` | `closed`
- lastLogin, createdAt, updatedAt

### Project (프로젝트)
- id, customerId, title, description
- status: `PENDING` | `PROGRESS` | `REST` | `COMPLETED`
- startDate, endDate, 유지보수 기록

### Inquiry (문의)
- id, title, content, authorName
- type: `기술지원` | `일반문의` | `결제/환불`
- status: `pending` | `answered` | `closed`
- customerId (선택사항)

### Transaction (거래)
- id, serviceType, amount, status
- customerId, customerName
- status: `pending` | `completed`

### DailyStat (일일 통계)
- date, pageViews, visitors, signups, inquiries, revenue

## 시작하기

### 설치
```bash
npm install
# 또는
yarn install
```

### 환경 변수 설정
`.env` 파일 생성:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/crm_db"
```

### 데이터베이스 마이그레이션
```bash
npx prisma migrate dev --name init
```

### 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 으로 접속하면 됨.

## 주요 스크립트

```bash
npm run dev       # 개발 서버 실행
npm run build     # 프로덕션 빌드
npm start         # 프로덕션 서버 실행
npm run lint      # 코드 린팅
```

## 개발 계획

- [ ] API 엔드포인트 완성
- [ ] GA4 데이터 연동
- [ ] 고급 필터링 기능
- [ ] 데이터 내보내기 (CSV, Excel)
- [ ] 알림 시스템
- [ ] 사용자 권한 관리
- [ ] 다국어 지원

## 라이선스

이 프로젝트는 개인 및 회사 프로젝트입니다.

---

**개발자**: 동현  
**시작일**: 2026년 6월
# CRM_client
