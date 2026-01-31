---
title: Key concepts and considerations in generative AI
description: Learn about the limitations of large language models (LLMs) and how to get the best results by modifying prompts, building an inference pipeline, and adjusting API call parameters.
ms.date: 01/30/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.collection: ce-skilling-ai-copilot
ms.subservice: intelligent-apps
# CustomerIntent: As an AI app developer, I want to learn about the limitations and best practices for using LLMs in my applications.
---

# Key concepts and considerations for building generative AI solutions

Large language models (LLMs) are powerful, but they have limits. You need to know what LLMs can do by default and how to adjust them to get the best results for your generative AI apps. This article covers the main challenges with LLMs and shows simple ways to solve them and improve how you generate content, no matter what kind of generative AI features you build.

## Engineering challenges when working with LLMs

Here are the most significant challenges and limitations to keep in mind when you work with LLMs:

- **Knowledge cutoff**: LLMs only know what they were trained on up to a certain date. Without external data connections, they can’t access real-time or private information.

- **Hallucination**: LLMs might generate inaccurate or misleading information. The Groundedness detection feature in Azure AI Foundry helps you determine whether an LLM’s responses are based on the source materials you provide. Ungrounded responses  include information not supported by your data. Learn how to use groundedness detection in this [quickstart](/azure/ai-services/content-safety/quickstart-groundedness?tabs=python&pivots=programming-language-rest).

- **Transparency**: You can’t always trace the source or accuracy of generated content, and there’s no built-in verification step.

- **No domain-specific knowledge**: LLMs don’t know your internal or proprietary data unless you integrate it.

- **Inability to learn from interactions**: LLMs don’t have memory or awareness of past interactions, so they can’t adapt or improve over time based on user feedback.
To overcome these challenges and get the best results, supplement the LLM’s knowledge with your own data and use validation tools.

### Where LLMs get their information

LLMs are trained on large datasets from books, articles, websites, and other sources. Their responses reflect patterns in this data, but anything that happened after the training cutoff isn’t included. Without external connections, LLMs can’t access real-time information or browse the internet, which can lead to outdated or incomplete answers.

## Factors that affect how inference works

When you use an LLM, it might look like the model remembers your whole conversation. In reality, each new prompt you send includes all your earlier prompts and the model’s replies. The LLM uses this full history as context to create the next answer. This running history is the _context window_.

Each LLM has a maximum context window size, which changes by model and version. If your conversation goes over this limit, the model drops the oldest parts and ignores them in its answer.

Longer context windows mean the model has to process more data, which can slow down things and cost more.

The context window size uses tokens, not words. Tokens are the smallest pieces of text the model can handle—these parts might be whole words, parts of words, or single characters, depending on the language and tokenizer.

For developers, token usage directly impacts:

- The maximum amount of conversation history the model can consider (context window)
- The cost of each prompt and completion, since billing is based on the number of tokens processed

## What is tokenization?

_Tokenization_ is the process of breaking text into tokens—the smallest units a model can process. Tokenization is essential for both training and inference with LLMs. Depending on the language and tokenizer, tokens might be whole words, subwords, or even single characters. Tokenization can be as simple as splitting by spaces and punctuation, or as complex as using algorithms that account for language structure and morphology.

