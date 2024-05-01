---
title: Building a Retrieval-Augmented Generation (RAG) chat system
description: Conceptual article detailing the creation of a Retrieval-Augmented Generation (RAG)-based chat system, emphasizing integration, optimization, and ethical considerations for delivering contextually relevant responses.
ms.date: 4/12/2024
ms.topic: conceptual
---

# Implementing a Retrieval-Augmented Generation System

The other articles in this series discuss the knowledge retrieval models that LLMs use to generate their responses. By default, an LLM only has access to its training data. However, this can be augmented to include real-time data or private data. This article discusses one of two mechanisms for accomplishing this.

Retrieval-Augmented Generation (RAG) is a form of pre-processing that combines semantic search with contextual priming (discussed in [another article](./gen-ai-concepts-considerations-developers.md)). 

It is often used to enable the "chat over my data" scenario, where companies that have a large corpus of textual content (internal documents, documentation, etc.) and want to use this corpus as the basis for answers to user prompts. 

>[!NOTE]
> The term Retrieval-Augmented Generation (RAG) accommodatively in this article. The process of implementing a RAG-based chat system outlined in this article can be applied whether there's a desire to use external data to be used in a supportive capacity (RAG) or to be used as the centerpiece of the response (RCG). This nuanced distinction is not addressed in most reading related to RAG.

At a high level, you create a database entry for each document (or portion of a document called a "chunk") indexed on its embedding, a vector (array) of numbers that represent facets of the document. When a user submits a query, you search the database for similar documents, then submit the query and the documents to the LLM to compose an answer.

The following sections describe this in more detail.

### Creating an index of vectorized documents

The first step to creating a RAG-based chat system is to create a vector data store containing the vector embedding of the document (or a portion of the document). Consider the following diagram which outlines the basic steps to creating a vectoried index of documents.

:::image type="content" source="./media/vector-embedding-pipeline-highres.png" alt-text="Diagram depicting the different stages of ingestion of documents, starting with chunking, then post-chunking process steps, then calls to the embedding API, then saving the document chunks as vectorized embeddings into the vector database." :::

The entire process is driven by the notion of an **embedding**, which is a numerical representation of data — typically words, phrases, sentences, or even entire documents — that captures the semantic properties of the input in a way that can be processed by machine learning models. 

To create an embedding, you send the chunk of content (sentences, paragraphs, or entire documents) to the Azure OpenAI Embedding API. What is returned from the Embedding API is a vector. Each value in the vector represents some characteristic (dimension) of the content, including topic matter, semantic meaning, syntax and grammar, word and phrase usage, contextual relationships, style, and tone, etc. Together, all the values of the vector represent the content's "dimensional space". In other words, if you can think of a 3D representation of a vector with three values, a given vector lives in a certain area of the x, y, z plane. Now, what if you had not three but 1000 or more values. While it's not possible for humans to draw a 1000-dimension graph on a sheet of paper to make it more understandable, computers have no problem understanding that degree of dimensional space.

