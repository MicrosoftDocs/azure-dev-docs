---
ms.topic: include
ms.date: 12/13/2022
---

This code uses CLI-based authentication (using `AzureCliCredential`) because it demonstrates actions that you might otherwise do with the Azure CLI directly. In both cases, you're using the same identity for authentication. Depending on your environment, you may need to run `az login` first to authenticate.

To use such code in a production script (for example, to automate VM management), use `DefaultAzureCredential` (recommended) or a service principal based method as described in [How to authenticate Python apps with Azure services](../sdk/authentication-overview.md).
