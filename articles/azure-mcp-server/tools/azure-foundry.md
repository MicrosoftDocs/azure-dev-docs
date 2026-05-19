---
title: Azure MCP Server tools for Microsoft Foundry Extensions
description: Use Azure MCP Server tools to manage Microsoft Foundry Extensions resources such as chat completions, text completions, embeddings, and models with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 03/20/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
tool_count: 7
mcp-cli.version: 2.0.0-beta.31
ms.reviewer: zhoujay, xiangyan
---

# Azure MCP Server tools for Microsoft Foundry Extensions

The Azure MCP Server lets you manage Microsoft Foundry Extensions resources, including creating chat and text completions, generating embeddings, listing models, and working with knowledge indexes, with natural language prompts.

[Microsoft Foundry](/azure/ai-foundry/) is a platform for deploying and managing custom AI models in Azure. It provides tools and services for training, fine-tuning, deploying, and monitoring AI models in production environments.

When connecting to your Microsoft Foundry resource, the Azure MCP Server requires either the **endpoint** or the **resource group** of your Microsoft Foundry resource. For operations that don't require a specific resource, such as listing available models, neither the endpoint nor the resource group is required.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Knowledge: List knowledge indexes

<!-- @mcpcli foundryextensions knowledge index list -->

Get a list of knowledge indexes from Foundry:

- Find knowledge indexes created within Foundry projects.
- Use these indexes with AI agents for knowledge retrieval and RAG applications.
- The list updates as you create new indexes or update existing ones.

Example prompts include: 

- **View all indexes**: "Show me all knowledge indexes at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/my-project'"
- **Filter by project**: "List knowledge indexes at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/support-bot'"
- **Search by name**: "Find the knowledge index named 'product-faqs' at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/my-project'"
- **Filter by tag**: "List knowledge indexes tagged with 'security' at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/my-project'"
- **Show index details**: "Show details for the 'customer-service' knowledge index at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/my-project'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>`|

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Knowledge: Get index schema

<!-- @mcpcli foundryextensions knowledge index schema -->

Get the detailed schema configuration of a specific knowledge index from Foundry.

This operation shows you comprehensive information about the structure and configuration of a knowledge index, including field definitions, data types, searchable attributes, and other schema properties. Use this schema information to understand how the index structures and indexes your data for searching.


Example prompts include:
- **View index schema**: "Show me the schema for knowledge index 'product-facts' at endpoint 'https://my-example-resource.services.ai.azure.com/api/projects/my-project'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Foundry project or service in the format `https://<resource>.services.ai.azure.com/api/projects/<project-name>` |
| **Index** |  Required | The name of the knowledge index. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## OpenAI: Create chat completions

<!-- @mcpcli foundryextensions openai chat-completions-create -->

 Create chat completions using Azure OpenAI in Foundry. Send messages to Azure OpenAI chat models deployed in your Foundry resource and receive AI-generated conversational responses. Supports multi-turn conversations with message history, system instructions, and response customization.

Example prompts include:

- **Simple greeting**: "Create a chat completion with message array '[{\"role\":\"user\",\"content\":\"Hello, how are you today?\"}]' using deployment 'gpt-35-turbo' on resource 'openai-prod'"
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
| **Deployment** |  Required | The name of the Foundry model deployment. |
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

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## OpenAI: Create embeddings

<!-- @mcpcli foundryextensions openai embeddings-create -->

Create embeddings using Azure OpenAI in Foundry. Generate vector embeddings from text using Azure OpenAI deployments in your Foundry resource for semantic search, similarity comparisons, clustering, or machine learning.

Example prompts include:

- **Basic text embedding**: "Generate embeddings for the text 'Azure OpenAI Service' using my 'text-embedding-ada-002' deployment in resource group 'my-resource-group'"
- **Create vector embeddings**: "Create vector embeddings for my text using Azure OpenAI with deployment 'text-embedding-3-large' on resource 'ai-services-prod' in resource group 'my-resource-group'"
- **Document embedding**: "Generate embeddings for 'Machine learning revolutionizes data analysis' using deployment 'ada-002' on resource 'embedding-service' in resource group 'my-resource-group'"
- **Multiple sentences**: "Create embeddings for the text 'Cloud computing provides scalable infrastructure. It enables global accessibility.' using my embedding deployment in resource group 'my-resource-group'"
- **With user tracking**: "Generate embeddings for 'Natural language processing applications' using deployment 'text-embedding-3-small' with user identifier 'analytics-team' in resource group 'my-resource-group'"
- **Specific dimensions**: "Create embeddings for 'Artificial intelligence transforms business operations' using deployment 'text-embedding-3-large' with 1536 dimensions on resource 'ai-central' in resource group 'my-resource-group'"
- **Base64 format**: "Generate embeddings for 'Deep learning neural networks' using deployment 'ada-002' with base64 encoding format on resource 'ml-services' in resource group 'my-resource-group'"
- **Research text**: "Create vector embeddings for 'Quantum computing demonstrates computational advantages in specific algorithms' using my text-embedding deployment in resource group 'my-resource-group'"
- **Product description**: "Generate embeddings for 'High-performance laptop with advanced graphics processing unit' using deployment 'text-embedding-3-small' on resource 'product-ai' in resource group 'my-resource-group'"
- **Technical documentation**: "Create embeddings for 'API authentication requires valid credentials and proper authorization headers' using deployment 'ada-002' with float encoding on resource 'docs-embedding' in resource group 'my-resource-group'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Resource name** |  Required | The name of the Azure OpenAI resource. |
| **Deployment** |  Required | The name of the Foundry model deployment. |
| **Input text** |  Required | The input text to generate embeddings for. |
| **User** |  Optional | Optional user identifier for tracking and abuse monitoring. |
| **Encoding format** |  Optional | The format to return embeddings in (`float` or `base64`). |
| **Dimensions** |  Optional | The number of dimensions for the embedding output. Only supported in some models. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## OpenAI: Create completions

