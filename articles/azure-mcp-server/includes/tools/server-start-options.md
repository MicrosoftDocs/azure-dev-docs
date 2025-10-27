---
 author: diberry
 ms.author: diberry
 ms.service: azure-mcp-server
 ms.topic: include
 ms.date: 10/27/2025
---

## Azure MCP Server start parameters

The `azmcp` server supports the following options for server start parameters:

| Option | Required or optional | Description |
|--------|----------------------|-------------|
| **Debug** | Optional | Enable debug mode with verbose logging to `stderr`. |
| **Enable insecure transports** | Optional | Enable insecure transport. |
| **Insecure disable user confirmation** | Optional | Disable user confirmation (elicitation) before allowing high risk commands to run, such as returning secrets (passwords) from KeyVault. |
| **Namespace** | Optional | The Azure service namespaces to expose on the MCP server (for example, `storage`, `keyvault`, `cosmos`). |
| **Read only** | Optional | Whether the MCP server should be read-only. If true, no write operations are allowed. |
| **Transport** | Optional | Transport mechanism to use for Azure MCP Server. |
