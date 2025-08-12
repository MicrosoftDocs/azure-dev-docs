---
title: Azure Storage Tools 
description: Learn how to use the Azure MCP Server with Azure Storage.
keywords: azure mcp server, azmcp, storage account, blob storage
author: diberry
ms.author: diberry
ms.date: 08/12/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Storage tools for the Azure MCP Server

The Azure MCP Server enables you to manage Azure Storage resources, including storage accounts, containers, tables, and blobs with natural language prompts. You don't need to remember specific command syntax.

[Azure Storage](/azure/storage/common/storage-introduction) is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers highly available, massively scalable, durable, and secure storage for various data objects in the cloud.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Account: create

Create a new Azure Storage account.

Example prompts include:

- **Create account**: "Create a storage account named 'mystorageaccount' in 'eastus'."
- **New storage**: "Set up a new storage account called 'datastore2025' in region 'westus2'."
- **Specify SKU and kind**: "Create a storage account 'mydata' in 'eastus' with Standard_GRS and kind StorageV2."
- **Secure storage**: "Create a storage account 'securestore' in 'centralus' with HTTPS only."
- **Enable Data Lake**: "Set up a storage account 'datalakeacct' in 'westeurope' with hierarchical namespace enabled."

| Parameter | Required or optional | Description |
|-----------------------------|----------------------|-------------|
| **Account** | Required | The name of the Azure Storage account to create. Must be globally unique, 3-24 characters, lowercase letters and numbers only. |
| **Region** | Required | The Azure region where the storage account will be created (for example, 'eastus', 'westus2'). |
| **SKU** | Optional | The storage account SKU. Valid values: Standard_LRS, Standard_GRS, Standard_RAGRS, Standard_ZRS, Premium_LRS, Premium_ZRS, Standard_GZRS, Standard_RAGZRS. |
| **Kind** | Optional | The storage account kind. Valid values: Storage, StorageV2, BlobStorage, FileStorage, BlockBlobStorage. |
| **Default access tier for blobs** | Optional | The default access tier for blob storage. Valid values: Hot, Cool. |
| **Require secure transfer (HTTPS)** | Optional | Whether to require secure transfer (HTTPS) for the storage account. |
| **Allow public access to blobs** | Optional | Whether to allow public access to blobs in the storage account. |
| **Enable hierarchical namespace (Data Lake)** | Optional | Whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |


## Account: list 

The Azure MCP Server can list all storage accounts in a subscription. This functionality provides an overview of your storage infrastructure.

Example prompts include:

- **List accounts**: "Show me all storage accounts in my subscription."
- **View accounts**: "What storage accounts do I have available?"
- **Find accounts**: "List my storage accounts."
- **Query accounts**: "Show all my storage resources."
- **Check accounts**: "Storage accounts in subscription abc123."

## Blob: set blob access tier in a batch

Azure MCP Server can set the access tier for multiple blobs in a single batch operation. This functionality efficiently changes the storage tier for multiple blobs simultaneously to optimize storage costs and access patterns based on your data usage needs.

Example prompts include:

- **Set tier for multiple blobs**: "Set the access tier to 'Cool' for files 'data1.csv' and 'data2.csv' in my 'analytics' container."
- **Archive old files**: "Change the tier to 'Archive' for all backup files in container 'backups'"
- **Optimize storage costs**: "Set tier to 'Hot' for frequently accessed files in my 'documents' container"
- **Batch tier change**: "Move files to 'Cool' tier: 'log1.txt', 'log2.txt', 'log3.txt' in container 'logs'"
- **Update access tier**: "Change access tier to 'Archive' for multiple files in my storage account"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account** | Required | The name of the Azure Storage account. This name is unique to Azure (for example, 'mystorageaccount'). |
| **Container** | Required | The name of the container to access within the storage account. |
| **Tier** | Required | The access tier to set for the blobs. Valid values include Hot, Cool, Archive, and others depending on the storage account type. |
| **Blob names** | Required | The names of the blobs to set the access tier for. Provide multiple blob names separated by spaces. Each blob name should be the full path within the container (for example, 'file1.txt' or 'folder/file2.txt'). |


## Blob: get container details

The Azure MCP Server shows detailed information about a specific container in a storage account. This information includes metadata, access policies, and other properties.

Example prompts include:

- **Container details**: "Show me details about the 'documents' container in my 'mystorageaccount' storage account."
- **Container info**: "Get properties of container 'images' in storage account 'media_files'"
- **Container properties**: "What are the settings for my 'backups' container?"
- **Container status**: "Check access policy for 'user_data' container"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account** | Required | The name of the Azure Storage account. |
| **Container** | Required | The name of the container to access. |


## Blob: List containers

The Azure MCP Server can list all blob containers in a storage account. This functionality helps you organize and manage your blob data.

Example prompts include:

- **List containers**: "Show me all containers in my 'mystorageaccount' storage account."
- **View containers**: "What containers do I have in storage account 'app_data'?"
- **Find containers**: "List all containers in my storage 'user_files'"
- **Query containers**: "Show available containers in my storage account"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account** | Required | The name of the Azure Storage account. |

## Blob: list container blobs

The Azure MCP Server can list all blobs in a container. This feature helps you manage the files stored in your blob storage.

Example prompts include:

- **List blobs**: "Show me all files in the 'documents' container in my 'mystorageaccount' storage account."
- **View blobs**: "What files do I have in container 'images'?"
- **Find blobs**: "List all files in my 'backups' container"
- **Query blobs**: "Show available files in container 'logs'"
- **Check blobs**: "Get all blobs in my 'user_data' container"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account** | Required | The name of the Azure Storage account. |
| **Container** | Required | The name of the container to access. |

