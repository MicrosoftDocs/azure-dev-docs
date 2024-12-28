---
title: Build advanced retrieval-augmented generation systems
description: A conceptual article for developers to learn about real-world considerations and patterns for retrieval-augmented generation (RAG)-based chat systems.
ms.date: 11/19/2024
ms.topic: conceptual
ms.custom: build-2024-intelligent-apps
---

# Build advanced retrieval-augmented generation systems

The [previous article](./augment-llm-rag-fine-tuning.md) discusses two options for building a "chat over your data" application, one of the top use cases for generative AI in businesses:

- Retrieval-augmented generation (RAG), which supplements large language model (LLM) training with a database of searchable articles that can be retrieved based on similarity to the users' queries. The articles are passed to the LLM for completion.
- Fine-tuning, which expands the LLM's training to understand more about the problem domain.

The previous article also discusses when to use each approach, the pros and cons of each approach, and several other considerations.

This article explores RAG in more depth. Specifically, in this article, we describe the work that's required to create a production-ready solution.

The previous article depicted the steps or phases of RAG by using the following diagram.

:::image type="content" source="./media/naive-rag-inference-pipeline-highres.png" alt-text="Diagram that depicts a simple RAG flow, with boxes representing steps or processes and arrows connecting each box." :::

This depiction is called _naive RAG_. It's a useful way to initially understand the mechanisms, roles, and responsibilities that are required to implement an RAG-based chat system.

However, a real-world implementation has many more preprocessing and post-processing steps to prepare the articles, the queries, and the responses for use. The following diagram is a more realistic depiction of an RAG, sometimes called _advanced RAG_.

:::image type="content" source="./media/advanced-rag-inference-pipeline-highres.png" alt-text="Diagram that displays the advanced RAG flow of logic as a series of boxes with arrows between them." :::

This article provides a conceptual framework for understanding the types of preprocessing and post-processing concerns in a real-world RAG-based chat system, organized as follows:

- Ingestion phase
- Inference pipeline phase
- Evaluation phase

As a conceptual overview, the keywords and ideas are provided as context and as a starting point for more exploration and research.

## Ingestion

Ingestion is primarily about storing your organization's documents in a way that they can be easily retrieved to answer a user's question. The challenge is ensuring that the portions of the documents that best match the user's query are located and used during inference. Matching is accomplished primarily through vectorized embeddings and a cosine similarity search. However, matching is facilitated by understanding the nature of the content (for example, patterns and form) and the data organization strategy (the structure of the data when it's stored in the vector database).

For ingestion, developers need to consider the following steps:

- Content preprocessing and extraction
- Chunking strategy
- Chunking organization
- Update strategy

### Content preprocessing and extraction

Clean and accurate content is one of the best ways to improve the overall quality of an RAG-based chat system. To get clean, accurate content, start by analyzing the shape and form of the documents to be indexed. Do the documents conform to specified content patterns like documentation? If not, what types of questions might the documents answer?

At a minimum, create steps in the ingestion pipeline to:

- Standardize text formats
- Handle special characters
- Remove unrelated, outdated content
- Account for versioned content
- Account for content experience (tabs, images, tables)
- Extract metadata

Some of this information (like metadata, for example) might be useful if it's kept with the document in the vector database to use during the retrieval and evaluation process in the inference pipeline. It also can be combined with the text chunk to persuade the chunk's vector embedding.

### Chunking strategy

As a developer, you must decide how to break up a longer document into smaller chunks. Chunking can improve the relevance of the supplemental content that's sent to the LLM to answer the user's query accurately. You also need to consider how to use the chunks after they are retrieved. System designers should do some research on techniques used in the industry, and do some experimentation, even testing it in a limited capacity in the organization.

Developers must consider:

- **Chunk size optimization**: Determine what is the ideal size of the chunk, and how to designate a chunk. By section? By paragraph? By sentence?
- **Overlapping and sliding window chunks**: Determine how to divide the content into discrete chunks. Or will the chunks overlap? Or both (a sliding window)?
- **Small2Big**: When chunking is done at a granular level like a single sentence, is the content organized so that it's easy to find the neighboring sentences or containing paragraph? Retrieving this additional information and supplying it to the LLM might provide it with more context when answering the user's query. For more information, see the next section.

### Chunking organization

In an RAG system, the organization of data in the vector database is crucial for efficient retrieval of relevant information to augment the generation process. Here are the types of indexing and retrieval strategies developers might consider:

