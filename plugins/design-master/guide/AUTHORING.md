# 주제 파일 작성 계약 (AUTHORING)

UI 요소 가이드는 주제 23개, 요소 214개로 이루어진다. 페이지 틀(`index.html`, `guide.*`)과 시연 키트(`kit.*`)는 완성되어 있고,
주제마다 파일 하나(`topics/<topic-id>.js`)를 채우면 된다. 이 문서와 모범 예시 `topics/feedback.js`만 보고 주제 하나를 끝낼 수 있게 썼다.

## 1. 맡은 일과 건드리지 않는 것

- 고치는 파일은 **자기 주제 파일 하나**(`topics/<topic-id>.js`)뿐이다. 지금은 빈 스텁이 들어 있으니 통째로 바꾼다.
- 다음 파일은 고치지 않는다: `index.html`, `guide.css`, `guide.js`, `kit.css`, `kit.js`, `topics/_manifest.js`, 다른 주제 파일.
  키트에 필요한 도구가 없으면 자기 주제 파일 안에서 HTML과 CSS로 만든다. 키트를 바꿔야 할 만큼 공통적이면 리더에게 제안만 한다.
- 외부 리소스는 쓰지 않는다. 이미지, 폰트, 스크립트 CDN 모두 불가. 폰트는 `index.html`이 불러오는 Noto Sans KR, Black Han Sans와 시스템 폰트뿐이다.
- 빌드 단계는 없다. 파일을 저장하고 `index.html#<topic-id>`를 새로고침하면 바로 보인다.

## 2. 작업 순서

1. 아래 "주제 표"에서 자기 주제의 id, 요소 id, 레퍼런스 파일, 키프레임 접두사를 확인한다.
2. `plugins/design-master/references/<파일>.md`에서 해당 항목을 읽는다. when, avoid, notes, vs는 레퍼런스 내용을 따른다(5절).
3. `topics/feedback.js`를 열어 구조를 본다.
4. 요소마다 내용과 시연을 쓴다. 요소 id와 순서는 `_manifest.js`와 같아야 한다.
5. 9절의 자가 점검을 한다.

## 3. 파일 형태

```js
/* Topic: <한글 이름> (<topic-id>). Reference: plugins/design-master/references/<file>.md */
UIGuide.registerTopic({
  id: 'gestures',                  // manifest의 topic id
  intro: '한두 문장 소개(선택)',
  elements: [ /* 요소 객체, manifest와 같은 순서와 개수 */ ],
  css: K => `...`                  // 이 주제의 CSS. 문자열이나 (K) => 문자열
});
```

`registerTopic(def)`는 전역 함수 하나다. 주제 이름, 영문 이름, 묶음은 manifest에서 가져오므로 다시 쓰지 않는다.
`elements: []`이면 "준비 중" 화면이 나온다(지금의 스텁).

### 요소 객체

| 필드 | 필수 | 내용 |
|---|---|---|
| `id` | 예 | manifest의 요소 id. 해시 `#<topic-id>-<id>`로 쓰인다 |
| `ko`, `en` | 예 | 한글 이름, 영어 이름. manifest와 같게 |
| `aka` | 아니오 | 검색에 쓰는 다른 이름 배열. 예: `['배지', 'count']` |
| `when` | 예 | 쓰기 좋은 상황 한 줄 |
| `avoid` | 예 | 피할 상황 한 줄. 대신 쓸 것이 있으면 괄호로 |
| `notes` | 예 | 구현 메모 2~4개(배열). 수치, 접근성, 상태처럼 틀리기 쉬운 것 |
| `vs` | 예 | 비슷한 것과의 차이. `{ id, text }` 또는 다른 주제면 `{ topic, id, name, text }` |
| `demo` | 예 | 시연 정의(아래) |

`vs` 예시:

```js
vs: { id: 'snackbar', text: '스낵바는 되돌리기 같은 액션 버튼이 하나 있어요.' }                 // 같은 주제의 요소
vs: { topic: 'confusable-pairs', id: 'chip-badge', name: '칩', text: '칩은 상태를 설명하는...' } // 다른 주제
vs: { name: '팝오버', text: '팝오버는 눌러서 열고 버튼을 담을 수 있어요.' }                     // 가이드에 없는 것
```

`text`의 따옴표 안 `aria-*`, `role="..."`은 화면에서 자동으로 코드 모양이 된다(notes도 같다).

