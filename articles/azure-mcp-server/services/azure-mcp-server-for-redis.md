---
title: Manage Azure Redis with Azure MCP Server
description: Learn how to use the Azure MCP Server to create, list, and manage Azure Redis resources through AI-powered natural language interactions.
author: diberry
ms.author: diberry
ms.service: azure-managed-redis
ms.topic: how-to
ms.date: 12/12/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-generated
ms.custom: build-2025

#customer intent: As an Azure Redis user, I want to create and manage Redis resources using natural language conversations so that I can quickly provision caches and review inventory without navigating portals.

---

# Manage Azure Redis with Azure MCP Server

If you work with Azure Managed Redis, the Azure MCP Server can help you create new Redis resources, inventory existing caches, and manage Redis deployments using natural language conversations with AI assistants.

[Azure Managed Redis](/azure/redis) provides in-memory data storage based on the Redis software. While the Azure portal and Azure CLI are powerful tools, the Azure MCP Server provides a more intuitive way to interact with your Redis resources through conversational AI.

## What is the Azure MCP Server?

[!INCLUDE [mcp-introduction](../includes/mcp-introduction.md)]

For Azure Redis users, this means you can:

- Create new Redis resources with specific SKUs and configurations using plain language
- List all Redis resources across subscriptions without complex queries
- Configure Redis modules like RedisJSON or RedisBloom through conversation
- Review Redis cache inventory and deployment details quickly
- Set up development and production Redis instances conversationally
- Verify Redis resource configurations across environments

## Prerequisites

To use the Azure MCP Server with Azure Redis, you need:

### Azure requirements

- **Azure subscription**: An active Azure subscription. [Create one for free](https://azure.microsoft.com/free/).
- **Azure Redis resources**: At least one Azure Managed Redis cache in your subscription, or permissions to create them.
- **Azure permissions**: Appropriate roles like Contributor or Redis Cache Contributor to perform the operations you want. See [Use Microsoft Entra ID for cache authentication with Azure Managed Redis](/azure/redis/entra-for-authentication).

[!INCLUDE [mcp-prerequisites](../includes/mcp-prerequisites.md)]

## Where can you use Azure MCP Server?

[!INCLUDE [mcp-usage-contexts](../includes/mcp-usage-contexts.md)]

## Available tools for Azure Redis

The Azure MCP Server provides two tools specifically designed for Azure Redis operations. These tools enable you to create and manage Redis resources through natural language conversations.

### Resource creation

Provision new Azure Managed Redis resources with specific configurations, SKUs, and modules.

**Common scenarios**:
- Quickly create Redis caches for new applications or environments
- Provision Redis with specific SKUs matching performance requirements
- Enable Redis modules like RedisJSON or RedisBloom during creation
- Set up multiple Redis instances across regions for testing
- Configure authentication settings during Redis provisioning

### Resource inventory

List and review all Redis resources in your subscription.

**Common scenarios**:
- Audit Redis resources across subscriptions and resource groups
- Identify Redis instances for cost optimization reviews
- Find Redis caches by name or location
- Verify Redis deployments after infrastructure changes
- Create inventory reports of Redis resources for compliance

For detailed information about each tool, including parameters and examples, see [Azure Redis tools for Azure MCP Server](../tools/azure-redis.md).

## Get started

Ready to use Azure MCP Server with your Azure Redis resources?

1. **Set up your environment**: Choose an AI assistant or development tool that supports MCP. For setup and authentication instructions, see the links in the [Where can you use Azure MCP Server?](#where-can-you-use-azure-mcp-server) section above.

2. **Start exploring**: Ask your AI assistant questions about your Redis resources or request operations. Try prompts like:
   - "List all Redis resources in my subscription"
   - "Create a Redis cache named 'test-cache' in eastus with Balanced_B0 SKU"
   - "Show me my Redis instances in the 'production' resource group"

3. **Learn more**: Review the [Azure Redis tools reference](../tools/azure-redis.md) for all available capabilities and detailed parameter information.

## Best practices

When using Azure MCP Server with Azure Redis:

- **Choose appropriate SKUs**: Specify Redis SKU based on your performance and cost requirements. Use Balanced_B0 for development and higher SKUs for production workloads.
- **Enable required modules early**: Specify Redis modules like RedisJSON or RedisBloom during creation to avoid reconfiguration later.
- **Disable access keys**: For production environments, explicitly disable access key authentication and use managed identities or Microsoft Entra ID for better security.
- **Use consistent naming**: Follow naming conventions for Redis resources across environments (for example, `app-cache-dev`, `app-cache-prod`) to simplify management.
- **Review regularly**: Periodically list all Redis resources to identify unused instances and optimize costs.
- **Tag resources**: While creating Redis resources, consider adding Azure tags through the portal for better resource organization and cost tracking.

## Related content

* [Azure MCP Server overview](../overview.md)
* [Get started with Azure MCP Server](../get-started.md)
* [Azure Redis tools reference](../tools/azure-redis.md)
* [Azure Redis documentation](/azure/redis/)
* [Azure Managed Redis overview](/azure/redis/overview)
