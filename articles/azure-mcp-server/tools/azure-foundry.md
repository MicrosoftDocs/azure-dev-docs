---
title: Azure AI Foundry Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure AI Foundry to manage your AI models and deployments.
keywords: azure mcp server, azmcp, azure ai foundry, ai models, model deployment
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 11/07/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Azure AI Foundry tools for the Azure MCP Server

The Azure MCP Server enables you to manage Azure resources, including Azure AI Foundry models and deployments, with natural language prompts. This capability helps you quickly manage your AI models without needing to remember complex syntax.

[Azure AI Foundry](/azure/ai-foundry/) is a platform for deploying and managing custom AI models in Azure. It provides tools and services for training, fine-tuning, deploying, and monitoring AI models in production environments. With Azure AI Foundry, you can more easily incorporate AI capabilities into your applications.

When connecting to your Azure AI Foundry resource, the Azure MCP Server requires either the **endpoint** or the **resource group** of your Azure AI Foundry resource. For operations that don't require a specific resource, such as listing available models, neither the endpoint or resource group is required.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Agents: Connect and run

<!-- `azmcp foundry agents connect` -->

Connect to a specific Azure AI Agent and run a query. This command returns the agent's response along with thread and run IDs for potential evaluation.

Example prompts include: 

- **Connect to agent**: "Connect to agent 'support-bot' and ask about ticket status"
- **Query specific agent**: "Ask agent 'sales-bot' for the latest sales report"
- **Use context**: "Connect to agent 'hr-bot' with context from the last conversation"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent** |  Required | The ID of the agent to interact with. |
| **Query** |  Required | The query sent to the agent. |
| **Endpoint** |  Required | The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>`. |

Destructive: &#10060; | Idempotent: &#10060; | Open World: &#9989; | Read Only: &#10060; | Secret: &#10060; | Local Required: &#10060;

## Agents: Create a new agent

<!-- azmcp foundry agents create -->

Creates an AI Foundry Agent that processes messages according to a given system instruction using an existing AI Foundry model deployment.

Example prompts include:

- **Create customer support agent**: "Create an agent named 'customer-support-bot' using deployment 'gpt-4' at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/support-project' with system instruction 'You are a helpful customer support agent who assists with product inquiries and troubleshooting'"
- **Create sales assistant**: "Set up an agent called 'sales-assistant' with model deployment 'gpt-35-turbo' at 'https://my-example-resource.services.ai.azure.com/api/projects/sales' that follows the instruction 'You are a sales assistant who helps customers find products and provides pricing information'"
- **Create HR chatbot**: "Build an agent named 'hr-onboarding-bot' using deployment 'gpt-4-turbo' at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/hr-dept' with instruction 'You are an HR specialist who guides new employees through the onboarding process and answers policy questions'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>`. |
| **Model deployment** |  Required | Name of the model deployment. |
| **Agent name** |  Required | A human-readable name of the Agent. |
| **System instruction** |  Required | System instruction for the agent to follow when process messages. |

Destructive: &#10060; | Idempotent: &#10060; | Open World: &#10060; | Read Only: &#10060; | Secret: &#10060; | Local Required: &#10060;

## Agents: Evaluate an agent


<!-- azmcp foundry agents evaluate -->

Run agent evaluation on agent data. Requires JSON strings for query, response, and tool definitions.

Example prompts include:

