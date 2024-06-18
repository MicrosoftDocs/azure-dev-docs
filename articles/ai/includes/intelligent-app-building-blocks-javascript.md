---
ms.custom: overview
ms.topic: include
ms.date: 05/15/2024
ms.service: azure
---

| Building block | Description |
|----------------|-------------|
| [Evaluate chat app answers](../../javascript/get-started-app-chat-evaluations.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json) | Learn how to evaluate a chat app's answers against a set of correct or ideal answers (known as ground truth). Whenever you change your chat application in a way which affects the answers, run an evaluation to compare the changes. This demo application offers tools you can use today to make it easier to run evaluations. |
| [Load balance with Azure Container Apps](../../javascript/get-started-app-chat-scaling-with-azure-container-apps.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json) | Learn how to add load balancing to your application to extend the chat app beyond the Azure OpenAI token and model quota limits. This approach uses Azure Container Apps to create three Azure OpenAI endpoints, as well as a primary container to direct incoming traffic to one of the three endpoints. |
| [Load balance with API Management](../../javascript/get-started-app-chat-scaling-with-azure-api-management.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json) | Learn how to add load balancing to your application to extend the chat app beyond the Azure OpenAI token and model quota limits. This approach uses Azure API Management to create three Azure OpenAI endpoints, as well as a primary container to direct incoming traffic to one of the three endpoints. |

<!--

### Secure resources with passwordless connections

Application requests to most Azure services must be authenticated with keys or [passwordless connections](../passwordless-connections.md). Developers must be diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate to the service. Passwordless authentication offers improved management and security benefits over the account key because there's no key (or connection string) to store.

### Load balance with Azure Container Apps 

Learn how to [add load balancing to your application](../javascript/get-started-app-chat-scaling-with-azure-container-apps.md) to extend the chat app beyond the Azure OpenAI token and model quota limits. This approach uses Azure Container Apps to create three Azure OpenAI endpoints, as well as a primary container to direct incoming traffic to one of the three endpoints.

### Load balance with Azure API Management

Learn how to [add load balancing to your application](../../javascript/get-started-app-chat-scaling-with-azure-api-management.md) to extend the chat app beyond the Azure OpenAI token and model quota limits. This approach uses Azure API Management to create three Azure OpenAI endpoints, as well as a primary container to direct incoming traffic to one of the three endpoints.

### Evaluate 

Learn how to [evaluate a chat app's answers](../../javascript/get-started-app-chat-evaluations.md) against a set of correct or ideal answers (known as ground truth). Whenever you change your chat application in a way which affects the answers, run an evaluation to compare the changes. This demo application offers tools you can use today to make it easier to run evaluations.

-->
