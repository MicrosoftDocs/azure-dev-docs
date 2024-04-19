---
title: Introduction to developing generative AI applications for experienced developers
description: Conceptual overview about integrating generative AI into applications, exploring its business benefits, operational fundamentals, and the potential of large language models (LLMs).
ms.date: 4/12/2024
ms.topic: conceptual
---

# Introduction to building generative AI solutions for developers

The purpose of this series of articles is to show you how your current software development experience applies to generative AI.

Generative AI democratizes AI development by offering easy-to-use APIs, allowing developers of any skill level to integrate advanced AI functionalities into their applications without needing specialized knowledge. 

Even so, it's common to struggle to understand where you, as an application developer, fit in, at what level in the "stack" you should focus, what you're capable of building with the existing technologies, and develop a mental model where all the terminology and technology fits into a framework that allows you to design and build generative AI features into your applications.


## What do business hope to achieve with generative AI?

To understand how your current software development experience applies to generative AI, it's important to start by understanding how businesses intend to benefit from it. Businesses view generative AI as a means to improve customer engagement, increase operational efficiency, and enhance problem-solving and creativity. Integrating generative AI into existing systems opens opportunities for businesses to enhance their software ecosystems. It can complement traditional software functionalities with advanced AI capabilities, such as predictive text in IDEs for developers or personalized recommendations for users, thereby enriching the overall software experience.

Here are a few common scenarios where generative AI can help businesses:

- Content Generation 
  -	Generate text, code, images, and sound. This could be useful for marketing, sales, IT, internal communications, and more.
- Natural Language Processing
  - Compose or improve business communications through suggestions or complete generation of messages.
  - "Chat with your data", or in other words, enabling a user to ask questions in a chat experience and using data stored in databases or in documents as the basis for answers.
  -	Summarization, organization, and simplification of large bodies of content to make the content more accessible.
  - "Semantic search", or rather, allowing users to search over documents and data without using exact keyword matches.
  - Translating language to increase the reach and accessibility of content.
- Data analysis
  - Analyze markets and identify trends in data.
  - Model "what if" scenarios to help companies plan for possible changes or challenges in every area of the business.
  - Analyze code to suggest improvements, fix bugs, and generate documentation.

Given this, software developers have an opportunity to dramatically increase their impact by integrating generative AI applications and functionality into the software their organizations rely on.

## How do you build these types of applications?

While the LLM does a lot of the heavy lifting, you will build systems that integrate, orchestrate, and monitor the results. As you'll learn, there's a lot of opportunity here. But fortunately, you can leverage the skills you already know:

- Making calls to APIs using REST, JSON or language-specific SDKs
- Orchestrating calls to many different APIs and performing logic
- Storing to and retrieving from data stores
- Integrating input and results into the user experience
- Creating APIs that can be called from LLMs

## What tools and services are available?

There are many functions, roles and responsibilities that need to be addressed depending on the type of system you're building. And each technology, sample and building block from Microsoft addresses one or more of those responsibilities. Therefore, the challenge is making sure you understand:

- What are the typical functions, roles and responsibilities in a given type of generative AI feature? For example, as we discuss at length in conceptual articles describing RAG-based chat systems, there are a number of architectural responsibilities in the system. 
- What APIs, services, and tools exist for a given function, role or responsibility? For each of those, you can choose to build that component yourself with custom code or leverage existing low-code / no-code tools, or call into APIs for existing services.
- Should you use a code-centric or no-code / low-code solution? You could build everything yourself, but is that an efficient use of your time and skill? You can usually stitch together a combination of technologies and approaches (code, no-code, low-code, tools) depending on what you're trying to achieve.

The point here is that there's no single right way to build generative AI features into your applications. There are trade-offs.


## Start with a focus on the application layer

You don't need to understand everything about how generative AI works (like how LLMs are trained, internal structure of a model, etc.) to get started or be productive. In fact, given that you likely already are building software solutions, you need to know very little beyond what you already know. 

