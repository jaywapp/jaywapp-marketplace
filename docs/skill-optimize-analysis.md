# skill-optimize 마켓플레이스 추가 분석

## 요청

제공된 `skill-optimize` 스킬과 지원 파일을 `jaywapp-marketplace`에 등록한다.

## 현재 상태와 근거

- 대상 저장소: `D:\work\jaywapp-marketplace`
- 현재 작업 브랜치: `codex/workspace-environment-20260904`
- 저장소는 `plugins/<plugin-name>/` 구조와 루트 `plugin.json`, `README.md`, 플랫폼별 매니페스트를 사용한다.
- 기존 스킬 플러그인은 `plugins/*/skills/<skill-name>/SKILL.md`에 스킬을 둔다.
- `registry.json`에는 로컬 플러그인뿐 아니라 외부 저장소 항목도 존재하므로, 재생성 시 기존 외부 항목을 보존해야 한다.

## 결정 및 가정

- 플러그인 디렉터리는 `plugins/skill-optimize`로 만든다.
- 제공된 `/skill-optimize` 호출 방식과 `Read` 기반 progressive disclosure가 Claude Code 스킬에 맞으므로 플랫폼은 `claude`만 등록한다. Codex용 매니페스트는 요청 범위에 포함하지 않는다.
- 제공된 `reference.md`의 내용은 스킬 본문이 가리키는 경로와 적용 단계 명칭에 맞춰 `references/restructure.md`로 저장한다.
- 제공된 `measure.py`는 내용 변경 없이 `scripts/measure.py`에 저장한다.
- 플러그인 메타데이터의 작성자는 저장소 기존 항목과 같이 `jaywapp`, 라이선스는 `MIT`, 버전은 `1.0.0`으로 지정한다.

## 범위

- `plugins/skill-optimize` 신규 플러그인과 스킬 리소스 추가
- `registry.json`에 새 플러그인 등록
- 추가 파일의 구조·프런트매터·스크립트·플러그인 메타데이터 검증

## 비범위

- 다른 저장소 변경
- Codex 전용 플러그인 매니페스트 추가
- 스킬 내용의 재작성 또는 기능 확장
- 커밋, push, PR, 배포

## 완료 기준

1. `SKILL.md`, `references/restructure.md`, `scripts/measure.py`가 제공된 내용과 일치한다.
2. 플러그인 루트 및 Claude 매니페스트가 저장소 검증 규칙을 만족한다.
3. `registry.json`에 기존 5개 항목을 유지한 채 `skill-optimize`가 추가된다.
4. `measure.py --selftest`, 플러그인 검증, JSON 검증이 통과한다.
