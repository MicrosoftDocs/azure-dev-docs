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

:::image type="content" source="./media/vector-embedding-pipeline-highres.png" alt-text="" :::

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

:::image type="content" source="./media/vector-embedding-pipeline-highres.png" alt-text="" :::

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



Challenges and Considerations: Implementing a RAG system comes with its set of challenges. Data privacy is paramount, as the system must handle user data responsibly, especially when retrieving and processing information from external sources. Computational requirements can also be significant, as both the retrieval and generative processes are resource-intensive. Ensuring the accuracy and relevance of responses while managing biases present in the data or model is another critical consideration. Developers must navigate these challenges carefully to create efficient, ethical, and valuable RAG systems.






### Chunking strategy

For developers dealing with embeddings in machine learning and natural language processing projects, how you chunk and store your embeddings is crucial for both performance and accuracy. Chunking refers to the process of dividing your embeddings into manageable pieces or batches before storage or processing. The size of these chunks can significantly impact the efficiency of retrieval operations and the effectiveness of algorithms like nearest neighbor searches. Smaller chunks may lead to faster retrieval times because they can be more quickly loaded into memory, but they might increase the overhead due to more frequent reads from the storage system. On the other hand, larger chunks reduce the number of reads but require more memory to process, which can slow down operations if the system's memory is limited. Furthermore, the chunk size can affect the granularity of parallel processing tasks, with implications for computational efficiency and scalability. Optimal chunking requires balancing these factors: memory usage, processing speed, and the overhead of data retrieval, all of which can influence the accuracy and responsiveness of applications utilizing embeddings, such as recommendation systems or semantic search engines. Developers must carefully consider their specific application requirements, data volume, and system capabilities when deciding on the chunk size for storing embeddings.




Developing a Retrieval-Augmented Generation (RAG)-based chat system involves several nuanced considerations that significantly impact its performance and output quality. Let's address each bullet point and explore additional factors affecting RAG-chat system results.



### How can you perform pre- and post-generation processing to improve results?
Pre-generation processing might include cleaning the input data, applying query expansion techniques, or using specific prompts to guide the model's focus. Post-generation processing could involve filtering out inappropriate content, adjusting the tone or style of the responses to match desired criteria, or summarizing lengthy outputs. These processing steps help tailor the system's outputs to specific use cases and improve the overall user experience.

### How can you fine-tune results for your specific domain?
Fine-tuning a model on domain-specific data is crucial for improving its performance on specialized topics or industries. This process involves training the model further on a dataset that is representative of the domain in question, allowing it to understand and generate responses that are accurate and relevant to that domain. Fine-tuning can significantly enhance the model's effectiveness by adapting its responses to the specific context and terminology of the domain.

### How can you use query-expansion techniques to improve results?
Query expansion involves modifying the original query to include additional terms or phrases that are semantically related to the original query. This can help improve the retrieval process by increasing the chances of finding relevant documents, especially if the initial query was ambiguous or lacked specific context. Techniques like synonym expansion, using ontologies, or leveraging user feedback can enrich the query, leading to better-informed responses from the generative model.

### Additional Factors to Consider
- **Bias and Fairness**: Developers need to be aware of and mitigate biases in both the retrieval corpus and the generative model to ensure fair and unbiased responses.
- **Efficiency and Scalability**: The system's architecture must be designed to handle the computational load efficiently, ensuring fast response times even as the data corpus grows.
- **Privacy and Security**: Ensuring user data privacy and securing the system against potential misuse or data breaches is critical, especially when handling sensitive information.
- **Continuous Learning**: Incorporating mechanisms for the model to learn from new data and user interactions over time can improve its performance and relevance.

Addressing these points requires a thoughtful approach to designing and implementing RAG-chat systems, balancing technical considerations with ethical and practical concerns to create effective, reliable, and user-friendly applications.

==========================

What are the high-level architectural components of a RAG-chat system?

Here's an overview of each component and their roles, with an addition that might enhance the architecture:

- **LLM (Large Language Model)**: This is the core of the RAG system, responsible for generating human-like responses based on the input it receives. The LLM uses information from the retrieval system to create relevant and contextually appropriate answers.

- **Embeddings API**: This component processes the input query to produce embeddings, which are vector representations of the text. These embeddings are used to find relevant information in a vector database, enabling the retrieval of contextually similar content.



- **Vector Database**: Stores the embeddings of pre-processed data, allowing for efficient retrieval of information based on similarity to the query embeddings. This component is crucial for the retrieval part of the RAG system, enabling it to quickly find relevant information that informs the LLM's generation process.

- **A User Interface Technology (web, desktop, mobile, web API)**: This component is the front end through which users interact with the RAG system. It could be a web interface, a desktop application, a mobile app, or a web API, designed to capture user queries and display the generated responses.

- **Completion API**: Often part of or connected to the LLM, the Completion API takes the input (possibly augmented with retrieved context) and generates the final text completion. It's the bridge between raw model output and the user-ready response, possibly involving further processing to tailor the response to the application's needs.

Additional component to consider:

