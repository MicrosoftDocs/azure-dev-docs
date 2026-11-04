---
title: Azure MCP Server tools for Azure Migrate
description: Azure MCP Server tools help you manage Azure Migrate planning, guidance retrieval, and platform landing zone requests.
ms.reviewer: akrohill
ms.date: 11/03/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom: build-2025
tool_count: 2
mcp-cli.version: "3.0.0-beta.47+bd724faf47e86348c7163a429b584aabfd714876"
---

# Azure MCP Server tools for Azure Migrate

The Azure MCP Server lets you manage migration planning, guidance retrieval, and request submissions with natural language prompts.

Azure Migrate provides a centralized hub for assessing and migrating on-premises workloads to Azure. For more information, see [Azure Migrate documentation](/azure/migrate/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get guidance for platform landing zone

Provides guidance for modifying an existing platform landing zone, including its resource names, management groups, network settings, regions, security controls, and policies.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azuremigrate platformlandingzone getguidance \
  --scenario <scenario> \
  [--policy-name <policy-name>] \
  [--list-policies <list-policies>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `scenario` | string | Yes | The modification scenario key. Valid values: resource-names, management-groups, ddos, bastion, dns, gateways, regions, ip-addresses, policy-enforcement, policy-assignment, ama, amba, defender, zero-trust, slz. |
| `policy-name` | string | No | The policy assignment name to look up (for example, `Enable-DDoS-VNET`). Used with policy-enforcement or policy-assignment scenarios. |
| `list-policies` | string | No | Set to true to list all available policies organized by archetype. Useful for finding the exact policy name. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azuremigrate platformlandingzone getguidance -->

Example prompts include:

- "Get guidance for enabling DDoS protection in my landing zone by using the `ddos` scenario"
- "List the available landing-zone policies by using the `policy-assignment` scenario"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Scenario** |  Required | The modification scenario key. Valid values: resource-names, management-groups, ddos, bastion, dns, gateways, regions, ip-addresses, policy-enforcement, policy-assignment, ama, amba, defender, zero-trust, slz. |
| **Policy name** |  Optional | The policy assignment name to look up (for example, `Enable-DDoS-VNET`). Used with policy-enforcement or policy-assignment scenarios. |
| **List policies** |  Optional | Set to `true` to list all available policies organized by archetype. Useful for finding the exact policy name. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |

## Request platform landing zone

Checks, configures, generates, and downloads platform landing zones for Azure Migrate projects. It can also create a migration project and report parameter status.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azuremigrate platformlandingzone request \
  --action <action> \
  --migrate-project-name <migrate-project-name> \
  --resource-group <resource-group> \
  [--region-type <region-type>] \
  [--firewall-type <firewall-type>] \
  [--network-architecture <network-architecture>] \
  [--identity-subscription-id <identity-subscription-id>] \
  [--management-subscription-id <management-subscription-id>] \
  [--connectivity-subscription-id <connectivity-subscription-id>] \
  [--regions <regions>] \
  [--environment-name <environment-name>] \
  [--version-control-system <version-control-system>] \
  [--organization-name <organization-name>] \
  [--location <location>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | The action to perform: `update` (set parameters), `check` (check existing platform landing zone), `generate` (generate platform landing zone), `download` (get download instructions), `status` (view parameter status), `createmigrateproject` (create new migration project). |
| `migrate-project-name` | string | Yes | The Azure Migrate project name for Platform Landing Zone generation context. |
| `resource-group` | string | Yes | The Azure resource group name. |
| `region-type` | string | No | The region type for the Platform Landing Zone. Valid values: `single`, `multi`. |
| `firewall-type` | string | No | The firewall type for the Platform Landing Zone. Valid values: `azurefirewall`, `nva`. |
| `network-architecture` | string | No | The network architecture for the Platform Landing Zone. Valid values: `hubspoke`, `vwan`. |
| `identity-subscription-id` | string | No | The Azure subscription ID for the identity management group in Platform Landing Zone (GUID format). |
| `management-subscription-id` | string | No | The Azure subscription ID for the management group in Platform Landing Zone (GUID format). |
| `connectivity-subscription-id` | string | No | The Azure subscription ID for the connectivity group in Platform Landing Zone (GUID format). |
| `regions` | string | No | Comma-separated list of Azure regions for Platform Landing Zone (for example, `eastus,westus2`). |
| `environment-name` | string | No | The environment name for the Platform Landing Zone. |
| `version-control-system` | string | No | The version control system for the Platform Landing Zone. Valid values: `local`, `github`, `azuredevops`. |
| `organization-name` | string | No | The organization name for the Platform Landing Zone. |
| `location` | string | No | The Azure region location for creating new resources (for example, `eastus`, `westus2`). Required for `createmigrateproject` action. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azuremigrate platformlandingzone request -->

Choose the action that matches the task: `check` for an existing landing zone, `update` to set generation parameters, `generate` to create the landing zone, `download` to retrieve its files, `status` to inspect parameters, or `createmigrateproject` to create a migration project. When you create a project, also provide `location`. For an update, collect the requested parameter changes before you run the tool.

Example prompts include:

- "Check whether a platform landing zone exists for project \<migrate-project-name\> in resource group \<resource-group-name\>"
- "Generate a multi-region landing zone for project \<migrate-project-name\> in resource group \<resource-group-name\> by using a hub-spoke network"
- "Download the generated landing zone for project \<migrate-project-name\> in resource group \<resource-group-name\>"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Action** |  Required | The action to perform: `update` (set parameters), `check` (check existing platform landing zone), `generate` (generate platform landing zone), `download` (get download instructions), `status` (view parameter status), `createmigrateproject` (create new migration project). |
| **Migrate project name** |  Required | The Azure Migrate project name for Platform Landing Zone generation context. |
| **Resource group** |  Required | The name of the Azure resource group. This name is a logical container for Azure resources. |
| **Region type** |  Optional | The region type for the Platform Landing Zone. Valid values: `single`, `multi`. |
| **Firewall type** |  Optional | The firewall type for the Platform Landing Zone. Valid values: `azurefirewall`, `nva`. |
| **Network architecture** |  Optional | The network architecture for the Platform Landing Zone. Valid values: `hubspoke`, `vwan`. |
| **Identity subscription ID** |  Optional | The Azure subscription ID for the identity management group in Platform Landing Zone (GUID format). |
| **Management subscription ID** |  Optional | The Azure subscription ID for the management group in Platform Landing Zone (GUID format). |
| **Connectivity subscription ID** |  Optional | The Azure subscription ID for the connectivity group in Platform Landing Zone (GUID format). |
| **Regions** |  Optional | Comma-separated list of Azure regions for Platform Landing Zone (for example, `eastus,westus2`). |
| **Environment name** |  Optional | The environment name for the Platform Landing Zone. |
| **Version control system** |  Optional | The version control system for the Platform Landing Zone. Valid values: `local`, `github`, `azuredevops`. |
| **Organization name** |  Optional | The organization name for the Platform Landing Zone. |
| **Location** |  Optional | The Azure region location for creating new resources (for example, `eastus`, `westus2`). Required for `createmigrateproject` action. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Migrate documentation](/azure/migrate/)
