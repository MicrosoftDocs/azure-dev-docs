---
author: KarlErickson
ms.author: bbanerjee
ms.date: 03/11/2024
---

The following diagram shows the topology of the app:

:::image type="content" source="../media/topology-sign-in.png" alt-text="Diagram that shows the topology of the app.":::

The client app uses MSAL for Java (MSAL4J) to sign in users to their own Microsoft Entra ID tenant and obtain an [ID token](/entra/identity-platform/id-tokens) from Microsoft Entra ID. The ID token proves that a user is authenticated with this tenant. The app protects its routes according to the user's authentication status.