- **Hierarchical indexes**: This approach involves creating multiple layers of indexes. A top-level index (a summary index) quickly narrows down the search space to a subset of potentially relevant chunks, and a second-level index (a chunks index) provides more detailed pointers to the actual data. This method can significantly speed up the retrieval process because it reduces the number of entries to scan in the detailed index by filtering through the summary index first.
- **Specialized indexes**: Specialized indexes like graph-based or relational databases can be used depending on the nature of the data and the relationships between chunks. For instance:
  - **Graph-based indexes** are useful when the chunks have interconnected information or relationships that can enhance retrieval, such as citation networks or knowledge graphs.
  - **Relational databases** can be effective if the chunks are structured in a tabular format where SQL queries can be used to filter and retrieve data based on specific attributes or relationships.
- **Hybrid indexes**: A hybrid approach combines multiple indexing strategies to apply the strengths of each. For example, developers might use a hierarchical index for initial filtering and a graph-based index to explore relationships between chunks dynamically during retrieval.

### Alignment optimization

To enhance the relevance and accuracy of the retrieved chunks, align them closely with the question or query types they're meant to answer. One strategy is to generate and insert a hypothetical question for each chunk that represents what question the chunk is best suited to answer. This helps in several ways:

- **Improved matching**: During retrieval, the system can compare the incoming query with these hypothetical questions to find the best match to improve the relevance of the chunks that are fetched.
- **Training data for machine learning models**: These pairings of questions and chunks can serve as training data to improve the machine learning models that are the basis of the RAG system. The RAG system learns which types of questions are best answered by which chunks.
- **Direct query handling**: If a real user query closely matches a hypothetical question, the system can quickly retrieve and use the corresponding chunk and speed up the response time.

Each chunk's hypothetical question acts like a label that guides the retrieval algorithm, so it's more focused and contextually aware. This kind of optimization is useful in scenarios in which the chunks cover a wide range of information topics or types.

### Update strategies

If your organization needs to index documents that are frequently updated, it's essential to maintain an updated corpus to ensure that the retriever component (the logic in the system that's responsible for performing the query against the vector database and returning the results) can access the most current information. Here are some strategies for updating the vector database in these types of systems:

- **Incremental updates**:
  - **Regular intervals**: Schedule updates at regular intervals (for example, daily, weekly) depending on the frequency of document changes. This method ensures that the database is periodically refreshed.
  - **Trigger-based updates**: Implement a system in which an update triggers reindexing. For instance, any modification or addition of a document automatically initiates reindexing in the affected sections.
- **Partial updates**:
  - **Selective re-indexing**: Instead of reindexing an entire database, update only the changed corpus parts. This approach can be more efficient than full reindexing, especially for large datasets.
  - **Delta encoding**: Store only the differences between the existing documents and their updated versions. This approach reduces the data processing load by avoiding the need to process unchanged data.
- **Versioning**:
  - **Snapshotting**: Maintain document corpus versions at different points in time. This technique provides a backup mechanism and allows the system to revert to or refer to previous versions.
  - **Document version control**: Use a version control system to systematically track document changes for maintaining the change history and simplifying the update process.
- **Real-time updates**:
  - **Stream processing**: When information timeliness is critical, use stream processing technologies for real-time vector database updates as document changes are made.
  - **Live querying**: Instead of relying solely on preindexed vectors, implement a live data query mechanism for up-to-date responses, possibly combining with cached results for efficiency.
- **Optimization techniques**:
  - **Batch processing**: Batch process accumulated changes for resource optimization and overhead reduction instead of frequent updates.
  - **Hybrid approaches**: Combine various strategies, such as:

    - Using incremental updates for minor changes.
    - Full reindexing for major updates.
    - Document corpus structural changes.

Choosing the right update strategy or a combination depends on specific requirements, such as:

- Document corpus size
- Update frequency
- Real-time data needs
- Resource availability

- Evaluate these factors based on the specific application needs as each approach has complexity, cost, and update latency trade-offs.

## Inference pipeline

Now that the articles are chunked, vectorized, and stored in a vector database, the focus turns to completion challenges.

There are many tasks that developers must take into account, mostly in the form of preprocessing inputs to optimize the likelihood of getting the desired results and post-processing outputs to ensure desired results:

