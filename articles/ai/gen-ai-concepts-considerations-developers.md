---
title: Important concepts and considerations for developers building generative AI solutuions
description: Conceptual article for developers building generative AI applications explaining the limitations of LLMs and how to get the best results by modifying prompts, implementing an inference pipeline and tweaking optional API call parameters.
ms.date: 4/12/2024
ms.topic: conceptual
---

# Important concepts and considerations for developers building generative AI solutuions

LLMs are amazing, but even they have their limitations. Engineers need to understand those limitations, what LLMs are capable of "out of the box", and how to tweak them to get the best results. This article will identify several challenges and limiting factors, and explain common ways to overcome those challenges and take control of the content generation process regardless of what type of generative AI feature you're building into your application.

## Engineering challenges of working with LLMs

LLMs are incredible tools, but even they have their limitations. These limitation require engineers to make affordances to correct their problems. These problems include:

- **Knowledge cutoff** - Due to the high cost of training an LLM, their body of knowledge is limited to what they were trained on at a certain point in time. Without any plug-ins or other accommodations, they have no access to real-time information, nor do they have access to private data.

- **Hallucination** - An LLM uses statistical probabilities and a little randomness to generate information. There are mechanisms in place to keep generated responses aligned to the human's intent in the questions that are asked and the information they were trained on, but it's possible that they create replies that are not accurate.

- **Transparency** - Again, due to the way the models are trained, they no longer have access to the foundational knowledge they were trained on. And even if they did, there's no guarantee that information was truthful and grounded in the first place. Furthermore, there's no verification step to ensure that the generated response is accurate.

- **No domain specific knowledge** - Similar to "knowledge cutoff, if you have private information like internal-only company documents, the LLM was not trained on this information and therefore has no domain specific knowledge.

What can you do to mitigate the possible downsides or problems with LLMs and get the best possible results to help your users and your organization? Start by understanding the ways in which you can supplement where the LLM is getting its data from.

### Understanding where LLMs get their information

To address the problems of LLMs, engineers need to consider the kinds of information they are working with, and choose the right retrieval model for their application. The following categories represent different approaches to how LLMs interact with external information or databases to generate responses.

:::image type="content" source="./media/llm-knowledge.png" alt-text="An image" :::

- **Retrieval-Off Generation (ROG)** - This is the way traditional way LLMs operate, where the model generates responses based solely on the knowledge it was trained on, without accessing or retrieving any external information during the generation process. The model's knowledge is static, limited to what was included in its training data up to the cutoff date. In addition to creative writing, it can answer questions on information readily available at large on the internet.

- **Retrieval-Augmented Generation (RAG)** - Combines the generative capabilities of LLMs with the ability to retrieve information from external databases or documents in real-time. The model queries an external source to find relevant information, which it then uses to inform its response. This approach allows the model to provide more accurate and up-to-date information than it could from its pre-trained knowledge alone. Use cases include fact checking, answering questions based on real-time data or private, domain-specific data.

- **Retrieval-Centric Generation (RCG)** - Places even more emphasis on the retrieved content, often structuring responses around the information fetched from external sources. The model might directly incorporate large segments of retrieved text into its outputs, editing or annotating them to fit the user's query. This approach can be seen as a hybrid between retrieval-based and generative methods, where the balance may heavily favor the information retrieved over the model's own generative capabilities. Use cases include summarization of a longer document, research assistance to provide comparisons and thematic explorations across multiple similar documents, and compilation or collation of different sources of material into a combined output.

A good example of Retrieval-Off Generation (ROG) is ChatGPT. By contrast, if necessary, Copilot (via Bing) extends the LLM by using external sources from news sources (and providing links to those sources).

At first glance, Retrieval-Augmented Generation (RAG) and Retrieval-Centric Generation (RCG) sound similar because both involve integrating external information into the language generation process. However, they differ in how they prioritize and utilize the retrieved information within the generation process.

In RAG systems, the external data retrieval is used to _augment_ the generative capabilities of a pre-trained language model. The retrieved information provides additional context or specific data that the model uses to inform its responses. Here, the generative aspect of the language model remains central to the response, while the retrieved data acts as a _supportive element_ to enhance accuracy or depth.

RCG systems, on the other hand, place a stronger emphasis on the retrieved information itself. In these systems, the retrieved data is often the _centerpiece_ of the response, with the generative model’s role primarily to refine, format, or slightly enhance the retrieved text. This approach is used particularly when accuracy and direct relevance of the information are paramount, and less creative synthesis or extrapolation is required.

