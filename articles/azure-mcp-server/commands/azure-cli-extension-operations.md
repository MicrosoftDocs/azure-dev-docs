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
<!-- This is the proposed command article template for the Azure MCP Server documentation -->
<!-- H1 will be <SERVICE-NAME> operations -->
# Azure CLI extension operations

The Azure MCP Server allows you to execute any Azure CLI command.

<!-- Brief description of the service with link to the official documentation. -->

[Azure Command-Line Interface (CLI)](/cli/azure/reference-index?view=azure-cli-latest) is a cross-platform command-line tool to connect to Azure and execute administrative commands on Azure resources. It allows the execution of commands through a terminal using interactive command-line prompts or a script.

> [!TIP]
> When using the Azure MCP Server, required parameters need to be in the conversation context, but they don't always need to be in the exact prompt you use to call a command. If a parameter like a subscription ID is already established in the conversation context, the MCP Server can use that information without requiring you to repeat it in every prompt. This creates a more natural conversational experience while still ensuring all necessary information is available.


## Execute CLI command

The Azure MCP Server can execute Azure CLI commands. 

<!-- the next subsection is for example prompts that would give the LLM a hint fort  -->
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
| azmcp extension az | Execute Azure CLI command.|

```console
azmcp extension az --command "<command>"
```

#### Required parameters

- `--command`: The command text.

#### Optional parameters

None

#### Examples

List resource groups

```console
azmcp extension az --command "group list"
```

Get storage account details

```console
azmcp extension az --command "storage account show --name <account-name> --resource-group <resource-group>"
```

List virtual machines

```console
azmcp extension az --command "vm list --resource-group <resource-group>"
```