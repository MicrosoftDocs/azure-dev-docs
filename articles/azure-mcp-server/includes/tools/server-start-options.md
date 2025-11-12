---
 author: diberry
 ms.author: diberry
 ms.service: azure-mcp-server
 ms.topic: include
 ms.date: 11/12/2025
---

## Azure MCP Server start parameters

The `azmcp` server supports the following options for server start parameters:

| Option | Required or optional | Description |
|--------|----------------------|-------------|
| **Debug** | Optional | Enable debug mode with verbose logging to `stderr`. |
| **Enable insecure transports** | Optional | Enable insecure transport. |
| **Insecure disable user confirmation** | Optional | Disable user confirmation (elicitation) before allowing high risk commands to run, such as returning secrets (passwords) from KeyVault. |
| **Mode** | Optional | Server mode: `namespace` (default), `consolidated`, `all`, or `single`. |
| **Namespace** | Optional | The Azure service namespaces to expose on the MCP server (for example, `storage`, `keyvault`, `cosmos`). |
| **Read only** | Optional | Whether the MCP server should be read-only. If true, no write operations are allowed. |
| **Tool**| Optional |	Expose specific tools by name (for example, `azmcp_storage_account_get`). It automatically switches to `all` mode. It can't be used together with the namespace option. |
| **Transport** | Optional | Transport mechanism to use for Azure MCP Server. |
