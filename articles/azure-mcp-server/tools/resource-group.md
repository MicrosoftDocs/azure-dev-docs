---
title: Azure Resource Group Tools 
description: Learn how to use the Azure MCP Server with Azure Resource Groups.
keywords: azure mcp server, azmcp, resource group
author: diberry
ms.author: diberry
ms.date: 5/12/2025
ms.topic: reference
ms.custom: build-2025
--- 
# Resource Group tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure resource groups, providing foundational resource organization capabilities.

[Azure Resource Groups](/azure/azure-resource-manager/management/overview) are logical containers that help you organize and manage your Azure resources. Resource groups make it easier to administer your resources by deployment, billing, or natural affinity.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Use existing server

### List resource groups

The Azure MCP Server can list all resource groups in a subscription. This helps you see your organizational structure at a glance.

**Example prompts** include:

- **List groups**: "Show me all resource groups in my subscription."
- **View groups**: "What resource groups do I have available?"
- **Find groups**: "List all my resource groups"
- **Query groups**: "Show my resource group organization"
- **Check groups**: "Resource groups in subscription abc123"

### Create resource group

The Azure MCP Server can create a new resource group in your subscription. This helps you establish organization for new projects or workloads.

**Example prompts** include:

- **Create group**: "Create a new resource group called 'app-dev-resources' in the East US region."
- **Make group**: "Set up a new resource group named 'project-alpha-rg' in West Europe"
- **Add group**: "I need a new resource group called 'data-analytics' in Central US"
- **New group**: "Create a resource group for my test environment in South Central US"
- **Establish group**: "Create 'frontend-resources-rg' in East US 2 for my web apps"

### Delete resource group

The Azure MCP Server can delete a resource group from your subscription. This operation deletes all resources within the group, so use it carefully.

**Example prompts** include:

- **Delete group**: "Delete the resource group named 'old-project-resources' from my subscription."
- **Remove group**: "Get rid of the 'test-environment' resource group"
- **Purge group**: "Permanently delete the 'temporary-resources' group"
- **Eliminate group**: "Delete the unused development resource group"
- **Clean up group**: "Remove the deprecated 'poc-resources' group from my subscription"

## Develop new server

### List resource groups

The Azure MCP Server can list all resource groups in a subscription.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp group list | List resource groups in a subscription.|

```console
azmcp group list \
    --subscription <SUBSCRIPTION_ID>
```

##### Required parameters

`--subscription`: The ID of the subscription to list resource groups from.

##### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

List all resource groups in the specified subscription.

```console
azmcp group list \
    --subscription "my-subscription-id"
```

### Create resource group

The Azure MCP Server can create a new resource group in your subscription.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp group create | Create a new resource group.|

```console
azmcp group create \
    --subscription <SUBSCRIPTION_ID> \
    --name <RESOURCE_GROUP_NAME> \
    --location <LOCATION> \
    [--tags <TAGS>]
```

##### Required parameters

`--subscription`: The ID of the subscription where the resource group will be created.<br>
`--name`: The name of the resource group to create.<br>
`--location`: The Azure region where the resource group will be created.

##### Optional parameters

`--tags`: Space-separated tags in 'key=value' format.

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Create a new resource group without tags.

```console
azmcp group create \
    --subscription "my-subscription-id" \
    --name "app-dev-resources" \
    --location "eastus"
```

Create a new resource group with tags.

```console
azmcp group create \
    --subscription "my-subscription-id" \
    --name "project-alpha-rg" \
    --location "westeurope" \
    --tags "Environment=Production" "Project=Alpha" "Department=Engineering"
```

### Delete resource group

The Azure MCP Server can delete a resource group from your subscription. This operation deletes all resources within the group.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp group delete | Delete a resource group.|

```console
azmcp group delete \
    --subscription <SUBSCRIPTION_ID> \
    --name <RESOURCE_GROUP_NAME>
```

##### Required parameters

`--subscription`: The ID of the subscription containing the resource group.<br>
`--name`: The name of the resource group to delete.

##### Optional parameters

[!INCLUDE [common-parameters](../includes/tools/common-parameters.md)]

##### JSON response

[!INCLUDE [JSON response](../includes/tools/response-format.md)]

#### Examples

Delete a resource group from the subscription.

```console
azmcp group delete \
    --subscription "my-subscription-id" \
    --name "old-project-resources"
```
