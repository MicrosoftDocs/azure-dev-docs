---
ms.topic: include
ms.date: 11/12/2025
---
## Tool annotations for Azure MCP Server

[Tool annotations](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations) are hints that provide additional information about the characteristics of each tool. The following table describes the possible hints that can be associated with a tool.

| Name | Description |
|------|-------------|
| **Destructive** | Indicates whether the tool can make destructive updates to its environment. If true, the tool might delete or modify existing resources. If false, the tool only adds new resources without removing or altering existing ones. |
| **Idempotent** | Specifies if repeated calls with the same arguments produce the same result without side effects. If true, multiple executions with the same arguments produce the same result. If false, repeated executions might have additional effects or yield different results. |
| **Open world** | Defines whether the tool might interact with an "open world" of external entities. If true, the tool might interact with an unpredictable or dynamic set of entities (for example, web search). If false, the tool's domain of interaction is closed and well-defined (for example, memory access). |
| **Read only** | Indicates if the tool performs only read operations. If true, there's no change of state of the environment. If false, the tool might make modifications to its environment. |
| **Secret** | Microsoft proprietary annotation that indicates if the tool's response might contain sensitive data requiring sanitization. If true, the response might include secrets, credentials, or keys that should be sanitized before forwarding to the LLM or logging. If false, the response doesn't contain sensitive information. |
| **Local required** | Microsoft proprietary annotation to indicate if the tool requires local execution or resources. If true, the tool is only available when the Azure MCP server runs in Local (STDIO) mode. If false, the tool is available in both local and remote server modes. |