- **Evaluate task adherence**: "Evaluate the full query and response I got from my agent for task_adherence"
- **Check intent resolution**: "Evaluate my agent's response for intent_resolution using the query about pricing plans"
- **Verify tool accuracy**: "Analyze the tool_call_accuracy of my sales-bot's response to the customer inquiry"
- **Assess agent performance**: "Evaluate my support agent's response to the technical issue query using task_adherence"
- **Comprehensive evaluation**: "Run an evaluation on my HR agent's handling of the employee onboarding query with all the response data"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Query** |  Required | The query sent to the agent. |
| **Evaluator** |  Required | The name of the evaluator to use (`intent_resolution`, `tool_call_accuracy`, `task_adherence`). |
| **Response** |  Optional | The response from the agent. |
| **Tool Definitions** |  Optional | Optional tool definitions made by the agent in JSON format. |
| **Endpoint** |  Required |  The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>`. |
| **Azure OpenAI Deployment** |  Required | The deployment name for the Azure OpenAI model to be used in evaluation. |

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## Agents: Get agent sample for language SDK

<!-- azmcp foundry agents get-sdk-sample -->

Get code samples to interact with a Foundry Agent using AI Foundry SDK and programming language of your choice.

Example prompts include: 

- **Get Python sample**: "Show me a Python code sample for interacting with a Foundry Agent"
- **Get C# sample**: "Generate a csharp code example to work with my AI Foundry agent"
- **Get TypeScript sample**: "Provide a typescript sample code for connecting to and using a Foundry Agent"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Programming language** |  Required | The programming language of the sdk for interacting with a Foundry Agent. Supported values are `csharp`, `python` and `typescript`. |

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## Agents: List agents

<!-- azmcp foundry agents list -->


List all Azure AI Agents in an Azure AI Foundry project. Shows agents that can be used for AI workflows, evaluations, and interactive tasks. 

Example prompts include:

- **View all agents**: "Show me all agents in Azure AI Foundry"
- **List by project**: "List all AI agents in my 'customer-service' project"
- **Check available agents**: "What agents do I have configured in my Azure AI Foundry account?"
- **Agent inventory**: "I need a complete list of all the agents in my Azure AI environment"
- **Find specific agents**: "Show me all chatbot agents available in my Azure AI Foundry resource"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>`.|

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## Agents: Query and execute an agent

<!-- azmcp foundry agents query-and-evaluate -->

Query an agent and evaluate its response in a single operation. This command returns both the agent response and evaluation results.

Example prompts include:

- **Query and evaluate**: "Query agent 'support-bot' about ticket status and evaluate task adherence"
- **Single operation**: "Ask agent 'sales-bot' for the latest sales report and check intent resolution"
- **Combined action**: "Connect to agent 'hr-bot', ask about onboarding, and evaluate tool call accuracy"
- **Full cycle**: "Query 'marketing-bot' for campaign ideas and evaluate the response for task adherence"
- **End-to-end check**: "Ask 'devops-bot' about deployment status and evaluate intent resolution"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Agent ID** |  Required | The ID of the agent to interact with. |
| **Query** |  Required | The query sent to the agent. |
| **Endpoint** |  Required | The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>` |
| **Evaluators** |  Optional | The list of evaluators to use for evaluation, separated by commas. If not specified, all evaluators are used. |
| **Azure OpenAI Endpoint** |  Required | The endpoint URL for the Azure OpenAI service to be used in evaluation. |
| **Azure OpenAI Deployment** |  Required | The deployment name for the Azure OpenAI model.|

Destructive: &#10060; | Idempotent: &#10060; | Open World: &#9989; | Read Only: &#10060; | Secret: &#10060; | Local Required: &#10060;

## Knowledge: List knowledge indexes

<!-- foundry knowledge index list -->

Get a list of knowledge indexes from Azure AI Foundry:

- Find knowledge indexes created within Azure AI Foundry projects.
- Use these indexes with AI agents for knowledge retrieval and RAG applications.
- The list updates as you create new indexes or update existing ones.

Example prompts include: 

- **View all indexes**: "Show me all knowledge indexes in Azure AI Foundry"
- **Filter by project**: "List knowledge indexes in the 'support-bot' project"
- **Search by name**: "Find the knowledge index named 'product-faqs'"
- **Filter by tag**: "List knowledge indexes tagged with 'security' or 'onboarding'"
- **Show index details**: "Show details for the 'customer-service' knowledge index, including document count and last updated date"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>`|

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## Knowledge: Get index schema

<!-- foundry knowledge index schema -->

Get the detailed schema configuration of a specific knowledge index from Azure AI Foundry.

