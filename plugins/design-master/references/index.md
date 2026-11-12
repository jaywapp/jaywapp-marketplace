# references 색인

스킬은 이 파일을 먼저 읽고, 질문이나 화면에 필요한 파일만 골라 읽는다. 파일 하나는 항목(### 제목) 여러 개로 이루어지고 항목 형식은 아래 "항목 형식"과 같다.

## 한눈에 찾기

| 알고 싶은 것 | 파일 |
|---|---|
| 화면의 큰 뼈대, 레이아웃 | [layout.md](layout.md) |
| 화면 이동, 하단 메뉴, 탭 바 모션 | [navigation.md](navigation.md) |
| 알림과 피드백(토스트, 모달, 툴팁 등) | [feedback.md](feedback.md) |
| 버튼과 입력 칸의 상태와 모션 | [inputs.md](inputs.md) |
| "A vs B" 중 무엇을 쓸지 | [confusable-pairs.md](confusable-pairs.md) |
| 빈 화면과 로딩 | [empty-loading.md](empty-loading.md) |
| 진행 표시와 완료 표시 | [indicators-completion.md](indicators-completion.md) |
| 앱 첫 화면 흐름 | [onboarding.md](onboarding.md) |
| 움직임, 화면 전환, 텍스트 등장 | [motion.md](motion.md) |
| 터치 제스처 | [gestures.md](gestures.md) |
| 평점과 공유 | [ratings-share.md](ratings-share.md) |
| AI 채팅 화면 | [ai-chat.md](ai-chat.md) |
| 디자인 스타일 | [styles.md](styles.md) |
| 간격 수치 | [spacing.md](spacing.md) |
| 품질 규칙(Q01~Q16) | [quality-rules.md](quality-rules.md) |
| 결정 순서 | [decision-order.md](decision-order.md) |

## 항목 형식

```
### 한글 이름 (English name)
- 무엇: 한 문장 정의
- 언제: 쓰기 좋은 상황
- 피할 때: 쓰면 안 되는 상황과 대신 쓸 것
- 구현 주의: 크기, 위치, 지속 시간, 접근성, 상태 등 틀리기 쉬운 것(통용되는 수치는 수치로)
- 비슷한 것: 이름(차이 한 줄)
```

여러 파일에 걸치는 항목은 한 곳에만 본문을 두고 다른 곳에는 `- 참조:` 줄로 그 위치를 가리킨다.

## 파일별 항목 이름

### layout.md
- 웹 레이아웃 12종: Two-column, Split screen, Z-shape(zig-zag), Asymmetrical, F-shape, Featured image or video, Card or block, Magazine, Fixed navigation, Masonry, Hidden navigation, Interactive
- 화면 배치 9종: 히어로(Hero section), 벤토 그리드(Bento grid), 스플릿(Split screen, 참조), 카드 그리드(Card grid), 사이드바 레이아웃(Sidebar layout), 매거진(Magazine layout, 참조), 대시보드(Dashboard), Z 패턴(Z-pattern, 참조), 풀블리드(Full bleed)

### navigation.md
- 화면 이동 9종: 하단 탭바(Tab bar), 상단 탭(Top tabs), 드로어(Navigation drawer), 브레드크럼(Breadcrumb), 고정 헤더(Sticky header), 플로팅 버튼(Floating action button), 페이지네이션(Pagination), 무한 스크롤(Infinite scroll), 뒤로 가기(Back navigation)
- 모바일 하단 메뉴 스타일 11종: Minimal clean, Glassmorphism, Floating(Detached), Neumorphism, Pill highlight, Center FAB, Gradient bold, Outline icons, Tab with indicator, Curved background, Dock style(iOS inspired)
- 탭 바 전환 모션 6종: Sliding pill, Liquid bulge, Floating notch, Icon fill, Expanding label, Bubble float

### feedback.md
- 알림·피드백 9종: 토스트(Toast), 스낵바(Snackbar), 배너(Banner), 모달(Modal dialog), 바텀시트(Bottom sheet), 인라인 오류(Inline error), 툴팁(Tooltip), 코치마크(Coach mark), 뱃지(Badge)

### inputs.md
- 버튼 상태 9종: 기본(Default), 호버(Hover), 눌림(Pressed), 포커스(Focus), 비활성(Disabled), 로딩(Loading), 성공(Success), 오류(Error), 선택됨(Selected)
- 입력: 텍스트 필드 상태(Text field states), 셀렉트(Select)
- 텍스트 필드 모션 6종: OTP code, Card number, Strength meter, Auto grow, Tag input, Ghost complete

### confusable-pairs.md
- 헷갈리는 UI 짝 18쌍: 토글 vs 체크박스, 라디오 vs 체크박스, 탭 vs 세그먼트, 모달 vs 바텀시트, 토스트 vs 스낵바, 툴팁 vs 팝오버, 칩 vs 배지, 스피너 vs 스켈레톤, 스테퍼 vs 슬라이더, 드롭다운 메뉴 vs 셀렉트, 버튼 vs 링크, 플레이스홀더 vs 라벨, 햄버거 vs 케밥, 앱 바 vs 탭 바, 카드 vs 리스트, 아바타 vs 썸네일, 배너 vs 팝업, FAB vs 아이콘 버튼

### empty-loading.md
- 빈 화면 9종: 첫 사용(First use), 검색 결과 없음(No search results), 필터 결과 없음(No filter results), 오프라인(Offline), 권한 필요(Permission needed), 모두 완료(All caught up), 삭제 직후(Emptied), 오류 화면(Error state), 잠김(Locked content)
- 로딩 패턴 9종: 스피너(Spinner), 스켈레톤(Skeleton screen), 진행 바(Progress bar), 진행 링(Progress ring), 단계 표시(Stepper, 참조), 블러 업(Blur-up image), 낙관적 UI(Optimistic UI), 스트리밍 텍스트(Streaming text), 로딩 버튼(Loading button)

### indicators-completion.md
- 인디케이터 9종: 프로그레스 바(Progress bar, 참조), 스텝 인디케이터(Step indicator), 페이지 인디케이터(Page indicator), 스토리 바(Story progress), 스크롤 진행 바(Scroll progress), 원형 진행률(Progress ring, 참조), 강도 표시기(Strength meter, 참조), 탭 인디케이터(Tab indicator), 홈 인디케이터(Home indicator)
- 완료 표시 9종: 체크 그리기(Check animation), 할 일 줄긋기(Strikethrough), 버튼 모핑(Button morph), 진행률 완료(Progress complete), 보냄 애니메이션(Send animation), 스탬프(Stamp), 배지 획득(Badge unlock), 컨페티(Confetti), 완료 화면(Success screen)

### onboarding.md
- 앱 첫 화면 9종: 스플래시(Splash screen), 온보딩(Onboarding), 권한 요청(Permission request), 코치마크(Coach mark, 참조), 간편 로그인(Social login), 약관 동의(Terms agreement), 프로필 설정(Profile setup), 스켈레톤(Skeleton, 참조), 웰컴 화면(Welcome screen)

### motion.md
- 움직임 이름 9종: 이즈 인(Ease-in), 이즈 아웃(Ease-out), 스프링(Spring), 바운스(Bounce), 순차 등장(Stagger), 페이드(Fade), 슬라이드(Slide), 확대 전환(Zoom transition), 공유 요소 전환(Shared element)
- 화면 전환 9종: 푸시(Push), 모달 등장(Modal present), 페이드 스루(Fade through), 공유 요소(Shared element, 참조), 카드 확장(Card expand), 줌(Zoom), 순차 등장(Stagger in, 참조), 탭 전환(Tab switch), 시트 확장(Sheet expand)
- 텍스트 등장 9종: 타이핑(Typewriter), 페이드 업(Fade up), 글자 순차 등장(Letter stagger), 카운트 업(Count up), 스크램블(Scramble), 마스크 리빌(Mask reveal), 하이라이트(Highlight), 단어 교체(Word rotate), 블러 인(Blur in)

### gestures.md
- 제스처 9종: 탭(Tap), 길게 누르기(Long press), 스와이프(Swipe), 밀어서 삭제(Swipe to delete), 드래그(Drag and drop), 핀치(Pinch to zoom), 두 번 탭(Double tap), 당겨서 새로고침(Pull to refresh), 가장자리 스와이프(Edge swipe)

### ratings-share.md
- 평점 UI 9종: 별점(Star rating), 반 별점(Half-star rating), NPS 점수(0~10), 이모지 평가(Emoji rating), 좋아요 싫어요(Thumbs up/down), 평점 슬라이더(Rating slider), 평점 요약(Rating summary), 평가 태그(Rating tags), 평점 배지(Rating badge)
- 공유 9종: iOS 공유(Share on iOS), 안드로이드 공유(Share on Android), 전달(Forward), 보내기(Send), 링크 복사(Copy link), 리포스트(Repost), QR 공유(QR code), 근처 공유(Nearby share), 공유 시트(Share sheet)

### ai-chat.md
- AI 채팅 화면 9종: 생각 중 표시(Thinking indicator), 스트리밍 답변(Streaming response), 추천 질문 칩(Suggested prompts), 다시 생성(Regenerate), 출처 표시(Citations), 답변 피드백(Feedback buttons), 고쳐 묻기(Edit and resend), 파일 첨부(File attachment), 에이전트 단계(Agent steps)

### styles.md
- 디자인 스타일 9종: 스큐어모피즘(Skeuomorphism), 플랫 디자인(Flat design), 머티리얼(Material design), 뉴모피즘(Neumorphism), 글래스모피즘(Glassmorphism), 클레이모피즘(Claymorphism), 네오 브루탈리즘(Neo brutalism), 3D 아이콘(3D icon), 리퀴드 글래스(Liquid glass)

### spacing.md
- 모바일 스페이싱 가이드: 좌우 여백 24px, 제목과 콘텐츠 사이 16px, 섹션 간 32px, 탭·카드 사이 12px, 버튼 간 12px, 탭 바 탭 내부 패딩 위아래 16px. 8px 기반 체계와 웹 데스크톱 대응 기준 포함

### quality-rules.md
- Q01 텍스트 대비, Q02 터치 타깃, Q03 간격 체계, Q04 글자 크기와 줄 길이, Q05 색 사용, Q06 모서리 반경, Q07 그림자, Q08 상태 누락, Q09 라벨과 플레이스홀더, Q10 정렬과 그룹화, Q11 주 행동 하나, Q12 아이콘 일관성, Q13 반응형, Q14 다크 모드, Q15 실제 길이의 콘텐츠, Q16 포커스와 키보드

### decision-order.md
- 결정 지점 8개: 목적과 주 행동, 레이아웃, 내비게이션, 핵심 컴포넌트, 상태, 피드백, 모션과 전환, 스타일과 간격 마감

## 요소 이름으로 찾기(중복 소유 항목)

한 항목이 여러 이름으로 나올 때 본문이 있는 곳이다.

| 이름 | 본문 위치 |
|---|---|
| 코치마크 | feedback.md |
| 스켈레톤 | empty-loading.md |
| 프로그레스 바, 진행 바 | empty-loading.md |
| 진행 링, 원형 진행률 | empty-loading.md |
| 스텝 인디케이터, 단계 표시(Stepper) | indicators-completion.md |
| 강도 표시기, Strength meter | inputs.md |
| 스플릿, Split screen | layout.md의 웹 레이아웃 절 |
| 매거진 | layout.md의 웹 레이아웃 절 |
| Z 패턴, Z-shape | layout.md의 웹 레이아웃 절 |
| 순차 등장, Stagger in | motion.md의 움직임 이름 절 |
| 공유 요소, 공유 요소 전환 | motion.md의 움직임 이름 절 |
| 확대 전환, 줌 | 확대 전환은 움직임 이름 절, 줌은 화면 전환 절(서로 가리킨다) |
| 스트리밍 텍스트, 스트리밍 답변 | 텍스트와 일반 규칙은 empty-loading.md, 채팅 화면 규칙은 ai-chat.md |
| 뱃지(알림 수), 배지 획득, 평점 배지, 칩 vs 배지 | 각각 feedback.md, indicators-completion.md, ratings-share.md, confusable-pairs.md |
| 하단 메뉴의 Glassmorphism, Neumorphism | 메뉴 적용은 navigation.md, 스타일 일반론은 styles.md |

## 항목 추가 방법

스크린샷이 더 생기면 다음 순서로 덧붙인다.

1. 항목 이름(한글과 영어)을 정한다. 기존 항목과 같은 요소인지 먼저 이 색인에서 찾는다. 같은 요소면 새로 만들지 않고 기존 항목의 "비슷한 것"이나 "구현 주의"에 보탠다.
2. 들어갈 파일을 고른다. 기존 주제에 속하면 그 파일의 해당 절 끝에 `### 이름` 항목을 "항목 형식"대로 쓴다. 새 주제면 `references/<topic>.md`를 만들고 파일 첫 줄에 `# 제목 (종류와 개수)`와 한두 문장 설명을 둔다.
3. 이 색인의 "한눈에 찾기" 표와 "파일별 항목 이름"에 새 이름을 추가한다(색인에 없는 항목은 스킬이 찾지 못한다).
4. 같은 항목이 다른 주제에도 나오면 본문은 한 곳에 두고 다른 곳에는 `- 참조:` 줄만 둔다. "요소 이름으로 찾기" 표에도 올린다.
5. 설명은 스크린샷 원문을 베끼지 않고 직접 쓴다. 수치는 통용되는 값만 쓰고 출처가 불분명하면 쓰지 않는다.
6. 주제나 파일이 늘면 `lookup` 스킬은 색인만 읽으므로 스킬 파일을 고칠 필요는 없다. `decision-order.md`의 해당 지점에 볼 파일을 추가한다.
