---
ms.custom: overview
ms.topic: include
ms.date: 05/15/2024
ms.service: azure
---

| Building block | Description |
|----------------|-------------|
| [Load balance with Azure Container Apps](/dotnet/ai/get-started-app-chat-scaling-with-azure-container-apps?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json) | Learn how to add load balancing to your application to extend the chat app beyond the Azure OpenAI token and model quota limits. This approach uses Azure Container Apps to create three Azure OpenAI endpoints, as well as a primary container to direct incoming traffic to one of the three endpoints. |


<!-- 

### Secure resources with passwordless connections

Application requests to most Azure services must be authenticated with keys or [passwordless connections](../passwordless-connections.md). Developers must be diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate to the service. Passwordless authentication offers improved management and security benefits over the account key because there's no key (or connection string) to store.

### Load balance with Azure Container Apps 

Learn how to [add load balancing to your application](/dotnet/ai/get-started-app-chat-scaling-with-azure-container-apps) to extend the chat app beyond the Azure OpenAI token and model quota limits. This approach uses Azure Container Apps to create three Azure OpenAI endpoints, as well as a primary container to direct incoming traffic to one of the three endpoints.

-->