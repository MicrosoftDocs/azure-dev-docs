---
 author: diberry
 ms.author: diberry
 ms.service: azure-mcp-server
 ms.topic: include
 ms.date: 05/01/2025
---

All responses follow a consistent JSON format:

| Property | Type | Description |
|----------|------|-------------|
| `status` | string | HTTP response status code indicating success or failure (examples include "200", "403", "500"). |
| `message` | string | Human-readable message providing context about the operation result. |
| `args` | array | List of arguments that were passed to the operation. |
| `results` | array | Collection of data returned from the operation. |
| `duration` | number | Time taken to complete the operation in milliseconds. |

```json
{
  "status": "200",
  "message": "",
  "args": [],
  "results": [],
  "duration": 123
}
```