### 시연 객체 (`demo`)

| 필드 | 필수 | 내용 |
|---|---|---|
| `frame` | 아니오 | `phone`(기본), `browser`, `compare`, `bare` 중 하나 |
| `cycle` | 예 | 한 바퀴 길이(ms). **3000~6000** |
| `still` | 예 | 대표 장면 시점(ms). reduced-motion이거나 사용자가 "시연 멈춤"을 누르면 모든 애니메이션이 이 시점에서 멈춘다. 요소가 가장 잘 보이는 순간을 고른다 |
| `alt` | 예 | 시연의 대체 설명. "무엇을 하면 무엇이 어떻게 나타났다 사라지는 시연" 한 문장 |
| `html` | 예 | `K => 문자열`(화면 안 마크업). `compare`는 `K => [왼쪽, 오른쪽]` |
| `phases` | 권장 | 타임라인 구간 `[['등장', 900, 1200], ['유지', 1200, 3500], ['퇴장', 3500, 3900]]`. 구간 이름에 유지, 갱신, 머묾이 들어가면 바탕색, 지연·대기면 빗금, 나머지는 강조색으로 그려진다 |
| `labels` | compare만 | 두 칸의 이름. `['토글', '체크박스']` |
| `url` | browser만 | 주소창 글자. 기본 `jangbom.example/list` |

## 4. 시연 만들기

### 4.1 좌표계

- 모든 화면(`.k-scr`)은 **폭 16em**이다. 크기와 위치는 em으로 쓰면 어떤 크기로 그려져도 비율이 유지된다.
- 화면 높이: `phone`과 `compare` 칸은 21.33em(3:4), `browser`는 10em(16:10, 주소창은 화면 밖), `bare`는 12em(4:3).
- 장보기 앱 화면(phone)의 고정 위치:
  - 상태 표시줄 0~1.3em, 앱 바 1.3~3.7em
  - 목록 행은 3.7em부터 한 줄 2.3em. n번째 행(1부터)의 세로 중심은 `3.7 + 2.3 × (n - 1) + 1.15`em
  - 체크 원 중심 x=1.5em, 앱 바 아이콘 중심 y=2.5em, 오른쪽 아이콘 x=14.5em, 그 왼쪽 아이콘 x=12.7em
  - 하단 탭바 2.9em(세 탭 중심 x=2.67, 8, 13.33em, y=19.9em), FAB 2.6em(오른쪽·아래 여백 1.1em)

### 4.2 가상의 앱

시연 속 화면은 모든 주제가 **가상의 공유 장보기 목록 앱** 하나를 쓴다(우유 2L, 달걀 10구, 두부, 대파, 사과, 참기름, 양파, 김; 탭은 목록, 가족, 설정).
실제 브랜드, 로고, 상표는 쓰지 않는다. 주소가 필요하면 `jangbom.example`을 쓴다. lorem ipsum 금지.
앱 색은 화면 토큰으로 쓴다: `--a-bg`, `--a-ink`, `--a-mut`, `--a-line`, `--a-soft`, `--a-brand`(당근색), `--a-err`, `--a-ok`, `--a-warn-bg`, `--a-warn-ink`, `--a-dark`.

### 4.3 키트 도구 (`html: K => ...`와 `css: K => ...`에서 쓰는 `K`)