## Blob: get blob details

Get blob properties, metadata, and general information. 

Example prompts include:

- **Get blob details**: "Show me details for 'file.txt' in container 'documents' in storage account 'mystorageaccount'."
- **Blob properties**: "Get properties of blob 'image1.png' in container 'photos' in storage account 'mediafiles'."
- **Blob metadata**: "What is the metadata for 'backup.zip' in 'backups' container in 'mydata' storage account?"

| Parameter | Required or optional | Description |
|-----------------------------|----------------------|-------------|
| **Account** | Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| **Container** | Required | The name of the container to access within the storage account. |
| **Blob** | Required | The name of the blob to access within the container. This should be the full path within the container (for example, 'file.txt' or 'folder/file.txt'). |

## Datalake: create directory

The Azure MCP Server can create directories in a Data Lake file system. This functionality helps you organize your hierarchical data structure in Azure Data Lake Storage by creating new folder paths as needed.

Example prompts include:

- **Create directory**: "Create a new directory called 'data/logs' in my 'analytics' file system in storage account 'mydatalake'."
- **Make folder**: "Create folder 'archives/2024' in file system 'backup-data'"
- **New directory**: "Make a directory 'processed/monthly' in my data lake file system"
- **Create path**: "Create directory structure 'raw-data/sales/quarterly' in my file system"
- **Make subdirectory**: "Create subdirectory 'temp/staging' in my 'workflow' file system"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Directory path** | Required | The full path of the directory to create in the Data Lake, including the file system name (for example, 'myfilesystem/data/logs' or 'myfilesystem/archives/2024'). Use forward slashes (/) to separate the file system name from the directory path and for subdirectories. |
| **Account** | Required | The name of the Azure Storage account. This name is unique to Azure (for example, 'mystorageaccount'). |

## Datalake: list file system paths

The Azure MCP Server can list all paths (files and directories) in a Data Lake file system. This functionality helps you explore and manage your hierarchical data stored in Azure Data Lake Storage.

Example prompts include:

- **List paths**: "Show me all files and folders in the 'data' file system in my 'mydatalake' storage account."
- **View paths**: "What paths are available in file system 'logs'?"
- **Find paths**: "List all paths in my 'analytics' file system"
- **Query paths**: "Show available files and directories in file system 'raw-data'"
- **Check paths**: "Get all paths in my 'processed-data' file system"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **File system name** | Required | The name of the Data Lake file system to access within the storage account. |
| **Account** | Required | The name of the Azure Storage account. This name is unique to Azure (for example, 'mystorageaccount'). |
| **Filter path** | Optional | The prefix to filter paths in the Data Lake. Only paths that start with this prefix will be listed. |
| **Recursive** | Optional | Flag to indicate whether the command operates recursively on all subdirectories. |


## Queue: send message

Send messages to an Azure Storage queue for asynchronous processing.

Example prompts include:

- **Send message**: "Send 'Hello, world!' to the 'tasks' queue in storage account 'mystorageaccount'."
- **Set message TTL**: "Send 'process this' to queue 'jobs' in storage account 'workdata' with a time-to-live of 3600 seconds."
- **Set visibility timeout**: "Send 'start job' to queue 'operations' in storage account 'prodstore' with a visibility timeout of 30 seconds."

| Parameter | Required or optional | Description |
|-----------------------------|----------------------|-------------|
| **Account** | Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| **Queue** | Required | The name of the queue to access within the storage account. |
| **Message** | Required | The content of the message to send to the queue. |
| **Time-to-live (seconds)** | Optional | The time-to-live for the message in seconds. If not specified, the message uses the queue's default TTL. Set to -1 for messages that never expire. |
| **Visibility timeout (seconds)** | Optional | The visibility timeout for the message in seconds. This determines how long the message will be invisible after it's retrieved. If not specified, defaults to 0 (immediately visible). |


## Share: list files

The Azure MCP Server can list files and directories within a file share directory. This functionality recursively lists all items in a specified file share directory, including files, subdirectories, and their properties. Files and directories may be filtered by a prefix.

Example prompts include:

- **List files**: "Show me all files in the 'documents' directory of my 'myshare' file share in storage account 'mystorageaccount'."
- **View directory contents**: "What files are in directory 'projects/2024' in my 'teamshare' file share?"
- **Find files with prefix**: "List all files starting with 'report_' in directory 'reports' of my file share"
- **Browse folders**: "Show contents of directory 'uploads/images' in my file share"
- **Check directory**: "Get all files and folders in 'backup/daily' directory of my file share"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account** | Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| **Share** | Required | The name of the file share to access within the storage account. |
| **Directory path** | Required | The path of the directory to list within the file share (for example, 'documents/projects' or 'uploads/2024'). Use forward slashes (/) to separate subdirectories. |
| **Prefix** | Optional | Optional prefix to filter results. Only items that start with this prefix are returned. |

## Table: list tables

The Azure MCP Server can list all tables in a storage account. This functionality helps you manage your structured NoSQL data.

Example prompts include:

- **List tables**: "Show me all tables in my 'mystorageaccount' storage account."
- **View tables**: "What tables do I have in storage account 'app_data'?"
- **Find tables**: "List all tables in my storage 'user_data'"
- **Query tables**: "Show available tables in my storage account"
- **Check tables**: "Get all storage tables in my 'analytics_data' account"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account** | Required | The name of the Azure Storage account. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)