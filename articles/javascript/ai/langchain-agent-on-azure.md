---
title: Build a LangChain.js agent for Azure
description: Create a LangChain.js agent with LangChain.js that queries HR documents using Azure AI Search and Azure OpenAI for intelligent document search and question answering.
ms.date: 12/08/2025
ms.author: diberry
author: diberry
ms.topic: tutorial
ms.custom: devx-track-ts, devx-track-ts-ai
#customer intent: As a JavaScript developer, I want to use LangChain with Azure so that I can build an agentic workflow.
---

# Tutorial: Build a LangChain.js agent with Azure AI Search

Build an intelligent HR assistant using LangChain.js and Azure services. This agent helps employees at the fictitious NorthWind company find answers to human resources questions by searching through company documentation.

You'll use [Azure AI Search](/azure/search/) to find relevant documents and [Azure OpenAI](/azure/ai-foundry/foundry-models/concepts/models-sold-directly-by-azure) to generate accurate answers. The LangChain.js framework handles the complexity of agent orchestration, letting you focus on your specific business requirements.

What you'll learn:

> [!div class="checklist"]
> * Deploy Azure resources using Azure Developer CLI
> * Build a LangChain.js agent that integrates with Azure services
> * Implement retrieval-augmented generation (RAG) for document search
> * Test and debug your agent locally and in Azure

By the end of this tutorial, you have a working REST API that answers HR questions using your company's documentation.

## Architecture overview

:::image type="content" source="./media/langchain-agent-on-azure/agent-workflow.png" alt-text="Screenshot of diagram illustrating the LangChain.js agent workflow and its decision branch to use HR documentation for answering questions.":::

NorthWind relies on two data sources: 
- HR documentation accessible to _all_ employees 
- Confidential HR database containing sensitive employee data. 

This tutorial focuses on building a LangChain.js agent that determines whether an employee's question can be answered using the public HR documents. If so, the LangChain.js agent provides the answer directly.

## Prerequisites

To use this sample in [Codespace](https://codespaces.new/Azure-Samples/azure-typescript-langchainjs) or local development container, including building and running the LangChain.js agent, you need the following:

* An active Azure account. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) if you don't have one.

If you run the sample code locally without a development container, you also need:

