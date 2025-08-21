---
title: Manage Azure Quotas with Azure MCP Server
description: Use Azure MCP Server to manage Azure Quotas with natural language prompts. Monitor usage, set alerts, and optimize resource allocation. Learn more and get started today.
keywords: azure mcp server, azmcp, quotas
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 08/20/2025
---

# Azure Quotas for the Azure MCP Server

Azure MCP Server helps you manage Azure quotas efficiently by using natural language prompts. This article explains how to monitor quota usage, set alerts, and optimize resource allocation for your Azure resources.

[Azure Quotas](/azure/quotas/quotas-overview) enables you to monitor and create alerts for specific quotas. You can receive notifications when the usage reaches predefined thresholds.


## Region: availability list

Given a list of Azure resource types, this tool returns a list of regions where the resource types are available. Always get the user's subscription ID before calling this tool.

Example prompts include:

- **Check region availability**: "Which regions support Microsoft.App/containerApps and Microsoft.Web/sites?"
- **Resource region list**: "Show me all regions where I can deploy Microsoft.CognitiveServices/accounts."
- **Find available regions for resources**: "List available regions for Microsoft.App/containerApps, Microsoft.Web/sites, and Microsoft.CognitiveServices/accounts."
- **Region support for cognitive services**: "Where can I deploy the 'gpt-4' model for Microsoft.CognitiveServices/accounts?"
- **Deployment options**: "What regions allow deployment of container apps and web sites?"

| Parameters | Required or optional | Description |
|-----------------------------|----------------------|-------------|
| **Resource types to check** | Required | Comma-separated list of Azure resource types to check available regions for. For example: 'Microsoft.App/containerApps, Microsoft.Web/sites, Microsoft.CognitiveServices/accounts'. |
| **Cognitive service model name** | Optional | Model name for cognitive services. Only needed when Microsoft.CognitiveServices is included in resource types. |
| **Cognitive service model version** | Optional | Model version for cognitive services. Only needed when Microsoft.CognitiveServices is included in resource types. |
| **Cognitive service deployment SKU name** | Optional | Deployment SKU name for cognitive services. Only needed when Microsoft.CognitiveServices is included in resource types. |


## Usage: check

This tool checks the usage and quota information for Azure resources in a region.

Example prompts include:

- **Check quota usage**: "Check my quota usage for Microsoft.App/containerApps in eastus."
- **Resource quota status**: "Show me the current quota and usage for Microsoft.Web/sites and Microsoft.CognitiveServices/accounts in westus."
- **Quota limits**: "What are the quota limits for container apps in centralus?"
- **Usage report**: "Get a usage report for all my resources in region 'eastus2'."
- **Quota and usage details**: "Can you provide quota and usage details for Microsoft.App/containerApps, Microsoft.Web/sites in westeurope?"

| Parameters | Required or optional | Description |
|-----------------------------|----------------------|-------------|
| **Region for deployment** | Required | The Azure region where you want to check the usage and quota. For example: `eastus`, `westus`. |
| **Resource types to deploy** | Required | The Azure resource types that you want to check the usage and quota for (comma-separated). For example: `Microsoft.App/containerApps`, `Microsoft.Web/sites`, `Microsoft.CognitiveServices/accounts`. |