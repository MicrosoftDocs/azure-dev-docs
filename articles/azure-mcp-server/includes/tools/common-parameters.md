---
 author: diberry
 ms.author: diberry
 ms.service: azure-mcp-server
 ms.topic: include
 ms.date: 05/01/2025
---

All Azure MCP Server tools support these common parameters:

| Arg | Required | Default | Description |
|-----------|----------|---------|-------------|
| `--subscription` | Yes | - | Azure subscription ID for target resources. |
| `--tenant-id` | No | - | Azure tenant ID for authentication. |
| `--auth-method` | No | `credential` | Authentication methods include `credential`, `key`, `connectionString`. |
| `--retry-max-retries` | No | 3 | Maximum retry attempts for failed operations. |
| `--retry-delay` | No | 2 | Delay between retry attempts in seconds. |
| `--retry-max-delay` | No | 10 | Maximum delay between retries in seconds. |
| `--retry-mode` | No | `exponential` | Retry strategies include `fixed` or `exponential`. |
| `--retry-network-timeout` | No | 100 | Network operation timeout in seconds. |
