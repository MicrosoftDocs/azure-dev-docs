---
title: Introduction to developing generative AI applications for experienced developers
description: Conceptual overview about integrating generative AI into applications, exploring its business benefits, operational fundamentals, and the potential of large language models (LLMs).
ms.date: 11/05/2024
ms.topic: conceptual
ms.custom: build-2024-intelligent-apps, ai-learning-hub
---

# Introduction to building generative AI solutions for developers

Generative AI, enabled by Large Language Models (LLMs), opens exciting new possibilities for software developers and organizations. Services like Azure OpenAI democratize AI development by offering easy-to-use APIs, allowing developers of any skill level to integrate advanced AI functionality into their applications without needing specialized knowledge or requiring organizations to invest in  hardware.

As an application developer, you might struggle to understand what role you can play and where you fit in. For example, perhaps you wonder at what level in the "AI stack" to focus your learning. Or you might wonder what you are capable of building given existing technologies?

To answer these questions, it's important that you first develop a mental model that maps how new terminology and technologies fit into what you already understand. Developing a mental model helps you design and build generative AI features into your applications.

The purpose of this series of articles is to show you how your current software development experience applies to generative AI. The articles also set a basis of keywords and concepts to build on as you begin to develop your first generative AI solutions.

## How businesses benefit from using generative AI

To understand how your current software development experience applies to generative AI, it's important to understand how businesses intend to benefit from using generative AI.

Businesses view generative AI as a means to improve customer engagement, increase operational efficiency, and enhance problem-solving and creativity. Integrating generative AI into existing systems opens opportunities for businesses to enhance their software ecosystems. It can complement traditional software functionalities with advanced AI capabilities, such as personalized recommendations for users or an intelligent agent that can answer specific questions about an organization or its products or services.

Here are a few common scenarios where generative AI can help businesses:

- **Content generation**:
  - Generate text, code, images, and sound. This can be useful for marketing, sales, IT, internal communications, and more.
- **Natural language processing**:
  - Compose or improve business communications through suggestions or complete generation of messages.
  - "Chat with your data." That is, enable a user to ask questions in a chat experience by using data that's stored in the organization's databases or documents as the basis for answers.
  - Summarization, organization, and simplification of large bodies of content to make content more accessible.
  - "Semantic search." That is, allowing users to search documents and data without using exact keyword matches.
  - Translate language to increase the reach and accessibility of content.
- **Data analysis**:
  - Analyze markets and identify trends in data.
  - Model "what if" scenarios to help companies plan for possible changes or challenges in every area of the business.
  - Analyze code to suggest improvements, fix bugs, and generate documentation.

So, software developers have an opportunity to dramatically increase their impact by integrating generative AI applications and functionality into the software their organizations rely on.

## How to build these types of applications

Although the large language model (LLM) does the heavy lifting, you build systems that integrate, orchestrate, and monitor the results. There's much to learn, but you can apply the skills you already have, including how to:

- Make calls to APIs by using REST, JSON, or language-specific software development kits (SDKs)
- Orchestrate calls to APIs and perform business logic
- Store to and retrieve from data stores
- Integrate input and results into the user experience
- Create APIs that can be called from LLMs

Developing generative AI solutions build on your existing skills.

## What tools and services are available

Microsoft invests in developing tools, services, APIs, samples, and learning resources to help you as you begin your generative AI development journey. Each highlights some major concern or responsibility that are needed to construct a generative AI solution. To utilize a given service, API or resource effectively, the challenge is making sure you:

- Understand the typical functions, roles, and responsibilities in a given type of generative AI feature? For example, as we discuss at length in conceptual articles describing Retrieval-Augmented Generation (RAG) based chat systems, there are many architectural responsibilities in the system. It's important that you understand the problem domain and constraints intimately before designing a system that addresses the problem.
- Understand the APIs, services, and tools exist for a given function, role, or responsibility? Now that you understand the problem domain and constraints, you can choose to build that aspect of the system yourself with custom code or use existing low-code / no-code tools, or call into APIs for existing services.
- Understand the options including code-centric and no-code or low-code solutions. You could build everything yourself, but is that an efficient use of your time and skill? Depending on your requirements, you can usually stitch together a combination of technologies and approaches (code, no-code, low-code, tools).

