---
ms.custom: overview
ms.topic: include
ms.date: 06/23/2025
ms.author: johalexander
author: ms-johnalex
ms.service: azure
---

This article shows you how to evaluate a chat app's answers against a set of correct or ideal answers (known as ground truth). Whenever you change your chat application in a way that affects the answers, run an evaluation to compare the changes. This demo application offers tools that you can use today to make it easier to run evaluations.

By following the instructions in this article, you:

- Use provided sample prompts tailored to the subject domain. These prompts are already in the repository.
- Generate sample user questions and ground truth answers from your own documents.
- Run evaluations by using a sample prompt with the generated user questions.
- Review analysis of answers.

> [!NOTE]
> This article uses one or more [AI app templates](../intelligent-app-templates.md) as the basis for the examples and guidance in the article. AI app templates provide you with well-maintained reference implementations that are easy to deploy. They help to ensure a high-quality starting point for your AI apps.

## Architectural overview

Key components of the architecture include:

- **Azure-hosted chat app**: The chat app runs in Azure App Service.
- **Microsoft AI Chat Protocol**: The protocol provides standardized API contracts across AI solutions and languages. The chat app conforms to the [Microsoft AI Chat Protocol](https://github.com/microsoft/ai-chat-protocol/), which allows the evaluations app to run against any chat app that conforms to the protocol.
- **Azure AI Search**: The chat app uses Azure AI Search to store the data from your own documents.
- **Sample questions generator**: The tool can generate many questions for each document along with the ground truth answer. The more questions there are, the longer the evaluations.
- **Evaluator**: The tool runs sample questions and prompts against the chat app and returns the results.
- **Review tool**: The tool reviews the results of the evaluations.
- **Diff tool**: The tool compares the answers between evaluations.

When you deploy this evaluation to Azure, the Azure OpenAI Service endpoint is created for the `GPT-4` model with its own [capacity](/azure/ai-services/openai/quotas-limits#regional-quota-limits). When you evaluate chat applications, it's important that the evaluator has its own Azure OpenAI resource by using `GPT-4` with its own capacity.
