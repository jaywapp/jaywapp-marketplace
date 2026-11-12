# design-master

디자이너가 아닌 개발자가 웹·모바일 화면을 만들 때 어색한 UI가 나오지 않도록 돕는 Claude Code 플러그인이다.
UI 요소 지식(`references/`)을 하나로 두고 네 가지 스킬이 같이 쓴다.

## 스킬

| 스킬 | 하는 일 | 호출 예 |
|---|---|---|
| `design-master:lookup` | UI 요소 이름, 쓰임, 비교를 답한다. 요청하면 동작하는 HTML 데모를 만든다. 평소 대화의 UI 질문에도 자동으로 쓰인다 | "토스트랑 스낵바 차이가 뭐야", "아래에서 올라오는 패널 이름이 뭐야" |
| `design-master:propose` | 화면의 결정 지점마다 후보 시안을 HTML로 나란히 보여 주고 채팅에서 고르게 한다. 선택은 `decisions.md`에 쌓인다 | "로그인 화면 시안 제안해줘" |
| `design-master:build` | 고른 결정(`decisions.md`, `final.html`)대로 대상 레포의 스택과 토큰에 맞춰 구현하고 점검한다 | "고른 대로 구현해줘" |
| `design-master:guide` | UI 요소 전체를 보여 주는 가이드 페이지(`guide/index.html`)를 브라우저로 연다. 주제를 말하면 그 부분으로 연다. 가이드 페이지는 준비 중(pending)이며 파일이 없으면 없다고 알린다 | "UI 가이드 열어줘" |
| `design-master:review` | 기존 화면을 품질 규칙(Q01~Q16)과 패턴 적합성으로 점검해 심각도 순으로 보고한다. 기본은 점검만 한다 | "이 화면 UI 리뷰해줘" |

## 설치

이 마켓플레이스를 등록하고 플러그인을 설치한다.

```
/plugin marketplace add jaywapp/jaywapp-marketplace
/plugin install design-master@jaywapp-marketplace
```

로컬 체크아웃으로 시험할 때는 `/plugin marketplace add <체크아웃 경로>`를 쓴다.

## 흐름

1. 요소가 궁금하면 `lookup`.
2. 새 화면이면 `propose`로 결정 지점마다 시안을 보고 고른다. 결과는 대상 레포의 `docs/ux-concepts/<slug>/`에 쌓인다.
   - `step-NN-<지점>.html`: 지점별 후보 비교
   - `decisions.md`: 선택과 이유
   - `final.html`: 선택을 합친 최종 시안
3. `build`가 `decisions.md`와 `final.html`을 읽고 구현한다.
4. 이미 있는 화면은 `review`.

시안은 레포 안 HTML 파일로 저장하고 브라우저로 연다. claude.ai 아티팩트는 요청할 때만 올린다.

## 구성

```
design-master/
  plugin.json                  마켓플레이스 검증과 레지스트리용 메타데이터
  .claude-plugin/plugin.json   Claude Code 플러그인 매니페스트
  references/                  지식(모든 스킬이 공유)
    index.md                   파일 목록과 항목 이름 전체, 항목 추가 방법
    layout.md  navigation.md  feedback.md  inputs.md  confusable-pairs.md
    empty-loading.md  indicators-completion.md  onboarding.md  motion.md
    gestures.md  ratings-share.md  ai-chat.md  styles.md  spacing.md
    quality-rules.md           기본 품질 규칙 Q01~Q16
    decision-order.md          화면 하나를 만들 때의 결정 순서
  templates/
    draft.html                 시안 비교 페이지 틀
    demo.html                  요소 데모 페이지 틀
  guide/                       가이드 페이지(준비 중, 별도 작업)
  skills/lookup  propose  build  review  guide
```

## 지식 추가

새 UI 항목을 덧붙이는 방법은 `references/index.md`의 "항목 추가 방법"을 따른다. 항목은 `### 이름 (English)` 아래에 무엇, 언제, 피할 때, 구현 주의, 비슷한 것 순으로 쓴다.

## 주의

- 지식은 스택 중립이다. 구현은 대상 레포의 스택, 디자인 시스템, 토큰을 따른다. 레포에 간격 체계가 있으면 `references/spacing.md`의 기본 수치보다 그것이 우선이다.
- 다른 디자인 스킬(impeccable, design-taste-frontend 등)에 의존하지 않는다. 레포 규칙이 그런 스킬의 사용을 요구하면 그 규칙이 우선한다.
- 스킬은 플러그인 안 파일을 `${CLAUDE_PLUGIN_ROOT}/...`로 가리킨다.
