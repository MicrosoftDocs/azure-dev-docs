---
title: Generative AI for JavaScript developers
description: Learn how to build generative AI apps with JavaScript by using prompt engineering, RAG, LangChain.js, Ollama, Microsoft Foundry, Azure Cosmos DB, and the AI Chat Protocol.
ms.date: 03/13/2026
ms.author: diberry
author: diberry
ms.service: azure-javascript
ms.subservice: intelligent-apps
ms.topic: concept-article
ms.custom: devx-track-js, devx-track-js-ai
ms.collection: ce-skilling-ai-copilot
ai-usage: ai-generated
#customer intent: As a JavaScript developer, I want to understand generative AI so that I can build AI applications.
---

# Generative AI for JavaScript developers

Use JavaScript to build generative AI features into your web, mobile, and desktop apps. This overview highlights core concepts, tools, and learning resources to help you get started.

## Why use JavaScript for AI?

Python is a common choice for training AI models, but most app developers use models through web APIs. Because JavaScript runs across browsers and servers and handles HTTP calls well, it's a practical choice for building AI apps.

## Take the companion course

Use the companion course to learn through videos, code projects, and a full end-to-end sample.

* [Course](https://github.com/microsoft/generative-ai-with-javascript)
* [Video series](https://aka.ms/genai-js)

If you're a student or new developer, this course gives you a practical way to learn AI. If you already build apps professionally, it helps you deepen your AI skills.

In this course, you:

* Learn AI while you bring historical figures to life with generative AI.
* Apply accessibility by using built-in browser APIs.
* Use text and image generation to integrate AI into the app experience.
* Learn architectural patterns for AI applications.

:::image type="content" source="media/generative-ai-for-javascript-developers/leonardo-talk.png" alt-text="An AI-generated image of Leonardo Da Vinci used in the companion app to talk to historical characters.":::

[Use the companion application to talk to historical characters](https://github.com/microsoft/generative-ai-with-javascript/blob/main/README.md)

## What to know about LLMs

Large language models (LLMs) are neural networks trained on large datasets to understand and generate text. Training usually starts with a broad base model and then adds fine-tuning for specific tasks. LLMs can help with scenarios such as code completion and chat, but they also have limits, including context windows and possible bias in training data. That's why responsible AI practices such as fairness, reliability, privacy, and accountability matter.

Learn more in the [LLM session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/01-llms.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/01-llms/readme.md)
* [Video](https://www.youtube.com/watch?v=GQ_2OjNZ9aA&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=2)

## Use prompt engineering techniques

Prompt engineering is the practice of writing prompts that guide the model toward better results. Use zero-shot prompts when you don't need examples, or few-shot prompts when examples help. Clear instructions, relevant context, and explicit output formats often improve responses and prepare you for more advanced patterns such as RAG.

Learn more in the [prompt engineering session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/02-prompt-engineering.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/02-prompt-engineering/readme.md)
* [Video](https://www.youtube.com/watch?v=gQ6TlyxBmWs&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=3)

## Improve AI accuracy and reliability with RAG

Use retrieval-augmented generation (RAG) to ground model responses in current, trusted data. RAG combines a retriever that finds relevant content with a generator that uses that content to answer questions. This approach can improve accuracy, make responses easier to verify, and control costs. For example, a real estate support app can use company documents to answer detailed customer questions.

Learn more in the [RAG session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/03-rag.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/03-rag/readme.md)
* [Video](https://www.youtube.com/watch?v=xkFOmx5yxIA&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=4)

## Speed up your AI development with LangChain.js

Speed up your AI projects with LangChain.js. This JavaScript library helps you build prompt templates, connect models and vector stores, and compose complex workflows. It works well for rapid prototyping, such as an API that answers questions from YouTube transcripts. When you're ready for production, you can swap local models and vector stores for Azure services without rewriting your app.

Learn more in the [LangChain.js session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/04-langchainjs.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/04-langchainjs/readme.md)
* [Video](https://www.youtube.com/watch?v=02IDU8eCX8o&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=5)

## Run AI models on your local machine with Ollama

Use Ollama to run local AI models, including Phi-3, on your machine. Local models reduce cloud dependencies, support offline development, and shorten your inner loop while you test ideas. Because Ollama exposes an OpenAI-compatible API, you can integrate it into existing JavaScript workflows with minimal changes.

Learn more in the [Ollama session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/05-local-models.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/05-local-models/readme.md)
* [Video](https://www.youtube.com/watch?v=dLfNnoPv4AQ&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=6)

## Get started with AI for free

You can run AI for free by using [Foundry Local](/azure/foundry-local/get-started), which lets you download AI models and interact with them locally. There's also [AI Toolkit for Visual Studio Code](/windows/ai/toolkit/), an extension that supports model download, fine-tuning, and more. [Ollama](https://ollama.com/) is another popular choice for running local models.

You can also try models without any local setup by creating a GitHub Codespace and using a Jupyter notebook to test prompt engineering, few-shot learning, and RAG.

Learn more in the [Phi-3 session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/06-playground.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/06-playground/readme.md)
* [Video](https://www.youtube.com/watch?v=Ds32MS9SHzU&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=7)

## Introduction to Microsoft Foundry

Use Microsoft Foundry to start building generative AI apps with JavaScript. Organize resources with hubs and projects, browse models, and deploy a model to test in a playground. Whether you use managed compute or serverless APIs, the workflow stays the same: choose a model, deploy it, and integrate it into your app.

Learn more in the [Foundry session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/07-ai-foundry.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/07-ai-foundry/readme.md)
* [Video](https://www.youtube.com/watch?v=9Mo-VOGk8ng&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=8)

## Build generative AI apps with Azure Cosmos DB

Learn more in the [Azure Cosmos DB session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/08-cosmos-db.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/08-cosmos-db/readme.md)
* [Video](https://www.youtube.com/watch?v=-GQyaLbeqxQ&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=9)

## Azure tools and services for hosting and storing AI apps

Learn which Azure tools and services fit common AI app architectures, including chat apps, RAG apps, and autonomous agents. This session also shows how to use Azure Developer CLI (AZD) to deploy apps and compare serverless and container-based hosting options.

Learn more in the [Azure tools and services session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/09-azure-tools.md):
* [Video](https://www.youtube.com/watch?v=WB6Fpzhwyug&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=10)

## Stream generative AI output with the AI Chat Protocol

Use the AI Chat Protocol to support real-time communication between your AI service and client apps. You can stream responses from the browser or from an AI inference server, depending on your architecture. As you implement streaming, plan for API key protection, data safety, and protocol choice. The protocol client supports methods such as `getCompletion` and `getStreamedCompletion`, as shown in the serverless RAG with LangChain.js example.

Learn more in the [Streaming session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/10-chat-protocol.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/10-chat-protocol/readme.md)
* [Video](https://www.youtube.com/watch?v=fzDCW-6hMtU&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=11)