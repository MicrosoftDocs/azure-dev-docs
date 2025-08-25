---
title: Generative AI for JavaScript developers
description: Discover generative AI in JavaScript with our essential guide. Build AI-powered web, mobile, and desktop apps using prompt engineering, RAG, and secure AI Chat Protocol streaming. Access demos and courses featuring tools like LangChain.js, Ollama, and Azure Cosmos DB for scalable, innovative solutions.
ms.topic: concept-article
ms.date: 08/05/2025
#customer intent: As a JavaScript developer, I want understand generative AI so that build AI applications.
---

# Generative AI for JavaScript overview

Discover the power of Generative AI with JavaScript. Learn how to seamlessly integrate AI into your web, mobile, or desktop applications. 

## JavaScript with AI?

While it's true that Python is great for creating and training AI models, building apps with those models is different. Most AI models work through web APIs, so any language that can make HTTP calls can use AI. JavaScript is cross-platform and connects browsers and servers easily, making it a strong choice for AI apps.

## Fun and interactive course

Join us for an immersive learning experience including videos, code projects, and a full implementation to both use and learn about generative AI.

* [Course](https://github.com/microsoft/generative-ai-with-javascript)
* [Video series](https://aka.ms/genai-js)

This course is a great way for students and new developers to learn about AI in a fun, interactive way. For career developers, dive deeper for your upscaling to AI.

In this course:

* Learn AI while you bring historical figures to life with generative AI
* Apply accessibility with the built- browser APIs
* Use text and image generation to integrate AI into the app experience
* Learn architectural patterns for AI applications

:::image type="content" source="media/generative-ai-for-javascript-developers/leonardo-talk.png" alt-text="An AI-generated image of Leonardo Da Vinci used in the companion app to talk to historical characters.":::

[Use the companion application to talk to historical characters](https://github.com/microsoft/generative-ai-with-javascript/blob/main/README.md)

## What you need to know about LLMs?

Large Language Models (LLMs) are deep neural networks trained on lots of data to understand and create text. Training starts with large, diverse datasets to build a base model, then uses special data to fine-tune for better results. LLMs work like smart autocompletion tools in code editors or chat apps. Models have limits, like context windows (usually a few thousand tokens, though newer models support more) and can show biases from their training data. That’s why responsible AI matters—focus on fairness, reliability, privacy, and accountability, as Microsoft recommends.

Learn more in the [LLM session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/01-llms.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/01-llms/readme.md)
* [Video](https://www.youtube.com/watch?v=GQ_2OjNZ9aA&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=2)

## Essential prompt engineering techniques

Prompt engineering means designing prompts to get better AI results. You can use zero-shot learning (no examples) or few-shot learning (with examples) to guide the model. Adding cues like step-by-step instructions, clear context, and output formats helps the model give better answers. You can also adjust tone and personalize responses. These basics set you up for advanced techniques like RAG.

Learn more in the [prompt engineering session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/02-prompt-engineering.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/02-prompt-engineering/readme.md)
* [Video](https://www.youtube.com/watch?v=gQ6TlyxBmWs&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=3)

## Improve AI accuracy and reliability with RAG

Use Retrieval Augmented Generation (RAG) to make AI more accurate and reliable. RAG combines a retriever that finds up-to-date documents with a generator that uses those documents to answer questions. This approach gives clear, factual answers based on trusted sources, making results easy to check and cost-effective. For example, Contoso real estate support uses RAG to give detailed answers backed by company documents.

Learn more in the [RAG session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/03-rag.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/03-rag/readme.md)
* [Video](https://www.youtube.com/watch?v=xkFOmx5yxIA&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=4)

## Speed up your AI development with LangChain.js

Speed up your AI projects with LangChain.js. This JavaScript library makes it easy to work with large language models. Use LangChain.js to build prompt templates, connect models and vector databases, and create complex workflows. Quickly prototype apps, like an API that pulls and answers questions from YouTube transcripts. When you’re ready for production, swap local models and vector stores for Azure services without changing your code.

Learn more in the [LangChain.js session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/04-langchainjs.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/04-langchainjs/readme.md)
* [Video](https://www.youtube.com/watch?v=02IDU8eCX8o&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=5)

## Run AI models on your local machine with Ollama

Download and use local AI models with Ollama—an open-source tool based on llama.cpp—to efficiently run small language models like Phi-3. Local models eliminate reliance on cloud infrastructure, enable rapid development with offline capabilities, and offer cost-effective testing through a fast inner development loop. Phi-3, noted for its high performance and responsible AI safety, can run even on moderate-spec devices and is accessible via an OpenAI-compatible API, making it easy to integrate with your development workflow.

Learn more in the [Ollama session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/05-local-models.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/05-local-models/readme.md)
* [Video](https://www.youtube.com/watch?v=dLfNnoPv4AQ&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=6)

## Get started with AI for free using Phi-3

Try AI models with the Ollama tool and Phi-3 model in your browser using an online playground. Create a GitHub Codespace to use VS Code in your browser, run commands like "Ollama run phi3" to chat with the model, and use a Jupyter notebook to test prompt engineering, few-shot learning, and RAG. You can build and explore AI projects online—no need for a fast GPU or local setup.

Learn more in the [Phi-3 session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/06-playground.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/06-playground/readme.md)
* [Video](https://www.youtube.com/watch?v=Ds32MS9SHzU&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=7)

## Introduction to Azure AI Foundry

Use Azure AI Foundry to start building generative AI apps with JavaScript. Organize resources with hubs and projects, browse thousands of models, and deploy a model to test in a playground. Whether you pick managed compute or serverless APIs, follow the same steps to select, deploy, and use your model in your workflow.

Learn more in the [Azure AI Foundry session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/07-ai-foundry.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/07-ai-foundry/readme.md)
* [Video](https://www.youtube.com/watch?v=9Mo-VOGk8ng&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=8)

## Building Generative AI Apps with Azure Cosmos DB

Learn more in the [Azure Cosmos DB session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/08-cosmos-db.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/08-cosmos-db/readme.md)
* [Video](https://www.youtube.com/watch?v=-GQyaLbeqxQ&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=9)

## Azure tools & services for hosting and storing AI apps

Discover key Azure tools and services for hosting and storing your AI apps. Build different types of AI apps, like chat apps, RAG, and autonomous agents. Use the Azure Developer CLI (AZD) to deploy easily. Compare serverless and container-based options, and learn how to keep your APIs secure, scalable, and monitored for real-world use.

Learn more in the [Azure tools and services session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/09-azure-tools.md):
* [Video](https://www.youtube.com/watch?v=WB6Fpzhwyug&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=10)

## Streaming Generative AI output with the AI Chat Protocol

Stream generative AI output with the AI Chat Protocol. This tool makes real-time communication easy between your AI service and client apps. Try two streaming methods: run inference in the browser or use an AI inference server. Watch out for API key exposure, data safety, and choosing the right protocol. The AI Chat Protocol’s simple client lets you add secure and efficient streaming to your app using getCompletion and getStreamedCompletion methods, as shown in our serverless RAG with LangChain.js example.

Learn more in the [Streaming session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/sessions/10-chat-protocol.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/videos/demos/10-chat-protocol/readme.md)
* [Video](https://www.youtube.com/watch?v=fzDCW-6hMtU&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=11)