The mechanisms for external retrieval of data that power both RAG and RCG are discussed in articles about storing vectorized embeddings of documents versus fine-tuning an LLM, the two prevalent approaches to supplementing the knowledge avaiable to the LLM based on its initial training.

Understanding the distinctions between retrieval models can help in choosing the right approach for specific applications, balancing the need for creative synthesis versus the need for accuracy and fidelity to source material.

## Understanding factors how an LLM 

Since you're likely familiar with ChatGPT's web-based user interface, understanding how it works can help you understand concepts that will be vital when building generative AI features in your own applications. 

When interactively chatting with ChatGPT, the user interface design gives the illusion of a long-running chat session which maintains state over the course of several back-and-forth exchanges between you and the LLM. In reality, for a given chat session, all of your prompts and all of the LLM's responses (also known as "completions") are sent each time you initiate a new prompt. So, as your conversation grows, you are sending more and more text to the LLM to process – all of the previous prompts and completions. ChatGPT uses the entire chat session's context – not just the current prompt – when composing a response to your current prompt. The entire chat session is called the **context window**.

There's a context window length limit depending on the version of ChatGPT you work with. Any part of your chat conversation that exceeds the context window length limit will be ignored when composing a response to your latest prompt.

Long conversations may seem like a good idea at first, but extremely long context windows can affect the amount of computation required to process the prompt and compose a completion. This affects the latency of the response as well as how much it costs for OpenAI to process the request.

What is ChatGPT's context window limit? Or rather, how many words can ChatGPT work with?
The context window limit depends on the LLM model, version, and edition you are working with. Furthermore, context lengths are measured in tokens, not in words. Tokens are the smallest units of text that the model can understand and generate. These units can be words, parts of words (like syllables or stems), or even individual characters. Tokens are at the heart of natural language processing (NLP).

The use of tokens impacts two important considerations for developers:

-	The maximum context window limit
-	The price per prompt and completion

## What is tokenization?

