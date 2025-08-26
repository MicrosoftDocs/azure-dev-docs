---
title: Azure AI Foundry Tools - Azure MCP Server
description: Learn how to use the Azure MCP Server with Azure AI Foundry to manage your AI models and deployments.
keywords: azure mcp server, azmcp, azure ai foundry, ai models, model deployment
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 08/26/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
---

# Azure AI Foundry tools for the Azure MCP Server

The Azure MCP Server enables you to manage Azure resources, including Azure AI Foundry models and deployments, with natural language prompts. This capability helps you quickly manage your AI models without needing to remember complex syntax.

[Azure AI Foundry](/azure/ai-foundry/) is a platform for deploying and managing custom AI models in Azure. It provides tools and services for training, fine-tuning, deploying, and monitoring AI models in production environments. With Azure AI Foundry, you can more easily incorporate AI capabilities into your applications.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Knowledge: index list

Get a list of knowledge indexes from Azure AI Foundry:

- Get list of knowledge indexes specifically created within Azure AI Foundry projects.
- These indexes can be used with AI agents for knowledge retrieval and RAG applications.
- The list may change as new indexes are created or existing ones are updated.

Example prompts include: 

- **View all indexes**: "Show me all knowledge indexes in Azure AI Foundry"
- **Filter by project**: "List knowledge indexes in the 'support-bot' project"
- **Search by name**: "Find the knowledge index named 'product-faqs'"
- **Filter by tag**: "List knowledge indexes tagged with 'security' or 'onboarding'"
- **Show index details**: "Show details for the 'customer-service' knowledge index, including document count and last updated date"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Endpoint** |  Required | The endpoint URL for the Azure AI service. |
    

## Models: List available models

<!-- azmcp foundry models list -->

Lists all available AI models in Azure AI Foundry.

Example prompts include:

- **View all models**: "Show me all available AI models in Azure AI Foundry"
- **Filter by free usage**: "List all free models available for prototyping in Azure AI Foundry that I can use in the playground"
- **Filter by free usage**: "List all free models available for prototyping in Azure AI Foundry"
- **Filter by publisher**: "Show me models published by Microsoft in Azure AI Foundry"
- **Filter by license**: "What models with Apache license are available in Azure AI Foundry?"
- **Search by name**: "Find the llama model in Azure AI Foundry"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Search for free playground** | Optional | If set to true, returns a list of models from Azure AI Foundry that can also be used with GitHub inference endpoint and GitHub PAT token. If false, returns a list of models from Azure AI Foundry, regardless of GitHub support. To learn more, see [GitHub Models](https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models#experimenting-with-ai-models-in-the-playground).|
| **Publisher** | Optional | A filter to specify the publisher of the models to retrieve. |
| **License** | Optional | A filter to specify the license type of the models to retrieve. |
| **Model** | Optional | The name of the model to search for. |

## Models: Deploy a model

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
| **Deployment** | Required | A unique name for this model deployment |
| **Model** | Required | The name of the model to deploy |
| **Model format** | Required | The format of the model (for example, 'OpenAI', 'Meta', 'Microsoft') |
| **Azure AI services** | Required | The name of the Azure AI services account to deploy to |
| **Resource group** | Required | The name of the Azure resource group where the model will be deployed |
| **Model version** | Optional | The version of the model to deploy |
| **Model source** | Optional | The source of the model |
| **Scale type** | Optional | The scale type for the deployment |
| **Scale capacity** | Optional | The scale capacity for the deployment |
| **SKU** | Optional | The SKU name for the deployment |
| **SKU capacity** | Optional | The SKU capacity for the deployment |

## Models: List model deployments

<!-- azmcp foundry models deployments list -->

Lists all model deployments associated with a specific Azure AI Foundry endpoint. Use this command to monitor and manage your active model deployments. In the following example prompts, replace `https://my-example-resource.openai.azure.com` with your actual Azure AI Foundry endpoint URL.

Example prompts include:

- **List deployments on production**: "Show me all model deployments on my https://my-example-resource.openai.azure.com endpoint"
- **Check specific endpoint**: "What models are currently deployed to the https://my-example-resource.openai.azure.com endpoint?"
- **View regional deployments**: "List all deployments in my https://my-example-resource.openai.azure.com endpoint"
- **Check deployment status**: "Show me the status of all models deployed to our https://my-example-resource.openai.azure.com endpoint"
- **See active models**: "What AI models are running on our https://my-example-resource.openai.azure.com endpoint right now?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Endpoint** | Required | The endpoint URL for the Azure AI service |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure AI Foundry documentation](/azure/ai-foundry/)
- [Azure AI Services overview](/azure/ai-services/)
- [Deploy and consume models](/azure/ai-foundry/concepts/deployments-overview)