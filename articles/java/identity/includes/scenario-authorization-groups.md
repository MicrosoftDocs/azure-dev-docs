---
ms.author: bbanerjee
ms.date: 03/11/2024
---

## Scenario

1. This web application uses MSAL for Java (MSAL4J) to sign in users a Microsoft Entra ID tenant and obtains an [ID token](/entra/identity-platform/id-tokens) from Microsoft Entra ID.

1. The ID token proves that a user has successfully authenticated with this tenant.

1. The web application protects its routes according to user's authentication status and group membership.
