# mcp-plugin-template

Claude Code와 Codex에서 공유 가능한 MCP 서버 플러그인 템플릿입니다.

## 구조

```
mcp-plugin-template/
├── .claude-plugin/
│   └── plugin.json       # Claude Code 플러그인 매니페스트
├── .codex-plugin/
│   └── plugin.json       # Codex 플러그인 매니페스트
├── .agents/
│   └── plugins/
│       └── marketplace.json  # Codex 마켓플레이스 — 위치가 다르니 주의
├── .mcp.json             # Claude Code용 MCP 서버 설정
├── .codex.mcp.json       # Codex용 MCP 서버 설정
└── src/
    └── index.js          # MCP 서버 구현 (양쪽 플랫폼 공유)
```

> **Codex 마켓플레이스 파일은 `.agents/plugins/marketplace.json` 입니다.**
> `.codex-plugin/plugin.json` 만 두면 Codex 가 플러그인을 아예 인식하지 못합니다.

## 사용 방법

### 1. 템플릿 복사

```bash
cp -r plugin-templates/mcp-plugin-template plugins/my-mcp-plugin
```

### 2. TODO 항목 수정

아래 파일의 `[TODO: ...]` 부분을 채워넣습니다.

- `.claude-plugin/plugin.json` — `name`, `author`, `homepage`, `repository`
- `.codex-plugin/plugin.json` — 동일 항목 + `interface.developerName`, `interface.websiteURL` 등
- `.agents/plugins/marketplace.json` — `name`, `interface.displayName`, `plugins[].name`

### 3. MCP 서버 구현

`src/index.js`에 MCP 서버 로직을 작성합니다.

```js
// src/index.js 예시
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer({ name: 'my-mcp-plugin', version: '1.0.0' });

server.tool('my-tool', '도구 설명', {}, async () => {
  return { content: [{ type: 'text', text: 'Hello!' }] };
});

server.run();
```

## 플랫폼별 MCP 설정 차이

| | Claude Code | Codex |
|---|---|---|
| MCP 설정 파일 | `.mcp.json` | `.codex.mcp.json` |
| 플러그인 루트 참조 | `${CLAUDE_PLUGIN_ROOT}` | 변수 없음 — `cwd: "."` 가 설치 경로로 해석됨 |
| 영속 데이터 디렉터리 | `${CLAUDE_PLUGIN_DATA}` | 없음 (업데이트 시 재생성) |
| 사용자 설정값 입력 | `userConfig` + `${user_config.KEY}` | 없음 — `env_vars` 로 사용자 환경변수를 전달 |

자격증명이 필요한 플러그인은 이 차이가 중요합니다. Claude Code는 설치 시 입력창으로 받아
보안 저장소에 넣지만, Codex는 사용자가 미리 환경변수를 등록해 두어야 합니다.

```json
// .codex.mcp.json — 자격증명을 사용자 환경에서 전달받는 예
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["./src/index.js"],
      "cwd": ".",
      "env_vars": ["MY_API_KEY"]
    }
  }
}
```

## 마켓플레이스 등록

### 이 저장소에 등록

`plugin.json`을 루트에 추가하고 [CONTRIBUTING.md](../../CONTRIBUTING.md)를 참고해 PR을 제출하세요.

### 별도 저장소로 배포

코드가 무거운 플러그인은 자체 저장소에 두고 마켓플레이스에서 외부 소스로 참조합니다.

```bash
# Claude Code
/plugin marketplace add owner/repo
/plugin install <name>@<marketplace>

# Codex
codex plugin marketplace add owner/repo
codex plugin add <name>@<marketplace>
```
