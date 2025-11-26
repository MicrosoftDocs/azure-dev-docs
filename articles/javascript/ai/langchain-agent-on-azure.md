---
title: Build a LangChain.js agent for Azure
description: Create a LangChain.js agent with LangChain.js that queries HR documents using Azure AI Search and Azure OpenAI for intelligent document search and question answering.
ms.date: 11/25/2025
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

* An active Azure account. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) if you don't have one.
* [Node.js LTS](https://nodejs.org/) installed on your system.
* [TypeScript](https://www.typescriptlang.org/) for writing and compiling TypeScript code.
* [Azure Developer CLI (azd)](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd?tabs=windows%2Cmacos%2Clinux) installed and configured.
* [LangChain.js](https://www.npmjs.com/package/langchain) library for building the agent.
* Optional: [LangSmith](https://www.langchain.com/langsmith) for monitoring AI usage. You need the project name, key, and endpoint.
* Optional: [LangGraph Studio](https://studio.langchain.com) for debugging LangGraph chains and LangChain.js agents.

## Azure resources

The following Azure resources are required. They are created for you in this article:

* [Azure AI Search resource](/azure/search/search-what-is-azure-search): Ensure you have the resource endpoint, admin key (for document insertion), query key (for reading documents), and index name.
* [Azure OpenAI resource](/azure/ai-services/openai/): You need the resource instance name, key, and two models with their API versions:
  * An embeddings model like `text-embedding-3-small`.
  * A large language model (LLM) like `'gpt-4.1-mini`.

## Agent architecture

The LangChain.js framework provides a decision flow for building intelligent agents as a LangGraph. In this tutorial, you create a LangChain.js agent that integrates with Azure AI Search and Azure OpenAI to answer HR-related questions. The agent's architecture is designed to:

* Determine if a question is relevant to HR documentation.
* Retrieve relevant documents from Azure AI Search.
* Use Azure OpenAI to generate an answer based on the retrieved documents and LLM model.

**Key Components**:

- **Graph structure**: The LangChain.js agent is represented as a graph, where:
   - **Nodes** perform specific tasks, such as decision-making or retrieving data.
   - **Edges** define the flow between nodes, determining the sequence of operations.

- **Azure AI Search integration**:
  - Uses an embeddings model to create vectors.
  - Inserts HR documents (*.md, *.pdf) into vector store. The [documents](https://github.com/Azure-Samples/azure-typescript-langchainjs/tree/main/packages/langgraph-agent/data) include:
    -  Company information
    -  Employee handbook
    -  Benefits handbook
    -  Employee role library
  -  Retrieves relevant documents based on the user prompt.

* **Azure OpenAI integration**:
   * Uses a large language model to:
     * Determines if a question is answerable from impersonal HR documents.
     * Generates answer with prompt using context from documents and user question.

The following table has examples of user questions which are and aren't relevant and answerable from general Human resources documents:

| Question | Relevance to HR Documents |
|----------|----------------------------|
| `Does the NorthWind Health Plus plan cover eye exams?` | Relevant. The HR documents, such as the employee handbook, should provide an answer. |
| `How much of my perks + benefits have I spent?` | Not relevant. This question requires access to confidential employee data, which is outside the scope of this agent. |

By using the framework, you avoid boilerplate code typically required for LangChain.js agents and Azure service integration, allowing you to focus on your business needs.

## Clone the sample code repository

In a new directory, clonet the sample code repository and change to the new directory:

```console
git clone https://github.com/Azure-Samples/azure-typescript-langchainjs.git
cd azure-typescript-langchainjs
```

This sample provides all the code you need to create secure Azure resources, build the LangChain.js agent with Azure AI Search and Azure OpenAI, and use the agent from a Node.js Fastify API server.

## Use Azure Developer CLI to create resources

1. Sign in to Azure with the Azure Developer CLI then create the Azure resources. 

    ```console
    azd auth login
    azd up
    ```
    
1. During the `azd up` command, answer the questions:
    - New environment name: enter a unique environment name such as `langchain-agent`. This is used as part of the Azure resource group. 
    - Select an Azure Subscription: select the subscription where the resources are created.
    - Select a region such as `eastus2`.

When the deployment is complete, the necessary resource information is in `.env` file in the root of the repository. 

The resources are created with both passwordless and key access. For this tutorial, the applicaiton uses your local developer account to insert your credentials into the local application runtime. Learn more about [passwordless authentication](https://learn.microsoft.com/en-us/azure/developer/intro/passwordless-overview).

The article is meant for your local development environment; there isn't a corresponding production deployment of source code.

## Install dependencies

1. Install the Node.js packages for this project. 

    ```console
    npm install 
    ```

    This command installs the dependencies defined in the two `package.json` file, including:

    - [`./packages/server-api`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/server-api/package.json):Fastify for the web server
    - [`./packages/langgraph-agent`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/package.json): 
        - LangChain.js for building the agent
        - Azure SDK packages for integrating with Azure resources

1. Build the 2 packages: the API server and the AI agent.

    ```console
    npm run build
    ```

    This creates a link between the two packages so the API server can call the AI agent.


## Run the LangChain.js agent locally

1. Read the Human resources documentation, create embeddings, and insert them into the Azure AI Search vector store.

    ```console
    npm run load_data
    ``` 

    This may take several minutes. You can watch the terminal output to see the progress of document insertion including how many LangChain documents (chuncks) have been processed.
    
1. Start the Fastify API server.

    ```console
    npm start
    ```

    The server starts and listens on port 3000. You can test the server by navigating to `http://localhost:3000` in your web browser. You should see a welcome message indicating that the server is running.

## Use the API to ask questions

1. Use the API to ask questions.

    You can use a tool like [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) or `curl` to send a POST request to the `/ask` endpoint with a JSON body containing your question.

    Rest client queries are available in the [`packages/server-api/http`](https://github.com/Azure-Samples/azure-typescript-langchainjs/tree/main/packages/server-api/http) directory.

    Example using `curl`:

    ```console
    curl -X POST http://localhost:3000/ask -H "Content-Type: application/json" -d "{\"question\": \"Does the NorthWind Health Plus plan cover eye exams?\"}"
    ```

    You should receive a JSON response with the answer from the LangChain.js agent.


## Understand the Azure integration with LangChain.js agent

This section explains how the LangChain.js agent integrates with Azure services. 

### Understand LangChain.js agent project structure

The agent project is in the `packages/langgraph-agent` directory. The following table summarizes the key directories and files:

| Path | Description | Role |
|------|-------------|------|
| [`src/graph.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/graph.ts) | LangGraph definition for the agent workflow. | Defines agent workflow |
| [`src/index.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/index.ts) | Functions to call the LangChain.js agent from the API server. | API entry points |
| [`src/azure/azure-credential.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/azure/azure-credential.ts) | Creates the Azure credential using your developer login. | Auth integration |
| [`src/azure/embeddings.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/azure/embeddings.ts) | Uses the embeddings client for Azure OpenAI. | Embeddings |
| [`src/azure/llm.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/azure/llm.ts) | Uses the LLM client for Azure OpenAI. | Language model |
| [`src/azure/vector_store.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/azure/vector_store.ts) | Integrates with Azure AI Search vector store. | Vector store |
| [`src/langchain/prompt.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/langchain/prompt.ts) | Prompt used to generate answers from the LLM. | Prompt logic |
| [`src/langchain/nodes.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/langchain/nodes.ts) | LangGraph nodes, route, and message management. | Node management |
| [`src/langchain/node_requires_hr_documents.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/langchain/node_requires_hr_documents.ts) | Determines if the user's question is relevant to HR documents. | HR relevance check |
| [`src/langchain/node_get_answer.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/langchain/node_get_answer.ts) | Gets the answer from the LLM using vector store documents. | Answer generation |
| [`src/scripts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/scripts) | Scripts to load documents into the vector store. | Data ingestion |

## Azure passwordless authentication

While the resources are created with both passwordless and key access, the application uses your local developer account to insert your credentials into the local application runtime. To use passwordless authentication, the [`DefaultAzureCredential`](https://learn.microsoft.com/javascript/api/@azure/identity/defaultazurecredential) credential from the [`@azure/identity`](https://www.npmjs.com/package/@azure/identity) npm package is used. This class automatically picks up your developer login credentials when running locally.

To update the credential, a token provider function may be necessary. 

The following code snippet from [`src/azure/azure-credential.ts`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages/langgraph-agent/src/azure/azure-credential.ts) shows how to create the credential:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages/langgraph-agent/src/azure/azure-credential.ts" :::

Because the credential is used, instead of a resource key, you don't need to manage or rotate keys, enhancing security and simplifying access control. 

### Azure AI Search integration

The Azure AI Search resource is created in the [`./infra/main.bicep`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/infra/main.bicep) file using Azure Verified Module `br/public:avm/res/search/search-service` for AI Search. The vector store index is created with fields suitable for storing document chunks and their embeddings. The resource is created with the required Role-Based Access Control (RBAC) roles for the application to read and write to the index. Learn more about [Azure AI Search RBAC roles](https://learn.microsoft.com/azure/search/search-security-rbac).

To create a client for Azure AI Search, pass the credential object. 

```typescript
import { DefaultAzureCredential } from "@azure/identity";
import {
  SearchClient,
  SearchIndexClient
} from "@azure/search-documents";

// Azure AI Search endpoint
const AZURE_AISEARCH_ENDPOINT  = process.env.AZURE_AISEARCH_ENDPOINT ;
const credential = new DefaultAzureCredential();

// Azure AI Search index name: northwind
const index = process.env.AZURE_AISEARCH_INDEX_NAME;

// To manage indexes
const indexClient = new SearchIndexClient(
  AZURE_AISEARCH_ENDPOINT, 
  credential
);

// To query and manipulate documents
const searchClient = new SearchClient(
  AZURE_AISEARCH_ENDPOINT,
  index, 
  credential
);
```

### Azure OpenAI integration

The Azure OpenAI resource is created in the [`./infra/main.bicep`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/infra/main.bicep) file using Azure Verified Module `br/public:avm/res/cognitive-services/account` for Azure OpenAI. The resource is created with the required Role-Based Access Control (RBAC) roles for the application to access the models. Learn more about [Azure OpenAI RBAC roles](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/rbac-azure-ai-foundry).

To create an embedding client for Azure OpenAI, return the credential from the token provider. 

```typescript
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";
import { AzureOpenAIEmbeddings } from "@langchain/openai";

// Token credential: for this article it is a Local developer credential
const credential = new DefaultAzureCredential();

// Scope specific for Azure OpenAI
const scope = "https://cognitiveservices.azure.com/.default";

// Token provider function
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

// Azure resource name
const embeddingEndpoint = process.env.AZURE_OPENAI_EMBEDDING_INSTANCE;

// deployment name and model name are the same in this application
const embeddingModel = process.env.AZURE_OPENAI_EMBEDDING_MODEL; 

// Azure API version for the embedding model
const apiVersion = process.env.AZURE_OPENAI_EMBEDDING_API_VERSION;

const options = { azureADTokenProvider, deployment: embeddingModel, apiVersion, embeddingEndpoint }

const client = new AzureOpenAI(options);
```

## Azure versus other clients for Azure resources

When integrating with Azure OpenAI using non-Azure SDK, such as LangChain.js or OpenAI, it's important to check those SDKs. Use the token provider function rather than the credential object directly if required.

The [`getBearerTokenProvider`](https://learn.microsoft.com/en-us/javascript/api/@azure/identity/?view=azure-node-latest#@azure-identity-getbearertokenprovider) function from @azure/identity is required when using the LangChain.js OpenAI library to access Azure OpenAI resources. This is because the LangChain-provided OpenAI client expects a token provider function, not a credential object, to fetch OAuth 2.0 bearer tokens for the resource scope (for example, "https://cognitiveservices.azure.com/.default"). By specifying the scope once when creating the provider, you ensure tokens are fetched for that scope automatically, without extra boilerplate.

## Troubleshooting

For any issues with the procedure, create an issue on the [sample code repository](https://github.com/Azure-Samples/azure-typescript-langchainjs/issues)

For any errors while running the agent, review the [troubleshooting information](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/Troubleshooting.md).


## Clean up resources

You can delete the resource group which holds the Azure AI Search resource and the Azure OpenAI resource or use the Azure Developer CLI:

```console
azd down
```

## Related content

* [Get started with Serverless AI Chat with RAG using LangChain.js](get-started-app-chat-template-langchainjs.md)

