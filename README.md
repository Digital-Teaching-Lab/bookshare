# Bookshare — 우리 반 그림책장

Next.js + Vercel + Supabase로 배포하는 유아 그림책 추천 웹앱입니다.
교사는 이메일·비밀번호로 로그인하며, 반 이름·책 기록·사진·녹음은 교사별로 분리됩니다.
사진과 녹음은 비공개 Supabase Storage에 직접 업로드합니다. 서버에는 관리자 키가 필요하지 않습니다.

## 1. Supabase 준비

1. https://supabase.com/dashboard 에서 가입하고 `bookshare` 프로젝트를 만듭니다.
2. SQL Editor → New query에서 `supabase/setup.sql` 내용을 붙여 넣고 Run을 누릅니다.
3. 프로젝트의 Connect 창에서 Project URL과 Publishable key를 확인합니다.
4. Authentication → URL Configuration에서 배포 주소를 Site URL로 지정합니다.
   Redirect URLs에 `https://배포주소/auth/callback`을 추가합니다.
   로컬 테스트 시에는 `http://127.0.0.1:5174/auth/callback`도 추가합니다.
5. Authentication의 이메일 가입과 이메일 인증을 사용합니다. 실제로 여러 교사가 가입할 때는
   이메일 발송 제한을 확인하고 Custom SMTP를 설정합니다.

## 2. GitHub 코드 업데이트

새 ZIP을 압축 해제하고 **폴더 안의 내용**을 저장소 최상위에 업로드합니다.
`package.json`, `package-lock.json`, `tsconfig.json`, `app` 등 같은 이름의 파일은 새 버전으로 교체합니다.
기존 `build`, `db`, `drizzle`, `.openai`, `vite.config.ts` 등은 이 버전에서 사용하지 않습니다.
불필요한 이전 파일이 남아 있어도 새 tsconfig가 해당 파일을 검사하지 않습니다.
`.env.local`과 node_modules는 업로드하지 않습니다. 제공 ZIP에는 포함되지 않습니다.

## 3. Vercel 배포

1. https://vercel.com 에서 GitHub 계정으로 가입합니다.
2. Add New → Project → GitHub 저장소 `Digital-Teaching-Lab/bookshare`를 Import합니다.
3. Framework Preset은 Next.js, Root Directory는 저장소 최상위입니다.
4. Environment Variables에 아래 세 값을 등록합니다.

| 이름 | 값 |
| --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | Supabase Project URL |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Supabase Publishable key (구형 프로젝트는 anon 키) |
| YES24_API_KEY | 이미 발급받은 예스24 키 |

`SUPABASE_SERVICE_ROLE_KEY` 또는 secret 키는 쓰지 않습니다.
예스24 키는 `NEXT_PUBLIC_`로 시작하는 이름에 넣지 않습니다.
5. Deploy 후 나온 URL을 Supabase의 Site URL과 Redirect URLs에 반영합니다.
6. 사이트에서 선생님 가입 → 이메일 확인 → 로그인 → 반 이름 저장을 합니다.

환경 변수를 바꿨다면 Vercel에서 Redeploy가 필요합니다.

## 4. 확인할 사항

- 교사 A와 교사 B를 각각 가입해 서로의 반 이름과 기록이 보이지 않는지 확인합니다.
- 휴대폰에서 사진·녹음·책 검색·저장을 하고 컴퓨터에서 같은 계정으로 확인합니다.
- 수정·삭제·녹음 재생과 카드/책장 인쇄를 확인합니다.
- 브라우저 인쇄 설정의 머리글과 바닥글을 끄면 인쇄 시각과 URL이 없어집니다.
- 기존 로컬 개발 화면에 남긴 기록은 새 Supabase 프로젝트로 자동 이전되지 않습니다.
- 추천 카드 삭제는 기록을 삭제합니다. 저장 파일은 남을 수 있으며 Storage에서 별도로 관리합니다.
- 녹음이 최대 2분이고 파일은 12MB까지 허용됩니다.

## 로컬 실행

`.env.example`을 `.env.local`로 복사하고 값을 채운 뒤:

```sh
npm install
npm run dev
```

개발 주소는 http://127.0.0.1:5174 입니다.

```sh
npm run check
npm run build
```

설정 전에도 빌드는 됩니다. 설정되지 않은 로그인 화면은 연결 준비 안내를 표시합니다.
실제 교사별 저장과 재생은 Supabase 설정 후 확인해야 합니다.

공식 문서: https://supabase.com/docs/guides/auth/server-side/nextjs
https://supabase.com/docs/guides/storage/security/access-control
https://vercel.com/docs/frameworks/full-stack/nextjs
