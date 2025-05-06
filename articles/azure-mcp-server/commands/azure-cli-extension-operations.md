---
title: Azure CLI Extension Operations
description: Learn how to use the Azure MCP Server with the Azure CLI Extension.
keywords:  azure mcp server, azmcp, azure cli extension
author: diberry
ms.author: diberry
ms.date: 5/05/2025
ms.topic: reference
ms.custom: build-2025
---
# Azure CLI extension operations

The Azure MCP Server allows you to execute any Azure CLI command.

[Azure Command-Line Interface (CLI)](/cli/azure) is a cross-platform command-line tool to connect to Azure and execute administrative commands on Azure resources. It allows the execution of commands through a terminal using interactive command-line prompts or a script.

Find commands in the [reference documentation](/cli/azure/reference-index).

[!INCLUDE [tip-about-params](./includes/commands/parameter-consideration.md)]

## Execute CLI command

The Azure MCP Server can execute Azure CLI commands. 

### Example prompts

Example prompts for using the Azure MCP Server with Azure CLI extensions.

- **List my Azure resources**: "Show me all my resource groups"
- **Query specific details**: "Get details for storage account mystorageacct01 in the dev-rg resource group"
- **Check virtual machine status**: "Are any of my VMs in eastus running right now?"
- **Manage security settings**: "I need to see all network security groups in my subscription"
- **Create a new resource**: "Create a new resource group called 'project-alpha' in westus2"
- **Perform maintenance**: "Please stop the VM named 'webserver01'"
- **Configure service settings**: "Update my App Service plan to P2v2 tier"
- **Check compliance**: "Show me which of my storage accounts don't have secure transfer enabled"
- **Export data**: "Export the list of all my AKS clusters to a table"
- **Clean up resources**: "Delete the resource group 'temp-project' without prompting for confirmation"

### Command reference

The Azure MCP Server has commands to execute Azure CLI commands.  

| Name            | Description               |
|-----------------|--------------------------|
| azmcp extension az | Execute Azure CLI command. |

```console
azmcp extension az --command "<COMMAND>"
```

#### Required parameters

- `--command`: The command text.

#### Optional parameters

None

#### Examples

List resource groups with [group list](/cli/azure/group#az-group-list).

```console
azmcp extension az --command "group list"
```

Get storage account details with [storage account show](/cli/azure/storage/account#az-storage-account-show).

```console
azmcp extension az --command "storage account show --name <ACCOUNT-NAME> --resource-group <RESOURCE-GROUP>"
```

List virtual machines with [vm list](/cli/azure/vm#az-vm-list).

```console
azmcp extension az --command "vm list --resource-group <RESOURCE-GROUP>"
```