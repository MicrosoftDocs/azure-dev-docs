---
title: Azure MCP Server Tools for Azure Terraform
description: Use Azure MCP Server tools to retrieve Terraform provider documentation, Azure Verified Modules information, export Azure resources to Terraform, and validate configurations against policies.
author: diberry
ms.author: diberry
ms.reviewer: yunliu1
ms.date: 05/13/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ai-usage: ai-assisted
content_well_notification:
  - AI-contribution
tool_count: 10
mcp-cli.version: "3.0.0-beta.10+7287903f962dd029489594e2ae68842f3e10ac30"
---

# Azure MCP Server tools for Azure Terraform overview

The Azure MCP Server tools help you work with Terraform for Azure by using natural-language prompts. You can retrieve AzureRM and AzAPI provider documentation, discover Azure Verified Modules, export existing Azure resources to Terraform configuration, and validate Terraform workspaces and plans against the Azure policy library ([policy-library-avm](https://github.com/Azure/policy-library-avm)) via conftest.

Azure Terraform tools cover the full lifecycle of Infrastructure as Code with Terraform on Azure, from provider documentation lookup to resource export and policy validation. For more information, see [Terraform on Azure documentation](/azure/developer/terraform/).

> [!NOTE]
> Tool annotations describe Azure-side behavior only. Some tools in this family generate local files or commands for the agent to execute, which isn't reflected in the annotation hints.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get AzureRM provider documentation

<!-- azureterraform azurerm get -->

Retrieves comprehensive AzureRM Terraform provider documentation for a specified resource type. Returns the resource summary, arguments with descriptions and requirements, attributes, usage examples, and important notes.

Example prompts include:

- **Get resource documentation**: "Show me the Terraform documentation for azurerm_resource_group"
- **Look up a data source**: "Get the data source documentation for azurerm_storage_account"
- **Filter by argument**: "Show me the documentation for the `address_space` argument on `azurerm_virtual_network`."
- **Check attributes**: "Show me the attributes for azurerm_key_vault"

| Parameter | Required or optional | Description |
|-----------|---------------------|-------------|
| **Resource type** | Required | The AzureRM Terraform resource type name (for example, `azurerm_resource_group`, `azurerm_storage_account`). The `azurerm_` prefix is optional. |
| **Doc type** | Optional | The documentation type to retrieve. Options: `resource` (default), `data-source`. |
| **Argument** | Optional | Filter results to a specific argument name. |
| **Attribute** | Optional | Filter results to a specific attribute name. |

Specify either `Argument` or `Attribute` — the tool looks up documentation for that specific element type.

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get AzAPI provider documentation

<!-- azureterraform azapi get -->

Retrieves AzAPI Terraform provider documentation and schema for a specified Azure resource type. Returns the resource schema in HCL format suitable for `azapi_resource` blocks, including property definitions with types and requirements, parent resource information, and Terraform usage examples. This tool reuses Azure Bicep type definitions to generate accurate AzAPI schemas.

Example prompts include:

- **Get resource schema**: "Show me the AzAPI schema for Microsoft.Compute/virtualMachines"
- **Specific API version**: "Get the AzAPI documentation for Microsoft.Storage/storageAccounts at API version 2023-05-01"
- **Explore a resource type**: "What properties does Microsoft.Network/virtualNetworks have in AzAPI?"

| Parameter | Required or optional | Description |
|-----------|---------------------|-------------|
| **Resource type** | Required | The Azure resource type in ARM format (for example, `Microsoft.Compute/virtualMachines`, `Microsoft.Storage/storageAccounts`). |
| **API version** | Optional | The API version to use for the resource schema. If omitted, the latest stable version is used. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## List Azure Verified Modules

<!-- azureterraform avm list -->

Retrieves all available Azure Verified Modules (AVM) for Terraform. Returns a list of modules with their name, description, source reference, and repository URL. The source field can be used directly in Terraform module blocks.

Example prompts include:

- **List all modules**: "List all available Azure Verified Modules for Terraform"
- **Find modules**: "What Azure Verified Modules are available for storage?"
- **Browse modules**: "Show me the AVM module catalog"

This tool has no required parameters.

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get Azure Verified Module versions

<!-- azureterraform avm versions -->

Retrieves all available versions of a specified Azure Verified Module (AVM). Returns version tags with creation dates, sorted from newest to oldest. The first version in the list is the latest.

Example prompts include:

- **Check versions**: "What versions are available for avm-res-storage-storageaccount?"
- **Latest version**: "What is the latest version of the AVM module for virtual networks?"

| Parameter | Required or optional | Description |
|-----------|---------------------|-------------|
| **Module name** | Required | The name of the Azure Verified Module (for example, `avm-res-storage-storageaccount`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get Azure Verified Module documentation

<!-- azureterraform avm get -->

Retrieves the documentation (README.md) for a specific version of an Azure Verified Module (AVM). Returns the full module documentation including usage examples, input variables, output values, and resource descriptions.

Example prompts include:

- **Get module docs**: "Show me the documentation for avm-res-storage-storageaccount version 0.4.0"
- **Usage examples**: "Get usage examples for the AVM key vault module version 0.3.0"

| Parameter | Required or optional | Description |
|-----------|---------------------|-------------|
| **Module name** | Required | The name of the Azure Verified Module (for example, `avm-res-storage-storageaccount`). |
| **Module version** | Required | The version of the Azure Verified Module (for example, `0.4.0`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Export a single resource to Terraform

<!-- azureterraform aztfexport resource -->

Generates an `aztfexport` command to export a single Azure resource to Terraform configuration. Returns the command and arguments for the agent to execute locally. If `aztfexport` isn't installed locally, returns installation instructions instead.

Example prompts include:

- **Export a resource**: "Export my storage account to Terraform configuration"
- **Use AzAPI provider**: "Export resource /subscriptions/.../storageAccounts/myaccount using the azapi provider"
- **Custom name**: "Export this VM to Terraform with resource name 'primary_vm'"

Set this to `false` for authoritative exports — when `true`, the export may complete with skipped resources or incomplete infrastructure-as-code.

| Parameter | Required or optional | Description |
|-----------|---------------------|-------------|
| **Resource ID** | Required | The full Azure resource ID to export (for example, `/subscriptions/.../resourceGroups/.../providers/Microsoft.Storage/storageAccounts/mystorageaccount`). |
| **Output folder** | Optional | Output folder name for the generated Terraform files. No default — the tool prompts for a path when omitted. |
| **Provider** | Optional | Terraform provider to use: `azurerm` (default) or `azapi`. |
| **Terraform resource name** | Optional | Custom resource name to use in the generated Terraform configuration. |
| **Include role assignment** | Optional | Include role assignments in the export. |
| **Parallelism** | Optional | Number of parallel operations (default: 10, max: 50). |
| **Continue on error** | Optional | Continue export even if some resources fail (default: true). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ✅

## Export a resource group to Terraform

<!-- azureterraform aztfexport resourcegroup -->

Generates an `aztfexport` command to export an Azure resource group and all its resources to Terraform configuration. Returns the command and arguments for the agent to execute locally. If `aztfexport` isn't installed locally, returns installation instructions instead.

Example prompts include:

- **Export a resource group**: "Export the my-app-rg resource group to Terraform"
- **Custom naming**: "Export resource group production-rg with name pattern 'prod_{type}'"
- **Use AzAPI**: "Export my resource group to Terraform using the azapi provider"

Set this to `false` for authoritative exports — when `true`, the export may complete with skipped resources or incomplete infrastructure-as-code.

| Parameter | Required or optional | Description |
|-----------|---------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group to export. |
| **Output folder** | Optional | Output folder name for the generated Terraform files. No default — the tool prompts for a path when omitted. |
| **Provider** | Optional | Terraform provider to use: `azurerm` (default) or `azapi`. |
| **Name pattern** | Optional | Pattern for naming resources in the generated Terraform configuration. |
| **Include role assignment** | Optional | Include role assignments in the export. |
| **Parallelism** | Optional | Number of parallel operations (default: 10, max: 50). |
| **Continue on error** | Optional | Continue export even if some resources fail (default: true). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ✅

## Export resources by query to Terraform

<!-- azureterraform aztfexport query -->

Generates an `aztfexport` command to export Azure resources matching an Azure Resource Graph query to Terraform configuration. Returns the command and arguments for the agent to execute locally. If `aztfexport` isn't installed locally, returns installation instructions instead.

Example prompts include:

- **Export by type**: "Export all storage accounts to Terraform"
- **Export by query**: "Export resources matching type =~ 'Microsoft.Web/sites' to Terraform"
- **Custom output**: "Export all VMs to Terraform in the 'infra-output' folder"

Set this to `false` for authoritative exports — when `true`, the export may complete with skipped resources or incomplete infrastructure-as-code.

| Parameter | Required or optional | Description |
|-----------|---------------------|-------------|
| **Query** | Required | Azure Resource Graph KQL WHERE clause to select resources for export (for example, `type =~ 'Microsoft.Storage/storageAccounts'`). |
| **Output folder** | Optional | Output folder name for the generated Terraform files. No default — the tool prompts for a path when omitted. |
| **Provider** | Optional | Terraform provider to use: `azurerm` (default) or `azapi`. |
| **Name pattern** | Optional | Pattern for naming resources in the generated Terraform configuration. |
| **Include role assignment** | Optional | Include role assignments in the export. |
| **Parallelism** | Optional | Number of parallel operations (default: 10, max: 50). |
| **Continue on error** | Optional | Continue export even if some resources fail (default: true). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ✅

## Validate Terraform workspace against policies

<!-- azureterraform conftest workspace -->

Generates a `conftest` command to validate Terraform `.tf` files in a workspace against Azure policies. Returns the command and arguments for the agent to execute locally. Uses the Azure policy library ([policy-library-avm](https://github.com/Azure/policy-library-avm)) for validation with configurable policy sets. If `conftest` isn't installed locally, returns installation instructions instead.

Example prompts include:

- **Validate workspace**: "Validate my Terraform workspace against Azure policies"
- **Specific policy set**: "Check my Terraform files against the Azure Proactive Resiliency Library"
- **Security policies**: "Run avmsec policies with high severity filter on my Terraform workspace"

| Parameter | Required or optional | Description |
|-----------|---------------------|-------------|
| **Workspace folder** | Required | Path to the Terraform workspace folder containing `.tf` files to validate. |
| **Policy set** | Optional | Policy set to use for validation: `all` (default), `Azure-Proactive-Resiliency-Library-v2`, or `avmsec`. |
| **Severity filter** | Optional | Severity filter for avmsec policies: `high`, `medium`, `low`, or `info`. Only applicable when policy set is `avmsec`. No default — all severities included. |
| **Custom policies** | Optional | Comma-separated list of custom policy paths to include in validation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ✅

## Validate Terraform plan against policies

<!-- azureterraform conftest plan -->

Generates a `conftest` command to validate a Terraform plan JSON file against Azure policies. Returns the command and arguments for the agent to execute locally. Uses the Azure policy library ([policy-library-avm](https://github.com/Azure/policy-library-avm)) for validation with configurable policy sets. If `conftest` isn't installed locally, returns installation instructions instead.

Example prompts include:

- **Validate plan**: "Validate my Terraform plan against Azure policies"
- **Resiliency check**: "Check my tfplan.json against the Azure Proactive Resiliency Library"
- **Filter by severity**: "Run avmsec policies with medium severity on my Terraform plan"

| Parameter | Required or optional | Description |
|-----------|---------------------|-------------|
| **Plan folder** | Required | Path to the folder containing the Terraform plan JSON file (`tfplan.json`) to validate. |
| **Policy set** | Optional | Policy set to use for validation: `all` (default), `Azure-Proactive-Resiliency-Library-v2`, or `avmsec`. |
| **Severity filter** | Optional | Severity filter for avmsec policies: `high`, `medium`, `low`, or `info`. Only applicable when policy set is `avmsec`. No default — all severities included. |
| **Custom policies** | Optional | Comma-separated list of custom policy paths to include in validation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ✅

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Terraform best practices for Azure](azure-terraform-best-practices.md)
- [Terraform on Azure documentation](/azure/developer/terraform/)
- [Azure Verified Modules registry](https://registry.terraform.io/namespaces/Azure)
- [Azure Export for Terraform](/azure/developer/terraform/azure-export-for-terraform/export-terraform-overview)
