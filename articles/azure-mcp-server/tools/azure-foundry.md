---
title: Azure MCP Server Tools for Microsoft Foundry Extensions
description: Use Azure MCP Server tools with natural language prompts or Azure MCP CLI commands to manage Microsoft Foundry Extensions resources such as chat completions, text completions, embeddings, and models.
author: diberry
ms.author: diberry
ms.reviewer: zhoujay, xiangyan
ms.date: 08/24/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom: msecd-doc-authoring-1013
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 7
mcp-cli.version: "3.0.0-beta.37+19951caeceada3430e56e2487379817219a98df5"
---

# Azure MCP Server tools for Microsoft Foundry Extensions

The Azure MCP Server lets you manage Microsoft Foundry Extensions resources, including creating chat and text completions, generating embeddings, listing models, and working with knowledge indexes, with natural language prompts.

[Microsoft Foundry](/azure/ai-foundry/) is a platform for deploying and managing custom AI models in Azure. It provides tools and services for training, fine-tuning, deploying, and monitoring AI models in production environments.

Knowledge index commands require the endpoint of your Microsoft Foundry project. OpenAI commands require the resource name and resource group. The resource get command can list resources without providing a resource name.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Knowledge: List knowledge indexes

Get a list of knowledge indexes from Foundry:

- Find knowledge indexes created within Foundry projects.
- Use these indexes with AI agents for knowledge retrieval and RAG applications.
- The list updates as you create new indexes or update existing ones.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp foundryextensions knowledge index list \
  --endpoint <endpoint>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `endpoint` | string | Yes | The endpoint URL for the Microsoft Foundry project or service. The endpoint follows this pattern: `https://<foundry-resource-name>.services.ai.azure.com/api/projects/<project-name>`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli foundryextensions knowledge index list -->

Example prompts include: 

- **View all indexes**: "Show me all knowledge indexes at endpoint `https://my-example-resource.services.ai.azure.com/api/projects/my-project`"
- **Filter by project**: "List knowledge indexes at endpoint `https://my-example-resource.services.ai.azure.com/api/projects/support-bot`"
- **Search by name**: "Find the knowledge index named `product-faqs` at endpoint `https://my-example-resource.services.ai.azure.com/api/projects/my-project`"
- **Filter by tag**: "List knowledge indexes tagged with `security` at endpoint `https://my-example-resource.services.ai.azure.com/api/projects/my-project`"
- **Show index details**: "Show details for the `customer-service` knowledge index at endpoint `https://my-example-resource.services.ai.azure.com/api/projects/my-project`"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Microsoft Foundry project or service. The endpoint follows this pattern: `https://<foundry-resource-name>.services.ai.azure.com/api/projects/<project-name>`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Knowledge: Get index schema

Get the detailed schema configuration of a specific knowledge index from Foundry.

This operation shows you comprehensive information about the structure and configuration of a knowledge index, including field definitions, data types, searchable attributes, and other schema properties. Use this schema information to understand how the index structures and indexes your data for searching.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp foundryextensions knowledge index schema \
  --index <index> \
  --endpoint <endpoint>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `index` | string | Yes | The name of the knowledge index. |
| `endpoint` | string | Yes | The endpoint URL for the Microsoft Foundry project or service. The endpoint follows this pattern: `https://<foundry-resource-name>.services.ai.azure.com/api/projects/<project-name>`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli foundryextensions knowledge index schema -->