"Tokenization" is the process of converting text into tokens. It's a crucial step in preparing data for training or inference (the process of composing completions based on prompts) with an LLM. The process involves several steps, including breaking down complex text into manageable pieces (tokens), which the model can then process. This process can be simple, such as splitting text by spaces and punctuation, or more complex, involving sophisticated algorithms to handle different languages, morphologies (the structure of words), and syntaxes (the arrangement of words). LLM researchers and developers decide on the method of tokenization based on what they're trying to accomplish. 
OpenAI has a [helpful page](https://platform.openai.com/tokenizer) that explains more about tokenization, and even has a calculator that will illustrate how a sentence or paragraph breaks down into tokens.
 
As the note at the bottom of the OpenAI Tokenizer page states that, in typical English texts, one token is equivalent to about four characters. This means that on average, 100 tokens are approximately equal to 75 words, or three-quarters of a word per token.

The OpenAI Tokenizer page also talks about [tiktoken](https://github.com/openai/tiktoken), a package for Python and JavaScript that allows you to programmatically estimate how many tokens you will use for a given prompt sent to the OpenAI API.

### Token usage affects billing

Each of the Azure OpenAI APIs have a different billing methodology. For processing and generating text with the Chat Completions API, you are billed based on the number of tokens you submit as a prompt and the number of tokens that are generated as a result (completion).

Each LLM model (ex. gpt-3.5, gpt-3.5-turbo, gpt-4, etc.) usually has a different price, which reflects the amount of computation required to process and generate tokens. Price is usually presented as "price per 1000 tokens" or "price per one million tokens".

This pricing model has a significant impact on how you design the user interactions, as well as the amount of pre- and post- processing you add. 

## System versus User prompts

Up to this point, we've only talked about "user prompts" – the prompts that comprise the interchange between you and ChatGPT. 

OpenAI introduced the "system prompt" (also known as "custom instructions"), which is an over-arching set of instructions that you define and is added to all your chat conversations. Think of it as a set of meta instructions you want the LLM to always observe each time you start a new chat session. For example, you can set the system prompt to "always respond in the poetic form of haiku." From that point on, every new prompt to ChatGPT will result in a haiku containing the answer.

While "reply in haiku form" is not a very useful example, it does illustrate the idea that you can influence an LLM's completion to your prompt by modifying the prompt itself.

Why would you want to modify the user's prompt? If you are building a generative AI feature or application for a professional audience, which may include company employees, customers, and partners, you will undoubtedly want to add safeguards to limit the scope of topics or domains it is allowed to answer. 

But modifying the user's prompt is only one method to improve the text generation experience for users. 

## Methods to improve the text generation experience for users In ChatGPT

If you want to improve text generation, you are limited to simply improving the prompt, and there are many prompt engineering techniques that can help you. However, if you're building your own generative AI application, there are several ways to improve the text generation experience for users, and you may want to experiment with implementing all of them:

-	Programmatically modify the user prompts
-	Implement an inference pipeline
-	Retrieval-Augmented Generation (discussed in other articles)
-	Fine-tuning (discussed in other articles)

### Programmatically modifying user prompts

From a programmatic perspective, there's no special API for adding a system prompt to your users' conversations. You merely append instructions to the prompt as needed.
However, there are a few techniques for improving user prompts:

- **Contextual Priming**: Craft system prompts that explicitly set the context of the conversation within your desired domain. This involves providing a brief description or a set of instructions at the beginning of each interaction, guiding the AI to stay within the problem domain.
- **Example-Based Guidance**: Include examples of the types of questions and answers that are relevant to your domain in the initial prompt. This will help the AI understand the kind of responses expected.

Furthermore, all prompt-engineering techniques can be applied. If you can accomplish this programmatically in some way, then you can improve the user's prompt on their behalf.

The caveat to this approach is that the longer the prompt, the more expensive  each call to the LLM. Even so, this is likely the most inexpensive of the approaches that will be discussed.

### Implementing an inference pipeline

The next step beyond modifying the user's prompt programmatically is to create an entire inference pipeline.

An **inference pipeline** is the end-to-end process that takes raw input (like text or images) and "cleans it up" before using it to perform your primary prompt (pre-processing) or to check the completion to ensure it meets the user's needs prior to displaying it to the user (post-processing).

Pre-processing could involve keyword checking, relevance scoring, or transforming the query to better fit the expected domain language. For example, you could simply analyze the initial prompt submitted by the user and begin by asking the LLM if the prompt makes sense, if it is within the boundaries of what you are willing to accept, if it is based on a faulty premise, or needs to be re-written to avoid certain biases.  If the LLM analyzes the prompt and finds issues, you may go a step further: ask the LLM to re-word the prompt to potentially improve the answer.

Post-processing could involve validating the answer's relevance and appropriateness to the domain. This might include removing or flagging answers that don't fit the domain requirements. For example, you may want to inspect the completion provided by the LLM to ensure that it meets your quality and safety requirements. You can ask the LLM to evaluate the answer to see if it, indeed, meets the requirements you asked it to adhere to. If it does not, you can ask the LLM to modify the completion, and repeat this until you have a satisfactory result.

There is one caveat to this approach: each time you add a call to an LLM in your inference pipeline, you increase the overall latency  (time to respond) and the cost of each interaction with the user. As an experienced software developer, you are likely already aware of these kinds of trade-offs that must be made by leadership that affect the budget, performance, and effectiveness of the software system.

## Other factors influencing completions

If you look at the [Chat end point documentation](https://platform.openai.com/docs/api-reference/chat/create), you can see a list of required and optional parameters to pass that can affect aspects of the completion. You can experiement with these in the [Playground](https://platform.openai.com/playground/chat).

- **Temperature**: control the randomness of the output generated by the model. At zero, the model becomes completely deterministic, consistently selecting the most likely next token from its training data. At a temperature of 1, the model balances between choosing high probability tokens and introducing randomness into the output.

- **Max Tokens**: Controls the maximum length of the response. Setting a higher or lower limit can affect the detail and scope of the content generated.

- **Top P (Nucleus Sampling)**: This parameter is used in conjunction with the temperature to control the randomness of the response. Top P limits the AI to consider only the top P percent of probability mass when generating each token. Lower values lead to more focused and predictable text, while higher values allow for more diversity.

- **Frequency Penalty**: Decreases the likelihood of the model repeating the same line or phrase. Increasing this value helps in avoiding redundancy in the generated text.

- **Presence Penalty**: Encourages the model to introduce new concepts and terms in the completion. This is useful for generating more diverse and creative outputs.

- **Stop Sequences**: You can specify one or more sequences where the API will stop generating further tokens. This is useful for controlling the structure of the output, such as ending a completion at the end of a sentence or paragraph.

- **Logit Bias**: Allows you to modify the likelihood of specified tokens appearing in the completion. This can be used to guide the completion in a certain direction or to suppress undesired content.
