---
author: brendm
ms.service: azure
ms.topic: include
ms.date: 02/09/2026
ms.author: bmitchell287
---

Token-based authentication offers the following advantages over connection strings:

- Token-based authentication ensures that only the specific apps intended to access the Azure resource can access it, whereas anyone or any app with a connection string can connect to an Azure resource.
- Token-based authentication enables you to limit Azure resource access to only the specific permissions needed by the app. This approach follows the [principle of least privilege](https://wikipedia.org/wiki/Principle_of_least_privilege). In contrast, a connection string grants full rights to the Azure resource.
- When you use a [managed identity](/entra/identity/managed-identities-azure-resources/overview) for token-based authentication, Azure handles administrative functions for you, so you don't need to worry about tasks like securing or rotating secrets. This approach makes the app more secure because there's no connection string or application secret that can be compromised.
- The Azure Identity library acquires and manages Microsoft Entra tokens for you.

Limit use of connection strings to scenarios where token-based authentication isn't an option, initial proof-of-concept apps, or development prototypes that don't access production or sensitive data. When possible, use the token-based authentication classes available in the Azure Identity library to authenticate to Azure resources.