| 도구 | 하는 일 |
|---|---|
| `K.icon(name, cls?)` | 24 격자, 1.8 선 굵기 아이콘. 이름 목록은 `K.icons`(search, x, check, chevL/R/D/U, arrowL/R, share, shareAndroid, more, moreV, menu, trash, sort, filter, wifi, wifiOff, alert, info, plus, minus, list, users, user, sliders, home, bell, heart, star, bookmark, image, camera, send, link, copy, refresh, lock, edit, paperclip, mic, thumbUp, thumbDown, qr, repost, forward, grid, note, sparkle, checkCircle, xCircle, pause, play) |
| `K.app.status()` | 상태 표시줄 |
| `K.app.bar(title?, icons?, {back, cls}?)` | 앱 바. 아이콘마다 `.k-ib-<이름>` 클래스가 붙는다 |
| `K.app.row(i, {checked, item, cls}?)` | 목록 한 줄. `.k-r<n>`(1부터), 부품 `.k-cb > .k-ck`, `.k-n`, `.k-q`. `item: ['이름', '수량']`으로 바꿀 수 있다 |
| `K.app.rows(from, to, {checked:[i]}?)` | 여러 줄 |
| `K.app.list(from?, to?, {checked, cls, before, after}?)` | `.k-ls` 목록 묶음 |
| `K.app.screen({title, icons, rows, back, checked}?)` | 상태 표시줄 + 앱 바 + 목록 |
| `K.app.tabs(active?, {index: html}?)` | 하단 탭바. 두 번째 인자로 탭 아이콘 옆에 뱃지 등을 넣는다(`.k-tab-<i>`) |
| `K.app.fab(cls?)` | 플로팅 추가 버튼 `.k-fab` |
| `K.app.button(label, 'primary'\|'ghost'\|'danger', cls?)` | 버튼 `.k-btn` |
| `K.app.field(label, value, cls?)` | 라벨이 위에 붙은 입력 칸 `.k-field` |
| `K.tap(x, y, cls)` | 눌린 자리 원. `K.kf.tap`으로 움직인다 |
| `K.finger(x, y, cls)` | 손가락 끝. 제스처용. `K.kf.drag`, `K.kf.press`, `K.kf.path`로 움직인다 |
| `K.cursor(x, y, cls)` | 마우스 포인터(끝이 x, y). `K.kf.path`로 움직인다 |
| `K.dot(x, y, cls)` | 시선이나 초점 표시 원. 레이아웃의 읽는 순서를 보여 줄 때 |
| `K.scrim(cls)` | 화면 전체를 덮는 어두운 막(처음엔 투명) |
| `K.wf(kind, x, y, w, h, cls?)` | 와이어프레임 블록. kind: `block`, `img`, `text`(줄무늬), `title`, `nav`, `btn`, `line` |
| `K.dim({x, y, len, dir, label, side, cls})` | 치수선. `dir: 'h'`는 (x,y)에서 오른쪽으로, `'v'`는 아래로 len만큼. `side`는 라벨 위치(`top`/`bottom`, `left`/`right`) |
| `K.px(n, base?)` | 기기 px를 화면 em으로 바꾼다. 기본 base 360(폰 폭), 데스크톱은 1280 |
| `K.kf.tap(name, at%)` | 탭 원 키프레임. at%에 눌렸다가 at+6%에 사라진다 |
| `K.kf.drag(name, a%, b%, dx, dy)` | a%에 닿고 b%까지 (dx, dy)em 이동, b+3%에 뗀다 |
| `K.kf.press(name, a%, b%)` | a%부터 b%까지 누르고 있다(길게 누르기) |
| `K.kf.path(name, [[%, x, y], ...])` | 점들을 따라 translate한다(원래 자리 기준 em) |
| `K.kf.fade(name, [[a, b, c, d], ...], rise?)` | a~b% 나타나고 c~d% 사라진다. rise(em)만큼 아래에서 올라온다 |

키트 클래스(`k-` 접두사)는 키트 소유다. 모양을 바꾸려면 자기 선택자 아래에서 덮어쓴다(예: `.t-gestures-tap .k-r2{...}`).

### 4.4 CSS 규칙

- **모든 선택자는 `.t-<topic-id>-<element-id>`로 시작한다.** 시연 뿌리에 이 클래스가 붙는다. 예: `.t-feedback-toast .toast{...}`.
  안쪽 클래스 이름은 짧게 써도 된다(뿌리 클래스 아래에서만 쓰이므로 다른 주제와 겹치지 않는다).
- **키프레임 이름은 주제 표의 접두사로 시작한다.** 키프레임은 전역이라 겹치면 다른 주제를 망가뜨린다. 예: feedback은 `fbToastIn`.
- 애니메이션 길이, 반복, 채우기는 키트가 이미 정한다(`var(--cyc)`, 무한, both). 요소마다 **`animation-name`만** 쓴다.
  - `animation:` 단축 속성은 쓰지 않는다. 길이가 초기화된다.
  - **`animation-delay`도 쓰지 않는다.** 멈춤 기능이 delay를 쓴다. 순서 차이는 키프레임 %로 만든다.
  - 주기와 다른 길이가 꼭 필요하면(커서 깜빡임 등) feedback의 `.caret`처럼 `animation-name: a, b; animation-duration: var(--cyc), 1s;`로 둘 다 적는다.
