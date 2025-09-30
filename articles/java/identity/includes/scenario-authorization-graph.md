---
author: bmitchell287
ms.author: brendm
ms.reviewer: bbanerjee
ms.date: 08/21/2025
---

The following diagram shows the topology of the app:

:::image type="content" source="../media/topology.png" alt-text="Diagram that shows the topology of the app.":::

The client app uses MSAL for Java (MSAL4J) to sign in a user and obtain an [access token](/entra/identity-platform/access-tokens) for [Microsoft Graph](/graph/overview) from Microsoft Entra ID. The access token proves that the user is authorized to access the Microsoft Graph API endpoint as defined in the scope.
