---
ms.custom: overview, devx-track-python
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

Learn how to add load balancing to your application to extend the Chat app beyond the Azure OpenAI token and model quota limits. To add load balancing with Azure Container Apps, use a sample repository provided for you to create three Azure OpenAI endpoints. The Azure Container app uses one of the three endpoints for each request. 

This article requires you to deploy 2 separate samples:

* Chat app
    * If you haven't deployed the chat app yet, wait until after the load balancer sample is deployed. 
    * If you have already deployed the chat app once, you will redeploy it again after you deploy the load balancer. The chat app will be configured with the load balancer settings. 
* Load balancer app
    * [Load Balance with Container Apps sample](https://github.com/Azure-Samples/openai-aca-lb)


## Architecture for load balancing with Azure Container Apps

Because the Azure OpenAI resource has specific token and model quota limits, a chat app using a single Azure OpenAI resource is prone to have conversation failures due to those limits.

:::image type="content" source="../media/get-started-scaling-load-balancer-aca/chat-app-original-architecuture.png" alt-text="Diagram showing chat app architecture with Azure OpenAI resource highlighted.":::

To use the chat app without hitting those limits, use a load balanced solution with Azure Container Apps. This solution seamlessly exposes a single endpoint from Azure Container Apps to your chat app server. 

:::image type="content" source="../media/get-started-scaling-load-balancer-aca/chat-app-aca-architecuture.png" alt-text="Diagram showing chat app architecture with Azure Container Apps in front of three Azure OpenAI resources.":::

The Azure Container app sits in front of a set of Azure OpenAI resources. 

:::image type="content" source="../media/get-started-scaling-load-balancer-aca/intro-load-balance.png" alt-text="Diagram displaying a normal scenario and a throttling scenario for load balancing for Azure OpenAI. The normal scenario shows three Azure OpenAI endpoint groups with the first group of two endpoints getting successful traffic. The throttling scenario shows the same 3 groups of 2 endpoints with the first group failing with a response code of 429 and a response header indicating how many seconds the client has to wait in order for more request quota to be available.":::

The Container app has two uses:

* During a **normal scenario** where token and model quota is available, the Azure OpenAI resource returns a 200 back through the Container App and App Server.
* When a resource is in a **throttled scenario** such as due to quota limits, the Azure Container app can retry a different Azure OpenAI resource immediately to fullful the original chat app request.