The next step of the diagram shows you storing the vector along with the content itself (or a pointer to the content's location) and other metadata in a vector database. A vector database is like any type of database, with two differences:

- Vector databases use a vector as an index to search for data.
- Vector databases implement an algorithm called cosine similar search, also known as "nearest neighbor", which uses vectors that most closely match the search criteria.

------------------------------

- **Data Pipeline**: The data pipeline is responsible for the ingestion, processing, and management of data used by the system. This includes preprocessing data to be stored in the vector database and ensuring that the data fed into the LLM is in the correct format.
-------------------------------

With your corpus of documents stored in a vector database, you can supply the LLM with what it needs to answer questions from your users.




### Answering queries with your documents

A RAG system first uses semantic search to find articles that could be helpful to the LLM when composing an answer. The next step is to send the matching articles along with the user's original prompt to the LLM to compose an answer.

Consider the following diagram as a simple RAG implementation (sometimes referred to as "naive RAG").

:::image type="content" source="./media/naive-rag-inference-pipeline-highres.png" alt-text="Diagram depicting a simple RAG flow, with boxes representing steps or processes and arrows connecting each box. The flow begins with the user's query, which is sent to the Embedding API, which results in a vectorized query, which is used to find the nearest matches in the vector database, which retrieves article chunks, and the query and article chunks are sent to the Completion API, and the results are sent to the user." :::

In the diagram, a user submits a query. The first step is to create an embedding for the user's prompt to get back a vector. The next step is to search the vector database for those documents (or portions of documents) that are a "nearest neighbor" match. 


Cosine Similarity is a measure used to determine how similar two vectors are, essentially assessing the cosine of the angle between them. A cosine similarity close to 1 indicates a high degree of similarity (small angle), while a similarity near -1 indicates dissimilarity (angle approaching 180 degrees). This metric is crucial for tasks like document similarity, where the goal is to find documents with similar content or meaning.

"Nearest Neighbor" / KNN Algorithms work by finding the closest vectors (neighbors) to a given point in vector space. In the k-nearest neighbors algorithm, 'k' refers to the number of nearest neighbors to consider. This approach is widely used in classification and regression, where the algorithm predicts the label of a new data point based on the majority label of its 'k' nearest neighbors in the training set. KNN and cosine similarity are often used together in systems like recommendation engines, where the goal is to find items most similar to a user's preferences, represented as vectors in the embedding space.

You take the best results from that search and send the matching content along with the user's prompt to generate a response that (hopefully) is informed by matching content.

## Fine-tuning a model

LLMs are trained (pre-trained) on a broad dataset, grasping language structure, context, and a wide array of knowledge. This stage involves learning general language patterns. Fine-tuning is adding additional training to the pre-trained model based on a smaller, specific dataset. This dataset is usually targeted towards the specific tasks or domains the model is expected to perform in. During fine-tuning, the model's weights are adjusted to better predict or understand the nuances of this smaller dataset.

- Specialization: Fine-tuning tailors the model to specific tasks, such as legal document analysis, medical text interpretation, or customer service interactions. This makes the model more effective in those areas.
- Efficiency: It's more efficient to fine-tune a pre-trained model for a specific task than to train a model from scratch, as fine-tuning requires less data and computational resources.
- Adaptability: Fine-tuning allows for adaptation to new tasks or domains that were not part of the original training data, making LLMs versatile tools for various applications.
- Improved Performance: For tasks that are significantly different from the data the model was originally trained on, fine-tuning can lead to better performance, as it adjusts the model to understand the specific language, style, or terminology used in the new domain.
- Personalization: In some applications, fine-tuning can help personalize the model's responses or predictions to fit the specific needs or preferences of a user or organization.
However, fine-tuning also presents certain downsides and limitations. Understanding these can help in deciding when to opt for fine-tuning versus alternatives like retrieval-augmented generation (RAG).
- Data Requirement: Fine-tuning requires a sufficiently large and high-quality dataset specific to the target task or domain. Gathering and curating this dataset can be challenging and resource intensive.
- Overfitting Risk: There's a risk of overfitting, especially with a very specific or small dataset. Overfitting makes the model perform well on the training data but poorly on new, unseen data, reducing its generalizability.
- Cost and Resources: While less resource-intensive than training from scratch, fine-tuning still requires computational resources, especially for large models and datasets, which might be prohibitive for some users or projects.
- Maintenance and Updating: Fine-tuned models might need regular updates to remain effective as the domain-specific information changes over time. This ongoing maintenance requires additional resources and data.
- Model Drift: As the model is fine-tuned for specific tasks, it may lose some of its general language understanding and versatility, leading to a phenomenon known as model drift.

OpenAI's documentation thoroughly explains how to fine-tune a model. At a high level, you provide a JSON data set of potential questions and preferred answers. The documentation suggests that there are noticeable improvements by providing 50 to 100 question / answer pairs, but the right number varies greatly on the use case.

Parenthetically, this is another area where the non-deterministic nature of working with LLMs requires a lot of experimentation as well as trial and error.

### Fine-tuning versus retrieval-augmented generation

On the surface, it may seem like there is quite a bit of overlap between fine-tuning and retrieval-augmented generation. Choosing between fine-tuning and retrieval-augmented generation depends on the specific requirements of your task, including performance expectations, resource availability, and the need for domain specificity versus generalizability.

### When to Prefer Fine-tuning to Retrieval-Augmented Generation

- Task-Specific Performance: Fine-tuning is preferable when high performance on a specific task is critical, and there exists sufficient domain-specific data to train the model effectively without significant overfitting risks.
- Control Over Data: If you have proprietary or highly specialized data that significantly differs from the data the base model was trained on, fine-tuning allows you to incorporate this unique knowledge into the model.
- Limited Need for Real-time Updates: If the task doesn't require the model to be constantly updated with the latest information, fine-tuning can be more efficient since RAG models typically need access to up-to-date external databases or the internet to pull in recent data.

### When to Prefer Retrieval-Augmented Generation

- Dynamic or Evolving Content: RAG is more suitable for tasks where having the most current information is critical. Since RAG models can pull in data from external sources in real-time, they are better suited for applications like news generation or answering questions on recent events.
- Generalization Over Specialization: If the goal is to maintain strong performance across a wide range of topics rather than excelling in a narrow domain, RAG might be preferable. It leverages external knowledge bases, allowing it to generate responses across diverse domains without the risk of overfitting to a specific dataset.
- Resource Constraints: For those with limited resources for data collection and model training, leveraging a RAG approach might offer a cost-effective alternative to fine-tuning, especially if the base model already performs reasonably well on the desired tasks.

### Adding Safeguards

In addition to keeping the LLM's responses bound to specific subject matter or domains, you will also likely be concerned about the kinds of questions your users are asking of the LLM, and the kinds of answers it is generating.

First, API calls to Microsoft OpenAI Services automatically filters content it finds potentially offensive and reports this back to you across a number of filtering categories. See Content filtering for more details.

You can use OpenAI's Moderation API directly to explicitly check any content for potentially harmful content.

Secondly, you can use Azure AI Content Safety to help with text moderation, image moderation, jailbreak risk detection, and protected material detection. This combines a portal setup, configuration, and reporting experience with code you can add to your application to identify harmful content.

## Factors influencing your application design decisions

Understanding tokenization, pricing, context windows, and implementing programmatic improvements to enhance the users' text generation experience have a significant impact on how you design your generative AI system. Here's a short list of things to consider and other takeaways from this article that will impact your application design decisions:

- Define the problem space and audience clearly to align the AI's capabilities with user expectations, optimizing the solution's effectiveness for the intended use case.
- Evaluate the necessity of using the latest AI model against cost considerations. Less expensive models might suffice for your application's needs, balancing performance with budget constraints.
- Consider optimizing the context window length to manage costs without significantly impacting the user experience. Trimming unnecessary parts of the conversation could reduce processing fees while maintaining quality interactions.
- Evaluate the impact of tokenization and the granularity of your inputs and outputs. Understanding how your chosen LLM handles tokenization can help you optimize the efficiency of your API calls, potentially reducing costs and improving response times.
- Assess the benefits of preprocessing user prompts against the potential increase in latency and costs. Simplifying or modifying prompts before submission might improve response quality but could add complexity and time to the response cycle.
- Investigate strategies for parallelizing LLM requests to enhance performance. This approach might reduce latency but requires careful management to avoid increased complexity and potential cost implications.
- Decide between fine-tuning and retrieval-augmented generation based on your application's specific needs. Fine-tuning may offer better performance for specialized tasks, while RAG could provide flexibility and up-to-date content for dynamic applications.
- Acknowledge the non-deterministic nature of generative AI in your design, planning for variability in outputs and setting up mechanisms to ensure consistency and relevance in responses.
- Leverage low-code/no-code platforms for rapid prototyping and development if they meet your project's requirements, evaluating the trade-off between development speed and customizability. Explore the possibilities of low-code and no-code solutions for parts of your application to speed up development and enable non-technical team members to contribute to the project.


============================================



Challenges and Considerations: 

Implementing a RAG system comes with its set of challenges. Data privacy is paramount, as the system must handle user data responsibly, especially when retrieving and processing information from external sources. Computational requirements can also be significant, as both the retrieval and generative processes are resource-intensive. Ensuring the accuracy and relevance of responses while managing biases present in the data or model is another critical consideration. Developers must navigate these challenges carefully to create efficient, ethical, and valuable RAG systems.

