---
title: Azure Storage Operations
description: Learn how to use the Azure MCP Server with Azure Storage.
keywords:  azure mcp server, azmcp, storage
author: diberry
ms.author: diberry
ms.date: 5/05/2025
ms.topic: reference
ms.custom: build-2025
---
<!-- This is the proposed command article template for the Azure MCP Server documentation -->
<!-- H1 will be <SERVICE-NAME> operations -->
# Azure Storage operations for the Azure MCP Server

The Azure MCP Server allows you to list Azure storage resource information such as [Blob](/azure/storage/blobs) storage and [Table](/azure/storage/tables/) storage.

<!-- Brief description of the service with link to the official documentation. -->

[Azure Storage](/azure/storage/common/storage-introduction) is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers highly available, massively scalable, durable, and secure storage for a variety of data objects in the cloud, including blobs, files, queues, and tables. Azure Storage is designed for applications requiring scalability, data accessibility, and durability.

[!INCLUDE [tip-about-params](../includes/commands/parameter-consideration.md)]

## List storage accounts

The Azure MCP Server can list storage accounts in a subscription. This is useful for quickly checking the status of your storage resources.

<!-- the next subsection is for example prompts that would give the LLM a hint fort  -->
### Example prompts

Example prompts for using the Azure MCP Server with Azure Storage.

<!-- create several examples for the reader that capture the intent -->
- **List accounts**: "List all storage accounts in my subscription."
- **Show accounts**: "What storage accounts do I have?"
- **Find accounts**: "I need to see my storage resources"
- **Query accounts**: "Can you show me all my storage accounts?"
- **Check accounts**: "Storage accounts in subscription abc123"

<!-- The command reference is for the tool command that will run by the MCP Server -->
### Command reference

The Azure MCP Server has commands to manage Azure Storage resources. Advanced users and automation tools use these commands.

| Name            | Description               |
|-----------------|--------------------------|
| azmcp storage account list | List storage accounts in a subscription.|

```console
azmcp storage account list \
    --subscription <SUBSCRIPTION_ID>
```

#### Required parameters

`--subscription`: The ID of the subscription to list storage accounts from. This parameter is required.
 
#### Optional parameters

None

#### Examples

List all storage accounts in the specified subscription.

```console
azmcp storage account list \
    --subscription "my-subscription-id"
```


## List storage containers

The Azure MCP Server can list all [blobs](/azure/storage/blobs) containers in a storage account. This allows you to view your containers in one place.

### Example prompts

- **List all containers**: "Show me all the blob containers in my 'mystorageaccount' storage account."
- **List containers**: "List all containers in my storage account"
- **Get container names**: "What containers do I have in my 'devstorageaccount'?"
- **View containers**: "List all blob containers from contosostorage"
- **Check containers**: "Show me what containers are in my storage account"

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp storage blob container list | List blob containers in a storage account.|

```console
azmcp storage blob container list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME>
```

#### Required parameters

`--subscription`: The ID of the subscription containing the storage account.<br>
`--account-name`: The name of the storage account.

#### Optional parameters

None

#### Examples

List all blob containers in the specified storage account.

```console
azmcp storage blob container list \
    --subscription "my-subscription-id" \
    --account-name "mystorageaccount"
```

## List storage blobs

The Azure MCP Server can list [blobs](/azure/storage/blobs) within a container in a storage account. This allows you to view the contents of a container.

### Example prompts

- **List all blobs**: "Show me all the blobs in the 'images' container of my 'mystorageaccount' storage account."
- **List blobs**: "List all files in my 'documents' container"
- **Get blob names**: "What blobs do I have in the 'backups' container of my storage account?"
- **View blobs**: "List all blobs from the 'uploads' container in contosostorage"
- **Check blobs**: "Show me what files are in my 'logs' container"

### Command reference

| Name            | Description               |
|-----------------|--------------------------|
| azmcp storage blob list | List blobs in a container.|

```console
azmcp storage blob list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    --container-name <CONTAINER_NAME>
```

#### Required parameters

`--subscription`: The ID of the subscription containing the storage account.<br>
`--account-name`: The name of the storage account.<br>
`--container-name`: The name of the container to list blobs from.

#### Optional parameters

None.

#### Examples

List all [blobs](/azure/storage/blobs) in a container.

```console
azmcp storage blob list \
    --subscription "my-subscription-id" \
    --account-name "mystorageaccount" \
    --container-name "images"
```

List blobs with a specific prefix.

```console
azmcp storage blob list \
    --subscription "my-subscription-id" \
    --account-name "mystorageaccount" \
    --container-name "images"
```

## Get storage blob properties

Get detailed properties of a storage container.

### Example prompts

- **View container details**: "Show me the details of the 'images' container in my storage account."
- **Get container properties**: "What are the properties of the 'documents' container in mystorageaccount?"
- **Check container settings**: "Tell me about my 'backups' container in contosostorage."
- **View container metadata**: "Get the details of the 'media' container"
- **Container information**: "What's the access level of my 'public' container?"

### Command reference


| Name            | Description               |
|-----------------|--------------------------|
| azmcp storage blob container details | Get detailed properties of a storage container.|

```console
azmcp storage blob container details \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME> \
    --container-name <CONTAINER_NAME>
```

#### Required parameters

`--subscription`: The ID of the subscription containing the storage account.<br>
`--account-name`: The name of the storage account.<br>
`--container-name`: The name of the container to list blobs from.

#### Optional parameters

None.

#### Examples

Get details of a specific container.

```console
azmcp storage blob container details \
    --subscription "my-subscription-id" \
    --account-name "mystorageaccount" \
    --container-name "images"
```


## List storage tables

List [tables](/azure/storage/tables/) in a Storage account.

### Example prompts

- **List all tables**: "Show me all the tables in my 'mystorageaccount' storage account."
- **List tables**: "List all tables in my storage account"
- **Get table names**: "What tables do I have in my 'devstorageaccount'?"
- **View tables**: "List all tables from contosostorage"
- **Check tables**: "Show me what tables are in my storage account"

### Command reference


| Name            | Description               |
|-----------------|--------------------------|
| azmcp storage table list | List tables in a Storage account.|

```console
azmcp storage table list \
    --subscription <SUBSCRIPTION_ID> \
    --account-name <ACCOUNT_NAME>
```


#### Required parameters

`--subscription`: The ID of the subscription containing the storage account.<br>
`--account-name`: The name of the storage account.

#### Optional parameters

None.

#### Examples

List all tables in a storage account.

```console
azmcp storage table list \
    --subscription "my-subscription-id" \
    --account-name "mystorageaccount"
```

