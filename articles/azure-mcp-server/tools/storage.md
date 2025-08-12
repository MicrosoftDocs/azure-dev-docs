---
title: Azure Storage Tools 
description: Learn how to use the Azure MCP Server with Azure Storage.
keywords: azure mcp server, azmcp, storage account, blob storage
author: diberry
ms.author: diberry
ms.date: 08/05/2025
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

## Create directory

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
| **Account name** | Required | The name of the Azure Storage account. This name is unique to Azure (for example, 'mystorageaccount'). |
| **Resource group** | Optional | The name of the resource group containing the resource. |

## Get container details

The Azure MCP Server shows detailed information about a specific container in a storage account. This information includes metadata, access policies, and other properties.

Example prompts include:

- **Container details**: "Show me details about the 'documents' container in my 'mystorageaccount' storage account."
- **Container info**: "Get properties of container 'images' in storage account 'media_files'"
- **Container properties**: "What are the settings for my 'backups' container?"
- **Container status**: "Check access policy for 'user_data' container"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Account name** | Required | The name of the Azure Storage account. |
| **Container name** | Required | The name of the container to access. |

## List accounts

The Azure MCP Server can list all storage accounts in a subscription. This functionality provides an overview of your storage infrastructure.

Example prompts include:

- **List accounts**: "Show me all storage accounts in my subscription."
- **View accounts**: "What storage accounts do I have available?"
- **Find accounts**: "List my storage accounts."
- **Query accounts**: "Show all my storage resources."
- **Check accounts**: "Storage accounts in subscription abc123."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |

## List containers

The Azure MCP Server can list all blob containers in a storage account. This functionality helps you organize and manage your blob data.

Example prompts include:

- **List containers**: "Show me all containers in my 'mystorageaccount' storage account."
- **View containers**: "What containers do I have in storage account 'app_data'?"
- **Find containers**: "List all containers in my storage 'user_files'"
- **Query containers**: "Show available containers in my storage account"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Account name** | Required | The name of the Azure Storage account. |

## List container blobs

The Azure MCP Server can list all blobs in a container. This feature helps you manage the files stored in your blob storage.

Example prompts include:

- **List blobs**: "Show me all files in the 'documents' container in my 'mystorageaccount' storage account."
- **View blobs**: "What files do I have in container 'images'?"
- **Find blobs**: "List all files in my 'backups' container"
- **Query blobs**: "Show available files in container 'logs'"
- **Check blobs**: "Get all blobs in my 'user_data' container"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Account name** | Required | The name of the Azure Storage account. |
| **Container name** | Required | The name of the container to access. |

## List tables

The Azure MCP Server can list all tables in a storage account. This functionality helps you manage your structured NoSQL data.

Example prompts include:

- **List tables**: "Show me all tables in my 'mystorageaccount' storage account."
- **View tables**: "What tables do I have in storage account 'app_data'?"
- **Find tables**: "List all tables in my storage 'user_data'"
- **Query tables**: "Show available tables in my storage account"
- **Check tables**: "Get all storage tables in my 'analytics_data' account"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Subscription** | Required | The Azure subscription ID or name. |
| **Account name** | Required | The name of the Azure Storage account. |

## List file system paths


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
| **Account name** | Required | The name of the Azure Storage account. This name is unique to Azure (for example, 'mystorageaccount'). |
| **Resource group** | Optional | The name of the resource group containing the resource. |

## Set blob access tier in a batch

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

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../overview.md)