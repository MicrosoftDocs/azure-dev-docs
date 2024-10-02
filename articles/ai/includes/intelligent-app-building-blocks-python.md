---
ms.custom: overview
ms.topic: include
ms.date: 10/02/2024
ms.service: azure
---

| Building block | Description |
|----------------|-------------|
| [Configure document security for the chat app](../../python/get-started-app-chat-document-security-trim.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json)  |  When you build a chat application using the RAG pattern with your own data, make sure that each user receives an answer based on their permissions. An authorized user should have access to answers contained within the documents of the chat app. An unauthorized user shouldn't have access to answers from secured documents they don't have authorization to see. |
| [Evaluate chat app answers](../../python/get-started-app-chat-evaluations.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json) | Learn how to evaluate a chat app's answers against a set of correct or ideal answers (known as ground truth). Whenever you change your chat application in a way which affects the answers, run an evaluation to compare the changes. This demo application offers tools you can use today to make it easier to run evaluations. |
| [Load balance with Azure Container Apps](../../python/get-started-app-chat-scaling-with-azure-container-apps.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json) | Learn how to add load balancing to your application to extend the chat app beyond the Azure OpenAI token and model quota limits. This approach uses Azure Container Apps to create three Azure OpenAI endpoints, as well as a primary container to direct incoming traffic to one of the three endpoints. |
| [Load balance with API Management](../../python/get-started-app-chat-scaling-with-azure-api-management.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json) | Learn how to add load balancing to your application to extend the chat app beyond the Azure OpenAI token and model quota limits. This approach uses Azure API Management to create three Azure OpenAI endpoints, as well as a primary container to direct incoming traffic to one of the three endpoints. |
| [Load test the Python chat app with Locust](../../python/get-started-app-chat-app-load-test-locust.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json) | Learn the process to perform load testing on a Python chat application using the RAG pattern with Locust, a popular open-source load testing tool. The primary objective of load testing is to ensure that the expected load on your chat application does not exceed the current Azure OpenAI Transactions Per Minute (TPM) quota. By simulating user behavior under heavy load, you can identify potential bottlenecks and scalability issues in your application. |
| [Secure your AI App with keyless authentication](../get-started-securing-your-ai-app.md?toc=/azure/developer/ai/toc.json&bc=/azure/developer/ai/breadcrumb/toc.json) | Learn the process to secure your Python Azure OpenAI chat application with keyless authentication. Application requests to most Azure services should be authenticated with keyless or passwordless connections.  Keyless authentication offers improved management and security benefits over the account key because there's no key (or connection string) to store. |
<!--

### Secure Azure resources with passwordless connections

Application requests to most Azure services must be authenticated with keys or [passwordless connections](../passwordless-connections.md). Developers must be diligent to never expose the keys in an unsecure location. Anyone who gains access to the key is able to authenticate to the service. Passwordless authentication offers improved management and security benefits over the account key because there's no key (or connection string) to store.

### Add document security trimming to Azure AI Search

When you build a chat application using the RAG pattern with your own data, make sure that each user receives an answer based on their permissions. Follow the process in this article to [add document access control to your chat app](../../python/get-started-app-chat-document-security-trim.md).

An authorized user should have access to answers contained within the documents of the chat app. An unauthorized user shouldn't have access to answers from secured documents they don't have authorization to see.

### Evaluate chat app answers

Learn how to [evaluate a chat app's answers](../../python/get-started-app-chat-evaluations.md) against a set of correct or ideal answers (known as ground truth). Whenever you change your chat application in a way which affects the answers, run an evaluation to compare the changes. This demo application offers tools you can use today to make it easier to run evaluations.

### Load balance with Azure Container Apps 

Learn how to [add load balancing to your application](../../python/get-started-app-chat-scaling-with-azure-container-apps.md) to extend the chat app beyond the Azure OpenAI token and model quota limits. This approach uses Azure Container Apps to create three Azure OpenAI endpoints, as well as a primary container to direct incoming traffic to one of the three endpoints.

### Load balance with Azure API Management

Learn how to [add load balancing to your application](../../python/get-started-app-chat-scaling-with-azure-api-management.md) to extend the chat app beyond the Azure OpenAI token and model quota limits. This approach uses Azure API Management to create three Azure OpenAI endpoints, as well as a primary container to direct incoming traffic to one of the three endpoints.

### Load test with Locust

Learn the process to perform [load testing](../../python/get-started-app-chat-app-load-test-locust.md) on a Python chat application using the RAG pattern with Locust, a popular open-source load testing tool. The primary objective of load testing is to ensure that the expected load on your chat application does not exceed the current Azure OpenAI Transactions Per Minute (TPM) quota. By simulating user behavior under heavy load, you can identify potential bottlenecks and scalability issues in your application. This process is crucial for ensuring that your chat application remains responsive and reliable, even when faced with a high volume of user requests.

-->