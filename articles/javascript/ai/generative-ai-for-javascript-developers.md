---
title: Generative AI for JavaScript developers
description: Discover generative AI in JavaScript with our essential guide. Build AI-powered web, mobile, and desktop apps using prompt engineering, RAG, and secure AI Chat Protocol streaming. Access demos and courses featuring tools like LangChain.js, Ollama, and Azure Cosmos DB for scalable, innovative solutions.
ms.topic: concept-article
ms.date: 02/26/2025
#customer intent: As a JavaScript developer, I want understand generative AI so that build AI applications.
---

# Generative AI for JavaScript overview

Discover the power of Generative AI with JavaScript. Learn how to seamlessly integrate AI into your web, mobile, or desktop applications. 

## JavaScript with AI?

While it's true that Python is probably the best language to create, train, and fine-tune AI models, it's a different story when it's a matter of creating applications using these AI models. Most AI models are consumed using web APIs. That means that any language that can make HTTP calls can actually do AI. Because JavaScript is cross-platform and it provides seamless integration between the browser and server-side environments, it's a great choice for your AI applications. 

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

[Use the companion application to talk to historical characters](https://github.com/microsoft/generative-ai-with-javascript/app/README.md)

## What you need to know about LLMs?

Large Language Models (LLMs), are deep neural networks trained on vast amounts of data to recognize and generate text through tokenized inputs. LLMs are built by initially training on diverse, extensive datasets—an expensive process—to create a fundamental model, which can then be fine-tuned with specialized data for higher quality output. In practice, these models function like advanced autocompletion systems, whether in a typical IDE or through chat interfaces that follow detailed prompts. However, they're limited by context windows (typically a few thousand tokens, though newer models support much more) and may inherit biases from their training data. This underscores the importance of responsible AI practices, such as those advocated by Microsoft, which stress fairness, reliability, privacy, and accountability in AI development.

Learn more in the [LLM session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/sessions/01-llms.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/demos/01-llms)
* [Video](https://www.youtube.com/watch?v=GQ_2OjNZ9aA&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=2)

## 	Essential prompt engineering techniques

Prompt engineering involves designing and optimizing prompts to enhance AI model outputs. In this session, the concept is introduced with techniques like zero-shot learning, where the model generates responses using its training data without examples, and few-shot learning, where examples guide the desired outcome. The speaker demonstrates how adding cues—such as chain-of-thought phrases to encourage step-by-step reasoning, clear instructions, context, and even specifying output formats—can significantly improve the model's responses. When you use a scenario with an AI assistant for Contoso Shoes, various modifications like tone adjustments and personalization are shown to further refine results, setting the stage for more advanced techniques such as RAG in the next session.

Learn more in the [prompt engineering session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/sessions/02-prompt-engineering.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/demos/02-prompt-engineering)
* [Video](https://www.youtube.com/watch?v=gQ6TlyxBmWs&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=3)

## Improve AI accuracy and reliability with RAG

Improve AI accuracy and reliability using Retrieval Augmented Generation (RAG). RAG overcomes limitations of traditional large language models by combining a retriever that pulls relevant, up-to-date documents from a knowledge base with a generator that crafts answers based on that specific context. This method ensures factual, transparent responses by grounding the output in trusted sources, making it both cost-effective and verifiable. A practical example with Contoso real estate support demonstrates how RAG can effectively provide detailed, cited answers by using company documents to back up its responses.


Learn more in the [RAG session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/sessions/03-rag.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/demos/03-rag)
* [Video](https://www.youtube.com/watch?v=xkFOmx5yxIA&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=4)

## Speed up your AI development with LangChain.js

Accelerate your AI development using LangChain.js—a JavaScript library that streamlines working with large language models. LangChain.js provides high-level abstractions for building prompt templates, managing model and vector database components, and creating complex workflows. The framework enables rapid prototyping, such as building an API that extracts and processes YouTube transcripts to answer questions, and simplifies the transition from local development to production on Azure by allowing easy component swaps, like replacing local models and vector stores with Azure services.

Learn more in the [LangChain.js session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/sessions/04-langchainjs.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/demos/04-langchainjs)
* [Video](https://www.youtube.com/watch?v=02IDU8eCX8o&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=5)

## Run AI models on your local machine with Ollama

Download and use local AI models with Ollama—an open-source tool based on llama.cpp—to efficiently run small language models like Phi-3. Local models eliminate reliance on cloud infrastructure, enable rapid development with offline capabilities, and offer cost-effective testing through a fast inner development loop. Phi-3, noted for its high performance and responsible AI safety, can run even on moderate-spec devices and is accessible via an OpenAI-compatible API, making it easy to integrate with your development workflow.


Learn more in the [Ollama session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/sessions/05-local-models.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/demos/05-local-models)
* [Video](https://www.youtube.com/watch?v=dLfNnoPv4AQ&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=6)

## Get started with AI for free using Phi-3

Experiment with AI models using the Ollama tool and the Phi-3 model directly from your browser through an online playground. By creating a GitHub Codespace, you can interact with a familiar VS Code editor in your browser, run commands like Ollama run phi3 in the terminal to chat with the model, and utilize an interactive Jupyter notebook for executing code blocks that demonstrate prompt engineering, few-shot learning, and retrieval-augmented generation via an OpenAI-compatible API. This setup allows you to explore and develop your AI projects entirely online—no need for a fast GPU or local infrastructure.

Learn more in the [Phi-3 session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/sessions/06-playground.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/demos/06-playground)
* [Video](https://www.youtube.com/watch?v=Ds32MS9SHzU&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=7)

## Introduction to Azure AI Foundry

Azure AI Foundry is like the gateway for your journey into building generative AI applications with JavaScript. In this session, we’ll explore how the Foundry organizes resources through hubs and projects, dive into a rich model catalog featuring thousands of models from various providers, and deploy a model to test it in an interactive playground. Whether you choose managed compute or serverless API options, the core concepts remain consistent as you select, deploy, and integrate the model into your development workflow.

Learn more in the [Azure AI Foundry session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/sessions/07-ai-foundry.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/demos/07-ai-foundry)
* [Video](https://www.youtube.com/watch?v=9Mo-VOGk8ng&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=8)

## Building Generative AI Apps with Azure Cosmos DB

Learn more in the [Azure Cosmos DB session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/sessions/08-cosmos-db.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/demos/08-cosmos-db)
* [Video](https://www.youtube.com/watch?v=-GQyaLbeqxQ&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=9)

## Azure tools & services for hosting and storing AI apps

Learn the essential Azure tools and services for hosting and storing your AI apps. We'll explore the different types of AI apps you can build—from chat apps to retrieval-augmented generation and autonomous agents—and discuss the tooling required, including the Azure Developer CLI (AZD) for seamless deployment. You'll learn about architectural options, weighing serverless versus container-based approaches, and how to manage APIs in production with considerations for security, scaling, and monitoring, ensuring your AI applications are robust and ready for real-world use.

Learn more in the [Azure tools and services session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/sessions/09-azure-tools.md):
* [Video](https://www.youtube.com/watch?v=WB6Fpzhwyug&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=10)

## Streaming Generative AI output with the AI Chat Protocol

Explore streaming generative AI output using the AI Chat Protocol, which simplifies real-time communication between your back-end AI inference service and client applications. We'll review two streaming approaches—inference in the browser and via an AI inference server—discussing the challenges of API key exposure, data sanitization, and protocol selection. With the AI Chat Protocol's lightweight client and its synchronous (getCompletion) and asynchronous (getStreamedCompletion) methods, you can easily integrate secure, efficient, and well-structured streaming into your AI app, as demonstrated in our serverless RAG with LangChain.js sample.

Learn more in the [Streaming session of the course](https://github.com/microsoft/generative-ai-with-javascript/blob/main/sessions/10-chat-protocol.md):
* [Demo](https://github.com/microsoft/generative-ai-with-javascript/blob/main/demos/10-chat-protocol)
* [Video](https://www.youtube.com/watch?v=fzDCW-6hMtU&list=PLlrxD0HtieHi5ZpsHULPLxm839IrhmeDk&index=11)