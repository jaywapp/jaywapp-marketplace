---
name: key-man
description: Use when the user wants to list, copy, register, or remove secrets in the local KeyMan Windows credential vault through MCP.
---

# KeyMan MCP workflow

Use the `key-man` MCP server for local credential operations.

## Safety rules

- Never ask the user to paste a secret into the conversation.
- Never call a tool or shell command that prints a secret value.
- Use `keyman_list` for discovery; it returns metadata only.
- Use `keyman_copy` when the user needs a stored secret on their local clipboard.
- Register secrets only with `keyman_register_from_clipboard` or `keyman_register_from_environment`.
- Treat notes as non-sensitive metadata.
- Before `keyman_remove`, state the exact name, service, and environment being removed and rely on the client's destructive-tool confirmation.

If multiple entries share a name, use the service and environment fields returned by `keyman_list` to disambiguate.
