---
name: skill-optimize
description: Use when the user invokes /skill-optimize <skill-dir>, or asks to reduce a skill's context/token cost, shrink a bloated SKILL.md, split a skill into references, or audit a skill for duplicated or conflicting rules. Triggers - "스킬 최적화", "SKILL.md 너무 커", "스킬 토큰 줄여", "progressive disclosure 적용", "스킬 구조 점검".
---

# skill-optimize

## Overview

큰 SKILL.md를 "요약해서 작게" 만드는 작업이 아니다. **항상 로드되는 control plane(SKILL.md)** 과 **필요할 때만 읽는 knowledge plane(references/, scripts/)** 으로 재설계한다.
정보는 없애지 않고 **로딩 시점만 늦춘다.** 목표 지표:

```
Expected Context Cost ≈ Σ(reference tokens × load probability)
```

전체를 30% 압축하는 것보다, 70%를 호출 확률 10%짜리 reference로 옮기는 편이 훨씬 크게 줄어든다.

출처: github.com/jaywapp/wiki/blob/…/skill-file-context-optimization.md

## 입력

`/skill-optimize <skill-dir> [--apply]` — `<skill-dir>`은 SKILL.md가 있는 디렉토리. `--apply`가 없으면 분석·제안 보고서까지만 하고 멈춘다.

## 변경 계약 (Invariants)

이 작업에서 **새로 쓰는 텍스트는 다섯 종류뿐**이다. 그 외 모든 문장은 cut & paste로 위치만 바뀐다.

1. **통합된 중복 규칙** — 같은 뜻의 규칙 여러 줄을 하나의 invariant로 합친 결과물.
2. **routing table** — SKILL.md에 새로 추가되는 `조건 → 파일` 목록.
3. **이동 자리의 한 줄 포인터** — 옮겨간 섹션 자리에 남기는 `세부 → references/x.md`.
4. **reference 파일 머리 두 줄** — `# <제목>` 과 "언제 읽는가" 한 줄.
5. **frontmatter description** — 트리거 조건만 적는다(언제 쓰는지). 워크플로우 요약은 넣지 않는다.

그리고:

- **안전 규칙·절대 규칙·완료 조건은 SKILL.md에 남는다.** routing이 실패해도 지켜져야 하는 것은 reference로 내리지 않는다.
- **reference 한 파일 = 한 관심사, 약 300토큰 이상.** 그보다 작은 조각은 이웃 관심사 파일에 합친다. 파일 수는 보통 2~6개.
- **모든 reference는 routing table에 등재된다.** orphan 0개(measure.py가 검출).
- 대상 스킬 디렉토리 밖의 파일은 만들지도 고치지도 않는다.

## Workflow

1. **Measure** — 아래 명령을 실행하고 결과 파일을 읽는다(한글 출력은 콘솔 대신 파일로).
   ```
   python <이 스킬 디렉토리>/scripts/measure.py <skill-dir> --out <scratchpad>/before.txt
   ```
   얻는 것: always-on 토큰, 전체 토큰, 섹션 표(토큰·코드비율·힌트), 중복 후보 줄, 기존 lazy 파일과 orphan.
2. **Classify** — SKILL.md 본문을 읽고 섹션마다 Hot/Warm/Cold/Script/State를 판정한다(아래 표). 스크립트 hint는 헤딩 기반 추정이므로 참고만 한다.
3. **Propose** — 보고서 형식으로 분할안을 쓴다. `--apply`가 없으면 **여기서 종료**하고 사용자 확인을 기다린다 (CONFIRM REQUIRED — 스킬을 덮어쓰며 버전관리가 없을 수 있음).
4. **Apply** — `references/restructure.md`를 읽고 그 순서대로 수행한다: Dedup → Split → Route → Offload 후보 → State 분리.
5. **Evaluate** — measure.py를 다시 실행해 `after.txt`를 만들고 before와 비교한다. 통과 조건:
   - orphan 0개
   - always-on 토큰 감소
   - **전체 토큰(SKILL.md + lazy)이 before의 90% 미만이면 내용 유실·압축 의심** → 이동한 섹션을 원문과 대조해 복원한다. 정당한 감소는 중복 통합분만이다.
6. **Report** — 전/후 수치, 최종 파일 구조, 남은 후보(scripts 이관, description 재작성)를 보고한다.

## Hot / Warm / Cold 판정 기준

기준은 파일 크기가 아니라 **활성화 빈도 × 토큰**이다. 매 호출마다 결국 읽게 되는 내용은 분리해도 이득이 없다(Read 호출만 는다).

| 등급 | 판정 | 처리 |
|---|---|---|
| **Hot** | 거의 모든 호출에서 필요: 목적, 트리거, 절대 규칙, 기본 실행 순서, 완료 조건, routing | SKILL.md 유지 |
| **Warm** | 특정 workflow·모드에서만 필요: 모드별 절차, 플랫폼별 지침, "N개 중 1개 선택"하는 선택지 묶음 | `references/<workflow>.md` + routing 조건 |
| **Cold** | 가끔 필요: 긴 예제, edge case 목록, troubleshooting, 비교표, 배경 설명, 변경 이력 | `references/<topic>.md` + routing 조건 |
| **Script** | 검증·파싱·포맷·스캔 같은 결정적 작업을 자연어로 길게 설명한 부분 | `scripts/` 이관 **후보로 보고만** 한다. 새 스크립트는 사용자 확인 후 별 작업 |
| **State** | 세션 상태, 최근 결과, backlog처럼 실행마다 달라지는 내용 | 별도 state 파일로 분리, SKILL.md는 metadata만 스캔 |

로드 확률은 **실제로 Read되는 파일 단위**로 본다. "N개 중 1개 선택" 묶음은 옵션별 파일(각 300토큰 이상)로 나눌 수 있으면 확률 1/N인 Warm이고, 묶음 파일 하나로 두어야 하면 그 묶음을 여는 호출 비율이 확률이다. 그 비율이 1에 가까우면 Hot과 같다.

## 보고서 형식 (Propose·Report 공용)

```
## skill-optimize: <name>
before: SKILL.md N lines / ~T tok always-on / total ~X tok, lazy K files
| 섹션(줄) | tok | 등급 | 이동 위치 |
| ...      | ... | Hot/Warm/Cold/Script/State | 유지 / references/x.md / 후보 |
중복 통합: Lx + Ly → "<통합 문장>"  (n건, 없으면 "없음")
after(예상 또는 실측): SKILL.md ~T' tok (-P%) / total ~X' tok
  references/a.md ~A tok  ← IF <조건>
  references/b.md ~B tok  ← IF <조건>
남은 후보: scripts 이관 n건 / description 재작성 여부 / State 분리 여부
```

## Load references only when needed

- Apply 단계(`--apply` 또는 사용자 승인 후) → `references/restructure.md`
- 그 외 단계에서는 reference를 읽지 않는다.