The point here's that there's no single right way to build generative AI features into your applications. Many tools and approaches exist. It's important to evaluate the trade-offs.

## Start with a focus on the application layer

You don't need to understand everything about generative AI works to get started and be productive. As stated earlier, you likely already know enough since you can use APIs and apply existing skills.

For example, you don't need to train your own LLM from scratch. Training an LLM would require time and resources that most companies are unwilling to commit. Instead, you build on top of existing pretrained foundational models like GPT-4 by making API calls into existing hosted services like the Azure OpenAI API. In this way, adding generative AI features into an existing application is no different than adding any other functionality based on an API call.

Researching how LLMs are trained or how they work might satisfy your intellectual curiosity, but truly understanding how LLMs work requires deep understanding of data science and the math background to support it. This might include graduate level courses on statistics, probabilities, and information theory.

If you come from a computer science background, you can appreciate that most application development happens at a higher 'layer in the stack" of research and technologies. You might have some understanding of each layer, but you likely specialize in the application development layer, with a focus on a specific programming language and platform (available APIs, tooling, patterns, and so on).

The same is true for the field of AI. You can understand and appreciate the theory that goes into building on top of LLMs, but you likely focus your attention on the application layer or help implement patterns or processes to enable a generative AI effort in your company.

Here's an oversimplified representation of the layers of knowledge that are required to implement generative AI features in a new or existing application:

:::image type="content" source="./media/ai-stack-developers.png" alt-text="Diagram of layers of knowledge. At the bottom, a box containing the words foundational data science, artificial intelligent research, statistics, and probability theory. The next level up, the words training large language models. The next level up, building services, tooling, and developing APIs. And at the highest level, application layer, patterns, and processes.":::

At the lowest level, you have data scientists that are doing data science research to solve or improve AI based on a deep mathematical understanding of statistics, probability theory and so on.
One layer up, based on the lowest foundational layer, you have data scientists who implement theoretical concepts into LLMs, building the neural networks and training the weights and biases to provide a practical piece of software that can accept inputs (**prompts**) and generate results (**completions**). The computational process of composing completions based on prompts is known as **inference**. There are those who are responsible for implementing the how the neurons of the neural network predict the next word or pixel to be generated.

Given the amount of processing power required to train models and generate results based on an input. The models are often trained and hosted in large data centers. It's possible to train or host a model on a local computer, but the results are often slow (without dedicated GPU video cards to help handle the compute required to generate results).

When hosted in large data centers, programmatic access to these models is provided through REST APIs, and those are sometimes "wrapped" by SDKs and available to application developers for ease of use. Other tools can help improve the developer experience, providing observability or other utilities.
Application developers can make calls into these APIs to implement business functionality.

Beyond prompting the models programmatically, there are patterns and processes emerging to help businesses build reliable business functionality based on generative AI. For example, there are patterns emerging to help businesses ensure the generated text, code, images, and sound comply with ethical and safety standards as well as commitments to the privacy of customers' data.

In this stack of concerns or layers, if you're an application developer responsible for building business functionality, it's possible for you to push beyond the application layer into developing and training your own LLM. But this level of understanding requires a new set of skills that are often only available academically. If you can't commit to developing competence in data science academically to help build the "next layer down in the stack" (so to speak) then focus on application layer topics like:

- Understanding available APIs and SDKs, what is available, what the various endpoints produce, etc.
- Understanding related tools and services to help you build all the features required for a production-ready generative AI solution.
- Understanding prompt engineering, like how to achieve the best results by asking or rephrasing questions.
- Understanding where bottlenecks emerge and how to scale a solution. Understanding what is involved in logging or obtaining telemetry without violating customer privacy concerns.
- Understanding the characteristics of the various LLMs (their strengths, use cases, what are the benchmarks and what do they measure, key differentiations between vendors and models produced by each vendor, etc.) to choose the right model for your company's needs.
- Understand the latest patterns, workflows, and processes used to build effective and resilient generative AI features in your applications.

## Available services and tools from Microsoft

There are low-code and no-code generative AI tools and services available from Microsoft to help you build part or your whole solution. Various Azure services can play pivotal roles, each contributing to the efficiency, scalability, and robustness of the solution:

### API and SDKs for Code-centric approach