- Is the user's query written in a way to get the results the user is looking for?
- Does the user's query violate any of our policies?
- How do we rewrite the user's query to improve its chances at finding nearest matches in the vector database?
- How do we evaluate the query results to ensure that the article chunks align to the query?
- How do we evaluate and modify the query results before passing them into the LLM to ensure that the most relevant details are included in the LLM's completion?
- How do we evaluate the LLM's response to ensure that the LLM's completion answers the user's original query?
- How do we ensure that the LLM's response complies with our policies?

The entire inference pipeline is running in real time. Although there's no one right way for the preprocessing and post-processing step design, it's likely a combination of programming logic and other LLM calls. One of the most important considerations then is the trade-off between building the most accurate and compliant pipeline possible and the cost and latency required to make it happen.

Let's identify specific strategies in each stage.

### Query preprocessing steps

Query preprocessing occurs immediately after your user submits their query:

:::image type="content" source="./media/advanced-rag-query-processing-steps-highres.png" alt-text="Diagram that repeats the advanced RAG steps, with emphasis on the box labeled query processing steps." :::

The goal of these steps is to make sure that the user is asking questions that are within the scope of our system (and not trying to "jailbreak" the system to make it do something unintended) and to prepare the user's query to increase the likelihood that it locates the best possible article chunks using the cosine similarity or "nearest neighbor" search.

**Policy check**: This step involves logic that identifies, removes, flags, or rejects certain content. Some examples include removing personal data, removing expletives, and identifying "jailbreak" attempts. _Jailbreaking_ refers to methods users might use to circumvent or manipulate the built-in safety, ethical, or operational guidelines of the model.

**Query rewriting**: This step might be anything from expanding acronyms and removing slang to rephrasing the question to ask it more abstractly to extract high-level concepts and principles ("step-back prompting").

A variation on step-back prompting is _hypothetical document embeddings (HyDE)_, which uses the LLM to answer the user's question, creates an embedding for that response (the hypothetical document embedding), and uses that embedding to perform a search against the vector database.

### Subqueries

This processing step concerns the original query. If the original query is long and complex, it can be useful to programmatically break it into several smaller queries, and then combine all the responses.

For example, a question about scientific discoveries in physics might be: "Who made more significant contributions to modern physics, Albert Einstein or Niels Bohr?"

Breaking down complex queries into subqueries make them more manageable:

- **Subquery 1**: "What are the key contributions of Albert Einstein to modern physics?"
- **Subquery 2**: "What are the key contributions of Niels Bohr to modern physics?"

The results of these subqueries would detail the major theories and discoveries by each physicist. For example:

- For Einstein, contributions might include the theory of relativity, the photoelectric effect, and E=mc^2.
- For Bohr, contributions might include Bohr's model of the hydrogen atom, Bohr's work on quantum mechanics, and Bohr's principle of complementarity.

When these contributions are outlined, they can be assessed to determine:

- **Subquery 3**: "How have Einstein's theories impacted the development of modern physics?"
- **Subquery 4**: "How have Bohr's theories impacted the development of modern physics?"

These subqueries explore each scientist's influence on physics, such as:

- How Einstein's theories led to advancements in cosmology and quantum theory
- How Bohr's work contributed to understanding atomic structure and quantum mechanics

Combining the results of these subqueries can help the language model form a more comprehensive response regarding who made more significant contributions to modern physics based on their theoretical advancements. This method simplifies the original complex query by dealing with more specific, answerable components and then synthesizing those findings into a coherent answer.

### Query router

It's possible that your organization decides to divide its corpus of content into multiple vector stores or into entire retrieval systems. In that case, developers can employ a _query router_, a mechanism that intelligently determines which indexes or retrieval engines to use based on the query provided. The primary function of a query router is to optimize the retrieval of information by selecting the most appropriate database or index to provide the best answers to a specific query.

The query router typically functions at a point after the user formulates the query,  but before sending to retrieval systems. Here's a simplified workflow:

1. **Query analysis**: The LLM or another component analyzes the incoming query to understand its content, context, and the type of information that likely is needed.
1. **Index selection**: Based on the analysis, the query router selects one or more from potentially several available indexes. Each index might be optimized for different types of data or queries. For example, some indexes might be more suited to factual queries. Other indexes might excel in providing opinions or subjective content.
1. **Query dispatch**: The query is dispatched to the selected index.
1. **Results aggregation**: Responses from the selected indexes are retrieved and possibly aggregated or further processed to form a comprehensive answer.
1. **Answer generation**: The final step involves generating a coherent response based on the retrieved information, possibly integrating or synthesizing content from multiple sources.

Your organization might use multiple retrieval engines or indexes for the following use cases:

