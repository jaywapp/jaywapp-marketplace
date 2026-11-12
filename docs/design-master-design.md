# design-master 설계

확인된 요구사항은 `design-master-analysis.md`와 같다.

## 구조

플러그인 하나에 지식(references)을 두고 스킬 4개와 HTML 틀 2개가 공유한다.

- `references/`: 주제별 14개 파일(layout, navigation, feedback, inputs, confusable-pairs, empty-loading, indicators-completion, onboarding, motion, gestures, ratings-share, ai-chat, styles, spacing)과 `quality-rules.md`, `decision-order.md`, `index.md`.
- `templates/`: `draft.html`(후보 비교), `demo.html`(요소 데모).
- `skills/`: `lookup`, `propose`, `build`, `review`, `guide`(가이드 페이지 열기). SKILL.md는 절차만 담고 지식은 references를 읽게 한다.
- 매니페스트: 이 마켓플레이스는 루트 `plugin.json`(검증 스크립트용)과 `.claude-plugin/plugin.json`(Claude Code용)을 함께 둔다. 기존 `agent-team-manager`, `debate`와 같은 방식이다.

- `guide/`: UI 요소 전체를 보여 주는 정적 가이드 페이지(`guide/index.html`). 별도 작업으로 만들며 상태는 pending이다. `guide` 스킬은 이 파일을 브라우저로 열고 주제를 말하면 `index.html#<topic-id>`로 연다. topic id 표는 페이지 완성 후 채운다.

## 제어 흐름

1. lookup: `index.md` -> 해당 파일 -> 답변. 요청 시 `demo.html`을 바탕으로 데모 생성.
2. propose: 파악 -> `decision-order.md`로 결정 지점 선택 -> 지점마다 후보 시안(`step-NN-*.html`) -> 채팅 선택 -> `decisions.md` 누적 -> `final.html`.
3. build: `decisions.md`와 `final.html` 읽기 -> 레포 스택과 토큰에 맞춰 구현 -> `quality-rules.md`로 점검 -> 결정과 대조해 보고.
4. review: 대상 렌더 또는 코드 -> `quality-rules.md`와 패턴 적합성 -> 심각도 순 보고. 기본은 읽기 전용.
5. guide: `guide/index.html` 존재 확인 -> 주제가 있으면 앵커와 함께 브라우저로 열기. 파일이 없으면 없다고 알린다.

## 결정과 근거

| 결정 | 근거 | 대안 |
|---|---|---|
| 플러그인 내부 파일은 `${CLAUDE_PLUGIN_ROOT}`로 가리킨다 | 공식 스킬 문서에 플러그인 스킬의 본문에서 이 변수가 치환되고 플러그인 안 어디의 파일이든 스킬 간 공유 자원 참조에 쓰라고 되어 있다. `${CLAUDE_SKILL_DIR}`는 스킬 하위 폴더를 가리켜 공유 references에 맞지 않는다 | 상대 경로(`../../references`). 변수가 치환되지 않을 때의 대체로 SKILL.md에 병기 |
| references를 주제별 14개로 묶는다 | 항목이 약 200개라 파일 하나는 읽기 비용이 크다. 스킬이 `index.md`만 읽고 필요한 파일만 읽게 한다 | 항목마다 파일(관리 어려움), 파일 하나(토큰 낭비) |
| 중복 항목은 본문 한 곳과 `참조:` 줄 | 같은 내용을 여러 곳에 두면 수정이 갈라진다 | 모두 복제 |
| 시안은 HTML 파일 하나, 외부 리소스 없음 | 결정 사항(레포 안 파일, 브라우저). 오프라인과 재현성 | 아티팩트(요청 시에만) |
| 후보끼리 해당 지점만 다르게 | 비교가 가능해야 선택이 의미 있다 | 후보마다 완전히 다른 화면 |
| 스페이싱 수치는 사용자 가이드 기본값, 레포 체계가 우선 | 레포마다 이미 토큰이 있을 수 있다 | 수치 고정 |
| 레지스트리는 수동 항목 추가 | `build-registry.mjs`가 `plugin.json`이 없는 기존 폴더(`qa-workflow`)를 만나면 실패하고 기존 파일을 보존하는 설계라 스크립트로 재생성할 수 없다 | `qa-workflow` 매니페스트를 추가하는 별도 정리 |

## 호환성과 보안

- 비밀 값이 없다. 외부 서비스 호출이 없다. HTML 틀에 외부 스크립트, 폰트, 이미지가 없다.
- 스킬은 대상 레포의 규칙(`CLAUDE.md`, `AGENTS.md`)을 우선한다. 레포가 시안 3종 요구 같은 UX 절차를 두면 그 절차를 따른다.
- 다른 디자인 스킬에 의존하지 않으므로 단독 설치가 된다.

## 검증 전략

1. `node scripts/validate-plugin.mjs plugins/design-master`와 기존 `scripts/runtime.test.mjs`.
2. inventory의 모든 항목이 references에 있는지 주제별 대조.
3. 모든 SKILL.md의 frontmatter 파싱, 스킬이 가리키는 경로 존재 확인.
4. `draft.html`, `demo.html` 문법 확인(태그 닫힘, 스크립트 구문).
5. `git status`와 `git diff --stat`으로 변경 범위 확인.
6. 이후 별도: 로컬 마켓플레이스 설치와 `gyungchung` 화면으로 propose, build, review 실행.
