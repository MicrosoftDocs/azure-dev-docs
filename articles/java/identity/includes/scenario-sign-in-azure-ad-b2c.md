---
author: KarlErickson
ms.author: karler
ms.reviewer: bbanerjee
ms.date: 03/11/2024
---

The following diagram shows the topology of the app:

:::image type="content" source="../media/topology-sign-in.png" alt-text="Diagram that shows the topology of the app.":::

The app uses MSAL4J to sign in users and obtain an [ID token](/entra/identity-platform/id-tokens) from Azure AD B2C. The ID token proves that the user is authenticated against a Azure AD B2C tenant.