- **Data type specialization**: Some indexes might specialize in news articles, others in academic papers, and yet others in general web content or specific databases like for medical or legal information.
- **Query type optimization**: Certain indexes might be optimized for quick factual lookups (for example, dates, events), while others might be better for complex reasoning tasks or queries requiring deep domain knowledge.
- **Algorithmic differences**: Different retrieval algorithms might be used in different engines, such as vector-based similarity searches, traditional keyword-based searches, or more advanced semantic understanding models.

Imagine an RAG-based system that's used in a medical advisory context. The system has access to multiple indexes:

- A medical research paper index optimized for detailed and technical explanations
- A clinical case study index that provides real-world examples of symptoms and treatments
- A general health information index for basic queries and public health information

If a user asks a technical question about the biochemical effects of a new drug, the query router might prioritize the medical research paper index due to its depth and technical focus. For a question about typical symptoms of a common illness, however, the general health index might be chosen for its broad and easily understandable content.

### Post-retrieval processing steps

Post-retrieval processing occurs after the retriever component retrieves relevant content chunks from the vector database:

:::image type="content" source="./media/advanced-rag-post-retrieval-processing-steps-highres.png" alt-text="Diagram that repeats the advanced RAG steps, with emphasis on the box labeled post-retrieval processing steps." :::

With candidate content chunks retrieved, the next step is to validate the article chunk usefulness when _augmenting_ the LLM prompt before preparing the prompt to be presented to the LLM.

Developers must consider several prompt aspects:

- Including too much supplement information might result in ignoring the most important information.  
- Including irrelevant information might negatively influence the answer.

Another consideration is the _needle in a haystack_ problem, a term that refers to a known quirk of some LLMs in which the content at the beginning and end of a prompt have greater weight to the LLM than the content in the middle.

Finally, the LLM's maximum context window length and the number of tokens required to complete extraordinarily long prompts (especially when dealing with queries at scale) must be considered.

To deal with these issues, a post-retrieval processing pipeline might include the following steps:

- **Filtering results**: In this step, developers ensure that the article chunks that are returned by the vector database are relevant to the query. If they aren't, the result is ignored when the LLM prompt is composed.
- **Re-ranking**: Rank the article chunks that are retrieved from the vector store to ensure that relevant details are near the edges (the beginning and the end) of the prompt.
- **Prompt compression**: Use a small, inexpensive model to compress and summarize multiple article chunks into a single compressed prompt before sending the prompt to the LLM.

### Post-completion processing steps

Post-completion processing occurs after the user's query and all content chunks are sent to the LLM:

:::image type="content" source="./media/advanced-rag-post-completion-processing-steps-highres.png" alt-text="Diagram that repeats the advanced RAG steps, with emphasis on the box labeled post-completion processing steps." :::

Accuracy validation occurs after the LLM's prompt completion. A post-completion processing pipeline might include the following steps:

- **Fact check**: The intent is to identify specific claims made in the article that are presented as facts, and then to check those facts for accuracy. If the fact check step fails, it might be appropriate to requery the LLM in hopes of a better answer or to return an error message to the user.
- **Policy check**: The last line of defense to ensure that answers don't contain harmful content, whether for the user or for the organization.

## Evaluation

Evaluating the results of a nondeterministic system isn't as simple as running the unit tests or integration tests most developers are familiar with. You need to consider several factors:

- Are users satisfied with the results they're getting?
- Are users getting accurate responses to their questions?
- How do we capture user feedback? Do we have any policies in place that limit what data we're able to collect about user data?
- For diagnosis of unsatisfactory responses, do we have visibility into all the work that went into answering the question? Do we keep a log of each stage in the inference pipeline of inputs and outputs so that we can perform root cause analysis?
- How can we make changes to the system without regression or degradation of results?

### Capturing and acting on feedback from users

As mentioned earlier, developers might need to work with their organization's privacy team to design feedback capture mechanisms, telemetry, and logging to enable forensics and root cause analysis of a query session.

The next step is to develop an _assessment pipeline_. The need for an assessment pipeline arises from the complexity and time-intensive nature of analyzing verbatim feedback and the root causes of the responses provided by an AI system. This analysis is crucial because it involves investigating every response to understand how the AI query produced the results, checking the appropriateness of the content chunks that are used from documentation, and the strategies employed in dividing up these documents.

It also involves considering any extra preprocessing or post-processing steps that might enhance the results. This detailed examination often uncovers content gaps, particularly when no suitable documentation exists for response to a user's query.

