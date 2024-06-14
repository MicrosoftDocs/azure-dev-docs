---
title: Building advanced Retrieval-Augmented Generation systems
description: Conceptual article for developers discussing real-world considerations and patterns for  RAG-based chat systems.
ms.date: 5/1/2024
ms.topic: conceptual
ms.custom: build-2024-intelligent-apps
---

# Building advanced Retrieval-Augmented Generation systems

The previous article discussed two options for building a "chat over your data" application, one of the premiere use cases for generative AI in businesses:

- Retrieval augmented generation (RAG) which supplements a Large Language Model's (LLM) training with a database of searchable articles that can be retrieved based on similarity to the users' queries and passed to the LLM for completion.
- Fine-tuning, which expands the LLM's training to understand more about the problem domain.

The previous article also discussed when to use each approach, pro's and con's of each approach and several other considerations.

This article explores RAG in more depth, specifically, all of the work required to create a production-ready solution.

The previous article depicted the steps or phases of RAG using the following diagram.

:::image type="content" source="./media/naive-rag-inference-pipeline-highres.png" alt-text="Diagram depicting a simple RAG flow, with boxes representing steps or processes and arrows connecting each box. The flow begins with the user's query. Next, the query is sent to the Embedding API, which results in a vectorized query, which is used to find the nearest matches in the vector database, which retrieves article chunks, and the query and article chunks are sent to the Completion API, and the results are sent to the user." :::

This depiction has been referred to as "naive RAG" and is a useful way of first understanding the mechanisms, roles, and responsibilities required to implement a RAG-based chat system.

However, a more real-world implementation has many more pre- and post- processing steps to prepare the articles, the queries and the responses for use. The following diagram is a more realistic depiction of a RAG, sometimes referred to as "advanced RAG."

:::image type="content" source="./media/advanced-rag-inference-pipeline-highres.png" alt-text="Diagram displaying the advanced RAG flow of logic as a series of boxes with arrows between them. There are 10 boxes start with the user's query. Next, query processing steps, then a call to the Embedding API, then the resulting query as a vector, then the vector is used to query the vector database to find the nearest match, then retrieved as article chunks, then post-retrieval processing steps, then processed query and processed article chunks are sent to the Completion API, then post-completion processing steps, and finally a response delivered to the user." :::

This article provides a conceptual framework for understanding the types of pre- and post- processing concerns in a real-world RAG-based chat system, organized as follows:

- Ingestion phase
- Inference Pipeline phase
- Evaluation phase

As a conceptual overview, the keywords and ideas are provided as context and a starting point for further exploration and research.

## Ingestion

Ingestion is primarily concerned with storing your organization's documents in such a way that they can be easily retrieved to answer a user's question. The challenge is ensuring that the portions of the documents that best match the user's query are located and utilized during inference. Matching is accomplished primarily through vectorized embeddings and a cosine similarity search. However, it's facilitated by understanding the nature of the content (patterns, form, etc.) and the data organization strategy (the structure of the data when stored in the vector database).

To that end, developers need to consider the following:

- Content pre-processing and extraction
- Chunking strategy
- Chunking organization
- Update strategy

### Content pre-processing and extraction

Clean and accurate content is one of the best ways to improve the overall quality of a RAG-based chat system. To accomplish this, developers need to start by analyzing the shape and form of the documents to be indexed. Do the documents conform to specified content patterns like documentation? If not, what types of questions might the documents answer?

At a minimum, developers should create steps in the ingestion pipeline to:

- Standardize text formats
- Handle special characters
- Remove unrelated, outdated content
- Account for versioned content
- Account for content experience (tabs, images, tables)
- Extract metadata

Some of this information (like metadata for example) might be useful to be kept with the document in the vector database for use during the retrieval and evaluation process in the inference pipeline, or combined with the text chunk to persuade the chunk's vector embedding.

### Chunking strategy