The OpenAI [tokenizer](https://platform.openai.com/tokenizer) page explains tokenization in detail and includes a calculator to show how sentences are split into tokens.

In typical English text, one token is about four characters. On average, 100 tokens are roughly 75 words.

For developers, the following libraries help estimate token counts for prompts and completions, which is useful for managing context window limits and costs:
- the [tiktoken](https://github.com/openai/tiktoken) library (Python and JavaScript)
- the [Microsoft.ML.Tokenizers](https://www.nuget.org/packages/Microsoft.ML.Tokenizers/2.0.0-preview.1.25127.4#readme-body-tab) library (.NET)
- the [Hugging Face Tokenizers](https://huggingface.co/docs/tokenizers/python/latest/index) library (JavaScript, Python, and Java)

### Token usage affects billing

Each Azure OpenAI API has a different billing methodology. For processing and generating text with the Responses or Chat Completions API, you're billed based on the number of tokens you submit as a prompt and the number of tokens that are generated as a result (completion).

Each LLM model (for example, GPT-5.2, or GPT-5.2-mini) usually has a different price, which reflects the amount of computation required to process and generate tokens. Many times, price is presented as "price per 1,000 tokens" or "price per 1 million tokens."

This pricing model has a significant effect on how you design the user interactions and the amount of preprocessing and post-processing you add.

## System prompts vs. user prompts

So far, this article discussed _user prompts_. A _user prompt_ is what you send to the model and what the model replies to.

OpenAI also added the _system prompt_ (or _custom instructions_). A system prompt is a set of rules you add to every chat. For example, you can tell the LLM to "always answer in haiku form." After that, every answer will be a haiku.

This haiku example shows how you can change the LLM's answers by changing the prompt.

Why change the user's prompt? If you build a generative AI app for work, customers, or partners, you might want to add rules to limit what the model can answer.

But changing the user prompt is just one way to make text generation better.

## Methods to improve the text generation experience for users 

To improve text generation results, developers are limited to simply improving the prompt, and there are many prompt engineering techniques that can help. However, if you're building your own generative AI application, there are several ways to improve the text generation experience for users, and you might want to experiment with implementing all of them:

- Programmatically modify the user prompts.
- Implement an inference pipeline.
- Retrieval-Augmented Generation (discussed in other articles).
- Fine-tuning (discussed in other articles).

### Programmatically modify user prompts

To add a system prompt to a user conversation, you don't use a special API. You just append instructions to the prompt as needed.

But you can use a few techniques to improve user prompts:

- **Contextual priming**: Craft system prompts that explicitly set the context of the conversation within the domain. This approach involves providing a brief description or a set of instructions at the beginning of each interaction. The instructions guide AI to stay within the problem domain.
- **Example-based guidance**: In the initial prompt, include examples of the types of questions and answers that are relevant to your domain. This approach helps AI understand what kind of responses to expect.

You can use any prompt-engineering technique. If you can accomplish it programmatically, you can improve the user prompt on their behalf.

The caveat to this approach is that the longer the prompt, the higher the cost for each call to the LLM. Even so, this approach is likely the least expensive approach that this article describes.

### Implement an inference pipeline

After you improve the user's prompt, the next step is to build an inference pipeline.

An _inference pipeline_ is a process that:
1. Cleans up raw input (like text or images) 
1. Sends it to the model (preprocessing) 
1. Checks the model's answer to make sure it meets the user's needs before showing it (postprocessing).

Preprocessing can include checking for keywords, scoring relevance, or changing the query to better fit your domain. For example, look at the user's first prompt. Ask the LLM if the prompt makes sense, follows your rules, is based on a correct idea, or needs rewriting to avoid bias. If the LLM finds problems, you can ask it to rewrite the prompt to get a better answer.

Postprocessing can mean checking if the answer fits your domain and meets your standards. You might remove or flag answers that don't match your rules. For example, check the LLM's answer to see if it meets your quality and safety needs. You can ask the LLM to review its answer and change it if needed. Repeat this process until you get a good result.

Keep in mind: every time you call an LLM in your inference pipeline, it takes longer to respond and costs more. You need to balance these trade-offs with your budget, speed, and how well your system works.

For information about the specific steps to take to build an inference pipeline, see [Build an advanced retrieval-augmented generation system](advanced-retrieval-augmented-generation.md).

### Other factors that influence completions

Beyond programmatically modifying the prompt, creating an inference pipeline, and other techniques, more details are discussed in [Augmenting a large-language model with retrieval-augmented generation and fine-tuning](augment-llm-rag-fine-tuning.md). Also, you can modify parameters when you make calls to the Azure OpenAI API.

Here are some of the key parameters you can adjust to influence the model's output:

- **`Temperature`**: Control the randomness of the output the model generates. At zero, the model becomes deterministic, consistently selecting the most likely next token from its training data. At a temperature of 1, the model balances between choosing high-probability tokens and introducing randomness into the output.

- **`Max Tokens`**: Controls the maximum length of the response. Setting a higher or lower limit can affect the detail and scope of the generated content.

- **`Top P` (nucleus sampling)**: Used with `Temperature` to control the randomness of the response. `Top P` limits AI to consider only the top percent of probability mass (`P`) when it generates each token. Lower values lead to text that is more focused and predictable. Higher values allow for more diversity.

- **`Frequency Penalty`**: Decreases the likelihood of the model repeating the same line or phrase. Increasing this value helps avoid redundancy in the generated text.

- **`Presence Penalty`**: Encourages the model to introduce new concepts and terms in the completion. `Presence Penalty` is useful for generating more diverse and creative outputs.

- **`Stop Sequences`**: You can specify one or more sequences to instruct the API to stop generating more tokens. `Store Sequences` are useful for controlling the structure of the output, such as ending a completion at the end of a sentence or paragraph.

- **`Logit Bias`**: Allows you to modify the likelihood of specified tokens appearing in the completion. `Logit Bias` can be used to guide the completion in a certain direction or to suppress specific content.

## Microsoft Azure OpenAI safeguards

In addition to keeping the LLM's responses bound to specific subject matter or domains, you also likely are concerned about the kinds of questions your users are asking of the LLM. It's important to consider the kinds of answers it's generating.

First, API calls to Microsoft Azure OpenAI Models in Microsoft Foundry automatically filter content that the API finds potentially offensive and reports this back to you in many filtering categories.

You can directly use the [Content Moderation API](/azure/ai-services/content-moderator/api-reference) directly to check any content for potentially harmful content.

Then, you can use [Azure AI Content Safety](/azure/ai-services/content-safety/overview) to help with text moderation, image moderation, jailbreak risk detection, and protected material detection. This service combines a portal setup, configuration, and reporting experience with code you can add to your application to identify harmful content.

## AI Agents

AI agents are a new way to build generative AI apps that work on their own. They use LLMs to read and write text, and they can also connect to outside systems, APIs, and data sources.
AI agents can manage complex tasks, make choices using real-time data, and learn from how people use them.
For more information about AI agents, see [Quickstart: Create a new agent](/azure/ai-foundry/agents/quickstart?view=foundry-classic&pivots=programming-language-python-azure&preserve-view=true).

### Tool calling

AI agents can use outside tools and APIs to get information, take action, or connect with other services. This feature lets them do more than just generate text and handle more complex tasks.

For example, an AI agent can get real-time weather updates from a weather API or pull details from a database based on what a user asks.
For more information about tool calling, see [Discover and manage tools in the Foundry tool catalog (preview)](/azure/ai-foundry/agents/concepts/tool-catalog?view=foundry&preserve-view=true).

### Model Context Protocol (MCP)

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) lets apps provide capabilities and context to a large language model. A key feature of MCP is defining tools that AI agents use to complete tasks. MCP servers can run locally, but remote MCP servers are crucial for sharing tools at cloud scale. For more information: see [Build Agents using Model Context Protocol on Azure](intro-agents-mcp.md).

## Final considerations for application design

Understanding tokenization, pricing, context windows, and implementing programmatic improvements to enhance the users' text generation experience affects how you design your generative AI system.

Here's a short list of things to consider and other takeaways from this article that might affect your application design decisions:

- Evaluate the necessity of using the latest AI model against cost considerations. Models that are less expensive might suffice for your application's needs. Balance performance with budget constraints.
- Consider optimizing the context window length to manage costs without significantly affecting the user experience. Trimming unnecessary parts of the conversation might reduce processing fees while maintaining quality interactions.
- Assess how tokenization and the granularity of your inputs and outputs affect performance. Understanding how your chosen LLM handles tokenization can help you optimize the efficiency of your API calls, potentially reducing costs and improving response times.

If you want to start experimenting with building a generative AI solution immediately, we recommend that you take a look at [Get started with the chat by using your own data sample for Python](/azure/developer/python/get-started-app-chat-template?tabs=github-codespaces). The tutorial is also available in [.NET](/dotnet/ai/get-started-app-chat-template?tabs=github-codespaces), [Java](/azure/developer/java/ai/get-started-app-chat-template?tabs=github-codespaces), and [JavaScript](/azure/developer/javascript/get-started-app-chat-template?tabs=github-codespaces).