- **Monitoring and Logging System**: While not exclusive to RAG systems, a dedicated monitoring and logging component is essential for tracking system performance, user interactions, and errors. This system can help in optimizing the system's performance, debugging issues, and understanding user needs better, leading to more targeted improvements over time.

These components together create a powerful system capable of understanding and generating human-like text, providing users with informative and contextually relevant interactions. The inclusion of a monitoring and logging system ensures that the RAG-chat system can evolve and improve continuously, responding to user needs and technological advancements.


=================================================




Get started with the enterprise RAG chat sample

This is where we formally introduce the enterprise rag chat sample as a great starting point, including the quick starts, the GitHub repository, the Azure services employed, etc.

Getting Started with Experimentation and Proof of Concept

•	Setting Up a Development Environment: Guide on setting up Azure services, and tools needed for RAG system development.
•	Building a Simple Proof of Concept: Step-by-step guide to create a basic RAG chatbot, demonstrating the core functionalities.
•	Experimentation and Iteration: Tips on experimenting with different models, datasets, and Azure services to refine the chatbot.



## What are some early considerations for design and development?

Elaborating on these early considerations for designing and developing a RAG-chat system, and adding more factors for developers:

- **See the Azure Architecture Center!**: This resource is invaluable for understanding best practices, patterns, and architectures for cloud services, including those relevant to building AI and RAG-chat systems. It can guide you on how to leverage Azure services effectively for scalability, security, and performance.

- **Think about the kinds of questions you want to answer**: Tailor your RAG-chat system to meet the specific needs of your users. Understand the types of queries your system will handle to ensure the retrieval system and language model are optimized for relevant, accurate responses.

- **An organization’s initial AI project is a driver for legal and ethical decisions about AI**: Your first AI project sets the tone for how AI will be used within your organization. It's crucial to establish a framework for ethical AI use, data privacy, and compliance with legal standards from the outset.

- **Identify functional requirements**: Consider aspects like response accuracy, the frequency of content updates through a data pipeline, and the quality of your content. Determine how these factors will influence the system's performance and plan for managing and maintaining a high-quality dataset for training and updates.

- **Non-Functional Requirements**: Address scalability to ensure your system can grow with your user base, performance to keep response times low, security to protect user data, and compliance to meet industry standards and regulations. These considerations are foundational to building a trustworthy system.

- **Monitoring and Analytics**: Implement comprehensive monitoring and analytics to understand how users interact with your system and to measure performance metrics. This insight is crucial for iterative improvements and addressing any issues. Be mindful of how you manage telemetry and feedback, especially when handling Personally Identifiable Information (PII) and adhering to AI ethical guidelines.

Additional factors to consider:

- **User Experience Design**: Focus on creating a user-friendly interface that is intuitive and accessible. Consider how users will interact with your chat system and design for ease of use, responsiveness, and engagement.

- **Data Governance and Management**: Establish clear policies and practices for data governance, including data sourcing, storage, and usage. This is crucial for maintaining data quality, ensuring ethical use of data, and complying with data protection regulations.

- **Integration with Existing Systems**: Consider how your RAG-chat system will integrate with existing organizational systems and workflows. Seamless integration can enhance productivity and user satisfaction but requires careful planning to ensure compatibility and security.

- **Continuous Learning and Improvement**: Plan for ongoing training and refinement of your AI models based on new data and user feedback. A system that adapts and improves over time will remain relevant and valuable to your users.

- **Cost Management**: Be aware of the costs associated with cloud services, data storage, and processing. Optimize your use of resources to manage expenses while maintaining high system performance and reliability.

Starting with a clear understanding of these considerations will help developers lay a solid foundation for designing and developing a RAG-chat system that meets the needs of their organization and its users.




Embrace an iterative development process, using the feedback loop of prompt refinement and result evaluation to continuously improve the quality of AI-generated outputs.
Consider the scalability of your solution from the start. How will your application handle increased loads or the need to scale down? Scalability affects not just technical architecture but also cost management and user experience.

Determine the extent to which your application requires real-time information and how you will incorporate this into your design. If currentness is critical, consider how retrieval-augmented generation or regular model updates can meet this need.

Assess the trade-offs between customization and generalization. While fine-tuning allows for high specificity, it may limit the model's ability to handle a wide range of topics or questions. Consider how this affects your application's versatility and user experience.

Plan for ongoing maintenance and model updates. Generative AI models and their underlying technologies evolve rapidly. Consider how you will keep your application up to date with the latest models and practices without disrupting user experience.

Understand the regulatory and ethical implications of deploying generative AI in your application. This includes data privacy, content generation guidelines, and the potential for generating harmful or biased content.

Consider user feedback mechanisms as part of your application design. User interactions can provide valuable insights into improving model performance, user experience, and prompt refinement.

Develop a comprehensive testing strategy that includes not just traditional software testing but also evaluates the accuracy, relevance, and appropriateness of the AI-generated content. This may involve developing new metrics and testing methodologies specific to AI outputs.


•	Prioritize understanding the limitations and inherent biases of the LLMs you plan to use. This knowledge can guide you in designing systems that mitigate biases and improve the fairness and inclusivity of your application.
•	Implement content safety measures and moderation APIs to ensure user interactions remain positive and comply with regulatory standards, considering the balance between user freedom and content control.

