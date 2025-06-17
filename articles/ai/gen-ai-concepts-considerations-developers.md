---
title: Key Concepts and Considerations in Generative AI
description: As a developer, learn about the limitations of large language models (LLMs) and how to get the best results by modifying prompts, implementing an inference pipeline, and modifying optional API call parameters.
ms.date: 01/15/2025
ms.topic: concept-article
ms.custom: build-2024-intelligent-apps
---

# Key concepts and considerations for building generative AI solutions

Large language models (LLMs) are amazing, but they have limitations. As a developer, you need to understand those limitations, what LLMs are capable of "out of the box," and how to modify them to get the best results for the generative AI solutions you build. This article identifies several challenges and limiting factors of LLMs. It explains common ways to overcome the challenges and take control of the content generation process regardless of the type of generative AI features you build into your application.

## Engineering challenges when working with LLMs

The following list summarizes the most significant challenges or limitations to be aware of when you work with LLMs:

- **Knowledge cutoff**: Due to the high cost of training an LLM, an LLM's body of knowledge is limited to what it was trained on at a point in time. Without any plug-ins or other accommodations, an LLM has no access to real-time information, and it can't access private data.

- **Hallucination**: An LLM uses statistical probabilities and a little randomness to generate information. Mechanisms are in place to keep generated responses aligned to the human's intent in the questions that are asked and the information an LLM was trained on, but it's possible for an LLM to create replies that aren't accurate.

- **Transparency**: Also because of the way an LLM is trained, it no longer has access to the foundational knowledge it was trained on. Even if it did, there's no guarantee that the information was truthful and grounded to begin with. Also, there's no verification step to ensure that the generated response is accurate.

- **No domain-specific knowledge**: Similar to knowledge cutoff, if you have private information like internal-only company documents, the LLM wasn't trained on this information. It has no knowledge of domain-specific data.

What can you do to mitigate the possible challenges or problems with LLMs and get the best possible results to help your users and your organization? Start by understanding the ways you can supplement where an LLM gets its data.

### Where LLMs get their information

A good starting point to getting the best results from an LLM is to understand where or how LLMs get their information. The following categories represent different approaches to how LLMs interact with various sources of information to generate responses.

:::image type="content" source="./media/llm-knowledge.png" alt-text="Diagram that depicts three different types of retrieval generation: retrieval-off generation, retrieval-augmented generation, and retrieval-centric generation." :::

- **Retrieval-off generation (ROG)**:  Traditional LLMs use this model. The model generates responses based solely on the knowledge it was trained on, without accessing or retrieving any external information during the generation process. The model's knowledge is static and limited to what was included in its training data up to the cutoff date. In addition to creative writing, it can answer questions about information that's readily available on the internet.

- **Retrieval-augmented generation (RAG)**: Combines the generative capabilities of LLMs with the ability to retrieve information from external databases or documents in real time. The model queries an external source to find relevant information. It then uses the information to form its response. This approach allows the model to provide more accurate and up-to-date information than it provides by using its pretrained knowledge alone. Use cases include fact checking, answering questions based on real-time data, or answering questions based on private, domain-specific data.

- **Retrieval-centric generation (RCG)**: Places even more emphasis on the externally retrieved content, often structuring responses around the information fetched from external sources. The model might directly incorporate large segments of retrieved text into its outputs, editing or annotating them to fit the user's query. This approach can be seen as a hybrid between retrieval-based and generative methods, where the balance might heavily favor the information retrieved over the model's own generative capabilities. Use cases include summarization of a longer document, research assistance to provide comparisons and thematic explorations across multiple similar documents, and compilation or collation of different sources of material into a combined output.

A good example of ROG is ChatGPT. By contrast, Copilot (via Bing) extends an LLM by using external sources from news sources (and by providing links to those sources).

At first glance, RAG and RCG appear similar because both involve integrating external information into the language generation process. However, they differ in how they prioritize and use retrieved information in the generation process.

In a RAG system, the external data retrieval is used to _augment_ the generative capabilities of a pretrained language model. The retrieved information provides more context or specific data that the model uses to inform its responses. In a RAG system, the generative aspect of the language model remains central to the response. Retrieved data acts as a _supportive element_ to enhance accuracy or depth.

An RCG system places a stronger emphasis on the retrieved information itself. In an RCG system, the retrieved data often is the _centerpiece_ of the response, and the generative model’s role primarily is to refine, format, or slightly enhance the retrieved text. This approach is used particularly when accuracy and direct relevance of the information are paramount, and less creative synthesis or extrapolation is required.

The mechanisms for external retrieval of data that power both RAG and RCG are discussed in articles about storing vectorized embeddings of documents versus fine-tuning an LLM, the two prevalent approaches to supplementing the knowledge available to the LLM based on its initial training.

Understanding the distinctions between retrieval models can help you choose the right approach for specific applications. It helps you balance the need for creative synthesis versus accuracy and fidelity to source material.

