---
title: Build a LangChain.js agent for Azure
description: Create a LangChain.js agent with LangChain.js that queries HR documents using Azure AI Search and Azure OpenAI for intelligent document search and question answering.
ms.date: 04/25/2025
ms.author: diberry
author: diberry
ms.topic: tutorial
ms.custom: devx-track-ts, devx-track-ts-ai
#customer intent: As a JavaScript developer, I want to use LangChain with Azure so that I can build an agentic workflow.
---

# Tutorial: Build a LangChain.js agent with Azure AI Search

In this tutorial, you use LangChain.js to build a LangChain.js agent that enables the NorthWind company employees to ask human resources–related questions. By using the framework, you avoid boilerplate code typically required for LangChain.js agents and Azure service integration, allowing you to focus on your business needs.

In this tutorial, you:

> [!div class="checklist"]
> * Set up a LangChain.js agent
> * Integrate Azure resources into your LangChain.js agent
> * Optionally test your LangChain.js agent in LangSmith Studio

NorthWind relies on two data sources: public HR documentation accessible to all employees and a confidential HR database containing sensitive employee data. This tutorial focuses on building a LangChain.js agent that determines whether an employee’s question can be answered using the public HR documents. If so, the LangChain.js agent provides the answer directly.

:::image type="content" source="./media/langchain-agent-on-azure/agent-workflow.png" alt-text="Diagram illustrating the LangChain.js agent workflow and its decision branch to use HR documentation for answering questions.":::


> [!WARNING]
> This article uses keys to access resources. In a production environment, the recommended best practice is to use Azure RBAC and managed identity. This approach eliminates the need to manage or rotate keys, enhancing security and simplifying access control.


## Prerequisites