Developers must decide how to break up a longer document into smaller chunks. This can improve the relevance of the supplemental content sent into the LLM to answer the user's query accurately. Furthermore, developers need to consider how to utilize the chunks upon retrieval. This is an area where system designers should do some research on techniques used in the industry, and do some experimentation, even testing it in a limited capacity in their organization. 

Developers must consider:

- **Chunk size optimization** - Determine what is the ideal size of the chunk, and how to designate a chunk. By section? By paragraph? By sentence?
- **Overlapping and sliding window chunks** - Determine how to divide the content into discrete chunks. Or will the chunks overlap? Or both (sliding window)?
- **Small2Big** - When chunking at a granular level like a single sentence, will the content be organized in such a way that it's easy to find the neighboring sentences or containing paragraph? (See "Chunking organization.") Retrieving this additional information and supplying it to the LLM could provide it more context when answering the user's query.

### Chunking organization

In a RAG system, the organization of data in the vector database is crucial for efficient retrieval of relevant information to augment the generation process. Here are the types of indexing and retrieval strategies developers might consider:

- **Hierarchical Indexes** - This approach involves creating multiple layers of indexes, where a top-level index (summary index) quickly narrows down the search space to a subset of potentially relevant chunks, and a second-level index (chunks index) provides more detailed pointers to the actual data. This method can significantly speed up the retrieval process as it reduces the number of entries to scan in the detailed index by filtering through the summary index first.
- **Specialized Indexes** - Specialized indexes like graph-based or relational databases can be used depending on the nature of the data and the relationships between chunks. For instance:
	- **Graph-based indexes** are useful when the chunks have interconnected information or relationships that can enhance retrieval, such as citation networks or knowledge graphs.
	- **Relational databases** can be effective if the chunks are structured in a tabular format where SQL queries could be used to filter and retrieve data based on specific attributes or relationships.
- **Hybrid Indexes** - A hybrid approach combines multiple indexing strategies to leverage the strengths of each. For example, developers might use a hierarchical index for initial filtering and a graph-based index to explore relationships between chunks dynamically during retrieval.

### Alignment optimization

To enhance the relevance and accuracy of the retrieved chunks, it can be beneficial to align them more closely with the types of questions or queries they're meant to answer. One strategy to accomplish this is to generate and insert a hypothetical question for each chunk that represents what question the chunk is best suited to answer. This helps in several ways:

- **Improved Matching**: During retrieval, the system can compare the incoming query with these hypothetical questions to find the best match, improving the relevance of the chunks fetched.
- **Training Data for Machine Learning Models**: These pairings of questions and chunks can serve as training data to improve the machine learning models underlying the RAG system, helping it learn which types of questions are best answered by which chunks.
- **Direct Query Handling**: If a real user query closely matches a hypothetical question, the system can quickly retrieve and use the corresponding chunk, speeding up the response time.

Each chunk's hypothetical question acts as a kind of "label" that guides the retrieval algorithm, making it more focused and contextually aware. This is useful in scenarios where the chunks cover a wide range of topics or types of information.

### Update strategies

If your organization needs to index documents that are frequently updated, it's essential to maintain an updated corpus to ensure the retriever component (the logic in the system responsible for performing the query against the vector database and returning the results) can access the most current information. Here are some  strategies for updating the vector database in such systems:

- **Incremental updates**:
    - **Regular intervals**: Schedule updates at regular intervals (for example, daily, weekly) depending on the frequency of document changes. This method ensures that the database is periodically refreshed.
    - **Trigger-based updates**: Implement a system where updates trigger re-indexing. For instance, any modification or addition of a document could automatically initiate a reindexing of the affected sections.
- **Partial updates**:    
    - **Selective re-indexing**: Instead of re-indexing the entire database, selectively update only the parts of the corpus that have changed. This can be more efficient than full re-indexing, especially for large datasets.
    - **Delta encoding**: Store only the differences between the existing documents and their updated versions. This approach reduces the data processing load by avoiding the need to process unchanged data.