## Factors that affect how inference works

Because you're likely familiar with ChatGPT's web-based user interface, understanding how it works to answer questions can help you understand concepts that are vital when you build generative AI features in your own applications.

When a user chats with ChatGPT, the user interface design gives you the illusion of a long-running chat session that maintains state over the course of several back-and-forth exchanges between you and the LLM. In reality, for a given chat session, all prompts and all LLM responses (also called _completions_) are sent with each new prompt. As your conversation grows, you send increasingly more text to the LLM to process. With each new prompt, you send all previous prompts and completions. ChatGPT uses the entire chat session's context, and not just the current prompt, when it composes a response to your current prompt. The entire chat session is called the _context window_.

A context window has a length limit that varies by the version of ChatGPT you work with. Any part of your chat conversation that exceeds the context window length limit is ignored when ChatGPT composes a response to your latest prompt.

Long conversations might seem like a good idea at first, but long context windows can affect the amount of computation required to process the prompt and compose a completion. The size of the context windows affects the latency of the response and how much it costs for OpenAI to process the request.

What is ChatGPT's context window limit? That is, how many words can ChatGPT work with?

The context window limit depends on the LLM model, version, and edition you're working with. Furthermore, context lengths are measured in tokens, not in words. Tokens are the smallest units of text that the model can understand and generate. These units can be words, parts of words (like syllables or stems), or even individual characters. Tokens are at the heart of natural language processing (NLP).

The use of tokens impacts two important considerations for developers:

- The maximum context window limit
- The price per prompt and completion

## What is tokenization?

_Tokenization_ is the process of converting text into tokens. It's a crucial step in preparing data for training or inference (the process of composing completions based on prompts) with an LLM. The process involves several steps, including breaking down complex text into manageable pieces (tokens), which the model can then process. This process can be simple, such as splitting text by spaces and punctuation, or more complex, involving sophisticated algorithms to handle different languages, morphologies (the structure of words), and syntaxes (the arrangement of words). LLM researchers and developers decide on the method of tokenization based on what they're trying to accomplish.