Most importantly, you don't need to train your own LLM from scratch. That would require time and resources that most companies are unwilling to commit. Instead, you build on top of existing pre-trained foundational models like GPT-4 by making API calls into existing hosted services like the Azure OpenAI API. In this way, adding generative AI features into an existing application is no different than adding any other functionality based on an API call.

Researching how LLMs are trained or how they work might satisfy your intellectual curiosity, but truly understanding how LLMs work requires deep understanding of data science and the math background to support it include graduate level courses on statistics, probabilities, and information theory. 

If you come from a computer science background, you can appreciate that most application development happens at a "higher layer in the stack" of research and technologies. You may have some understanding of each layer, but you likely specialize in the application development layer, with a focus on a specific programming language and platform, with available APIs, tooling, patterns, and so on.

The same is true for the field of AI. You can understand and appreciate the theory that goes into building on top of Large Language Models (LLM), but you will likely focus your attention on the application layer or help to implement patterns or processes to enable a generative AI effort in your company.

Here is an over-simplified representation of the layers of knowledge required to implement generative AI features in a new or existing application:

:::image type="content" source="./media/ai-stack-developers.png" alt-text="Diagram of layers of knowledge. At the bottom, a box containing the words foundational data science, artificial intelligent research, statistics and probability theory. The next level up, the words training large language models. The next level up, building services, tooling and developing APIs. And at the highest level, application layer, patterns and processes.":::

At the lowest level, you have data scientists that are doing data science research to solve or improve AI based on a deep mathematical understanding of statistics, probability theory and so on.
One layer up, based on the lowest foundational layer, you have data scientists who are taking those theories and implementing them in LLMs, building the neural networks and training the weights and biases to provide a practical piece of software that can accept inputs (prompts) and generate results (completions). The computational process of the composing completions based on prompts is known as inference. There are those who are responsible for implementing the "black box" where the neurons of the neural network predict the next word or pixel to be generated.

Given the amount of processing power required to train models and generate results based on an input, these models are often trained and hosted in large data centers. It is possible to train or host a model on a local computer, but the results are often slow (without dedicated GPU video cards to help handle the compute required to generate results).

When hosted in large data centers, programmatic access to these models is provided through REST APIs, and those are sometimes "wrapped" by SDKs and available to application developers for ease of use. Other tools can help improve the developer experience, providing observability or other utilities.
Application developers can make calls into these APIs to implement business functionality. Later in this document we'll talk about some key scenarios that are enabled by LLMs but are usually things like summarizing text or answering questions based on existing content, generating code, images, audio, and so on.

Beyond prompting the models programmatically, there are patterns and processes emerging to help businesses build reliable business functionality based on generative AI. For example, there are patterns emerging to help businesses ensure the generated text, code, images and sound comply to ethical and safety standards as well as commitments to the privacy of customers' data.

In this stack of concerns or layers, if you are an application developer responsible for building business functionality, it is certainly possible for you to push beyond the application layer into developing and training your own LLM. But gaining this level of understanding requires a new set of skills that are often only available through an academic environment. If you can't commit to developing competence in data science academically to help build the "next layer down in the stack" (so to speak) then you may want to focus understanding things at the application layer like:

- Understanding available APIs and SDKs, what is available, what the various endpoints produce, etc.
- Understanding related tools and services to help you build all the features required for a production-ready generative AI solution.
- Understanding prompt engineering, like how to achieve the best results by asking or rephrasing questions. 
- Understanding where bottlenecks will emerge and how to scale a solution. Understanding what is involved in logging or obtaining telemetry without violating customer privacy concerns.
- Understanding the characteristics of the various LLMs (their strengths, use cases, what are the benchmarks and what do they measure, key differentiations between vendors and models produced by each vendor, etc.) to choose the right model for your company's needs.
- Understand the latest patterns, workflows, and processes used to build effective and resilient generative AI features in your applications.
