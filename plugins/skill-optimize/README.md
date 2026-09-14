# skill-optimize

SKILL.md의 컨텍스트·토큰 비용을 측정하고, 항상 로드되는 control plane과 필요할 때만 읽는 knowledge plane으로 재구성하는 Claude Code 스킬입니다.

## 호출

```text
/skill-optimize <skill-dir>
/skill-optimize <skill-dir> --apply
```

`--apply`가 없으면 분석·제안 보고서만 출력하고, 적용 전 사용자 확인을 요구합니다.

## 포함 파일

- `skills/skill-optimize/SKILL.md` — 스킬 규칙과 실행 흐름
- `skills/skill-optimize/references/restructure.md` — 적용 단계별 세부 절차
- `skills/skill-optimize/scripts/measure.py` — 결정적 비용·중복·orphan 측정기