The OpenAI [tokenizer](https://platform.openai.com/tokenizer) page explains more about tokenization. The page even has a calculator that illustrates how a sentence or paragraph breaks down into tokens.

As the note at the bottom of the OpenAI Tokenizer page states, in typical English texts, one token is equivalent to about four characters. On average, 100 tokens are approximately equal to 75 words or three-quarters of a word per token.

The OpenAI Tokenizer page also talks about [tiktoken](https://github.com/openai/tiktoken), a package for Python and JavaScript that you can use to programmatically estimate how many tokens are required to send a specific prompt to the OpenAI API.

### Token usage affects billing

Each Azure OpenAI API has a different billing methodology. For processing and generating text with the Chat Completions API, you're billed based on the number of tokens you submit as a prompt and the number of tokens that are generated as a result (completion).

Each LLM model (for example, GPT-3.5, GPT-3.5 Turbo, or GPT-4) usually has a different price, which reflects the amount of computation required to process and generate tokens. Many times, price is presented as "price per 1,000 tokens" or "price per 1 million tokens."

This pricing model has a significant effect on how you design the user interactions and the amount of preprocessing and post-processing you add.

## System prompts vs. user prompts

Up to this point, the discussion has focused solely on _user prompts_. A user prompt is the type of prompt that makes up the interchange between a user and ChatGPT.

OpenAI introduced the _system prompt_ (also called _custom instructions_). A system prompt is an overarching set of instructions that you define and add to all your chat conversations. Think of it as a set of meta instructions you want the LLM to always observe each time you start a new chat session. For example, you can set the system prompt to "always respond in the poetic form of haiku." From that point on, every new prompt to ChatGPT results in a haiku containing the answer.

While "reply in haiku form" isn't a useful example, it does illustrate the idea that you can influence an LLM's completion to your prompt by modifying the prompt itself.

Why would you want to modify the user's prompt? If you're building a generative AI feature or application for a professional audience, which might include company employees, customers, and partners, you undoubtedly want to add safeguards to limit the scope of topics or domains it can answer.

But modifying the user prompt is only one method to improve the text generation experience for users.

## Methods to improve the text generation experience for users in ChatGPT

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

The next step beyond modifying the user's prompt programmatically is to create an entire inference pipeline.

An _inference pipeline_ is an end-to-end process that "cleans up" raw input (like text or an image) before using it to perform your primary prompt (preprocessing) or checks the completion to ensure that it meets the user's needs before displaying it (postprocessing).

Preprocessing might involve keyword checking, relevance scoring, or transforming the query to better fit the expected domain language. For example, you can analyze the initial prompt the user submits. Begin by asking the LLM if the prompt makes sense, if it is within the boundaries of what you are willing to accept, if it's based on a faulty premise, or if it needs to be rewritten to avoid certain biases. If the LLM analyzes the prompt and finds issues, you might go a step further. You can ask the LLM to reword the prompt to potentially improve the answer.

Postprocessing might involve validating the answer's relevance and appropriateness to the domain. It might include removing or flagging answers that don't fit the domain requirements. For example, you might want to inspect the completion provided by the LLM to ensure that it meets your quality and safety requirements. You can ask the LLM to evaluate the answer to see if it in fact meets the requirements you asked it to adhere to. If it doesn't, you can ask the LLM to modify the completion. Repeat these steps until you have a satisfactory result.

There's one caveat to adding preprocessing steps: each time you add a call to an LLM in your inference pipeline, you increase the overall latency  (time to respond) and the cost of each interaction with the user. As an experienced software developer, you're likely already aware of these kinds of trade-offs that affect the budget, performance, and effectiveness of a software system.

For information about the specific steps to take to build an inference pipeline, see [Build an advanced retrieval-augmented generation system](advanced-retrieval-augmented-generation.md).

### Other factors that influence completions

Beyond programmatically modifying the prompt, creating an inference pipeline, and other techniques, more details are discussed in [Augmenting a large-language model with retrieval-augmented generation and fine-tuning](augment-llm-rag-fine-tuning.md). Also, you can modify parameters when you make calls to the Azure OpenAI API.

To review required and optional parameters to pass that can affect various aspects of the completion, see the [Chat endpoint documentation](https://platform.openai.com/docs/api-reference/chat/create). If you're using an SDK, see the SDK documentation for the language you use. You can experiment with the parameters in the [Playground](https://platform.openai.com/playground/chat).

- **`Temperature`**: Control the randomness of the output the model generates. At zero, the model becomes deterministic, consistently selecting the most likely next token from its training data. At a temperature of 1, the model balances between choosing high-probability tokens and introducing randomness into the output.

- **`Max Tokens`**: Controls the maximum length of the response. Setting a higher or lower limit can affect the detail and scope of the content that's generated.

- **`Top P` (nucleus sampling)**: Used with `Temperature` to control the randomness of the response. `Top P` limits AI to consider only the top percent of probability mass (`P`) when it generates each token. Lower values lead to text that is more focused and predictable. Higher values allow for more diversity.

- **`Frequency Penalty`**: Decreases the likelihood of the model repeating the same line or phrase. Increasing this value helps avoid redundancy in the generated text.

- **`Presence Penalty`**: Encourages the model to introduce new concepts and terms in the completion. `Presence Penalty` is useful for generating more diverse and creative outputs.

- **`Stop Sequences`**: You can specify one or more sequences to instruct the API to stop generating more tokens. `Store Sequences` are useful for controlling the structure of the output, such as ending a completion at the end of a sentence or paragraph.

- **`Logit Bias`**: Allows you to modify the likelihood of specified tokens appearing in the completion. `Logit Bias` can be used to guide the completion in a certain direction or to suppress specific content.

## Microsoft OpenAI safeguards

In addition to keeping the LLM's responses bound to specific subject matter or domains, you also likely are concerned about the kinds of questions your users are asking of the LLM. It's important to consider the kinds of answers it's generating.

First, API calls to Microsoft OpenAI Services automatically filter content that the API finds potentially offensive and reports this back to you in many filtering categories.

You can directly use the OpenAI Moderation API directly to check any content for potentially harmful content.

Then, you can use Azure AI Content Safety to help with text moderation, image moderation, jailbreak risk detection, and protected material detection. This combines a portal setup, configuration, and reporting experience with code you can add to your application to identify harmful content.

## Final considerations for application design

Understanding tokenization, pricing, context windows, and implementing programmatic improvements to enhance the users' text generation experience affects how you design your generative AI system.

Here's a short list of things to consider and other takeaways from this article that might affect your application design decisions:

- Evaluate the necessity of using the latest AI model against cost considerations. Models that are less expensive might suffice for your application's needs. Balance performance with budget constraints.
- Consider optimizing the context window length to manage costs without significantly affecting the user experience. Trimming unnecessary parts of the conversation might reduce processing fees while maintaining quality interactions.
- Assess how tokenization and the granularity of your inputs and outputs affect performance. Understanding how your chosen LLM handles tokenization can help you optimize the efficiency of your API calls, potentially reducing costs and improving response times.

If you want to start experimenting with building a generative AI solution immediately, we recommend that you take a look at [Get started with the chat by using your own data sample for Python](/azure/developer/python/get-started-app-chat-template?tabs=github-codespaces). The tutorial is also available in [.NET](/dotnet/ai/get-started-app-chat-template?tabs=github-codespaces), [Java](/azure/developer/java/ai/get-started-app-chat-template?tabs=github-codespaces), and [JavaScript](/azure/developer/javascript/get-started-app-chat-template?tabs=github-codespaces).
