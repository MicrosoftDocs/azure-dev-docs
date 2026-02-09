---
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: include
ms.date: 02/09/2026
ms.reviewer: anannyapatra
---

## Azure MCP Server start parameters

The `azmcp` server supports the following options for server start parameters:

| Option | Required or optional | Description |
|--------|----------------------|-------------|
| **Debug** | Optional | Enable debug mode with verbose logging to `stderr`. Default: `false`. |
| **Enable insecure transports** | Optional | Enable insecure transport. Default: `false`. |
| **Disable user confirmation** (Not recommended) | Optional | Disable user confirmation (elicitation) before allowing high risk commands to run, such as returning secrets (passwords) from KeyVault. When enabled, tools that handle secrets, credentials, or sensitive data will execute without user confirmation. This removes an important security layer designed to prevent unauthorized access to sensitive information. Only use this option in trusted, automated environments where user interaction is not possible. Never use this option in production environments or when handling untrusted input. Default: `false`. |
| **Mode** | Optional | Server mode: `namespace` (default), `consolidated`, `all`, or `single`. Default: `namespace`. |
| **Namespace** | Optional | The Azure service namespaces to expose on the MCP server (for example, `storage`, `keyvault`, `cosmos`). Default: all namespaces. |
| **Read only** | Optional | Whether the MCP server should be read-only. If true, no write operations are allowed. Default: `false`. |
| **Tool**| Optional | Expose specific tools by name (for example, `azmcp_storage_account_get`). It automatically switches to `all` mode. Default: all tools. |
| **Transport** | Optional | Transport mechanism to use for Azure MCP Server. Default: `stdio`. |