- 움직임은 `transform`과 `opacity` 위주로 만든다. width, height, top, left는 애니메이션하지 않는다.
- 키프레임 처음(0%)과 끝(100%)은 같은 장면이어야 반복이 튀지 않는다.
- 색은 화면 토큰(`--a-*`)을 쓴다. 장식용 그라디언트, 네온 광채, 이모지 아이콘은 쓰지 않는다.
- 문자열 안 글은 `~해요`체로, em dash와 en dash를 쓰지 않는다.

### 4.5 시연 품질 기준

- 시연만 봐도 **무엇인지**, 그리고 **비슷한 요소와 무엇이 다른지** 드러나야 한다. 예: 토스트는 버튼 없이 사라지고, 스낵바는 되돌리기를 눌러 되살린다.
- 한 바퀴는 원인, 반응, 정리 순서로 만든다. 예: 탭(원인) → 요소 등장(반응) → 사라지거나 원래대로(정리).
- 사용자 조작은 `K.tap`, `K.finger`, `K.cursor`로 보이게 한다. 저절로 일어나는 일과 사용자가 일으킨 일을 구분해 준다.
- `still` 시점에서 요소가 화면에 다 보여야 한다(탭 원이 떠 있지 않은 순간이 좋다).
- `alt`는 장면을 말로 옮긴다. 화면 읽기 사용자는 이 문장만 듣는다.

## 5. 내용 규칙

- when, avoid, notes, vs는 `plugins/design-master/references/<파일>.md`의 해당 항목(`### 한글 이름 (English)`)을 따른다.
  레퍼런스의 "언제" → `when`, "피할 때" → `avoid`, "구현 주의" → `notes`(2~4개로 나눠 줄인다), "비슷한 것" → `vs`.
  가이드와 레퍼런스가 서로 다른 말을 하면 안 된다. 수치는 레퍼런스에 있는 것만 쓴다.
- 레퍼런스에 `- 참조:`만 있는 항목은 본문이 있는 파일(references/index.md의 "요소 이름으로 찾기")을 따른다.
- 화면에 보이는 글은 한국어. 코드, 클래스, 키프레임 이름은 영어.

## 6. 주제 유형별 시연 패턴

모든 주제가 "폰 안의 장보기 앱"에 맞지는 않는다. 유형에 맞는 틀을 고른다.

### 앱 요소(기본): phone
알림, 입력, 로딩, 완료, 공유, AI 채팅 등. `topics/feedback.js`가 예시다.

### 웹 레이아웃·화면 배치: browser + 와이어프레임 + 시선 이동

```js
demo: {
  frame: 'browser', url: 'jangbom.example', cycle: 5000, still: 2500,
  phases: [['시선', 0, 4200]],
  alt: '헤더 아래 왼쪽 제목에서 오른쪽 이미지로, 다시 왼쪽 아래 버튼과 오른쪽 아래로 시선이 Z자로 이동하는 시연',
  html: K => K.wf('nav', 0, 0, 16, 1.2) + K.wf('title', 1, 2.2, 6, .8) + K.wf('text', 1, 3.4, 6, 2) +
    K.wf('img', 9, 2.2, 6, 4.6) + K.wf('btn', 1, 6.6, 3, 1.1) + K.dot(1.5, 2.6, 'gz')
},
// css: .t-web-layouts-z-shape .gz{animation-name:wlZ}
//      ${K.kf.path('wlZ', [[0,0,0],[25,12.5,0],[55,1,4.6],[85,12.5,4.6],[100,12.5,4.6]])}
```

영역 강조는 블록에 `outline`이나 밝기 변화를 키프레임으로 준다. 화면 배치(히어로, 대시보드 등)도 같은 틀을 쓴다.

### 스페이싱: 치수선

```js
html: K => K.app.status() + K.app.bar('설정', []) + '<div class="card"></div><div class="card c2"></div>' +
  K.dim({ x: 0, y: 5.2, len: K.px(24), dir: 'h', label: '24px', side: 'bottom' }) +
  K.dim({ x: 8, y: 8.6, len: K.px(12), dir: 'v', label: '12px' })
// css: .t-spacing-side-margin .card{position:absolute;left:${K.px(24)}em;right:${K.px(24)}em;top:4.6em;height:4em;border-radius:.6em;background:var(--a-soft)}
//      .t-spacing-side-margin .c2{top:${4.6 + 4 + K.px(12)}em}
```

