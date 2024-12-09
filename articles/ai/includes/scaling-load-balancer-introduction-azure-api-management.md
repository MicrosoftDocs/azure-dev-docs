---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

Learn how to add enterprise-grade load balancing to your application to extend the chat app beyond the Azure OpenAI Service token and model quota limits. This approach uses Azure API Management to intelligently direct traffic between three Azure OpenAI resources.

This article requires you to deploy two separate samples:

* Chat app
  * If you haven't deployed the chat app yet, wait until after the load balancer sample is deployed.
  * If you already deployed the chat app once, you change the environment variable to support a custom endpoint for the load balancer and redeploy it again.

* Load balancer with Azure API Management

> [!NOTE]
> This article uses one or more [AI app templates](../intelligent-app-templates.md) as the basis for the examples and guidance in the article. AI app templates provide you with well-maintained reference implementations that are easy to deploy. They help to ensure a high-quality starting point for your AI apps.

## Architecture for load balancing Azure OpenAI with Azure API Management

Because the Azure OpenAI resource has specific token and model quota limits, a chat app that uses a single Azure OpenAI resource is prone to have conversation failures because of those limits.

:::image type="content" source="../media/get-started-scaling-load-balancer-azure-api-management/chat-app-original-architecuture.png" alt-text="Diagram that shows chat app architecture with an Azure OpenAI resource highlighted.":::

To use the chat app without hitting those limits, use a load-balanced solution with API Management. This solution seamlessly exposes a single endpoint from API Management to your chat app server.

:::image type="content" source="../media/get-started-scaling-load-balancer-azure-api-management/chat-app-architecuture.png" alt-text="Diagram that shows chat app architecture with Azure API Management in front of three Azure OpenAI resources.":::

The API Management resource, as an API layer, sits in front of a set of Azure OpenAI resources. The API layer applies to two scenarios: normal and throttled. During a *normal scenario* where token and model quota is available, the Azure OpenAI resource returns a 200 back through the API layer and back-end app server.

:::image type="content" source="../media/get-started-scaling-load-balancer-azure-api-management/intro-load-balance-normal-usage.png" alt-text="Diagram that shows a normal scenario with three Azure OpenAI endpoint groups. The first group of two endpoints gets successful traffic. ":::

When a resource is *throttled* because of quota limits, the API layer can retry a different Azure OpenAI resource immediately to fulfill the original chat app request.

:::image type="content" source="../media/get-started-scaling-load-balancer-azure-api-management/intro-load-balance-throttled-usage.png" alt-text="Diagram that shows a throttling scenario with a 429 failing response code and a response header of how many seconds the client has to wait to retry.":::