This operation shows you comprehensive information about the structure and configuration of a knowledge index, including field definitions, data types, searchable attributes, and other schema properties. Use this schema information to understand how the index structures and indexes your data for searching.


Example prompts include:
- **View index schema**: "Show me the schema for the knowledge index 'product-facts'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>` |
| **Index** |  Required | The name of the knowledge index. |

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## Models: List available models

<!-- azmcp foundry models list -->

List all available Azure OpenAI models and deployments in an AI Foundry resource. This tool retrieves information about Azure OpenAI models deployed in your AI Foundry resource including model names, versions, capabilities, and deployment status.

Example prompts include:

- **View all models**: "Show me all available AI models in Azure AI Foundry"
- **Filter by free usage**: "List all free models available for prototyping in Azure AI Foundry that I can use in the playground"
- **Filter by free usage**: "List all free models available for prototyping in Azure AI Foundry"
- **Filter by publisher**: "Show me models published by Microsoft in Azure AI Foundry"
- **Filter by license**: "What models with Apache license are available in Azure AI Foundry?"
- **Search by name**: "Find the llama model in Azure AI Foundry"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Search for free playground** | Optional | If set to true, returns a list of models from Azure AI Foundry that you can also use with GitHub inference endpoint and GitHub PAT token. If false, returns a list of models from Azure AI Foundry, regardless of GitHub support. To learn more, see [GitHub Models](https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models#experimenting-with-ai-models-in-the-playground).|
| **Publisher** | Optional | A filter to specify the publisher of the models to retrieve. |
| **License** | Optional | A filter to specify the license type of the models to retrieve. |
| **Model** | Optional | The name of the model to search for. |

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## Models: Deploy a model

<!-- azmcp foundry models deploy -->

Deploy an AI model to your Azure environment. Use this command to deploy selected models from Azure AI Foundry and make them available for use in your applications.

Example prompts include:

- **Deploy with required parameters**: "Deploy GPT-4 model in OpenAI format to my ai-services account in ai-projects resource group with subscription dev-subscription"
- **Specify deployment name**: "Set up a deployment named text-embedding for the Ada embedding model in my AI services account with Standard SKU"
- **Include model version**: "Deploy version 2 of Llama model from Meta to my Azure AI services account with scale capacity of 3"
- **Deploy to specific resource group**: "Create a deployment named content-generation with GPT-4 model in my ai-central service in resource group ml-experiments"
- **Configure scaling**: "Deploy Claude model to my Azure AI service with autoscaling enabled and maximum capacity of 5"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Deployment** | Required | The name of the Azure AI Foundry model deployment. |
| **Model** | Required | The name of the model to deploy. |
| **Model format** | Required | The format of the model (for example, `OpenAI`, `Meta`, `Microsoft`). |
| **Azure AI services** | Required | The name of the Azure AI services account to deploy to. |
| **Resource group** | Required | The name of the Azure resource group where the model will be deployed. |
| **Model version** | Optional | The version of the model to deploy. |
| **Model source** | Optional | The source of the model. |
| **Scale type** | Optional | The scale type for the deployment. |
| **Scale capacity** | Optional | The scale capacity for the deployment. |
| **SKU** | Optional | The SKU name for the deployment. |
| **SKU capacity** | Optional | The SKU capacity for the deployment. |


Destructive: &#9989; | Idempotent: &#10060; | Open World: &#10060; | Read Only: &#10060; | Secret: &#10060; | Local Required: &#10060;

## Models: List model deployments

<!-- azmcp foundry models deployments list -->

List model deployments in an Azure AI Foundry (Cognitive Services) project. Shows currently deployed AI models at the project level.

Example prompts include:

- **List deployments on production**: "Show me all model deployments on my https://my-example-resource.openai.azure.com endpoint"
- **Check specific endpoint**: "What models are currently deployed to the https://my-example-resource.openai.azure.com endpoint?"
- **View regional deployments**: "List all deployments in my https://my-example-resource.openai.azure.com endpoint"
- **Check deployment status**: "Show me the status of all models deployed to our https://my-example-resource.openai.azure.com endpoint"
- **See active models**: "What AI models are running on our https://my-example-resource.openai.azure.com endpoint right now?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Endpoint** | Required |The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>` |

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## OpenAI: Create chat completions

<!-- azmcp foundry openai chat-completions-create -->

 Create chat completions using Azure OpenAI in AI Foundry. Send messages to Azure OpenAI chat models deployed in your AI Foundry resource and receive AI-generated conversational responses. Supports multi-turn conversations with message history, system instructions, and response customization.

Example prompts include:

- **Simple greeting**: "Create a chat completion with the message 'Hello, how are you today?'"
- **With system message**: "Create a chat completion with system message 'You are a helpful assistant' and user message 'Explain quantum computing' using deployment 'gpt-35-turbo' on resource 'openai-west'"
- **Control creativity**: "Generate a chat completion for 'Write a creative story' using deployment 'gpt-4' with temperature 0.8 and max 150 tokens on resource 'ai-central'"
- **Deterministic response**: "Create chat completion with message 'List 5 facts about Mars' using deployment 'gpt-35-turbo' with temperature 0.1 and seed 12345 on resource 'ai-services-prod'"
- **Conversation with history**: "Continue chat completion with messages: system 'You are a coding assistant', user 'How do I create a function in Python?', assistant 'Here's how...', user 'Can you show an example?' using deployment 'gpt-4' on resource 'dev-openai'"
- **With penalties for repetition**: "Create completion for 'Describe the benefits of cloud computing' using deployment 'gpt-35-turbo' with frequency penalty 0.5 and presence penalty 0.3 on resource 'ai-services-main'"
- **Streaming response**: "Generate streaming chat completion for 'Explain machine learning step by step' using deployment 'gpt-4' with stream true on resource 'openai-research'"
- **With stop sequences**: "Create completion for 'Count from 1 to 10' using deployment 'gpt-35-turbo' with stop sequences ['5', 'STOP'] on resource 'ai-test'"
- **User tracking**: "Generate completion for 'What is Azure AI?' using deployment 'gpt-4' with user identifier 'user-123' on resource 'prod-openai'"
- **Fine-tuned control**: "Create chat completion for 'Summarize this article' using deployment 'gpt-35-turbo' with temperature 0.2, top_p 0.9, max tokens 200, and AAD authentication on resource 'secure-ai'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Required | The name of the Azure OpenAI resource. |
| **Deployment** |  Required | The name of the Azure AI Foundry model deployment. |
| **Message array** |  Required | Array of messages in the conversation (JSON format). Each message should have `role` and `content` properties. |
| **Max tokens** |  Optional | The maximum number of tokens to generate in the completion. |
| **Temperature** |  Optional | Controls randomness in the output. Lower values make it more deterministic. |
| **Top p** |  Optional | Controls diversity via nucleus sampling (0.0 to 1.0). Default is `1.0`. |
| **Frequency penalty** |  Optional | Penalizes new tokens based on their frequency (-2.0 to 2.0). Default is `0`. |
| **Presence penalty** |  Optional | Penalizes new tokens based on presence (-2.0 to 2.0). Default is `0`. |
| **Stop** |  Optional | Up to 4 sequences where the API will stop generating further tokens. |
| **Stream** |  Optional | Whether to stream back partial progress. Default is `false`. |
| **Seed** |  Optional | If specified, the system will make a best effort to sample deterministically. |
| **User** |  Optional | Optional user identifier for tracking and abuse monitoring. |
| **Authentication type** |  Optional | The type of authentication to use. Options are `key` (default) or `aad`. |

Destructive: &#10060; | Idempotent: &#10060; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## OpenAI: Create embeddings

<!-- `azmcp foundry openai embeddings-create` -->

Create embeddings using Azure OpenAI in AI Foundry. Generate vector embeddings from text using Azure OpenAI deployments in your AI Foundry resource for semantic search, similarity comparisons, clustering, or machine learning.

Example prompts include:

- **Basic text embedding**: "Generate embeddings for the text 'Azure OpenAI Service' using my 'text-embedding-ada-002' deployment"
- **Create vector embeddings**: "Create vector embeddings for my text using Azure OpenAI with deployment 'text-embedding-3-large' on resource 'ai-services-prod'"
- **Document embedding**: "Generate embeddings for 'Machine learning revolutionizes data analysis' using deployment 'ada-002' on resource 'embedding-service'"
- **Multiple sentences**: "Create embeddings for the text 'Cloud computing provides scalable infrastructure. It enables global accessibility.' using my embedding deployment"
- **With user tracking**: "Generate embeddings for 'Natural language processing applications' using deployment 'text-embedding-3-small' with user identifier 'analytics-team'"
- **Specific dimensions**: "Create embeddings for 'Artificial intelligence transforms business operations' using deployment 'text-embedding-3-large' with 1536 dimensions on resource 'ai-central'"
- **Base64 format**: "Generate embeddings for 'Deep learning neural networks' using deployment 'ada-002' with base64 encoding format on resource 'ml-services'"
- **Research text**: "Create vector embeddings for 'Quantum computing demonstrates computational advantages in specific algorithms' using my text-embedding deployment"
- **Product description**: "Generate embeddings for 'High-performance laptop with advanced graphics processing unit' using deployment 'text-embedding-3-small' on resource 'product-ai'"
- **Technical documentation**: "Create embeddings for 'API authentication requires valid credentials and proper authorization headers' using deployment 'ada-002' with float encoding on resource 'docs-embedding'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Required | The name of the Azure OpenAI resource. |
| **Deployment** |  Required | The name of the Azure AI Foundry model deployment. |
| **Input text** |  Required | The input text to generate embeddings for. |
| **User** |  Optional | Optional user identifier for tracking and abuse monitoring. |
| **Encoding format** |  Optional | The format to return embeddings in (`float` or `base64`). |
| **Dimensions** |  Optional | The number of dimensions for the embedding output. Only supported in some models. |

Destructive: &#10060; | Idempotent: &#10060; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;    

## OpenAI: Create completions

<!-- azmcp foundry openai create-completion -->

 Create text completions using Azure OpenAI in AI Foundry. Send a prompt or question to Azure OpenAI models deployed in your AI Foundry resource and receive generated text answers. Use this when you need to create completions, get AI-generated content, generate answers to questions, or produce text completions from Azure OpenAI based on any input prompt. Supports customization with temperature and max tokens. 

Example prompts include:

- **Basic completion**: "Create a completion with the prompt 'What is Azure?' using my 'gpt-35-turbo' deployment"
- **With temperature control**: "Generate text completion for 'Explain machine learning' using deployment 'text-davinci-003' with temperature 0.3"
- **Limited tokens**: "Create a completion with prompt 'Write a summary' using my 'gpt-4' deployment with max 100 tokens"
- **Creative writing**: "Generate completion for 'Tell me a story about AI' using deployment 'gpt-35-turbo' with temperature 0.8 and 200 max tokens"
- **Technical explanation**: "Create completion with prompt 'How does cloud computing work?' using my OpenAI resource 'ai-services-east' and deployment 'gpt-4'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group where the AI resource is hosted. |
| **Resource name** |  Required | The name of the Azure OpenAI resource. |
| **Deployment** |  Required | The name of the deployment. |
| **Prompt text** |  Required | The prompt text to send to the completion model. |
| **Max tokens** |  Optional | The maximum number of tokens to generate in the completion. |
| **Temperature** |  Optional | Controls randomness in the output. Lower values make it more deterministic. |

Destructive: &#10060; | Idempotent: &#10060; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## OpenAI: List models and deployments

<!-- `azmcp foundry openai models-list` -->

List all available OpenAI models and deployments in an Azure resource. This tool retrieves information about 
deployed models including model names, versions, capabilities, and deployment status. 

Example prompts include:

- **View all models**: "List all OpenAI models in my 'ai-services-prod' resource"
- **Check deployments**: "Show me all deployed models and their status in resource 'openai-east'"
- **Production inventory**: "What models are available in my 'production-openai' resource?"
- **Development check**: "List all models and deployments in my 'dev-ai-services' resource"
- **Model capabilities**: "Show me all available OpenAI models with their capabilities in resource 'ai-central'"
- **Deployment status**: "What's the current status of all deployments in my 'openai-west' resource?"
- **Regional models**: "List all models available in my 'europe-openai' resource"
- **Service overview**: "Give me a complete overview of models and deployments in resource 'customer-ai'"
- **Model versions**: "Show me all model versions available in my 'ai-services-main' resource"
- **Resource audit**: "I need to audit all OpenAI models and deployments in resource 'enterprise-ai'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Required | The name of the Azure OpenAI resource. |

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## Resources: Get Foundry resource

<!-- azmcp foundry resource get -->

Get detailed information about Azure AI Foundry resources, including endpoint URL, 
location, SKU, and all deployed models with their configuration. If a specific resource name is provided, 
returns details for that resource only. If no resource name is provided, lists all AI Foundry resources 
in the subscription or resource group. 

Example prompts include:

- **Get specific resource**: "Show me details for the 'ai-foundry-prod' Azure AI Foundry resource including all deployed models"
- **List all resources**: "What Azure AI Foundry resources do I have in my subscription?"
- **Resource with configuration**: "Get the endpoint URL, location, and SKU information for my 'customer-ai-foundry' foundry resource"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Optional | The name of the Azure OpenAI resource. |

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## Threads: Create a new thread

<!-- azmcp foundry threads create -->

Creates an AI Foundry agent thread that holds the messages between the Agent and the user.

Example prompts include:

- **Create support thread**: "Create a new thread at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/support-project' with user message 'I need help with my account login'"
- **Start conversation thread**: "Create a thread at 'https://my-example-resource.services.ai.azure.com/api/projects/customer-service' with message 'What are your business hours?'"
- **Initialize chat thread**: "Start a new thread at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/sales-bot' with the user message 'I'm interested in purchasing your premium plan'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>`. |
| **User message** |  Required | The user message to add to the thread. |

Destructive: &#10060; | Idempotent: &#10060; | Open World: &#10060; | Read Only: &#10060; | Secret: &#10060; | Local Required: &#10060;

## Threads: Get thread messages

<!-- azmcpfoundry threads get-messages -->

Get messages in an AI Foundry agent thread.

Example prompts include:

- **Retrieve conversation history**: "Get all messages from thread 'thread_abc123xyz' at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/support-project'"
- **View thread messages**: "Show me the messages in thread 'thread_456def789' from endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/customer-service'"
- **Check thread content**: "Retrieve messages for thread ID 'thread_xyz789abc' at 'https://my-example-resource.services.ai.azure.com/api/projects/sales-bot'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>`. |
| **Thread ID** |  Required | The Foundry Agent Thread ID. |

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## Threads: List all threads

<!-- azmcp foundry threads list -->

List AI Foundry agent threads.

Example prompts include:

- **List all threads**: "Show me all agent threads at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/support-project'"
- **View project threads**: "List all threads from 'https://my-example-resource.services.ai.azure.com/api/projects/customer-service'"
- **Get thread inventory**: "Retrieve all agent threads at 'https://my-example-resource.services.ai.azure.com/api/projects/sales-bot'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Azure AI Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>`. |

Destructive: &#10060; | Idempotent: &#9989; | Open World: &#10060; | Read Only: &#9989; | Secret: &#10060; | Local Required: &#10060;

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure AI Foundry documentation](/azure/ai-foundry/)
- [Azure AI Services overview](/azure/ai-services/)
- [Deploy and consume models](/azure/ai-foundry/concepts/deployments-overview)