Example prompts include:
- **View index schema**: "Show me the schema for knowledge index `product-facts` at endpoint `https://my-example-resource.services.ai.azure.com/api/projects/my-project`"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Index** |  Required | The name of the knowledge index. |
| **Endpoint** |  Required | The endpoint URL for the Microsoft Foundry project or service. The endpoint follows this pattern: `https://<foundry-resource-name>.services.ai.azure.com/api/projects/<project-name>`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## OpenAI: Create chat completions

 Create chat completions by using Azure OpenAI in Foundry. Send messages to Azure OpenAI chat models deployed in your Foundry resource and receive AI-generated conversational responses. Supports multi-turn conversations with message history, system instructions, and response customization.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp foundryextensions openai chat-completions-create \
  --resource-name <resource-name> \
  --deployment <deployment> \
  --message-array <message-array> \
  --resource-group <resource-group> \
  [--max-tokens <max-tokens>] \
  [--temperature <temperature>] \
  [--top-p <top-p>] \
  [--frequency-penalty <frequency-penalty>] \
  [--presence-penalty <presence-penalty>] \
  [--stop <stop>] \
  [--stream <stream>] \
  [--seed <seed>] \
  [--user <user>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-name` | string | Yes | The name of the Microsoft Foundry resource. |
| `deployment` | string | Yes | The name of the deployment. |
| `message-array` | string | Yes | JSON array of messages in the conversation. Each message should have `role` and `content` properties. |
| `resource-group` | string | Yes | The Azure resource group name. |
| `max-tokens` | string | No | The maximum number of tokens to generate in the completion. |
| `temperature` | string | No | Controls randomness in the output. Lower values make it more deterministic. |
| `top-p` | string | No | Controls diversity via nucleus sampling (0.0 to 1.0). Default is 1.0. |
| `frequency-penalty` | string | No | Penalizes new tokens based on their frequency (-2.0 to 2.0). Default is 0. |
| `presence-penalty` | string | No | Penalizes new tokens based on presence (-2.0 to 2.0). Default is 0. |
| `stop` | string | No | Up to 4 sequences where the API stops generating further tokens. |
| `stream` | string | No | Whether to stream back partial progress. Default is false. |
| `seed` | string | No | If specified, the system makes a best effort to sample deterministically. |
| `user` | string | No | User identifier for tracking and abuse monitoring. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli foundryextensions openai chat-completions-create -->

Example prompts include:

- **Simple greeting**: "Create a chat completion with message array `[{"role":"user","content":"Hello, how are you today?"}]` using deployment `gpt-35-turbo` on resource `openai-prod`"
- **With system message**: "Create a chat completion with system message `You are a helpful assistant` and user message `Explain quantum computing` using deployment `gpt-35-turbo` on resource `openai-west`"
- **Control creativity**: "Generate a chat completion for `Write a creative story` using deployment `gpt-4` with temperature 0.8 and max 150 tokens on resource `ai-central`"
- **Deterministic response**: "Create chat completion with message `List 5 facts about Mars` using deployment `gpt-35-turbo` with temperature 0.1 and seed 12345 on resource `ai-services-prod`"
- **Conversation with history**: "Continue chat completion with messages: system `You are a coding assistant`, user `How do I create a function in Python?`, assistant `Here's how...`, user `Can you show an example?` using deployment `gpt-4` on resource `dev-openai`"
- **With penalties for repetition**: "Create completion for `Describe the benefits of cloud computing` using deployment `gpt-35-turbo` with frequency penalty 0.5 and presence penalty 0.3 on resource `ai-services-main`"
- **Streaming response**: "Generate streaming chat completion for `Explain machine learning step by step` using deployment `gpt-4` with stream true on resource `openai-research`"
- **With stop sequences**: "Create completion for `Count from 1 to 10` using deployment `gpt-35-turbo` with stop sequences `['5', 'STOP']` on resource `ai-test`"
- **User tracking**: "Generate completion for `What is Azure AI?` using deployment `gpt-4` with user identifier `user-123` on resource `prod-openai`"
- **Fine-tuned control**: "Create chat completion for `Summarize this article` using deployment `gpt-35-turbo` with temperature 0.2, top_p 0.9, max tokens 200, and AAD authentication on resource `secure-ai`"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Required | The name of the Microsoft Foundry resource. |
| **Deployment** |  Required | The name of the Foundry model deployment. |
| **Message array** |  Required | JSON array of messages in the conversation. Each message should have `role` and `content` properties. |
| **Resource group** |  Required | The Azure resource group name. |
| **Max tokens** |  Optional | The maximum number of tokens to generate in the completion. |
| **Temperature** |  Optional | Controls randomness in the output. Lower values make it more deterministic. |
| **Top p** |  Optional | Controls diversity via nucleus sampling (0.0 to 1.0). Default is `1.0`. |
| **Frequency penalty** |  Optional | Penalizes new tokens based on their frequency (-2.0 to 2.0). Default is `0`. |
| **Presence penalty** |  Optional | Penalizes new tokens based on presence (-2.0 to 2.0). Default is `0`. |
| **Stop** |  Optional | Up to 4 sequences where the API will stop generating further tokens. |
| **Stream** |  Optional | Whether to stream back partial progress. Default is `false`. |
| **Seed** |  Optional | If specified, the system will make a best effort to sample deterministically. |
| **User** |  Optional | User identifier for tracking and abuse monitoring. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

## OpenAI: Create embeddings

Create embeddings using Azure OpenAI in Foundry. Generate vector embeddings from text using Azure OpenAI deployments in your Foundry resource for semantic search, similarity comparisons, clustering, or machine learning.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp foundryextensions openai embeddings-create \
  --resource-name <resource-name> \
  --deployment <deployment> \
  --input-text <input-text> \
  --resource-group <resource-group> \
  [--user <user>] \
  [--encoding-format <encoding-format>] \
  [--dimensions <dimensions>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-name` | string | Yes | The name of the Microsoft Foundry resource. |
| `deployment` | string | Yes | The name of the deployment. |
| `input-text` | string | Yes | The input text to generate embeddings for. |
| `resource-group` | string | Yes | The Azure resource group name. |
| `user` | string | No | User identifier for tracking and abuse monitoring. |
| `encoding-format` | string | No | The format to return embeddings in (float or base64). |
| `dimensions` | string | No | The number of dimensions for the embedding output. Only supported in some models. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli foundryextensions openai embeddings-create -->

Example prompts include:

- **Basic text embedding**: "Generate embeddings for the text `Azure OpenAI Service` by using my `text-embedding-ada-002` deployment in resource group `my-resource-group`."
- **Create vector embeddings**: "Create vector embeddings for my text by using Azure OpenAI with deployment `text-embedding-3-large` on resource `ai-services-prod` in resource group `my-resource-group`."
- **Document embedding**: "Generate embeddings for `Machine learning revolutionizes data analysis` by using deployment `ada-002` on resource `embedding-service` in resource group `my-resource-group`."
- **Multiple sentences**: "Create embeddings for the text `Cloud computing provides scalable infrastructure. It enables global accessibility.` by using my embedding deployment in resource group `my-resource-group`."
- **With user tracking**: "Generate embeddings for `Natural language processing applications` by using deployment `text-embedding-3-small` with user identifier `analytics-team` in resource group `my-resource-group`."
- **Specific dimensions**: "Create embeddings for `Artificial intelligence transforms business operations` by using deployment `text-embedding-3-large` with 1536 dimensions on resource `ai-central` in resource group `my-resource-group`."
- **Base64 format**: "Generate embeddings for `Deep learning neural networks` by using deployment `ada-002` with base64 encoding format on resource `ml-services` in resource group `my-resource-group`."
- **Research text**: "Create vector embeddings for `Quantum computing demonstrates computational advantages in specific algorithms` by using my text-embedding deployment in resource group `my-resource-group`."
- **Product description**: "Generate embeddings for `High-performance laptop with advanced graphics processing unit` by using deployment `text-embedding-3-small` on resource `product-ai` in resource group `my-resource-group`."
- **Technical documentation**: "Create embeddings for `API authentication requires valid credentials and proper authorization headers` by using deployment `ada-002` with float encoding on resource `docs-embedding` in resource group `my-resource-group`."


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Required | The name of the Microsoft Foundry resource. |
| **Deployment** |  Required | The name of the Foundry model deployment. |
| **Input text** |  Required | The input text to generate embeddings for. |
| **Resource group** |  Required | The Azure resource group name. |
| **User** |  Optional | User identifier for tracking and abuse monitoring. |
| **Encoding format** |  Optional | The format to return embeddings in (`float` or `base64`). |
| **Dimensions** |  Optional | The number of dimensions for the embedding output. Only supported in some models. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

## OpenAI: Create completions

 Create text completions by using Azure OpenAI in Foundry. Send a prompt or question to Azure OpenAI models deployed in your Foundry resource and receive generated text answers. Use this feature when you need to create completions, get AI-generated content, generate answers to questions, or produce text completions from Azure OpenAI based on any input prompt. Supports customization with temperature and max tokens. 

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp foundryextensions openai create-completion \
  --deployment <deployment> \
  --prompt-text <prompt-text> \
  --resource-name <resource-name> \
  --resource-group <resource-group> \
  [--max-tokens <max-tokens>] \
  [--temperature <temperature>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `deployment` | string | Yes | The name of the deployment. |
| `prompt-text` | string | Yes | The prompt text to send to the completion model. |
| `resource-name` | string | Yes | The name of the Microsoft Foundry resource. |
| `resource-group` | string | Yes | The Azure resource group name. |
| `max-tokens` | string | No | The maximum number of tokens to generate in the completion. |
| `temperature` | string | No | Controls randomness in the output. Lower values make it more deterministic. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli foundryextensions openai create-completion -->

Example prompts include:

- **Basic completion**: "Create a completion with the prompt `What is Azure?` using my `gpt-35-turbo` deployment in resource group `my-resource-group`"
- **With temperature control**: "Generate text completion for `Explain machine learning` using deployment `text-davinci-003` with temperature 0.3 in resource group `my-resource-group`"
- **Limited tokens**: "Create a completion with prompt `Write a summary` using my `gpt-4` deployment with max 100 tokens in resource group `my-resource-group`"
- **Creative writing**: "Generate completion for `Tell me a story about AI` using deployment `gpt-35-turbo` with temperature 0.8 and 200 max tokens in resource group `my-resource-group`"
- **Technical explanation**: "Create completion with prompt `How does cloud computing work?` using my OpenAI resource `ai-services-east` and deployment `gpt-4` in resource group `my-resource-group`"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Deployment** |  Required | The name of the deployment. |
| **Prompt text** |  Required | The prompt text to send to the completion model. |
| **Resource name** |  Required | The name of the Microsoft Foundry resource. |
| **Resource group** |  Required | The Azure resource group name. |
| **Max tokens** |  Optional | The maximum number of tokens to generate in the completion. |
| **Temperature** |  Optional | Controls randomness in the output. Lower values make it more deterministic. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

## OpenAI: List models and deployments

List Azure OpenAI model deployments in a Microsoft Foundry resource. This tool retrieves information about
deployed models including model names, versions, capabilities, and deployment status.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp foundryextensions openai models-list \
  --resource-name <resource-name> \
  --resource-group <resource-group>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-name` | string | Yes | The name of the Microsoft Foundry resource. |
| `resource-group` | string | Yes | The Azure resource group name. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli foundryextensions openai models-list -->

Example prompts include:

- **View all models**: "List all deployed OpenAI models in my `ai-services-prod` resource in resource group `my-resource-group`."
- **Check deployments**: "Show me all deployed models and their status in resource `openai-east` in resource group `my-resource-group`."
- **Production inventory**: "What models are deployed in my `production-openai` resource in resource group `my-resource-group`?"
- **Development check**: "List all model deployments in my `dev-ai-services` resource in resource group `my-resource-group`."
- **Model capabilities**: "Show me all deployed OpenAI models with their capabilities in resource `ai-central` in resource group `my-resource-group`."
- **Deployment status**: "What's the current status of all deployments in my `openai-west` resource in resource group `my-resource-group`?"
- **Regional models**: "List all models deployed in my `europe-openai` resource in resource group `my-resource-group`."
- **Service overview**: "Give me a complete overview of model deployments in resource `customer-ai` in resource group `my-resource-group`."
- **Model versions**: "Show me all deployed model versions in my `ai-services-main` resource in resource group `my-resource-group`."
- **Resource audit**: "I need to audit all OpenAI model deployments in resource `enterprise-ai` in resource group `my-resource-group`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Required | The name of the Microsoft Foundry resource. |
| **Resource group** |  Required | The Azure resource group name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Resources: Get Foundry resource

List or get Microsoft Foundry resources and return resource-level details such as endpoint URL, location, SKU, kind, and provisioning state. If you provide a resource name, the tool returns that single resource. Otherwise, it returns the resource inventory in scope. For model deployment inventory inside a Foundry resource, use the OpenAI models list tool.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp foundryextensions resource get \
  [--resource-name <resource-name>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-name` | string | No | The name of the Microsoft Foundry resource. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli foundryextensions resource get -->

Example prompts include:

- **Get specific resource**: "Show me details for the `ai-foundry-prod` Foundry resource"
- **List all resources**: "What Foundry resources do I have in my subscription?"
- **Resource with configuration**: "Get the endpoint URL, location, and SKU information for my `customer-ai-foundry` foundry resource"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Optional | The name of the Microsoft Foundry resource. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Microsoft Foundry documentation](/azure/ai-foundry/)
- [Azure AI services overview](/azure/ai-services/)
- [Deploy and consume models](/azure/ai-foundry/concepts/deployments-overview)
