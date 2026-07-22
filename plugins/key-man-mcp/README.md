# KeyMan MCP

KeyMan MCP connects Codex and Claude Code to secrets stored locally in Windows Credential Manager. Tool responses contain metadata and confirmations only; they never contain secret values.

## Prerequisite

Install the latest KeyMan Windows installer from [jaywapp/key-man releases](https://github.com/jaywapp/key-man/releases). Confirm that `key-man-mcp.exe` is available on `PATH` in a newly opened terminal:

```powershell
Get-Command key-man-mcp.exe
```

## Tools

- `keyman_list` lists non-sensitive metadata.
- `keyman_copy` copies a stored value to the local Windows clipboard.
- `keyman_register_from_clipboard` stores the current clipboard value.
- `keyman_register_from_environment` stores a named local environment variable.
- `keyman_remove` deletes an entry after client confirmation.

Never paste a secret into an AI prompt. Put it on the local clipboard or in a temporary environment variable and ask the agent to use the corresponding registration tool.

## Codex

Install this plugin from the jaywapp marketplace. Without the plugin, the equivalent manual command is:

```powershell
codex mcp add key-man -- key-man-mcp.exe
```

## Claude Code

Install `key-man-mcp` from the jaywapp marketplace. The plugin's `.mcp.json` starts the same local stdio server automatically.

## Example requests

- "List my KeyMan entries for GitHub."
- "Copy the Production GitHub token to my local clipboard."
- "Register the current clipboard as Sample for Demo/Development."
- "Register the local `OPENAI_API_KEY` environment variable as OpenAI."
