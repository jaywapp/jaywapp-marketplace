# skill-optimize 마켓플레이스 추가 설계

## 구조

```text
plugins/skill-optimize/
├── plugin.json
├── README.md
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── skill-optimize/
        ├── SKILL.md
        ├── references/
        │   └── restructure.md
        └── scripts/
            └── measure.py
```

## 실행 및 로딩 흐름

1. 마켓플레이스가 `skill-optimize` 플러그인을 검색·설치한다.
2. Claude Code가 `skills/skill-optimize/SKILL.md`의 frontmatter를 읽고 트리거를 판단한다.
3. 분석 단계에서는 `scripts/measure.py`를 실행하고, 결과를 기준으로 본문을 분류한다.
4. `--apply` 또는 사용자 승인 후에만 `references/restructure.md`를 읽어 재구성 절차를 적용한다.
5. 스킬의 자체 완료 조건에 따라 전후 측정값과 orphan 여부를 보고한다.

## 매니페스트

- 루트 `plugin.json`: 마켓플레이스 인덱스가 요구하는 공통 필드와 `claude` 플랫폼을 선언한다.
- `.claude-plugin/plugin.json`: Claude Code에 플러그인 이름·버전·설명·skills 경로를 제공한다.
- Codex·Cursor·MCP 매니페스트는 해당 플랫폼 기능이 요청되지 않았으므로 만들지 않는다.

## 호환성 및 보안

- `measure.py`는 Python 표준 라이브러리만 사용하며 외부 네트워크나 비밀정보를 다루지 않는다.
- 스킬의 안전·절대 규칙은 사용자가 제공한 `SKILL.md`에 그대로 둔다.
- registry 갱신은 외부 저장소인 `toss-mcp` 항목을 삭제하지 않는 병합 방식으로 수행한다.

## 검증 전략

- `node scripts/validate-plugin.mjs plugins/skill-optimize`
- `python plugins/skill-optimize/skills/skill-optimize/scripts/measure.py --selftest`
- 각 JSON 파일의 파싱 검사
- `registry.json`의 기존 항목 보존 및 신규 항목 확인
- `git diff --check`와 변경 파일·범위 최종 검토
