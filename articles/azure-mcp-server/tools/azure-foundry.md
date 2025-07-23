---
title: Azure AI Foundry Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure AI Foundry to manage your AI models and deployments.
keywords: azure mcp server, azmcp, azure ai foundry, ai models, model deployment
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 07/22/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Azure AI Foundry tools for the Azure MCP Server

The Azure MCP Server enables you to manage Azure resources, including Azure AI Foundry models and deployments, with natural language prompts. This capability helps you quickly manage your AI models without needing to remember complex syntax.

[Azure AI Foundry](/azure/ai-foundry/) is a platform for deploying and managing custom AI models in Azure. It provides tools and services for training, fine-tuning, deploying, and monitoring AI models in production environments. With Azure AI Foundry, you can more easily incorporate AI capabilities into your applications.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List available models

<!-- azmcp foundry models list -->

Lists all available AI models in Azure AI Foundry. Use this command to view all models that you can deploy or use in your Azure environment.

Example prompts include:

- **View all models**: "Show me all available AI models in Azure AI Foundry"
- **Filter by free usage**: "List all free models available for prototyping in Azure AI Foundry that I can use in the playground"
- **Filter by free usage**: "List all free models available for prototyping in Azure AI Foundry"
- **Filter by publisher**: "Show me models published by Microsoft in Azure AI Foundry"
- **Filter by license**: "What models with Apache license are available in Azure AI Foundry?"
- **Search by name**: "Find the llama model in Azure AI Foundry"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Search for free playground | Optional | If true, filters models to include only those that users can use for free for prototyping. |
| Publisher name | Optional | A filter to specify the publisher of the models to retrieve. |
| License name | Optional | A filter to specify the license type of the models to retrieve. |
| Model name | Optional | The name of the model to search for. |

## Deploy a model

<!-- azmcp foundry models deploy -->

Deploys an AI model to your Azure environment. Use this command to deploy selected models from Azure AI Foundry and make them available for use in your applications.

Example prompts include:

- **Deploy with required parameters**: "Deploy GPT-4 model in OpenAI format to my ai-services account in ai-projects resource group with subscription dev-subscription"
- **Specify deployment name**: "Set up a deployment named text-embedding for the Ada embedding model in my AI services account with Standard SKU"
- **Include model version**: "Deploy version 2 of Llama model from Meta to my Azure AI services account with scale capacity of 3"
- **Deploy to specific resource group**: "Create a deployment named content-generation with GPT-4 model in my ai-central service in resource group ml-experiments"
- **Configure scaling**: "Deploy Claude model to my Azure AI service with auto-scaling enabled and maximum capacity of 5"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Deployment-name | Required | A unique name for this model deployment |
| Model name | Required | The name of the model to deploy |
| Model format | Required | The format of the model (for example, 'OpenAI', 'Meta', 'Microsoft') |
| Azure AI services name | Required | The name of the Azure AI services account to deploy to |
| Resource group | Required | The name of the Azure resource group where the model will be deployed |
| Model version | Optional | The version of the model to deploy |
| Model source | Optional | The source of the model |
| Scale type | Optional | The scale type for the deployment |
| Scale capacity | Optional | The scale capacity for the deployment |
| Sku name | Optional | The SKU name for the deployment |
| Sku capacity | Optional | The SKU capacity for the deployment |

## List model deployments

<!-- azmcp foundry models deployments list -->

Lists all model deployments associated with a specific Azure AI Foundry endpoint. Use this command to monitor and manage your active model deployments.

Example prompts include:

- **List deployments on production**: "Show me all model deployments on my https://production-ai.openai.azure.com endpoint"
- **Check specific endpoint**: "What models are currently deployed to the https://customer-service.cognitiveservices.azure.com endpoint?"
- **View regional deployments**: "List all deployments in my https://eastus-ai-service.openai.azure.com endpoint"
- **Check deployment status**: "Show me the status of all models deployed to our https://main-ai.openai.azure.com endpoint"
- **See active models**: "What AI models are running on our https://aistudio-prod.cognitiveservices.azure.com endpoint right now?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| Endpoint | Required | The endpoint URL for the Azure AI service |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure AI Foundry documentation](/azure/ai-foundry/)
- [Azure AI Services overview](/azure/ai-services/)
- [Deploy and consume models](/azure/ai-foundry/concepts/deployments-overview)