* An active Azure account. [Create an account for free](https://azure.microsoft.com/free) if you don't have one.
* [Node.js LTS](https://nodejs.org/) installed on your system.
* [TypeScript](https://www.typescriptlang.org/) for writing and compiling TypeScript code.
* [LangChain.js](https://www.npmjs.com/package/langchain) library for building the agent.
* Optional: [LangSmith](https://www.langchain.com/langsmith) for monitoring AI usage. You need the project name, key, and endpoint.
* Optional: [LangGraph Studio](https://studio.langchain.com) for debugging LangGraph chains and LangChain.js agents.
* [Azure AI Search resource](/azure/search/search-what-is-azure-search): Ensure you have the resource endpoint, admin key (for document insertion), query key (for reading documents), and index name.
* [Azure OpenAI resource](/azure/ai-services/openai/): You need the resource instance name, key, and two models with their API versions:
  * An embeddings model like `text-embedding-ada-002`.
  * A large language model like `gpt-4o`.

## Agent architecture

The LangChain.js framework provides a decision flow for building intelligent agents as a LangGraph. In this tutorial, you create a LangChain.js agent that integrates with Azure AI Search and Azure OpenAI to answer HR-related questions. The agent's architecture is designed to:

* Determine if a question is relevant to HR documentation.
* Retrieve relevant documents from Azure AI Search.
* Use Azure OpenAI to generate an answer based on the retrieved documents and LLM model.

**Key Components**:

* **Graph structure**: The LangChain.js agent is represented as a graph, where:
   * **Nodes** perform specific tasks, such as decision-making or retrieving data.
   * **Edges** define the flow between nodes, determining the sequence of operations.

* **Azure AI Search integration**:
   * Inserts HR documents into vector store as embeddings.
   * Uses an embeddings model (`text-embedding-ada-002`) to create these embeddings.
   * Retrieves relevant documents based on user prompt.

* **Azure OpenAI integration**:
   * Uses a large language model (`gpt-4o`) to:
     * Determines if a question is answerable from general HR documents.
     * Generates answer with prompt using context from documents and user question.

The following table has examples of user questions which are and aren't relevant and answerable from general Human resources documents:

| Question | Relevance to HR Documents |
|----------|----------------------------|
| `Does the NorthWind Health Plus plan cover eye exams?` | Relevant. The HR documents, such as the employee handbook, should provide an answer. |
| `How much of my perks + benefits have I spent?` | Not relevant. This question requires access to confidential employee data, which is outside the scope of this agent. |

By using the framework, you avoid boilerplate code typically required for LangChain.js agents and Azure service integration, allowing you to focus on your business needs.

## Initialize your Node.js project

In a new directory, initialize your Node.js project for your TypeScript agent. Run the following commands:

```console
npm init -y
npm pkg set type=module
npx tsc --init
```

## Create an environment file

Create a `.env` file for local development to store environment variables for Azure resources and LangGraph. Ensure the resource instance name for the embedding and LLM is just the resource name, not the endpoint.

Optional: If using LangSmith, set `LANGSMITH_TRACING` to `true` for local development. Disable it (`false`) or remove it in production.

## Install dependencies

1. Install Azure dependencies for Azure AI Search:

    ```console
    npm install @azure/search-documents
    ```

2. Install LangChain.js dependencies for creating and using an agent:

    ```console
    npm install @langchain/community @langchain/core @langchain/langgraph @langchain/openai langchain
    ```

3. Install development dependencies for local development:

    ```console
    npm install --save-dev dotenv
    ```

## Create Azure AI search resource configuration files

To manage the various Azure resources and models used in this tutorial, create specific configuration files for each resource. This approach ensures clarity and separation of concerns, making it easier to manage and maintain the configurations.

### Configuration to upload documents into vector store

The Azure AI Search configuration file uses the admin key to insert documents into the vector store. This key is essential for managing the ingestion of data into Azure AI Search. 

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/config/vector_store_admin.ts" :::

LangChain.js abstracts the need to define a schema for data ingestion into Azure AI Search, providing a default schema suitable for most scenarios. This abstraction simplifies the process and reduces the need for custom schema definitions.

### Configuration to query vector store

For querying the vector store, create a separate configuration file:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/config/vector_store_query.ts" :::

When querying the vector store, use the query key instead. This separation of keys ensures secure and efficient access to the resource.


## Create Azure OpenAI resource configuration files

To manage the two different models, embeddings and LLM, create separate configuration files. This approach ensures clarity and separation of concerns, making it easier to manage and maintain the configurations.

### Configuration for embeddings for vector store

To create embeddings for inserting documents into the Azure AI Search vector store, create a configuration file:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/config/embeddings.ts" :::

## Configuration for LLM to generate answers

To create answers from the large language model, create a configuration file:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/config/llm.ts" :::


## Constants and prompts

AI applications often rely on constant strings and prompts. Manage these constants with separate files.

Create the system prompt:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/config/system_prompt.ts" :::

Create the nodes constants:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/config/nodes.ts" :::

Create example user queries:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/config/user_queries.ts" :::


## Load documents into Azure AI Search

To load documents into Azure AI Search, use LangChain.js to simplify the process. The documents, stored as PDFs, are converted into embeddings and inserted into the vector store. This process ensures that the documents are ready for efficient retrieval and querying.

Key Considerations:

- **LangChain.js abstraction**: LangChain.js handles much of the complexity, such as schema definitions and client creation, making the process straightforward.
- **Throttling and retry logic**: While the sample code includes a minimal wait function, production applications should implement comprehensive error handling and retry logic to manage throttling and transient errors.

### Steps to load documents

1. **Locate the PDF Documents**: The documents are stored in the [data directory](https://github.com/Azure-Samples/azure-typescript-langchainjs/packages/langgraph_agent/data/).

2. **Load PDFs into LangChain.js**: Use the `loadPdfsFromDirectory` function to load the documents. This function utilizes the LangChain.js community's `PDFLoader.load` method to read each file and return a `Document[]` array. This array is a standard LangChain.js document format.

    :::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/azure/find_pdfs.ts" :::

3. **Insert documents into Azure AI Search**: Use the `loadDocsIntoAiSearchVector` function to send the document array to the Azure AI Search vector store. This function uses the embeddings client to process the documents and includes a basic wait function to handle throttling. For production, implement a robust retry/backoff mechanism.

    :::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/azure/load_vector_store.ts" :::

## Create agent workflow

In LangChain.js, build the LangChain.js agent with a LangGraph. LangGraph allows you to define the nodes and edges:

- **Node**: where work is performed.
- **Edge**: defines the connection between nodes.

### Workflow components

In this application, the two work nodes are:

- **requiresHrResources**: determines if the question is relevant to HR documentation using the Azure OpenAI LLM.
- **getAnswer**: retrieves the answer. The answer comes from a LangChain.js retriever chain, which uses the document embeddings from Azure AI Search and sends them to the Azure OpenAI LLM. This is the essence of retrieval-augmented generation.

The edges define where to start, end, and the condition needed to call the **getAnswer** node.

### Exporting the graph

To use LangGraph Studio to run and debug the graph, export it as its own object.

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/graph.ts" :::

In the **addNode**, **addEdge**, and **addConditionalEdges** methods, the first parameter is a name, as a string, to identify the object within the graph. The second parameter is either the function that should be called at that step or the name of the node to call.

For the **addEdge** method, its name is START ("__start__" defined in the ./src/config/nodes.ts file) and it always calls the DECISION_NODE. That node is defined with its two parameters: the first is its name, DECISION_NODE, and the second is the function called **requiresHrResources**.

### Common functionality

This app provides common LangChain functionality:

* State management:

    :::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/langchain/state.ts" :::

* Route termination:

    :::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/langchain/check_route_end.ts" :::


The only custom route for this application is the **routeRequiresHrResources**. This route is used to determine if the answer from the **requiresHrResources** node indicates that the user's question should continue on to the **ANSWER_NODE** node. Because this route receives the output of **requiresHrResources**, it is in the same file.

## Integrate Azure OpenAI resources

The Azure OpenAI integration uses two different models:

- **Embeddings**: Used to insert the documents into the vector store.
- **LLM**: Used to answer questions by querying the vector store and generating responses.

The embeddings client and the LLM client serve different purposes. Do not reduce them to a single model or client.

### Embeddings model

The embeddings client is required whenever documents are retrieved from the vector store. It includes a configuration for **maxRetries** to handle transient errors.

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/azure/embeddings.ts" :::

### LLM model

The LLM model is used to answer two types of questions:

* **Relevance to HR**: Determines if the user's question is relevant to HR documentation.
* **Answer generation**: Provides an answer to the user's question, augmented with documents from Azure AI Search.

The LLM client is created and invoked when an answer is required.

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/azure/llm.ts" :::

The LangChain.js agent uses the LLM to decide whether the question is relevant to HR documentation or if the workflow should route to the end of the graph.

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/azure/requires_hr_documents.ts" :::

The **requiresHrResources** function sets a message in the updated state with `HR resources required detected` content. The router, **routeRequiresHrResources**, looks for that content to determine where to send the messages.

## Integrate Azure AI Search resource for vector store

The Azure AI Search integration provides the vector store documents so the LLM can augment the answer for the **getAnswer** node. LangChain.js again provides much of the abstraction so the required code is minimal. The functions are:

- **getReadOnlyVectorStore**: Retrieves the client with the query key.
- **getDocsFromVectorStore**: Finds relevant documents to the user's question.

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/azure/vector_store.ts" :::

The LangChain.js integration code makes retrieving the relevant documents from the vector store incredibly easy.

## Write code to get answer from LLM

Now that the integration components are built, create the **getAnswer** function to retrieve relevant vector store documents and generate an answer using the LLM.

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/azure/get_answer.ts" :::

This function provides a prompt with two placeholders: one for the user's question and one for context. The context is all the relevant documents from the AI Search vector store. Pass the prompt and the LLM client to the **createStuffDocumentsChain** to create an LLM chain. Pass the LLM chain to **createRetrievalChain** to create a chain that includes the prompt, relevant documents, and the LLM.

Run the chains with **retrievalChain.invoke** and the user's question as input to get the answer. Return the answer in the messages state.

## Build the agent package

1. Add a script to **package.json** to build the TypeScript application:

    ```json
    "build": "tsc",
    ```

2. Build the LangChain.js agent.

    ```console
    npm run build
    ```

## Optional - run the LangChain.js agent in local development with LangChain Studio

Optionally, for local development, use LangChain Studio to work with your LangChain.js agent.

1. Create a `langgraph.json` file to define the graph.

    :::code language="json" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/langgraph.json" :::

2. Install the LangGraph CLI.

    ```console
    npm install @langchain/langgraph-cli --save-dev
    ```

3. Create a script in **package.json** to pass the `.env` file to the LangGraph CLI.

    ```json
    "studio": "npx @langchain/langgraph-cli dev",
    ```

4. The CLI runs in your terminal and opens a browser to the LangGraph Studio.

    ```console
              Welcome to

    ╦  ┌─┐┌┐┌┌─┐╔═╗┬─┐┌─┐┌─┐┬ ┬
    ║  ├─┤││││ ┬║ ╦├┬┘├─┤├─┘├─┤
    ╩═╝┴ ┴┘└┘└─┘╚═╝┴└─┴ ┴┴  ┴ ┴.js

    - 🚀 API: http://localhost:2024
    - 🎨 Studio UI: https://smith.langchain.com/studio?baseUrl=http://localhost:2024

    This in-memory server is designed for development and testing.
    For production use, please use LangGraph Cloud.

    info:    ▪ Starting server...
    info:    ▪ Initializing storage...
    info:    ▪ Registering graphs from C:\Users\myusername\azure-typescript-langchainjs\packages\langgraph-agent
    info:    ┏ Registering graph with id 'agent'
    info:    ┗ [1] { graph_id: 'agent' }
    info:    ▪ Starting 10 workers
    info:    ▪ Server running at ::1:2024
    ```

5. View the LangChain.js agent in the LangGraph Studio.

    :::image type="content" source="media/langchain-agent-on-azure/langgraph-platform-studio.png" alt-text="Screenshot of LangSmith Studio with a graph loaded.":::

6. Select **+ Message** to add a user question then select **Submit**.

    | Question | Relevance to HR documents |
    |----------|----------------------------|
    | `Does the NorthWind Health plus plan cover eye exams?` | This question is relevant to HR and general enough that the HR documents such as the employee handbook, the benefits handbook, and the employee role library should be able to answer it. |
    | `What is included in the NorthWind Health plus plan that is not included in the standard?` | This question is relevant to HR and general enough that the HR documents such as the employee handbook, the benefits handbook, and the employee role library should be able to answer it. |
    | `How much of my perks + benefit have I spent` | This question isn't relevant to the general, impersonal HR documents. This question should be sent to an agent which has access to employee data. |

7. If the question is relevant to the HR docs, it should pass through the **DECISION_NODE** and on to the **ANSWER_NODE**.

    Watch the terminal output to see the question to the LLM and the answer from the LLM.

8. If the question isn't relevant to the HR docs, the flow goes directly to **__end__**.

When the LangChain.js agent makes an incorrect decision, the issue may be:

- LLM model used
- Number of documents from vector store
- Prompt used in the decision node.

## Run the LangChain.js agent from an app

To call the LangChain.js agent from a parent application, such as a web API, you need to provide the invocation of the LangChain.js agent.

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/index.ts" :::

The two functions are:

* **ask_agent**: This function returns state so it allows you to add the LangChain.js agent to a LangChain multi-agent workflow.
* **get_answer**: This function returns just the text of the answer. This function can be called from an API.


## Troubleshooting

* For any issues with the procedure, create an issue on the [sample code repository](https://github.com/Azure-Samples/azure-typescript-langchainjs/issues)

## Clean up resources

Delete the resource group which holds the Azure AI Search resource and the Azure OpenAI resource.

## Related content

* [Get started with Serverless AI Chat with RAG using LangChain.js](get-started-app-chat-template-langchainjs.md)
