---
title: Augmenting a Large Language Model with Retrieval-Augmented Generation and Fine-tuning
description: Conceptual article detailing the creation of a Retrieval-Augmented Generation (RAG)-based chat system, emphasizing integration, optimization, and ethical considerations for delivering contextually relevant responses.
ms.date: 4/12/2024
ms.topic: conceptual
ms.custom: build-2024-intelligent-apps
---

# Augmenting a Large Language Model with Retrieval-Augmented Generation and Fine-tuning

The articles in this series discuss the knowledge retrieval models that LLMs use to generate their responses. By default, a Large Language Model (LLM) only has access to its training data. However, you can be augment the model to include real-time data or private data. This article discusses one of two mechanisms for augmenting a model.

The first mechanism is **Retrieval-Augmented Generation (RAG)**, which is a form of pre-processing that combines semantic search with contextual priming (discussed in [another article](./gen-ai-concepts-considerations-developers.md)). 

The second mechanism is **fine-tuning**, which refers to the process of further training the model on a specific dataset after its initial, broad training, with the goal of adapting it to perform better on tasks or understand concepts related to that dataset. This process helps the model specialize or improve its accuracy and efficiency in handling particular types of input or domains.

The following sections describe these two mechanisms in more detail.

## Understanding RAG

RAG is often used to enable the "chat over my data" scenario, where companies that have a large corpus of textual content (internal documents, documentation, etc.) and want to use this corpus as the basis for answers to user prompts.

At a high level, you create a database entry for each document (or portion of a document called a "chunk"). The chunk is indexed on its embedding, a vector (array) of numbers that represent facets of the document. When a user submits a query, you search the database for similar documents, then submit the query and the documents to the LLM to compose an answer.

>[!NOTE]
> The term Retrieval-Augmented Generation (RAG) accommodatively. The process of implementing a RAG-based chat system outlined in this article can be applied whether there's a desire to use external data to be used in a supportive capacity (RAG) or to be used as the centerpiece of the response (RCG). This nuanced distinction is not addressed in most reading related to RAG.

### Creating an index of vectorized documents

The first step to creating a RAG-based chat system is to create a vector data store containing the vector embedding of the document (or a portion of the document). Consider the following diagram that outlines the basic steps to creating a vectorized index of documents.

:::image type="content" source="./media/vector-embedding-pipeline-highres.png" alt-text="Diagram depicting the different stages of ingestion of documents, starting with chunking, then post-chunking process steps, then calls to the embedding API, then saving the document chunks as vectorized embeddings into the vector database." :::

This diagram represents a **data pipeline**, which is responsible for the ingestion, processing, and management of data used by the system. This includes preprocessing data to be stored in the vector database and ensuring that the data fed into the LLM is in the correct format.

The entire process is driven by the notion of an **embedding**, which is a numerical representation of data (typically words, phrases, sentences, or even entire documents) that captures the semantic properties of the input in a way that can be processed by machine learning models. 

To create an embedding, you send the chunk of content (sentences, paragraphs, or entire documents) to the Azure OpenAI Embedding API. What is returned from the Embedding API is a vector. Each value in the vector represents some characteristic (dimension) of the content. Dimensions might include topic matter, semantic meaning, syntax and grammar, word and phrase usage, contextual relationships, style, and tone, etc. Together, all the values of the vector represent the content's __dimensional space__. In other words, if you can think of a 3D representation of a vector with three values, a given vector lives in a certain area of the x, y, z plane. What if you 1000 (or more) values? While it's not possible for humans to draw a 1000-dimension graph on a sheet of paper to make it more understandable, computers have no problem understanding that degree of dimensional space.

