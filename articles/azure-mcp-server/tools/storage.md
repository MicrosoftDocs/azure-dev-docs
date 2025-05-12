---
title: Azure Storage Tools 
description: Learn how to use the Azure MCP Server with Azure Storage.
keywords: azure mcp server, azmcp, storage account, blob storage
author: diberry
ms.author: diberry
ms.date: 5/12/2025
ms.topic: reference
ms.custom: build-2025
--- 
# Storage tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Storage resources, including storage accounts, containers, and blobs.

[Azure Storage](/azure/storage/common/storage-introduction) is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers highly available, massively scalable, durable, and secure storage for a variety of data objects in the cloud.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Use existing MCP server for Storage

### List accounts

The Azure MCP Server can list all storage accounts in a subscription. This provides an overview of your storage infrastructure.

**Example prompts** include:

- **List accounts**: "Show me all storage accounts in my subscription."
- **View accounts**: "What storage accounts do I have available?"
- **Find accounts**: "List my storage accounts"
- **Query accounts**: "Show all my storage resources"
- **Check accounts**: "Storage accounts in subscription abc123"

### List containers

The Azure MCP Server can list all blob containers in a storage account. This helps you organize and manage your blob data.

**Example prompts** include:

- **List containers**: "Show me all containers in my 'mystorageaccount' storage account."
- **View containers**: "What containers do I have in storage account 'appdata'?"
- **Find containers**: "List all containers in my storage 'userfiles'"
- **Query containers**: "Show available containers in my storage account"
- **Check containers**: "Get all blob containers in my 'mediafiles' storage"

### Container details

The Azure MCP Server can show detailed information about a specific container in a storage account. This includes metadata, access policies, and other properties.

**Example prompts** include:

- **Container details**: "Show me details about the 'documents' container in my 'mystorageaccount' storage account."
- **Container info**: "Get properties of container 'images' in storage account 'mediafiles'"
- **Container properties**: "What are the settings for my 'backups' container?"
- **Container status**: "Check access policy for 'userdata' container"
- **Container metadata**: "Show me the metadata for the 'logs' container in my storage account"

### List blobs

The Azure MCP Server can list all blobs in a container. This helps you manage the files stored in your blob storage.

**Example prompts** include:

- **List blobs**: "Show me all files in the 'documents' container in my 'mystorageaccount' storage account."
- **View blobs**: "What files do I have in container 'images'?"
- **Find blobs**: "List all files in my 'backups' container"
- **Query blobs**: "Show available files in container 'logs'"
- **Check blobs**: "Get all blobs in my 'userdata' container"

### List tables

The Azure MCP Server can list all tables in a storage account. This helps you manage your structured NoSQL data.

**Example prompts** include:

- **List tables**: "Show me all tables in my 'mystorageaccount' storage account."
- **View tables**: "What tables do I have in storage account 'appdata'?"
- **Find tables**: "List all tables in my storage 'userdata'"
- **Query tables**: "Show available tables in my storage account"
- **Check tables**: "Get all storage tables in my 'analyticsdata' account"

## Develop new MCP server for Storage

### List accounts

The Azure MCP Server can list all storage accounts in a subscription.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp storage account list | List storage accounts in a subscription.|

```console
azmcp storage account list \
    --subscription <SUBSCRIPTION_ID>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription to list storage accounts from.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

List all storage accounts in the specified subscription.

```console
azmcp storage account list \
    --subscription "my-subscription-id"
```

### List containers

The Azure MCP Server can list all blob containers in a storage account.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp storage blob container list | List blob containers in a storage account.|

```console
azmcp storage blob container list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <STORAGE_ACCOUNT_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the storage account.<br>
`--account-name`: The name of the storage account.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

List all containers in the specified storage account.

```console
azmcp storage blob container list \
    --subscription "my-subscription-id" \
    --account-name "mystorageaccount"
```

### Container details

The Azure MCP Server can show detailed information about a specific container in a storage account.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp storage blob container details | Get details of a blob container.|

```console
azmcp storage blob container details \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <STORAGE_ACCOUNT_NAME> \
    --container-name <CONTAINER_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the storage account.<br>
`--account-name`: The name of the storage account.<br>
`--container-name`: The name of the container to get details for.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

Get details of a specific container in the storage account.

```console
azmcp storage blob container details \
    --subscription "my-subscription-id" \
    --account-name "mystorageaccount" \
    --container-name "documents"
```

### List blobs

The Azure MCP Server can list all blobs in a container.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp storage blob list | List blobs in a container.|

```console
azmcp storage blob list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <STORAGE_ACCOUNT_NAME> \
    --container-name <CONTAINER_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the storage account.<br>
`--account-name`: The name of the storage account.<br>
`--container-name`: The name of the container to list blobs from.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

List all blobs in the specified container.

```console
azmcp storage blob list \
    --subscription "my-subscription-id" \
    --account-name "mystorageaccount" \
    --container-name "documents"
```

### List tables

The Azure MCP Server can list all tables in a storage account.

#### Reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp storage table list | List tables in a storage account.|

```console
azmcp storage table list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <STORAGE_ACCOUNT_NAME>
```

View the [structured JSON output](get-started.md#response-format-common-to-all-tools) common to all tools.

##### Required parameters

`--subscription`: The ID of the subscription containing the storage account.<br>
`--account-name`: The name of the storage account.

##### Optional parameters

View the [optional parameters](get-started.md#optional-parameters-common-to-all-tools) common to all tools.

#### Examples

List all tables in the specified storage account.

```console
azmcp storage table list \
    --subscription "my-subscription-id" \
    --account-name "mystorageaccount"
```