Building an assessment pipeline becomes essential to manage the scale of these tasks effectively. An efficient pipeline uses custom tooling to evaluate metrics that approximate the quality of answers provided by AI. This system streamlines the process of determining why a specific answer was given to a user's question, which documents were used to generate that answer, and the effectiveness of the inference pipeline that processes the queries.

### Golden dataset

One strategy to evaluate the results of a nondeterministic system like an RAG chat system is to implement a golden dataset. A _golden dataset_ is a curated set of questions and approved answers, metadata (like topic and type of question), references to source documents that can serve as ground truth for answers, and even variations (different phrasings to capture the diversity of how users might ask the same questions).

The golden dataset represents the "best case scenario." Developers can evaluate the system to see how well it performs, and then perform regression tests when they implement new features or updates.

### Assessing harm
  
Harms modeling is a methodology aimed at foreseeing potential harms, spotting deficiencies in a product that might pose risks to individuals, and developing proactive strategies to mitigate such risks.

A tool designed for assessing the impact of technology, particularly AI systems, would feature several key components based on the principles of harms modeling as outlined in the provided resources.

Key features of a harms evaluation tool might include:

- **Stakeholder identification**: The tool might help users identify and categorize various stakeholders that are affected by the technology, including direct users, indirectly affected parties, and other entities, like future generations or nonhuman factors, such as environmental concerns.

- **Harm categories and descriptions**: The tool might include a comprehensive list of potential harms, such as privacy loss, emotional distress, or economic exploitation. The tool might guide the user through various scenarios, illustrate how the technology might cause these harms, and help evaluate both intended and unintended consequences​.

- **Severity and probability assessments**: The tool might help users assess the severity and probability of each identified harm. The user can prioritize issues to address first. Examples include qualitative assessments supported by data where available.

- **Mitigation strategies**: The tool can suggest potential mitigation strategies after it identifies and evaluates harms. Examples include changes to the system design, more safeguards, and alternative technological solutions that minimize identified risks.

- **Feedback mechanisms**: The tool should incorporate mechanisms for gathering feedback from stakeholders so that the harms evaluation process is dynamic and responsive to new information and perspectives​​.

- **Documentation and reporting**: For transparency and accountability, the tool might facilitate detailed reports that document the harms assessment process, findings, and potential risk mitigation actions taken​.

These features can help you identify and mitigate risks, but they also help you design more ethical and responsible AI systems by considering a broad spectrum of impacts from the start.

For more information, see these articles:

- [Foundations of assessing harm](/azure/architecture/guide/responsible-innovation/harms-modeling/)
- [Types of harm](/azure/architecture/guide/responsible-innovation/harms-modeling/type-of-harm)

### Testing and verifying the safeguards

This article outlines several processes that are aimed at mitigating the possibility of an RAG-based chat system being exploited or compromised. _Red-teaming_ plays a crucial role in ensuring that the mitigations are effective. Red-teaming involves simulating the actions of a potential adversary to uncover potential weaknesses or vulnerabilities in the application. This approach is especially vital in addressing the significant risk of jailbreaking.

Developers need to rigorously assess RAG-based chat system safeguards under various guideline scenarios to effectively test and verify them. This approach not only ensures robustness, but also helps you fine-tune the system’s responses to strictly adhere to defined ethical standards and operational procedures.

## Final considerations for application design

Here's a short list of things to consider and other takeaways from this article that might affect your application design decisions:

- Acknowledge the nondeterministic nature of generative AI in your design, planning for variability in outputs and setting up mechanisms to ensure consistency and relevance in responses.
- Assess the benefits of preprocessing user prompts against the potential increase in latency and costs. Simplifying or modifying prompts before submission might improve response quality but could add complexity and time to the response cycle.
- Investigate strategies for parallelizing LLM requests to enhance performance. This approach might reduce latency but requires careful management to avoid increased complexity and potential cost implications.

If you want to start experimenting with building a generative AI solution immediately, we recommend that you take a look at [Get started with chat by using your own data sample for Python](/azure/developer/python/get-started-app-chat-template?tabs=github-codespaces). The tutorial is also available for [.NET](/dotnet/ai/get-started-app-chat-template?tabs=github-codespaces), [Java](/azure/developer/java/ai/get-started-app-chat-template?tabs=github-codespaces), and [JavaScript](/azure/developer/javascript/get-started-app-chat-template?tabs=github-codespaces).