- **Versioning**:    
    - **Snapshotting**: Maintain versions of the document corpus at different points in time. This allows the system to revert or refer to previous versions if necessary and provides a backup mechanism.
    - **Document version control**: Use a version control system to track changes in documents systematically. This helps in maintaining the history of changes and can simplify the update process.
- **Real-time updates**:   
    - **Stream processing**: Utilize stream processing technologies to update the vector database in real-time as changes are made to the documents. This can be critical for applications where information timeliness is paramount.
    - **Live querying**: Instead of relying solely on pre-indexed vectors, implement a mechanism to query live data for the most up-to-date responses, possibly combining this with cached results for efficiency.
- **Optimization techniques**:
    - **Batch processing**: Accumulate changes and process them in batches to optimize the use of resources and reduce the overhead caused by frequent updates.
    - **Hybrid approaches**: Combine various strategies, such as using incremental updates for minor changes and full re-indexing for major updates or structural changes in the document corpus.

Choosing the right update strategy or combination of strategies depends on specific requirements such as the size of the document corpus, the frequency of updates, the need for real-time data, and resource availability. Each approach has its trade-offs in terms of complexity, cost, and update latency, so it's essential to evaluate these factors based on the specific needs of the application.

## Inference pipeline

Now that the articles have been chunked, vectorized, and stored in a vector database, the focus turns to challenges in completion.

- Is the user's query written in such a way to get the results from the system that the user is looking for?
- Does the user's query violate any of our policies?
- How do we rewrite the user's query to improve its chances at finding nearest matches in the vector database?
- How do we evaluate the query results to ensure that the article chunks aligned to the query?
- How do we evaluate and modify the query results prior to passing them into the LLM to ensure that the most relevant details are included in the LLM's completion?
- How do we evaluate the LLM's response to ensure that the LLM's completion answers the user's original query?
- How do we ensure the LLM's response complies with our policies?

As you can see, there are many tasks that developers must take into account, mostly in the form of:
- Pre-processing inputs to optimize the likelihood of getting the desired results
- Post-processing outputs to ensure desired results

Keep in mind that the entire inference pipeline is running in real time. While there's no one right way to design the logic that performs the pre- and post-processing steps, it's likely that it is a combination of programming logic and additional calls to an LLM. One of the most important considerations then is the trade-off between building the most accurate and compliant pipeline possible and the cost and latency required to make it happen.

Let's look at each stage to identify specific strategies.

### Query pre-processing steps

Query pre-processing occurs immediately after your user submits their query, as depicted in this diagram:

:::image type="content" source="./media/advanced-rag-query-processing-steps-highres.png" alt-text="Diagram repeating the advanced RAG steps with emphasis on the box labeled query processing steps." :::

The goal of these steps is to make sure the user is asking questions within the scope of our system (and not trying to "jailbreak" the system to make it do something unintended) and prepare the user's query to increase the likelihood that it will locate the best possible article chunks using the cosine similarity / "nearest neighbor" search.

**Policy check** - This step could involve logic that identifies, removes, flags or rejects certain content. Some examples might include removing personally identifiable information, removing expletives, and identifying "jailbreak" attempts. **Jailbreaking** refers to the methods that users might employ to circumvent or manipulate the built-in safety, ethical, or operational guidelines of the model. 

**Query re-writing** - This could be anything from expanding acronyms and removing slang to re-phrasing the question to ask it more abstractly to extract high-level concepts and principles ("step-back prompting"). 

A variation on step-back prompting is **hypothetical document embeddings** (HyDE) which uses the LLM to answer the user's question, creates an embedding for that response (the hypothetical document embedding), and uses that embedding to perform a search against the vector database.


### Subqueries

This processing step concerns the original query. If the original query is long and complex, it can be useful to programmatically break it into several smaller queries, then combine all of the responses.

For example, consider a question related to scientific discoveries, particularly in the field of physics. The user's query might be: "Who made more significant contributions to modern physics, Albert Einstein or Niels Bohr?"

