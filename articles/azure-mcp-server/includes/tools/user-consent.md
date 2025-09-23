---
author: diberry
ms.service: azure
ms.topic: include
ms.author: diberry
ms.date: 09/23/2025
---

Tools that handle sensitive data, such as secrets, require user consent before execution through a security mechanism called **elicitation**. When you use tools that access sensitive information, the MCP client prompts you to confirm the operation before proceeding.

> **🛡️ Elicitation (user confirmation) Security Feature:**
> 
> Elicitation prompts appear when tools might expose sensitive information like:
> - Key Vault secrets
> - Connection strings and passwords
> - Certificate private keys
> - Other confidential data
>
> These prompts protect against unauthorized access to sensitive information. You can bypass elicitation only in automated scenarios.