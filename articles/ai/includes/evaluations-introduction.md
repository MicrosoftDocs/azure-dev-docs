---
ms.custom: overview
ms.topic: include
ms.date: 01/31/2024
ms.author: diberry
author: diberry
ms.service: azure
---

This article shows you how to evaluate a chat app's answers against a set of correct or ideal answers (known as ground truth). Whenever you change your chat application in a way which affects the answers, run an evaluation to compare the changes. This demo application offers tools you can use today to make it easier to run evaluations.

By following the instructions in this article, you will:

- Use provided sample prompts tailored to the subject domain. These are already in the repository.
- Generate sample user questions and ground truth answers from your own documents.
- Run evaluations using a sample prompt with the generated user questions.
- Review analysis of answers.

## Architectural overview

Key components of the architecture include:

* **Azure-hosted chat app**: The chat app runs in Azure App Service. The chat app conforms to the chat protocol, which allows the evaluations app to run against any chat app that conforms to the protocol.
* **Azure AI Search**: The chat app uses Azure AI Search to store the data from your own documents. 
* **Sample questions generator**: Can generate a number of questions for each document along with the ground truth answer. The more questions, the longer the evaluation.
* **Evaluator** runs sample questions and prompts against the chat app and returns the results.
* **Review tool** allows you to review the results of the evaluations.
* **Diff tool** allows you to compare the answers between evaluations.