* [Node.js LTS](https://nodejs.org/) installed on your system.
* [TypeScript](https://www.typescriptlang.org/) for writing and compiling TypeScript code.
* [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli) installed and configured.
* [LangChain.js](https://www.npmjs.com/package/langchain) library for building the agent.
* Optional: [LangSmith](https://www.langchain.com/langsmith) for monitoring AI usage. You need the project name, key, and endpoint.
* Optional: [LangGraph Studio](https://studio.langchain.com) for debugging LangGraph chains and LangChain.js agents.

## Azure resources

The following Azure resources are required. They are created for you in this article using the [Azure Developer CLI](/azure/developer/azure-developer-cli) and [Bicep](/azure/azure-resource-manager/bicep/) templates using [Azure Verified Modules(AVM)](https://azure.github.io/Azure-Verified-Modules/). The resources are created with both passwordless and key access for learning purposes. This tutorial uses your local developer account for passwordless authentication:

* [Azure AI Search resource](/azure/search/search-what-is-azure-search) for vector search.
* [Azure OpenAI resource](/azure/ai-services/openai/) with the following models:
  * An embeddings model like `text-embedding-3-small`.
  * A large language model (LLM) like `'gpt-4.1-mini`.

## Agent architecture

The LangChain.js framework provides a decision flow for building intelligent agents as a LangGraph. In this tutorial, you create a LangChain.js agent that integrates with Azure AI Search and Azure OpenAI to answer HR-related questions. The agent's architecture is designed to:

* Determine if a question is relevant to general HR documentation available to _all_ employees.
* Retrieve relevant documents from Azure AI Search based on the user query.
* Use Azure OpenAI to generate an answer based on the retrieved documents and LLM model.

**Key Components**:

- **Graph structure**: The LangChain.js agent is represented as a graph, where:
   - **Nodes** perform specific tasks, such as decision-making or retrieving data.
   - **Edges** define the flow between nodes, determining the sequence of operations.

- **Azure AI Search integration**:
  - Uses an embeddings model to create vectors.
  - Inserts HR documents (*.md, *.pdf) into vector store. The [documents](https://github.com/Azure-Samples/azure-typescript-langchainjs/tree/main/packages-v1/langgraph-agent/data) include:
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

| Question | Relevant | Explanation |
|----------|----------|----------------------------|
| `Does the NorthWind Health Plus plan cover eye exams?` | Yes | The HR documents, such as the employee handbook, should provide an answer. |
| `How much of my perks + benefits have I spent?` | No | This question requires access to confidential employee data, which is outside the scope of this agent. |

By using the LangChain.js framework, you avoid much of the agentic boilerplate code typically required for agents and Azure service integration, allowing you to focus on your business needs.

## Clone the sample code repository

In a new directory, clone the sample code repository and change to the new directory:

```console
git clone https://github.com/Azure-Samples/azure-typescript-langchainjs.git
cd azure-typescript-langchainjs
```

This sample provides the code you need to create secure Azure resources, build the LangChain.js agent with Azure AI Search and Azure OpenAI, and use the agent from a Node.js Fastify API server.

## Authenticate to the Azure CLI and Azure Developer CLI 

Sign in to Azure with the Azure Developer CLI, create the Azure resources, and deploy the source code. Because the deployment process uses both Azure CLI and Azure Developer CLI, sign into Azure CLI, then configure the Azure Developer CLI to use your authentication from Azure CLI:

```console
az login
azd config set auth.useAzCliAuth true
```

## Create resources and deploy code with Azure Developer CLI

Begin the deployment process by running the `azd up` command:

```azdeveloper
azd up
```

During the `azd up` command, answer the questions:
- **New environment name**: enter a unique environment name such as `langchain-agent`. This environment name is used as part of the Azure resource group.
- **Select an Azure Subscription**: select the subscription where the resources are created.
- **Select a region**: such as `eastus2`.

The deployment takes approximately 10-15 minutes. The Azure Developer CLI orchestrates the process using phases and hooks defined in the [`azure.yaml`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/azure.yaml) file:

**Provision phase** (equivalent to `azd provision`):
- Creates Azure resources defined in [`infra/main.bicep`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/infra/main.bicep): 
    - Azure Container App
    - OpenAI
    - AI Search
    - [Container Registry](/azure/container-registry/)
    - [Managed identity](/azure/developer/intro/passwordless-overview)
- **Post-provision hook**: Checks if the Azure AI Search index `northwind` already exists
  - If the index doesn't exist: runs `npm install` and `npm run load_data` to upload HR documents using LangChain.js PDF loader and embedding client
  - If the index exists: skips data loading to avoid duplicates (you can manually reload by deleting the index or running `npm run load_data`)
**Deploy phase** (equivalent to `azd deploy`):
- **Pre-deploy hook**: Builds the Docker image for the Fastify API server and pushes it to Azure Container Registry
- Deploys the containerized API server to Azure Container Apps

When deployment completes, environment variables and resource information are saved to the `.env` file in the repository root. You can view the resources in the [Azure portal](https://portal.azure.com).

The resources are created with both passwordless and key access for learning purposes. This introductory tutorial uses your local developer account for passwordless authentication. For production applications, use only passwordless authentication with managed identities. Learn more about [passwordless authentication](/azure/developer/intro/passwordless-overview).

## Use the sample code locally

Now that the Azure resources are created, you can run the LangChain.js agent locally.

## Install dependencies

1. Install the Node.js packages for this project. 

    ```console
    npm install 
    ```

    This command installs the dependencies defined in the two `package.json` files in the `packages-v1` directory, including:

    - [`./packages-v1/server-api`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages-v1/server-api/package.json): 
        - Fastify for the web server
    - [`./packages-v1/langgraph-agent`](https://github.com/Azure-Samples/azure-typescript-langchainjs/blob/main/packages-v1/langgraph-agent/package.json): 
        - LangChain.js for building the agent
        - Azure SDK client library [`@azure/search-documents`](https://www.npmjs.com/package/@azure/search-documents) for integrating with Azure AI Search resource. The reference documentation is [here](/javascript/api/@azure/search-documents/).

1. Build the two packages: the API server and the AI agent.

    ```console
    npm run build
    ```

    This command creates a link between the two packages so the API server can call the AI agent.


## Run the API server locally

The Azure Developer CLI created the required Azure resources and configured the environment variables in the root `.env` file. This configuration included a post provision hook to upload the data into the vector store. Now, you can run the Fastify API server that hosts the LangChain.js agent.

1. Start the Fastify API server.

    ```console
    npm run dev
    ```

    The server starts and listens on port 3000. You can test the server by navigating to [`http://localhost:3000`] in your web browser. You should see a welcome message indicating that the server is running.

## Use the API to ask questions

1. Use the API to ask questions.

    You can use a tool like [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) or `curl` to send a POST request to the `/ask` endpoint with a JSON body containing your question.

    Rest client queries are available in the [`packages-v1/server-api/http`](https://github.com/Azure-Samples/azure-typescript-langchainjs/tree/main/packages-v1/server-api/http) directory.

    Example using `curl`:

    ```console
    curl -X POST http://localhost:3000/answer -H "Content-Type: application/json" -d "{\"question\": \"Does the NorthWind Health Plus plan cover eye exams?\"}"
    ```

    You should receive a JSON response with the answer from the LangChain.js agent.

    ```console
    {
      "answer": "Yes, the NorthWind Health Plus plan covers eye exams. According to the Employee Handbook, employees enrolled in the Health Plus plan are eligible for annual eye exams as part of their vision benefits."
    }
    ```

    Several example questions are available in the [`packages-v1/server-api/http`](https://github.com/Azure-Samples/azure-typescript-langchainjs/tree/main/packages-v1/server-api/http) directory. Open the files in [Visual Studio Code](https://code.visualstudio.com/) with [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to test them quickly.


## Understand the application code

This section explains how the LangChain.js agent integrates with Azure services. The repository's application is organized as an npm workspace with two main packages:

```console
Project Root
│
├── packages-v1/
│   │
│   ├── langgraph-agent/                    # Core LangGraph agent implementation
│   │   ├── src/
│   │   │   ├── azure/                      # Azure service integrations
│   │   │   │   ├── azure-credential.ts     # Centralized auth with DefaultAzureCredential
│   │   │   │   ├── embeddings.ts           # Azure OpenAI embeddings + PDF loading + rate limiting
│   │   │   │   ├── llm.ts                  # Azure OpenAI chat completion (key-based & passwordless)
│   │   │   │   └── vector_store.ts         # Azure AI Search vector store + indexing + similarity search
│   │   │   │
│   │   │   ├── langchain/                  # LangChain agent logic
│   │   │   │   ├── node_get_answer.ts      # RAG: retrieves docs + generates answers
│   │   │   │   ├── node_requires_hr_documents.ts  # Determines if HR docs needed
│   │   │   │   ├── nodes.ts                # LangGraph node definitions + state management
│   │   │   │   └── prompt.ts               # System prompts + conversation templates
│   │   │   │
│   │   │   └── scripts/                    # Utility scripts
│   │   │       └── load_vector_store.ts    # Uploads PDFs to Azure AI Search
│   │   │
│   │   └── data/                           # Source documents (PDFs) for vector store
│   │
│   └── server-api/                         # Fastify REST API server
│       └── src/
│           └── server.ts                   # HTTP server with /answer endpoint
│
├── infra/                                  # Infrastructure as Code
│   └── main.bicep                          # Azure resources: Container Apps, OpenAI, AI Search, ACR, managed identity
│
├── azure.yaml                              # Azure Developer CLI config + deployment hooks
├── Dockerfile                              # Multi-stage Docker build for containerized deployment
└── package.json                            # Workspace configuration + build scripts
```


**Key architectural decisions:**
- **Monorepo structure**: [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) allow shared dependencies and linked packages
- **Separation of concerns**: Agent logic (`langgraph-agent`) is independent from API server (`server-api`)
- **Centralized authentication**: Files in `./langgraph-agent/src/azure` handle both key-based and passwordless auth and Azure service integration

### Authentication to Azure Services

The application supports both key-based and passwordless authentication methods, controlled by the `SET_PASSWORDLESS` environment variable. The [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) from the [Azure Identity SDK](/javascript/api/overview/azure/identity-readme) is used for passwordless authentication, allowing the application to run seamlessly in local development and Azure environments. You can see this authentication in the following [code snippet](https://github.com/Azure-Samples/azure-typescript-langchainjs/tree/main/packages-v1/langgraph-agent/src/azure/azure-credential.ts):

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages-v1/langgraph-agent/src/azure/azure-credential.ts":::

When using third-party SDKs like LangChain.js or the OpenAI SDK to access Azure OpenAI, you need a **token provider function** instead of passing a credential object directly. The [`getBearerTokenProvider`](/javascript/api/@azure/identity/#@azure-identity-getbearertokenprovider) function from `@azure/identity` solves this problem by creating a token provider that automatically fetches and refreshes OAuth 2.0 bearer tokens for a specific Azure resource scope (for example, `"https://cognitiveservices.azure.com/.default"`). You configure the scope once during setup, and the token provider handles all token management automatically. This approach works with any `@azure/identity` credential type, including managed identity and Azure CLI credentials. While Azure SDKs accept `DefaultAzureCredential` directly, third-party SDKs like LangChain.js require this token provider pattern to bridge the authentication gap.

### Azure AI Search integration

The Azure AI Search resource stores document embeddings and enables semantic search for relevant content. The application uses LangChain's `AzureAISearchVectorStore` to manage the vector store without you having to define the index schema.

The vector store is created with configuration for both admin (write) and query (read) operations so that document loading and querying can use different configurations. This is important whether you are using keys or passwordless authentication with managed identities.

The Azure Developer CLI deployment includes a post-deployment hook that uploads the documents to the vector store with LangChain.js PDF loader and embedding client. This post-deployment hook is the last step of the `azd up` command after the Azure AI Search resource is created. The document loading script uses batching and retry logic to handle service rate limits. 

:::code language="typescript" source="~/../azure-typescript-langchainjs/azure.yaml" range="130-157":::

Use the root `.env` file is created by the Azure Developer CLI, you can authenticate to the Azure AI Search resource and create the **AzureAISearchVectorStore** client:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages-v1/langgraph-agent/src/azure/vector_store.ts" id="AZURE_AI_SEARCH_AUTH":::

When you query, the vector store converts the user's query into an embedding, searches for documents with similar vector representations, and returns the most relevant chunks. 

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages-v1/langgraph-agent/src/azure/vector_store.ts" id="AI_SEARCH_QUERY_FUNCTIONS":::

Because the vector store is built on top of LangChain.js, it abstracts away the complexity of directly interacting with the vector store. Once you learn the LangChain.js vector store interface, you can easily switch to other vector store implementations in the future.

### Azure OpenAI integration

The application uses Azure OpenAI for both embeddings and large language model (LLM) capabilities. The `AzureOpenAIEmbeddings` class from LangChain.js is used to generate embeddings for documents and queries. Once you create the embeddings client, LangChain.js uses it to create the embeddings.

### Azure OpenAI integration for embeddings

Use the root `.env` file created by the Azure Developer CLI to authenticate to the Azure OpenAI resource and create the **AzureOpenAIEmbeddings** client:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages-v1/langgraph-agent/src/azure/embeddings.ts" id="AZURE_OPENAI_EMBEDDINGS_AUTH":::

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages-v1/langgraph-agent/src/azure/embeddings.ts" id="AZURE_OPENAI_EMBEDDINGS_FUNCTION":::

### Azure OpenAI integration for LLM

Use the root `.env` file created by the Azure Developer CLI to authenticate to the Azure OpenAI resource and create the **AzureChatOpenAI** client:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages-v1/langgraph-agent/src/azure/llm.ts" id="AZURE_OPENAI_LLM_AUTH":::

The application uses the `AzureChatOpenAI` class from LangChain.js `@langchain/openai` to interact with Azure OpenAI models. 

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages-v1/langgraph-agent/src/azure/llm.ts" id="AZURE_OPENAI_CHAT_FUNCTION":::

## LangGraph agent workflow

The agent uses LangGraph to define a decision workflow that determines whether a question can be answered using HR documents.

**Graph structure**:

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages-v1/langgraph-agent/src/graph.ts" :::


The workflow consists of the following steps:

- **Start**: User submits a question.
- **requires_hr_documents node**: LLM determines if the question is answerable from general HR documents.
- **Conditional routing**: 
   - If yes, then proceeds to `get_answer` node.
   - If no, then returns message that question requires personal HR data.
- **get_answer node**: Retrieves documents and generates answer.
- **End**: Returns answer to user.

This relevance check is important because not all HR questions can be answered from general documents. Personal questions like "How much PTO do I have?" require access to employee databases that contain individual employee data. By checking relevance first, the agent avoids hallucinating answers for questions that need personal information it doesn't have access to.

### Decide if the question requires HR documents

The `requires_hr_documents` node uses an LLM to determine if the user's question can be answered using general HR documents. It uses a prompt template that instructs the model to respond with `YES` or `NO` based on the question's relevance. It returns the answer in a structured message, which can be passed along the workflow. The next node uses this response to route the workflow to either the `END` or the `ANSWER_NODE`.

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages-v1/langgraph-agent/src/langchain/node_requires_hr_documents.ts":::

### Get the required HR documents

Once it is determined that the question requires HR documents, the workflow uses `getAnswer` to retrieve the relevant documents from the vector store, add them to the _context_ of the prompt and pass the entire prompt to the LLM. 

:::code language="typescript" source="~/../azure-typescript-langchainjs/packages-v1/langgraph-agent/src/langchain/node_get_answer.ts":::

If no relevant documents are found, the agent returns a message indicating that it couldn't find an answer in the HR documents.

## Troubleshooting

For any issues with the procedure, create an issue on the [sample code repository](https://github.com/Azure-Samples/azure-typescript-langchainjs/issues)

## Clean up resources

You can delete the resource group, which holds the Azure AI Search resource and the Azure OpenAI resource or use the Azure Developer CLI to immediately delete all resources created by this tutorial.

```console
azd down --purge
```

## Related content

* [Get started with Serverless AI Chat with RAG using LangChain.js](./get-started-app-chat-template-langchainjs.md)

