---
author: KarlErickson
ms.author: karler
ms.reviewer: bbanerjee
ms.date: 03/11/2024
---

The following diagram shows the topology of the app:

:::image type="content" source="../media/topology.png" alt-text="Diagram that shows the topology of the app.":::

The client app uses MSAL for Java (MSAL4J) to sign in users to a Microsoft Entra ID tenant and obtain an [ID token](/entra/identity-platform/id-tokens) from Microsoft Entra ID. The ID token proves that a user is authenticated with this tenant. The app protects its routes according to user's authentication status and group membership.

For a video that covers this scenario, see [Implement authorization in your applications using app roles, security groups, scopes, and directory roles](https://www.youtube.com/watch?v=LRoc-na27l0).

