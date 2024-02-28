---
ms.author: bbanerjee
ms.date: 01/01/2024
ms.custom: devx-track-java
---

## Scenario

1. This web application uses **MSAL for Java (MSAL4J)** to sign in users an Microsoft Entra ID tenant and obtains an [ID Token](/en-us/entra/identity-platform/id-tokens) from **Microsoft Entra ID**.
2. The **ID Token** proves that a user has successfully authenticated with this tenant.
3. The web application protects its routes according to user's authentication status and group membership.