This query can be complex to handle directly because "significant contributions" can be subjective and multifaceted. Breaking it down into subqueries can make it more manageable:

1. **Subquery 1:** "What are the key contributions of Albert Einstein to modern physics?"
2. **Subquery 2:** "What are the key contributions of Niels Bohr to modern physics?"

The results of these subqueries would detail the major theories and discoveries by each physicist. For example:

- For Einstein, contributions might include the theory of relativity, the photoelectric effect, and E=mc^2.
- For Bohr, contributions might include his model of the hydrogen atom, his work on quantum mechanics, and his principle of complementarity.

Once these contributions are outlined, they can be assessed to determine:

3. **Subquery 3:** "How have Einstein's theories impacted the development of modern physics?"
4. **Subquery 4:** "How have Bohr's theories impacted the development of modern physics?"

These subqueries would explore the influence of each scientist's work on the field, such as how Einstein's theories led to advancements in cosmology and quantum theory, and how Bohr's work contributed to the understanding of atomic structure and quantum mechanics.

Combining the results of these subqueries can help the language model form a more comprehensive response regarding who made more significant contributions to modern physics, based on the extent and impact of their theoretical advancements. This method simplifies the original complex query by dealing with more specific, answerable components and then synthesizing those findings into a coherent answer.

### Query router

It's possible that your organization decides to divide its corpus of content into multiple vector stores or entire retrieval systems. In that case, developers can employ a **query router**, which is a mechanism that intelligently determines which indexes or retrieval engines to use based on the query provided. The primary function of a query router is to optimize the retrieval of information by selecting the most appropriate database or index that can provide the best answers to a specific query.

The query router typically functions at a point after the query has been formulated by the user but before it's sent to any retrieval systems. Here's a simplified workflow:

1. **Query Analysis**: The LLM or another component analyzes the incoming query to understand its content, context, and the type of information likely needed.
2. **Index Selection**: Based on the analysis, the query router selects one or more from potentially several available indexes. Each index might be optimized for different types of data or queries—for example, some might be more suited to factual queries, while others might excel in providing opinions or subjective content.
3. **Query Dispatch**: The query is then dispatched to the selected index.
4. **Results Aggregation**: Responses from the selected indexes are retrieved and possibly aggregated or further processed to form a comprehensive answer.
5. **Answer Generation**: The final step involves generating a coherent response based on the retrieved information, possibly integrating or synthesizing content from multiple sources.

Your organization might use multiple retrieval engines or indexes for the following use cases:

- **Data Type Specialization**: Some indexes might specialize in news articles, others in academic papers, and yet others in general web content or specific databases like those for medical or legal information.
- **Query Type Optimization**: Certain indexes might be optimized for quick factual lookups (for example, dates, events), while others might be better for complex reasoning tasks or queries requiring deep domain knowledge.
- **Algorithmic Differences**: Different retrieval algorithms might be used in different engines, such as vector-based similarity searches, traditional keyword-based searches, or more advanced semantic understanding models.

Imagine a RAG-based system used in a medical advisory context. The system has access to multiple indexes:

- A medical research paper index optimized for detailed and technical explanations.
- A clinical case study index that provides real-world examples of symptoms and treatments.
- A general health information index for basic queries and public health information.

If a user asks a technical question about the biochemical effects of a new drug, the query router might prioritize the medical research paper index due to its depth and technical focus. For a question about typical symptoms of a common illness, however, the general health index might be chosen for its broad and easily understandable content.

### Post-retrieval processing steps

Post-retrieval processing occurs after the retriever component retrieves relevant content chunks from the vector database as depicted in the diagram:

:::image type="content" source="./media/advanced-rag-post-retrieval-processing-steps-highres.png" alt-text="Diagram repeating the advanced RAG steps with emphasis on the box labeled post-retrieval processing steps." :::

