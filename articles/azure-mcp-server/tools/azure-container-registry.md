---
title: Azure Container Registry Tools 
description: Learn how to use the Azure MCP Server with Azure Container Registry.
keywords: azure mcp server, azmcp, container registry
author: diberry
ms.author: diberry
ms.date: 08/20/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 

# Azure Container Registry tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resources, including Azure Container Registries, using natural language prompts. This enables you to work with container registries without needing to remember complex command syntax.

[Azure Container Registry](/azure/container-registry/) allows you to build, store, and manage container images and artifacts in a private registry for all types of container deployments. Use Azure container registries with your existing container development and deployment pipelines. Use Azure Container Registry Tasks to build container images in Azure on-demand, or automate builds triggered by source code updates, updates to a container's base image, or timers.


[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Registry: list registry accounts in subscription

List accounts in a subscription. Optionally filter by resource group. 

Example prompts include: 


- **List registries**: "List all Azure Container Registries in my subscription."
- **Show registries**: "What container registries do I have?"
- **Find registries in a group**: "Show me all container registries in resource group 'devops-resources'."
- **Filter by resource group**: "List container registries in the resource group 'production-resources'."
- **Query registries**: "Can you list all my Azure Container Registries?"
- **Check registries**: "Container registries in subscription abc123"

## Registry: list repositories in registry

List repositories in Azure Container Registries. By default, lists repositories for all registries in the subscription.

Example prompts include:

- **List all repositories**: "List all repositories in my Azure Container Registries."
- **Show repositories for a registry**: "What repositories are in my registry 'myregistry'?"
- **Find specific repository**: "Show me the repository 'myapp' in registry 'myregistry'."
- **Filter by image name**: "List all repositories with images named 'myimage' in my registries."
- **Query repositories**: "Can you list all my container images?"
- **Check repository details**: "Get details for repository 'myapp' in registry 'myregistry'."

| Parameter | Required or optional | Description |
|-----------|----------|-------------|
| Registry | Optional | The name of the Azure Container Registry. This is the unique name you choose for your container registry. |