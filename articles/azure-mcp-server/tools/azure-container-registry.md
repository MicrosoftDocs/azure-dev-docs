---
title: Azure Container Registry Tools
description: Learn how to use the Azure MCP Server with Azure Container Registry.
author: sandeep-sen
ms.author: sandeepsen
ms.date: 11/03/2026
ms.topic: concept-article
tool_count: 2
mcp-cli.version: 3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876
ms.custom:
  - build-2025
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Container Registry

The Azure MCP Server enables you to manage Azure resources, including Azure Container Registries, by using natural language prompts. This capability lets you work with container registries without needing to remember complex command syntax.

[Azure Container Registry](/azure/container-registry/) enables you to build, store, and manage container images and artifacts in a private registry for all types of container deployments. Use Azure container registries with your existing container development and deployment pipelines. Use Azure Container Registry Tasks to build container images in Azure on-demand, or automate builds triggered by source code updates, updates to a container's base image, or timers.


[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Registry: List

Lists Azure Container Registries in a subscription. Optionally, filter by a resource group to narrow results. Each registry result includes `name`, `location`, `loginServer`, `skuName`, and `skuTier`. If no registries are found, the tool returns null results.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp acr registry list \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-group` | string | No | Limit registries to this resource group. Omit it to list registries across the subscription. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli acr registry list -->

Example prompts include:

- "List all Azure Container Registries in my subscription"
- "Show me my Azure Container Registries"
- "Show me the container registries in my subscription"
- "List container registries in resource group \<resource_group_name\>"
- "Show me the container registries in resource group \<resource_group_name\>"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Tenant** |  Optional | The Microsoft Entra ID tenant ID or name. This can be either the GUID identifier or the display name of your Entra ID tenant. |
| **Subscription** |  Optional | Specifies the Azure subscription to use. Accepts either a subscription ID (GUID) or display name. |
| **Resource group** | Optional | Limit registries to this resource group. Omit it to list registries across the subscription. |
| **Learn** |  Optional | Discover available sub-commands and their parameters without executing any Azure operation. Use on a command group (for example 'azmcp storage `--learn`') to list all commands in that group, or on a specific command (for example 'azmcp storage account list `--learn`') to see its options. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Registry repository: List

Lists repositories in Azure Container Registry. By default, lists repositories for all registries in the subscription. To list repositories for a specific registry, narrow the scope by resource group or by registry.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp acr registry repository list \
  [--resource-group <resource-group>] \
  [--registry <registry>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-group` | string | No | Limit registry lookup to this resource group. Omit it to search across the subscription. |
| `registry` | string | No | The Azure Container Registry name. Omit it to list repositories for all registries in the resource group or subscription. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli acr registry repository list -->

Example prompts include:

- "List all container registry repositories in my subscription"
- "Show me my container registry repositories"
- "List repositories in the container registry \<registry_name\>"
- "Show me the repositories in the container registry \<registry_name\>"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Tenant** |  Optional | The Microsoft Entra ID tenant ID or name. This can be either the GUID identifier or the display name of your Entra ID tenant. |
| **Subscription** |  Optional | Specifies the Azure subscription to use. Accepts either a subscription ID (GUID) or display name. |
| **Resource group** | Optional | Limit registry lookup to this resource group. Omit it to search across the subscription. |
| **Registry** | Optional | The Azure Container Registry name. Omit it to list repositories for all registries in the resource group or subscription. |
| **Learn** |  Optional | Discover available sub-commands and their parameters without executing any Azure operation. Use on a command group (for example 'azmcp storage `--learn`') to list all commands in that group, or on a specific command (for example 'azmcp storage account list `--learn`') to see its options. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Container Registry](/azure/container-registry/)