At the heart of every generative AI solution is an LLM model, and Azure OpenAI provides access to all of the features available in models like GPT-4.

|Product|Description|
|---|---|
|**Azure OpenAI**|A hosted service that provides access to powerful language models like GPT-4. There are several different APIs that allow you to perform all of the typical functions of an LLM, like creating embeddings, creating a chat experience, etc. with full access to settings and tweaks to customize the results as needed.|

### Execution environments

Since you're building business logic, presentation logic or APIs to integrate generative AI into your organization's applications, you need somewhere to host and execute that logic.

|Product|Description|
|---|---|
|**Azure App Service (or one of several container-based cloud services)**|This platform can host the web interfaces or APIs through which users interact with the RAG-chat system. It supports rapid development, deployment, and scaling of web applications, making it easier to manage the front-end components of the system.|
|**Azure Functions**|Use serverless compute to handle event-driven tasks within the RAG-chat system. For example, use it to trigger data retrieval processes, process user queries, or handle background tasks like data synchronization and cleanup. It allows for a more modular, scalable approach to building the system's backend.|

### Low-code / No-code

Alternatively, some of the logic required by the solution could be built quickly and hosted reliably by low-code or no-code solutions.

|Product|Description|
|---|---|
|**Azure AI Foundry**|You can use Azure AI Foundry to train, test, and deploy custom machine learning models to enhance the RAG-chat system. For example, use Azure AI Foundry to customize response generation or improve the relevance of retrieved information.|

### Vector database

Some generative AI solutions might require storage and retrieval of data used to augment generation. An example is RAG-based chat systems that allow users to chat with your organization's data. In this use case, you need a vector data store.

|Product|Description|
|---|---|
|**Azure AI Search**|You can use this service to efficiently search through large datasets to find relevant information that can be used to inform the responses generated by the language models. It's useful for the retrieval component of a RAG system, ensuring that the generated responses are as informative and contextually relevant as possible.|
|**Cosmos DB**|This globally distributed, multi-model database service could store the vast amounts of structured and unstructured data that the RAG-chat system needs to access. Its fast read and write capabilities make it ideal for serving real-time data to the language model and storing user interactions for further analysis.|
|**Azure Cache for Redis**|This fully managed in-memory data store could be used for caching frequently accessed information, reducing latency and improving the performance of the RAG-chat system. It's especially useful for storing session data, user preferences, and common queries.|
|**Azure Database for PostgreSQL Flexible Server**|This managed database service could store application data, including logs, user profiles, and historical chat data. Its flexibility and scalability support the dynamic needs of a RAG-chat system, ensuring data is consistently available and secure.|

Each of these Azure services contributes to creating a comprehensive, scalable, and efficient architecture for a generative AI solution, enabling developers to use the best of Azure's cloud capabilities and AI technologies.

## Code-centric generative AI development with the Azure OpenAI API

In this section, we focus on the Azure OpenAI API. As stated earlier, you access LLM functionality programmatically through a RESTful web API. You can use literally any modern programming language to call into these APIs. In many cases, language or platform specific SDKs operate as "wrappers" around the REST API calls to make the experience more idiomatic.

