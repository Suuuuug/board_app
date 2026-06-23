@AGENTS.md

# 프로젝트 개요

포스트잇 스타일 할 일 관리 앱. 날짜별 포스트잇 형태로 todo를 관리하며, 다수 사용자의 할 일을 한 화면에서 볼 수 있다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **UI**: MUI (Material UI) v9, 포스트잇 노란색 테마
- **언어**: TypeScript
- **DB**: 현재는 JSON 파일로 테스트 중 (`data/` 폴더). 추후 Prisma + MySQL로 교체 예정
- **스타일**: 다크/라이트 모드 토글 지원, localStorage에 테마 저장

## 파일 구조

```
data/                         JSON 테스트 데이터 (DB 미연결 상태)
  users.json                  사용자 목록 (id, name, pin)
  todos.json                  할 일 목록
  completions.json            완료 기록 (우측 알림창 데이터)

lib/
  types.ts                    공유 TypeScript 타입 (User, PublicUser, Todo, Completion, PostItRecord)
  json-db.ts                  JSON 파일 CRUD 헬퍼 (db.users / db.todos / db.completions)
  colors.ts                   포스트잇 색상 상수 (서버/클라이언트 공용)

app/
  layout.tsx                  루트 레이아웃 (ThemeRegistry, 폰트)
  page.tsx                    메인 페이지 → TodoListView 렌더
  TodoListView.tsx            메인 뷰 (클라이언트 컴포넌트, 전체 상태 관리)
  theme.ts                    MUI 테마 생성 함수 + postItColors 재export
  ThemeRegistry.tsx           MUI SSR 대응 레지스트리
  globals.css
  all/
    page.tsx                  전체보기 페이지 (서버 컴포넌트, 오늘 날짜 포스트잇 4명 그리드)
  api/
    users/route.ts            GET /api/users → 사용자 목록 (pin 제외)
    auth/route.ts             POST /api/auth → 이름+PIN 로그인 검증
    todos/route.ts            GET /api/todos?userId= / POST /api/todos
    todos/[id]/route.ts       PATCH /api/todos/:id (완료토글) / DELETE /api/todos/:id
    completions/route.ts      GET /api/completions

components/
  Sidebar.tsx                 좌측 사이드바 (사용자 목록, 로그인/로그아웃, 전체보기 버튼)
  PostItCard.tsx              포스트잇 카드 (할 일 목록 + 입력 폼)
  CompletionLog.tsx           우측 완료 알림창
  LoginDialog.tsx             이름+PIN 로그인 모달
  ConfirmDialog.tsx           삭제 확인 모달

prisma/
  schema.prisma               Prisma 스키마 (추후 MySQL 연동 시 수정 필요)
```

## 핵심 기능 구현 현황

| 기능 | 상태 |
|------|------|
| 날짜별 포스트잇 표시 | ✅ |
| 미완료 todo → 오늘 날짜로 이월 | ✅ (groupTodosIntoPostIts 함수) |
| 체크박스 더블클릭으로 완료 처리 | ✅ |
| todo 상태: 완료 / n일째 진행 | ✅ (createdAt 기준 자동 계산) |
| 포스트잇 하단 입력창으로 todo 추가 | ✅ |
| 상태 칩 클릭 → 삭제 확인 후 삭제 | ✅ |
| 스크롤로 이전 포스트잇 확인 (수정 불가) | ✅ |
| 사용자 버튼으로 타인 포스트잇 열람 | ✅ |
| 로그인 (이름+PIN), 본인 포스트잇만 수정 | ✅ |
| 전체보기 페이지 (/all) | ✅ |
| 우측 완료 알림창 | ✅ |
| Next.js Route Handler CRUD | ✅ |
| DB 연동 (Prisma + MySQL) | ❌ 미구현 |

## 주요 설계 결정

- **로그인 세션**: 서버 세션 없이 `localStorage`에 `{ id, name }` 저장. API는 userId를 클라이언트가 전달하는 방식 (테스트 단계라 auth 미들웨어 없음)
- **포스트잇 그룹핑**: 완료된 todo는 `completedAt` 날짜, 미완료 todo는 오늘 날짜에 표시
- **n일째 계산**: `createdAt` vs 오늘 날짜의 차이로 계산 (0일 = "진행", 1일+ = "n일째")
- **완료 처리**: PATCH `/api/todos/:id` 호출 시 서버에서 자동으로 `completions.json`에 기록
- **서버/클라이언트 분리**: `lib/colors.ts`를 별도 파일로 분리해 서버 컴포넌트(`app/all/page.tsx`)에서도 안전하게 import
- **params Promise**: Next.js 16에서 route handler의 params가 Promise로 변경됨 → `await params` 필수

## 다음 작업 (TODO)

- [ ] Prisma 스키마를 MySQL에 맞게 수정 (현재 SQLite)
- [ ] DB 연동: `lib/json-db.ts` → Prisma Client로 교체
- [ ] 모바일 반응형 (사이드바 현재 md 이상만 표시)
- [ ] 완료 알림창 실시간 업데이트 (현재 완료 처리 시에만 갱신)
- [ ] 로그인 세션 보안 강화 (서버 세션 or JWT)