<!-- @mcpcli foundryextensions openai create-completion -->

 Create text completions using Azure OpenAI in Foundry. Send a prompt or question to Azure OpenAI models deployed in your Foundry resource and receive generated text answers. Use this when you need to create completions, get AI-generated content, generate answers to questions, or produce text completions from Azure OpenAI based on any input prompt. Supports customization with temperature and max tokens. 

Example prompts include:

- **Basic completion**: "Create a completion with the prompt 'What is Azure?' using my 'gpt-35-turbo' deployment in resource group 'my-resource-group'"
- **With temperature control**: "Generate text completion for 'Explain machine learning' using deployment 'text-davinci-003' with temperature 0.3 in resource group 'my-resource-group'"
- **Limited tokens**: "Create a completion with prompt 'Write a summary' using my 'gpt-4' deployment with max 100 tokens in resource group 'my-resource-group'"
- **Creative writing**: "Generate completion for 'Tell me a story about AI' using deployment 'gpt-35-turbo' with temperature 0.8 and 200 max tokens in resource group 'my-resource-group'"
- **Technical explanation**: "Create completion with prompt 'How does cloud computing work?' using my OpenAI resource 'ai-services-east' and deployment 'gpt-4' in resource group 'my-resource-group'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group where the AI resource is hosted. |
| **Resource name** |  Required | The name of the Azure OpenAI resource. |
| **Deployment** |  Required | The name of the deployment. |
| **Prompt text** |  Required | The prompt text to send to the completion model. |
| **Max tokens** |  Optional | The maximum number of tokens to generate in the completion. |
| **Temperature** |  Optional | Controls randomness in the output. Lower values make it more deterministic. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## OpenAI: List models and deployments

<!-- @mcpcli foundryextensions openai models-list -->

List all available OpenAI models and deployments in an Azure resource. This tool retrieves information about 
deployed models including model names, versions, capabilities, and deployment status. 

Example prompts include:

- **View all models**: "List all OpenAI models in my 'ai-services-prod' resource in resource group 'my-resource-group'"
- **Check deployments**: "Show me all deployed models and their status in resource 'openai-east' in resource group 'my-resource-group'"
- **Production inventory**: "What models are available in my 'production-openai' resource in resource group 'my-resource-group'?"
- **Development check**: "List all models and deployments in my 'dev-ai-services' resource in resource group 'my-resource-group'"
- **Model capabilities**: "Show me all available OpenAI models with their capabilities in resource 'ai-central' in resource group 'my-resource-group'"
- **Deployment status**: "What's the current status of all deployments in my 'openai-west' resource in resource group 'my-resource-group'?"
- **Regional models**: "List all models available in my 'europe-openai' resource in resource group 'my-resource-group'"
- **Service overview**: "Give me a complete overview of models and deployments in resource 'customer-ai' in resource group 'my-resource-group'"
- **Model versions**: "Show me all model versions available in my 'ai-services-main' resource in resource group 'my-resource-group'"
- **Resource audit**: "I need to audit all OpenAI models and deployments in resource 'enterprise-ai' in resource group 'my-resource-group'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Resource name** |  Required | The name of the Azure OpenAI resource. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Resources: Get Foundry resource

<!-- @mcpcli foundryextensions resource get -->

Get detailed information about Foundry resources, including endpoint URL, 
location, SKU, and all deployed models with their configuration. If a specific resource name is provided, 
returns details for that resource only. If no resource name is provided, lists all Foundry resources 
in the subscription or resource group. 

Example prompts include:

- **Get specific resource**: "Show me details for the 'ai-foundry-prod' Foundry resource including all deployed models"
- **List all resources**: "What Foundry resources do I have in my subscription?"
- **Resource with configuration**: "Get the endpoint URL, location, and SKU information for my 'customer-ai-foundry' foundry resource"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Optional | The name of the Azure OpenAI resource. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Microsoft Foundry documentation](/azure/ai-foundry/)
- [Azure AI services overview](/azure/ai-services/)
- [Deploy and consume models](/azure/ai-foundry/concepts/deployments-overview)