- [Azure OpenAI client library for .NET](/dotnet/api/overview/azure/ai.openai-readme)
- [Azure OpenAI client library for Java](/java/api/overview/azure/ai-openai-readme)
- [Azure OpenAI client library for JavaScript](/javascript/api/overview/azure/openai-readme)
- [Azure OpenAI client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/ai/azopenai)
- Python has no Azure specific client library. You use the [OpenAI Python package](https://platform.openai.com/docs/api-reference) and change several options.

If a language or platform SDK is unavailable, the worst-case scenario is that you must make REST calls directly to the web API. However, most developers are familiar with how to call web APIs.

- [Azure OpenAI Service REST API](/azure/ai-services/openai/reference)

Azure OpenAI offers a range of APIs  designed to facilitate different types of AI-powered tasks, allowing developers to integrate advanced AI functionalities into their applications. Here's an overview of the key APIs available from OpenAI:

- **Chat Completions API**: This API is focused on text generation scenarios including conversational capabilities, enabling the creation of chatbots and virtual assistants that can engage in natural, human-like dialogue. It's optimized for interactive use cases, including customer support, personal assistants, and interactive learning environments. However, it’s also used for all text generation scenarios, including summarization, autocompletion, writing documents, analyzing text, translation, and so on. It’s the entry point for vision capabilities currently in preview (that is, upload an image and ask questions about it).
- **Moderation API**: This API is designed to help developers identify and filter out potentially harmful content within text, providing a tool to ensure safer user interactions by automatically detecting offensive, unsafe, or otherwise inappropriate material.
- **Embeddings API**: The Embeddings API generates vector representations of text inputs, converting words, sentences, or paragraphs into high-dimensional vectors. These embeddings can be used for semantic search, clustering, content similarity analysis, and more. It captures the underlying meaning and semantic relationships in the text.
- **Image generation API**: This API allows you to generate original, high-quality images and art from textual descriptions. It's based on OpenAI's DALL·E model, which can create images that match a wide variety of styles and subjects based on the prompts it receives.
- **Audio API**: This API provides access to OpenAI's audio model, designed for automatic speech recognition. It can transcribe spoken language into text, or text into speech, supporting various languages and dialects. It's useful for applications requiring voice commands, audio content transcription, and more.

While generative AI can be used to work with many different modalities of media, we spend the remainder of this article focusing on text-based generative AI solutions. This covers scenarios like chat, summarization, and so on.

## How to start developing applications with generative AI

Software developers who are new to an unfamiliar language, API, or technology usually begin to learn it by following tutorials or training modules to build small applications. Some software developers prefer to take a self-guided approach and build small experimental applications. Both approaches are valid and useful.

As you get started, it’s best to start small, promise little, iterate, and build your understanding and skill since developing with generative AI presents has unique challenges. For example, in traditional software development you can rely on deterministic output – for any set of inputs, you can expect the exact same output every time. However, Generative  is nondeterministic – you'll never get the exact same answer twice for a given prompt, which is at the root of many new challenges. As you’re getting started, consider the following tips before you get too far:

### Tip #1: Get clear on what you are trying to achieve

- Get specific about the problem you’re trying to solve: Generative AI can solve a wide range of problems, but success comes from clearly defining the specific problem you're aiming to solve. Are you trying to generate text, images, code, or something else? The more specific you are, the better you can tailor the AI to meet your needs.
- Understand your audience: Knowing your audience helps tailor the AI's output to match their expectations, whether it's casual users or experts in a particular field.

### Tip #2: Play to the strengths of LLMs

- Understand the limitations and biases of LLMs: While LLMs are powerful, they have limitations and inherent biases. Knowing the limitations and biases can help you design around them or incorporate mitigations.
- Understand where LLMs excel: LLMs excel at tasks like content creation, summarization, language translation, and so on. While their decision-making capabilities and discriminative capabilities are getting stronger with each new version, there might be other types of AI that are more appropriate for your scenario or use case. Choose the right tool for the job.

### Tip #3: The best results begin with good prompts

- Learn prompt engineering best practices: Crafting effective prompts is an art. Experiment with different prompts to see how they affect the output. Be concise yet descriptive.
- Commit to iterative refinement: Often, the first prompt might not yield the desired result. It's a process of trial and error. Use the outputs to refine your prompts further.

## Build your first generative AI solution

If you want to start experimenting with building a generative AI solution immediately, we recommend taking a look at [Get started with the chat using your own data sample for Python](/azure/developer/python/get-started-app-chat-template?tabs=github-codespaces). There are versions of the tutorial also available in [.NET](/dotnet/ai/get-started-app-chat-template?tabs=github-codespaces), [Java](/azure/developer/java/ai/get-started-app-chat-template?tabs=github-codespaces), and [JavaScript](/azure/developer/javascript/get-started-app-chat-template?tabs=github-codespaces).

## Final considerations that may influence your application design decisions

Here's a short list of things to consider and other takeaways from this article that impact your application design decisions:

- Define the problem space and audience clearly to align the AI's capabilities with user expectations, optimizing the solution's effectiveness for the intended use case.
- Use low-code/no-code platforms for rapid prototyping and development if they meet your project's requirements, evaluating the trade-off between development speed and customizability. Explore the possibilities of low-code and no-code solutions for parts of your application to speed up development and enable nontechnical team members to contribute to the project.