The next step of the diagram depicts storing the vector along with the content itself (or a pointer to the content's location) and other metadata in a vector database. A vector database is like any type of database, with two differences:

- Vector databases use a vector as an index to search for data.
- Vector databases implement an algorithm called cosine similar search, also known as **nearest neighbor**, which uses vectors that most closely match the search criteria.

With the corpus of documents stored in a vector database, developers can build a **retriever component** which retrieves documents that match the user's query from the database in order to supply the LLM with what it needs to answer the user's query.

### Answering queries with your documents

A RAG system first uses semantic search to find articles that could be helpful to the LLM when composing an answer. The next step is to send the matching articles along with the user's original prompt to the LLM to compose an answer.

Consider the following diagram as a simple RAG implementation (sometimes referred to as "naive RAG").

:::image type="content" source="./media/naive-rag-inference-pipeline-highres.png" alt-text="Diagram depicting a simple RAG flow, with boxes representing steps or processes and arrows connecting each box. The flow begins with the user's query, which is sent to the Embedding API. The Embedding API returns results in a vectorized query, which is used to find the nearest matches (article chunks) in the vector database. The query and article chunks are sent to the Completion API, and the results are sent to the user." :::

In the diagram, a user submits a query. The first step is to create an embedding for the user's prompt to get back a vector. The next step is to search the vector database for those documents (or portions of documents) that are a "nearest neighbor" match. 

**Cosine similarity** is a measure used to determine how similar two vectors are, essentially assessing the cosine of the angle between them. A cosine similarity close to 1 indicates a high degree of similarity (small angle), while a similarity near -1 indicates dissimilarity (angle approaching 180 degrees). This metric is crucial for tasks like document similarity, where the goal is to find documents with similar content or meaning.

**"Nearest Neighbor" Algorithms** work by finding the closest vectors (neighbors) to a given point in vector space. In the **k-nearest neighbors (KNN) algorithm**, 'k' refers to the number of nearest neighbors to consider. This approach is widely used in classification and regression, where the algorithm predicts the label of a new data point based on the majority label of its 'k' nearest neighbors in the training set. KNN and cosine similarity are often used together in systems like recommendation engines, where the goal is to find items most similar to a user's preferences, represented as vectors in the embedding space.

You take the best results from that search and send the matching content along with the user's prompt to generate a response that (hopefully) is informed by matching content.

### Challenges and Considerations

Implementing a RAG system comes with its set of challenges. Data privacy is paramount, as the system must handle user data responsibly, especially when retrieving and processing information from external sources. Computational requirements can also be significant, as both the retrieval and generative processes are resource-intensive. Ensuring the accuracy and relevance of responses while managing biases present in the data or model is another critical consideration. Developers must navigate these challenges carefully to create efficient, ethical, and valuable RAG systems.

The next article in this series, [Building advanced Retrieval-Augmented Generation systems]() provides more detail on building data and inference pipelines to enable a production-ready RAG system.

If you want to start experimenting with building a generative AI solution immediately, we recommend taking a look at [Get started with the chat using your own data sample for Python](/azure/developer/python/get-started-app-chat-template?tabs=github-codespaces). There are versions of the tutorial also available in [.NET](/dotnet/ai/get-started-app-chat-template?tabs=github-codespaces), [Java](/azure/developer/java/ai/get-started-app-chat-template?tabs=github-codespaces), and [JavaScript](/azure/developer/javascript/get-started-app-chat-template?tabs=github-codespaces).

## Fine-tuning a model

**Fine-tuning**, in the context of an LLM, refers to the process of adjusting the model's parameters on a domain-specific dataset after initially being trained on a large, diverse dataset.

LLMs are trained (pre-trained) on a broad dataset, grasping language structure, context, and a wide array of knowledge. This stage involves learning general language patterns. Fine-tuning is adding more training to the pre-trained model based on a smaller, specific dataset. This secondary training phase aims to adapt the model to perform better on particular tasks or understand specific domains, enhancing its accuracy and relevance for those specialized applications. During fine-tuning, the model's weights are adjusted to better predict or understand the nuances of this smaller dataset.

A few considerations:

- **Specialization**: Fine-tuning tailors the model to specific tasks, such as legal document analysis, medical text interpretation, or customer service interactions. This makes the model more effective in those areas.
- **Efficiency**: It's more efficient to fine-tune a pre-trained model for a specific task than to train a model from scratch, as fine-tuning requires less data and computational resources.
- **Adaptability**: Fine-tuning allows for adaptation to new tasks or domains that were not part of the original training data, making LLMs versatile tools for various applications.
- **Improved performance**: For tasks that are significantly different from the data the model was originally trained on, fine-tuning can lead to better performance, as it adjusts the model to understand the specific language, style, or terminology used in the new domain.
- **Personalization**: In some applications, fine-tuning can help personalize the model's responses or predictions to fit the specific needs or preferences of a user or organization.
However, fine-tuning also presents certain downsides and limitations. Understanding these can help in deciding when to opt for fine-tuning versus alternatives like retrieval-augmented generation (RAG).
- **Data requirement**: Fine-tuning requires a sufficiently large and high-quality dataset specific to the target task or domain. Gathering and curating this dataset can be challenging and resource intensive.
- **Overfitting risk**: There's a risk of overfitting, especially with a small dataset. Overfitting makes the model perform well on the training data but poorly on new, unseen data, reducing its generalizability.
- **Cost and resources**: While less resource-intensive than training from scratch, fine-tuning still requires computational resources, especially for large models and datasets, which might be prohibitive for some users or projects.
- **Maintenance and updating**: Fine-tuned models might need regular updates to remain effective as the domain-specific information changes over time. This ongoing maintenance requires extra resources and data.
- **Model drift**: As the model is fine-tuned for specific tasks, it might lose some of its general language understanding and versatility, leading to a phenomenon known as model drift.

[Customizing a model with fine-tuning](/azure/ai-services/openai/how-to/fine-tuning?tabs=turbo%2Cpython-new&pivots=programming-language-studio) explains how to fine-tune a model. At a high level, you provide a JSON data set of potential questions and preferred answers. The documentation suggests that there are noticeable improvements by providing 50 to 100 question / answer pairs, but the right number varies greatly on the use case.

## Fine-tuning versus retrieval-augmented generation

On the surface, it might seem like there's quite a bit of overlap between fine-tuning and retrieval-augmented generation. Choosing between fine-tuning and retrieval-augmented generation depends on the specific requirements of your task, including performance expectations, resource availability, and the need for domain specificity versus generalizability.

When to prefer fine-tuning over Retrieval-Augmented Generation:

- **Task-Specific Performance** - Fine-tuning is preferable when high performance on a specific task is critical, and there exists sufficient domain-specific data to train the model effectively without significant overfitting risks.
- **Control Over Data** - If you have proprietary or highly specialized data that significantly differs from the data the base model was trained on, fine-tuning allows you to incorporate this unique knowledge into the model.
- **Limited Need for Real-time Updates** - If the task doesn't require the model to be constantly updated with the latest information, fine-tuning can be more efficient since RAG models typically need access to up-to-date external databases or the internet to pull in recent data.

When to prefer Retrieval-Augmented Generation over fine-tuning:

- **Dynamic or Evolving Content** - RAG is more suitable for tasks where having the most current information is critical. Since RAG models can pull in data from external sources in real-time, they're better suited for applications like news generation or answering questions on recent events.
- **Generalization Over Specialization** - If the goal is to maintain strong performance across a wide range of topics rather than excelling in a narrow domain, RAG might be preferable. It uses external knowledge bases, allowing it to generate responses across diverse domains without the risk of overfitting to a specific dataset.
- **Resource Constraints** - For organizations with limited resources for data collection and model training, using a RAG approach might offer a cost-effective alternative to fine-tuning, especially if the base model already performs reasonably well on the desired tasks.

## Final considerations that might influence your application design decisions

Here's a short list of things to consider and other takeaways from this article that affect your application design decisions:

- Decide between fine-tuning and retrieval-augmented generation based on your application's specific needs. Fine-tuning might offer better performance for specialized tasks, while RAG could provide flexibility and up-to-date content for dynamic applications.