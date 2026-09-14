# Apply 절차: Dedup → Split → Route → Offload 후보 → State 분리

Workflow 4단계(`--apply`)에서만 읽는다. 각 단계의 산출물은 SKILL.md의 "변경 계약"을 벗어나지 않는다.

## 1. Dedup

measure.py의 중복 후보(유사도 ≥ 0.75)와 Classify에서 읽은 본문을 합쳐 **같은 뜻의 규칙**을 찾는다.

```
Before
- 요청하지 않은 파일 수정 금지
- 범위 밖 변경 금지
- 관련 없는 리팩터링 금지

After
- Scope invariant: 요청을 수행하는 데 직접 필요한 변경만 한다.
```

- 통합문은 원래 줄들 중 가장 상위(Hot) 위치에 두고, 나머지 위치의 줄은 제거한다.
- 의미가 달라질 정도로는 합치지 않는다. 애매하면 둘 다 남기고 보고서에 "판단 보류"로 적는다.
- 금지문 나열은 가능하면 원하는 행동 서술로 바꾼다 — 단, 이것도 통합 대상 줄에만 적용한다(다른 문장을 다듬는 근거가 아니다).

## 2. Split

Classify 표에 따라 Warm/Cold 섹션을 **헤딩 포함 원문 그대로** 잘라 붙인다.

- 파일명은 관심사로 짓는다: `references/workflow-<mode>.md`, `references/examples.md`, `references/troubleshooting.md`, `references/platform-<os>.md`, `references/<topic>.md`.
- 각 reference 첫 줄에 `# <제목>`, 둘째 줄에 "언제 읽는가" 한 줄을 붙인다. 그 아래는 원문.
- SKILL.md에서 잘려 나간 자리에는 한 줄만 남긴다: `세부 → references/<file>.md`.
- 300토큰 미만 조각은 가장 가까운 관심사 파일에 합친다. "N개 중 1개 선택" 묶음은 선택지별 파일이 각각 300토큰을 넘을 때만 개별 파일로 쪼개고, 아니면 묶음 하나로 둔다.
- 예제 예산: 대표 positive example 1~2개는 SKILL.md에 남겨도 된다. 나머지는 `examples.md`.
- 공통 규칙이 여러 reference에 복제되면 SKILL.md로 끌어올린다(reference 간 충돌 방지).

## 3. Route

SKILL.md의 Workflow 섹션 직후에 routing table을 둔다. Workflow 섹션이 없는 스킬(페르소나·스타일 가이드형)은 말미에 둔다.

```markdown
## Load references only when needed
- IF <작업 종류 == debugging>     → references/debugging.md
- IF <platform == windows>        → references/platform-windows.md
- IF <validation failed>          → references/troubleshooting.md
- IF <출력 예제가 필요한 경우>     → references/examples.md

관련 없는 reference는 읽지 않는다.
```

- 조건은 **관찰 가능한 술어**(작업 종류, 모드, 플랫폼, 실패 여부, 사용자 요청 문구)로 쓴다. "필요하면"은 조건이 아니다.
- 모든 reference 파일이 정확히 한 번 이상 등재되어야 한다. measure.py의 ORPHAN 표시가 0이 될 때까지 고친다.

### description 재작성 (선택)

frontmatter description이 스킬의 동작·절차를 요약하고 있으면 **트리거 조건만** 남긴 문장으로 바꾼다.

- `Use when ...`으로 시작, 3인칭, 증상·상황·사용자 문구 위주.
- 절차 요약을 넣지 않는다 — 에이전트가 본문 대신 description만 따라가는 원인이 된다.
- frontmatter 전체 1024자 이하, description 500자 이하 권장.

## 4. Offload 후보

자연어로 길게 적힌 결정적 절차(검증 규칙 수십 줄, 포맷 변환, 파일 스캔, 스키마 검사)는 스크립트 이관 후보다.

- 이 스킬에서는 **후보를 보고서에 적는 것까지만** 한다. 스크립트 작성은 사용자 확인 후 별 작업.
- 이관 시 SKILL.md에는 `스크립트를 실행하고 실패 시 중단` 한 줄만 남는다는 예상 절감을 함께 적는다.

## 5. State 분리

SKILL.md에 세션 상태·최근 작업 결과·observation backlog가 섞여 있으면 별도 state 파일(예: `state.md`, `state.json`)로 옮기고, SKILL.md에는 "필요 시 frontmatter/metadata만 스캔"하는 한 줄을 남긴다.

## Pitfalls

- **하네스가 on-demand 로딩을 지원해야 효과가 있다.** Claude Code는 Read로 가능. 스킬 전체를 하나의 프롬프트로 합치는 하네스라면 분리해도 절감이 없다.
- **과분해는 tool-call 오버헤드를 만든다.** 파일 수십 개로 쪼개면 탐색·지연이 늘어난다. 의미 단위 2~6개가 보통 적정선.
- **routing 오류**: SKILL.md가 필요한 reference를 정확히 안내하지 못하면 중요한 지침을 읽지 않고 작업한다. 그래서 안전·절대 규칙은 내리지 않는다.
- **reference 간 충돌**: 같은 규칙이 여러 reference에 복제되면 instruction conflict가 다시 생긴다. 공통 규칙은 상위 계층으로.
