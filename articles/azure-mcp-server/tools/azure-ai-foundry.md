---
title: Use Azure AI Foundry with Azure MCP Server
titleSuffix: Azure MCP Server
description: Send natural language commands to Azure AI Foundry to manage your AI models and deployments from Azure MCP Server.
ms.date: 07/17/2025
ms.topic: how-to
---

# Use Azure AI Foundry with Azure MCP Server

This article describes how to use Azure AI Foundry features from Azure MCP Server. Azure MCP Server supports managing your AI models and deployments through natural language prompts.

[Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry/) provides a platform for building, deploying, and managing AI models. With Azure MCP Server, you can interact with AI Foundry using natural language commands to streamline your AI development workflow.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## List AI Foundry models

<!-- azmcp foundry models list [--search-for-free-playground <search-for-free-playground>] [--publisher-name <publisher-name>] [--license-name <license-name>] [--model-name <model-name>] -->

List AI Foundry models with optional filtering parameters.

Example prompts:

- **Browse all models**: "Show me a list of all available AI Foundry models."
- **Find free playground models**: "What AI models can I use for free in the playground?"
- **Filter by publisher**: "List all Microsoft published AI models in Foundry."
- **Search specific model**: "Find the GPT-4 model in Azure AI Foundry."
- **Find model by license**: "Show me models with the 'Open Source' license in AI Foundry."

| Parameter | Required | Description |
|-----------|----------|-------------|
| `search-for-free-playground` | No | If true, filters models to include only those that can be used for free by users for prototyping |
| `publisher-name` | No | A filter to specify the publisher of the models to retrieve |
| `license-name` | No | A filter to specify the license type of the models to retrieve |
| `model-name` | No | The name of the model to search for |


## Deploy an AI Foundry model

<!-- azmcp foundry models deploy --subscription <subscription> --resource-group <resource-group> --deployment-name <deployment-name> --model-name <model-name> --model-format <model-format> --azure-ai-services-name <azure-ai-services-name> [--model-version <model-version>] [--model-source <model-source>] [--sku-name <sku-name>] [--sku-capacity <sku-capacity>] [--scale-type <scale-type>] [--scale-capacity <scale-capacity>] -->

Deploy an AI Foundry model to Azure.

Example prompts:

- **Deploy a model**: "Deploy the GPT-4 model to my 'ai-services' account in the 'ai-resource-group' resource group."
- **Create a new deployment**: "Create a new deployment of Llama 2 model in my Azure AI services account."
- **Setup AI model**: "Set up a new deployment of DALL-E 3 in my AI services resource."
- **Deploy with specific version**: "Deploy version 1.0 of the text-embedding-3-small model to my AI services account."
- **Configure deployment parameters**: "Deploy GPT-4o with standard SKU and capacity of 10 to my Azure AI services account."


| Parameter | Required | Description |
|-----------|----------|-------------|
| `subscription` | Yes | The Azure subscription ID or name |
| `resource-group` | Yes | The name of the Azure resource group |
| `deployment-name` | Yes | The name of the deployment |
| `model-name` | Yes | The name of the model to deploy |
| `model-format` | Yes | The format of the model (e.g., 'OpenAI', 'Meta', 'Microsoft') |
| `azure-ai-services-name` | Yes | The name of the Azure AI services account to deploy to |
| `model-version` | No | The version of the model to deploy |
| `model-source` | No | The source of the model |
| `sku-name` | No | The SKU name for the deployment |
| `sku-capacity` | No | The SKU capacity for the deployment |
| `scale-type` | No | The scale type for the deployment |
| `scale-capacity` | No | The scale capacity for the deployment |

## List AI Foundry model deployments

<!-- azmcp foundry models deployments list --endpoint <endpoint> -->

List AI Foundry model deployments for a specific endpoint.

Example prompts:

- **List all deployments**: "Show me all model deployments for my AI services endpoint."
- **Check deployment status**: "What models are currently deployed to my AI services endpoint?"
- **View deployment inventory**: "List the deployments at my Azure AI services endpoint."
- **Monitor deployments**: "Check the status of all model deployments at my AI endpoint."

| Parameter | Required | Description |
|-----------|----------|-------------|
| `endpoint` | Yes | The endpoint URL for the Azure AI service |


## Next steps

- [Learn more about Azure AI Foundry](/azure/ai-foundry/what-is-azure-ai-foundry)
- [Create an Azure AI Foundry project](/azure/ai-foundry/how-to/create-projects)
- [Azure AI Foundry documentation](/azure/ai-foundry/)