With candidate content chunks retrieved, the next steps are to validate that the article chunks will be useful when _augmenting_ the LLM prompt and then begin to prepare the prompt to be presented to the LLM. 

Developers must consider several aspects of the prompt. A prompt that includes too much supplement information and some (possibly the most important information) could be ignored. Similarly, a prompt that includes irrelevant information could unduly impact the answer.

Another consideration is the **needle in a haystack** problem, a term that refers to a known quirk of some LLMs where the content at the beginning and end of a prompt have greater weight to the LLM than the content in the middle.

Finally, the LLM's maximum context window length and the number of tokens required to complete extraordinarily long prompts (especially when dealing with queries at scale) must be considered.

To deal with these issues, a post-retrieval processing pipeline might include the following steps:

- **Filtering results** - In this step, developers ensure that the article chunks returned by the vector database are relevant to the query. If not, the result is ignored when composing the prompt for the LLM.
- **Re-ranking** - Rank the article chunks retrieved from the vector store to ensure relevant details live near the edges (beginning and end) of the prompt.
- **Prompt compression** - Using a small, inexpensive model designed to combine and summarize multiple article chunks into a single, compressed prompt prior to sending it to the LLM.

### Post-completion processing steps

Post-completion processing occurs after the user's query and all content chunks have been sent to the LLM, as depicted in the following diagram:

:::image type="content" source="./media/advanced-rag-post-completion-processing-steps-highres.png" alt-text="Diagram repeating the advanced RAG steps with emphasis on the box labeled post-completion processing steps." :::

Once the prompt has been completed by the LLM, it's time to validate the completion to ensure that the answer is accurate. A post-completion processing pipeline might include the following steps:

- **Fact check** - This could take many forms, but the intent is to identify specific claims made in the article that are presented as facts and then to check those facts for accuracy. If the fact check step fails, it might be appropriate to re-query the LLM in hopes of a better answer or return an error message to the user.
- **Policy check** - This is the last line of defense to ensure that answers don't contain harmful content, whether to the user or the organization.

## Evaluation

Evaluating the results of a non-deterministic system isn't as simple as, say, unit or integration tests that most developers are familiar with. There are several factors to consider:

- Are users satisfied with the results they're getting?
- Are users getting accurate responses to their questions?
- How do we capture user feedback? Do we have any policies in place that limit what data we're able to collect about user data?
- For diagnosis on unsatisfactory responses, do we have visibility into all of the work that went into answering the question? Do we keep a log of each stage in the inference pipeline of inputs and outputs so we can perform root cause analysis?
- How can we make changes to the system without regression or degradation of the results?

### Capturing and acting on feedback from users

As mentioned earlier, developers may need to work with their organization's privacy team to design feedback capture mechanisms and telemetry, logging, etc. to enable forensics and root cause analysis on a given query session.

The next step is to develop an **assessment pipeline**. The need for an assessment pipeline arises from the complexity and time-intensive nature of analyzing verbatim feedback and the root causes of the responses provided by an AI system. This analysis is crucial as it involves investigating every response to understand how the AI query produced the results, checking the appropriateness of the content chunks used from documentation, and the strategies employed in dividing up these documents. 

Furthermore, it involves considering any extra pre- or post-processing steps that could enhance the results. This detailed examination often uncovers content gaps, particularly when no suitable documentation exists in response to a user's query.

Building an assessment pipeline, therefore, becomes essential to manage the scale of these tasks effectively. An efficient pipeline would utilize custom tooling to evaluate metrics that approximate the quality of answers provided by the AI. This system would streamline the process of determining why a specific answer was given to a user's question, which documents were used to generate that answer, and the effectiveness of the inference pipeline that processes the queries.

### Golden dataset

One strategy to evaluating the results of a non-deterministic system like a RAG-chat system is to implement a "golden dataset". A **golden dataset** is a curated set of questions with approved answers, metadata (like topic and type of question), references to source documents that can serve as ground truth for answers, and even variations (different phrasings to capture the diversity of how users might ask the same questions). 