치수선이 나타나거나 간격이 좁혀졌다 제자리로 돌아오는 움직임으로 "왜 이 값인지"를 보여 준다. 정지에 가까워도 된다.

### 헷갈리는 짝: compare (나란히 비교)

```js
demo: {
  frame: 'compare', labels: ['토글', '체크박스'], cycle: 4000, still: 2000,
  alt: '왼쪽은 토글을 누르는 즉시 설정이 켜지고, 오른쪽은 체크박스로 항목을 고른 뒤 저장해야 반영되는 시연',
  html: K => [
    K.app.status() + K.app.bar('알림 설정', []) + '<div class="tgl"><span>푸시 알림</span><i class="sw"><b></b></i></div>' + K.tap(13.4, 5.05, 'tp'),
    K.app.status() + K.app.bar('담을 항목', []) + K.app.list(0, 4) + K.tap(1.5, 4.85, 'tp')
  ]
}
```

두 칸은 같은 시점에 같은 조작을 받게 해서 반응의 차이만 남긴다. 각 칸은 폭 16em 화면이라 앱 부품을 그대로 쓸 수 있다.

### 움직임 이름·화면 전환·텍스트 등장: 움직임 자체

이즈 인/아웃처럼 곡선이 주제면 `bare` 틀에 공이나 카드를 두고 `animation-timing-function`을 바꿔 보여 준다.
비교 대상(예: linear)을 회색으로 함께 두면 차이가 보인다. 화면 전환은 `phone` 안에서 화면 두 장을 `transform`으로 바꾼다.

```js
demo: { frame: 'bare', cycle: 3000, still: 1500, alt: '...',
  html: '<i class="ball b1"></i><i class="ball b2"></i><span class="lab l1">ease-in</span><span class="lab l2">linear</span>' }
// css: .t-motion-names-ease-in .b1{animation-name:mnMove;animation-timing-function:cubic-bezier(.55,0,1,.45)}
//      .t-motion-names-ease-in .b2{animation-name:mnMove;animation-timing-function:linear}
//      @keyframes mnMove{0%,10%{transform:none}70%,100%{transform:translateX(11em)}}
```

`animation-timing-function`을 요소에 직접 쓰면 키트 기본 곡선을 덮는다. 키프레임 안에서 구간별로 써도 된다.

### 디자인 스타일: 같은 대상을 스타일별로

같은 메모 카드(또는 장보기 앱 아이콘 하나)를 스타일마다 그린다. 정지에 가까워도 되고, 눌림이나 빛 반사 정도만 움직인다.
`bare` 틀에 카드 하나를 크게 둔다. 글래스모피즘처럼 배경이 필요하면 뒤에 단색 도형을 깔고 `backdrop-filter`를 쓴다.

### 제스처: 손가락과 화면 반응

```js
html: K => K.app.screen() + K.finger(12, 7.15, 'f1')
// css: .t-gestures-swipe .f1{animation-name:gsSwipe}  ${K.kf.drag('gsSwipe', 10, 40, -8, 0)}
//      화면 반응(행이 밀리는 것 등)은 같은 % 구간에 맞춰 키프레임을 쓴다.
```

길게 누르기는 `K.kf.press`, 두 번 탭은 `K.kf.tap` 두 개, 핀치는 손가락 두 개를 서로 반대로 `K.kf.drag`한다.

## 7. 주제 표

