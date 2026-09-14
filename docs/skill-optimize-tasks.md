# skill-optimize 마켓플레이스 추가 작업 계획

## 작업 메타데이터

- `orchestrator`: Codex
- 공통 작업 경계: 동일 저장소·동일 브랜치에서 순차 수행
- 병렬 실행: 없음 — 신규 플러그인 파일과 registry가 같은 작업 결과에 의존한다.

## 작업 목록

| ID | 작업 | owner | model | effort | depends_on | parallel_group | files | verification | status |
|---|---|---|---|---|---|---|---|---|---|
| T1 | 분석·설계 문서 작성 | Codex | gpt-5.6-terra | low | - | sequential | `docs/skill-optimize-analysis.md`, `docs/skill-optimize-design.md` | 문서 내용·범위 검토 | completed |
| T2 | 플러그인·스킬 리소스 추가 | Codex | gpt-5.6-terra | medium | T1 | sequential | `plugins/skill-optimize/**` | 매니페스트·파일 구조 검토 | completed |
| T3 | marketplace registry 신규 항목 병합 | Codex | gpt-5.6-terra | low | T2 | sequential | `registry.json` | 기존 항목 보존·JSON 파싱 | completed |
| T4 | 통합 검증 및 작업 문서 갱신 | Codex | gpt-5.6-terra | medium | T3 | sequential | `docs/skill-optimize-tasks.md` | plugin validator, `measure.py --selftest`, `git diff --check` | completed |

## 상태 기록

- T1은 구현 전에 완료했다.
- T2는 플러그인 메타데이터와 스킬 본문·reference·측정기를 추가했다.
- T3는 `skill-optimize`를 추가하면서 기존 `toss-mcp` 외부 항목을 보존했다.
- T4 검증 결과: 플러그인 validator 통과, `measure.py --selftest` 통과, 실제 측정 orphan 0개, JSON/frontmatter/routing 검사 통과, `git diff --check` 통과.
- `skill-creator`의 `quick_validate.py`는 실행 Python에 `PyYAML`이 없어 실행되지 않았다. 의존성 설치나 외부 변경 없이 대체 정적 검사를 수행했다.