The "golden dataset" represents the "best case scenario" and enables developers to evaluate the system to see how well it performs, and perform regression tests when implementing new features or updates.

### Assessing harm
  
Harms modeling is a methodology aimed at foreseeing potential harms, spotting deficiencies in a product that might pose risks to individuals, and developing proactive strategies to mitigate such risks. 

To tool designed for assessing the impact of technology, particularly AI systems, would feature several key components based on the principles of harms modeling as outlined in the provided resources.

Key features of a harms evaluation tool might include:

1. **Stakeholder Identification**: The tool would help users identify and categorize various stakeholders affected by the technology, including direct users, indirectly affected parties, and other entities like future generations or non-human factors such as environmental concerns​ (.
    
2. **Harm Categories and Descriptions**: It would include a comprehensive list of potential harms, such as privacy loss, emotional distress, or economic exploitation. The tool could guide the user through various scenarios illustrating how the technology might cause these harms, helping to evaluate both intended and unintended consequences​.
    
3. **Severity and Probability Assessments**: The tool would enable users to assess the severity and probability of each identified harm, allowing them to prioritize which issues to address first. This might include qualitative assessments and could be supported by data where available.
    
4. **Mitigation Strategies**: Upon identifying and evaluating harms, the tool would suggest potential mitigation strategies. This could include changes to the system design, more safeguards, or alternative technological solutions that minimize identified risks.
    
5. **Feedback Mechanisms**: The tool should incorporate mechanisms for gathering feedback from stakeholders, ensuring that the harms evaluation process is dynamic and responsive to new information and perspectives​​.
    
6. **Documentation and Reporting**: To aid in transparency and accountability, the tool would facilitate the creation of detailed reports that document the harms assessment process, findings, and actions taken to mitigate potential risks​.
    

These features would not only help identify and mitigate risks, but also help in designing more ethical and responsible AI systems by considering a broad spectrum of impacts from the outset.

For more information, see:

- [Foundations of assessing harm](/azure/architecture/guide/responsible-innovation/harms-modeling/)
- [Types of harm](/azure/architecture/guide/responsible-innovation/harms-modeling/type-of-harm)

### Testing and verifying the safeguards

This article outlined several processes aimed at mitigating the possibility that the RAG-based chat system could be exploited or compromised. **Red-teaming** plays a crucial role in ensuring the mitigations are effective. Red-teaming involves simulating an adversary's actions aimed at the application to uncover potential weaknesses or vulnerabilities. This approach is especially vital in addressing the significant risk of jailbreaking. 

To effectively test and verify the safeguards of a RAG-based chat system, developers need to rigorously assess these systems under various scenarios where these guidelines could be tested. This not only ensures robustness but also helps in fine-tuning the system’s responses to adhere strictly to defined ethical standards and operational procedures.

## Final considerations that might influence your application design decisions

Here's a short list of things to consider and other takeaways from this article that affect your application design decisions:

- Acknowledge the non-deterministic nature of generative AI in your design, planning for variability in outputs and setting up mechanisms to ensure consistency and relevance in responses.
- Assess the benefits of preprocessing user prompts against the potential increase in latency and costs. Simplifying or modifying prompts before submission might improve response quality but could add complexity and time to the response cycle.
- Investigate strategies for parallelizing LLM requests to enhance performance. This approach might reduce latency but requires careful management to avoid increased complexity and potential cost implications.

If you want to start experimenting with building a generative AI solution immediately, we recommend taking a look at [Get started with the chat with your data sample for Python](/azure/developer/python/get-started-app-chat-template?tabs=github-codespaces). There are versions of the tutorial also available in [.NET](/dotnet/ai/get-started-app-chat-template?tabs=github-codespaces), [Java](/azure/developer/java/ai/get-started-app-chat-template?tabs=github-codespaces), and [JavaScript](/azure/developer/javascript/get-started-app-chat-template?tabs=github-codespaces).