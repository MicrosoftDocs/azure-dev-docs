---
title: Azure Service Fabric tools for the Azure MCP Server overview
description: Learn about the tools available in Azure Service Fabric for managing microservices and containerized applications as part of the Azure MCP Server.
keywords: Azure, MCP Server, Service Fabric, microservices, container orchestration, application management
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 02/18/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.reviewer: anuchan
tool_count: 2
mcp-cli.version: 2.0.0-beta.20+6836f5da0f4b4aac4abadd186fbcf8c4dd7743f9
---

# Azure Service Fabric tools for the Azure MCP Server overview

The Azure MCP Server lets you manage microservices and containerized applications, including deployment, scaling, and monitoring, with natural language prompts.

Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices and containers. For more information, see [Azure Service Fabric documentation](/azure/service-fabric/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get managed cluster node details

<!-- @mcpcli servicefabric managedcluster node get -->

Get nodes for a Service Fabric managed cluster. By default, this command returns all nodes. You can also specify a node name to retrieve details for a single node. The output includes the name, node type, status, IP address, fault domain, upgrade domain, health state, and seed node status.

Example prompts include:
- "Get all nodes for the managed cluster `myManagedCluster` in resource group `rg-prod`."
- "Show me the nodes for the Service Fabric managed cluster `testCluster` within resource group `rg-dev`."
- "What is the status of node `node1` in managed cluster `myCluster` located in resource group `rg-test`?"
- "I need details for the node named `node2` from the managed cluster `productionCluster` in resource group `rg-prod`."
- "List the nodes for the Service Fabric managed cluster `stagingCluster` within resource group `rg-staging`."

| Parameter          | Required or optional | Description                                                           |
|--------------------|----------------------|-----------------------------------------------------------------------|
| **Cluster**        | Required             | Service Fabric managed cluster name.                                  |
| **Resource group** | Required             | The name of the Azure resource group, which is a logical container for Azure resources. |
| **Node**           | Optional             | The node name. When specified, this parameter returns a single node instead of all nodes. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Restart managed cluster nodes based on type

<!-- @mcpcli servicefabric managedcluster nodetype restart -->

Restart nodes of a specific node type in a Service Fabric managed cluster. 

Example prompts include:
- "Restart nodes `node1` and `node2` of node type `frontend` in managed cluster `myservicefabric` within resource group `rg-prod`"
- "I need to restart the nodes `node3` and `node4` of the `backend` node type in the `mycluster` managed cluster located in resource group `rg-dev`"
- "Can you restart all nodes of type `worker` in managed cluster `mycluster` that are located in resource group `rg-staging`?"
- "Restart nodes `node5` and `node6` of node type `database` in managed cluster `clustername` under resource group `rg-production`?"
- "Restart the nodes `node7` and `node8` of `app` node type in managed cluster `servicefabriccluster` under resource group `rg-test` and use update type `ByUpgradeDomain`"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Cluster** | Required | Service Fabric managed cluster name. |
| **Node type** | Required | The node type name within the managed cluster. |
| **Nodes** | Required | The list of node names to restart. You can provide multiple node names. |
| **Resource group** | Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Update type** | Optional | The update type for the restart operation. Update types include: `Default` or `ByUpgradeDomain`.|

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Service Fabric documentation](/azure/service-fabric/)