| 주제 | topic-id | 요소 수 | 레퍼런스 | 키프레임 접두사 | 권장 틀 |
|---|---|---|---|---|---|
| 웹 레이아웃 | web-layouts | 12 | layout.md | wl | browser |
| 화면 배치 | screen-layouts | 9 | layout.md | sl | browser |
| 화면 이동 | navigation | 9 | navigation.md | nv | phone |
| 하단 메뉴 스타일 | bottom-nav-styles | 11 | navigation.md, styles.md | bn | phone |
| 탭 바 전환 모션 | tab-bar-motion | 6 | navigation.md | tm | phone 또는 bare |
| 알림·피드백 | feedback | 9 | feedback.md | fb | phone (완성) |
| 버튼 상태 | button-states | 9 | inputs.md | bs | bare 또는 phone |
| 입력 | inputs | 8 | inputs.md | in | phone |
| 헷갈리는 짝 | confusable-pairs | 18 | confusable-pairs.md | cp | compare |
| 빈 화면 | empty-states | 9 | empty-loading.md | es | phone |
| 로딩 패턴 | loading | 9 | empty-loading.md | ld | phone |
| 인디케이터 | indicators | 9 | indicators-completion.md | id | phone |
| 완료 표시 | completion | 9 | indicators-completion.md | cm | phone |
| 앱 첫 화면 | first-run | 9 | onboarding.md | fr | phone |
| 움직임 이름 | motion-names | 9 | motion.md | mn | bare |
| 화면 전환 | transitions | 9 | motion.md | tr | phone |
| 텍스트 등장 | text-reveal | 9 | motion.md | tx | bare |
| 제스처 | gestures | 9 | gestures.md | gs | phone |
| 평점 UI | ratings | 9 | ratings-share.md | rt | phone |
| 공유 | sharing | 9 | ratings-share.md | sh | phone |
| AI 채팅 화면 | ai-chat | 9 | ai-chat.md | ai | phone |
| 디자인 스타일 | design-styles | 9 | styles.md | ds | bare |
| 모바일 스페이싱 | spacing | 6 | spacing.md | sp | phone |

요소 id는 `topics/_manifest.js`에 있다. 그 id를 그대로 같은 순서로 쓴다.

## 8. 흔한 실수

- 요소 id를 manifest와 다르게 쓴다. 콘솔에 `[UIGuide] ... id should be "..."` 경고가 나온다.
- 선택자를 `.t-<topic>-<element>` 없이 쓴다. 다른 주제의 같은 이름 클래스를 망가뜨린다.
- `animation:` 단축 속성이나 `animation-delay`를 쓴다. 길이가 틀어지거나 멈춤 장면이 어긋난다.
- 키프레임 0%와 100%가 달라 반복할 때 튄다.
- `still`이 탭 원이 떠 있는 순간이거나 요소가 아직 안 나온 순간이다.
- 시연 속 글을 길게 써서 작은 화면에서 넘친다. 화면 안 글은 한 줄 15자 안팎으로.
- 시연 안에서 짧은 일반 클래스 이름을 쓴다. `guide.css`가 `.ic`, `.ph`, `.nm`, `.chip`, `.skip`, `.step`, `.top`, `.tabs`, `.info`, `.pos`, `.hl`, `.tp`, `.w`, `.x`, `.r1`, `.grab` 같은 이름에 스타일을 걸고 있어 시연 안으로 새어 들어온다. 시연 안 클래스는 이 이름을 피하고, 헷갈리면 주제 접두사를 붙인다(예: `.fb-chip`).
- 글자 크기(`font-size`)가 있는 요소에 `left`, `top`을 em으로 준다. em이 그 요소의 글자 크기로 계산되어 위치가 어긋난다. 위치는 바깥 상자에, 글자 크기는 안쪽 요소에 준다.
- `var(--a-*)` 화면 색 토큰을 `.k-scr` 바깥(시연 루트)에서 쓴다. 토큰은 `.k-scr` 안에서만 풀린다.

## 9. 자가 점검

1. 브라우저로 `plugins/design-master/guide/index.html#<topic-id>`를 연다(`file://`로 열어도 된다).
2. 개발자 도구 콘솔에 오류나 `[UIGuide]` 경고가 없어야 한다. 경고는 필수 필드, id, cycle, still 문제를 알려 준다.
3. 오른쪽 위 멈춤 버튼으로 "시연 멈춤"을 켜서 요소마다 대표 장면이 제대로 보이는지 본다.
4. 창 폭을 약 390px로 줄여 화면 안 글이 넘치지 않는지, 가로 스크롤이 생기지 않는지 본다.
5. 요소를 끝까지 넘겨 보며(→ 키) 시연 하나하나가 3~6초 안에 한 바퀴를 돌고 처음 장면으로 자연스럽게 이어지는지 본다.
6. 전체 검색(오른쪽 위)에 요소 이름을 넣어 바로 가는지 본다.

headless로 확인하려면 playwright로 `index.html#<topic-id>-<element-id>`에 들어가 `console` 이벤트를 모으면 된다. 무거운 브라우저를 여러 개 띄우지 않는다.
