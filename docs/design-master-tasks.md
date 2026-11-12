# design-master 작업

orchestrator: Claude

| 작업 | owner | model | effort | depends_on | parallel_group | files | verification | status |
|---|---|---|---|---|---|---|---|---|
| 분석, 설계 문서 | Claude | sonnet | medium | 없음 | docs | docs/design-master-* | 문서 검토 | completed |
| references 작성(14개 주제 파일, 품질 규칙, 결정 순서, 색인) | Claude | sonnet | high | 분석, 설계 문서 | content | plugins/design-master/references/* | inventory 항목 대조 | completed |
| templates 작성(draft, demo) | Claude | sonnet | medium | 분석, 설계 문서 | content | plugins/design-master/templates/* | HTML 문법 확인 | completed |
| 스킬 4개와 매니페스트, README | Claude | sonnet | high | references 작성 | skills | plugins/design-master/skills/*, plugin.json, .claude-plugin/plugin.json, README.md | frontmatter 파싱, 경로 존재 | completed |
| 등록(marketplace.json, registry.json, 루트 README) | Claude | sonnet | low | 스킬 4개와 매니페스트, README | register | .claude-plugin/marketplace.json, registry.json, README.md | 편집 전후 diff로 기존 항목 유지 확인 | completed |
| 정적 검증 | Claude | sonnet | medium | 등록 | verify | 없음 | validate-plugin, runtime.test, git diff | completed |
| 리뷰 지적 반영(High 1, Medium 8, Low 전부) | Claude | sonnet | high | 정적 검증 | review-fix | plugins/design-master/*, registry.json, .claude-plugin/marketplace.json | validate-plugin, HTML 구문, 링크와 앵커 확인 | completed |
| guide 스킬 추가(skills/guide/SKILL.md) | Claude | sonnet | low | 리뷰 지적 반영 | review-fix | plugins/design-master/skills/guide/SKILL.md | frontmatter 파싱 | completed |
| guide 페이지 작성(guide/index.html, topic id 채우기) | 별도 에이전트 | - | - | guide 스킬 추가 | guide | plugins/design-master/guide/*, skills/guide/SKILL.md의 topic id 표 | 브라우저에서 앵커 이동 확인 | pending |
| 로컬 마켓플레이스 설치와 스킬 호출 확인 | 사용자 확인 필요 | - | - | 정적 검증 | verify | 없음 | `/plugin` 설치 후 네 스킬 호출 | pending |
| gyungchung 화면 하나로 propose, build, review 실행 | 사용자 확인 필요 | - | - | 설치 확인 | verify | repos/gyungchung (별도 작업) | 끝까지 1회 실행 | pending |

같은 파일을 쓰는 작업은 순차로 했다. references, templates, docs는 서로 파일이 겹치지 않는다. 이 작업은 한 세션이 직접 작성했다(서브에이전트의 콜드 스타트 비용이 컸다).

push, PR, 마켓플레이스 게시는 사용자 확인 전에 하지 않는다. 마지막 두 작업은 설치와 실행이 필요해 이 작업에서 하지 않았다.
