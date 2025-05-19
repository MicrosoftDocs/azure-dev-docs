---
title: Azure Storage Tools 
description: Learn how to use the Azure MCP Server with Azure Storage.
keywords: azure mcp server, azmcp, storage account, blob storage
author: diberry
ms.author: diberry
ms.date: 05/14/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Storage tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Storage resources, including storage accounts, containers, tables, and blobs with natural language prompts without having to remember specific command syntax.

[Azure Storage](/azure/storage/common/storage-introduction) is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers highly available, massively scalable, durable, and secure storage for various data objects in the cloud.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get container details

The Azure MCP Server can show detailed information about a specific container in a storage account. This information includes metadata, access policies, and other properties.

**Example prompts** include:

- **Container details**: "Show me details about the 'documents' container in my 'mystorageaccount' storage account."
- **Container info**: "Get properties of container 'images' in storage account 'media_files'"
- **Container properties**: "What are the settings for my 'backups' container?"
- **Container status**: "Check access policy for 'user_data' container"
- **Container metadata**: "Show me the metadata for the 'logs' container in my storage account"

## List accounts

The Azure MCP Server can list all storage accounts in a subscription. This functionality provides an overview of your storage infrastructure.

**Example prompts** include:

- **List accounts**: "Show me all storage accounts in my subscription."
- **View accounts**: "What storage accounts do I have available?"
- **Find accounts**: "List my storage accounts"
- **Query accounts**: "Show all my storage resources"
- **Check accounts**: "Storage accounts in subscription abc123"

## List containers

The Azure MCP Server can list all blob containers in a storage account. This functionality helps you organize and manage your blob data.

**Example prompts** include:

- **List containers**: "Show me all containers in my 'mystorageaccount' storage account."
- **View containers**: "What containers do I have in storage account 'app_data'?"
- **Find containers**: "List all containers in my storage 'user_files'"
- **Query containers**: "Show available containers in my storage account"
- **Check containers**: "Get all blob containers in my 'media_files' storage"

## List container blobs

The Azure MCP Server can list all blobs in a container. This helps you manage the files stored in your blob storage.

**Example prompts** include:

- **List blobs**: "Show me all files in the 'documents' container in my 'mystorageaccount' storage account."
- **View blobs**: "What files do I have in container 'images'?"
- **Find blobs**: "List all files in my 'backups' container"
- **Query blobs**: "Show available files in container 'logs'"
- **Check blobs**: "Get all blobs in my 'user_data' container"

## List tables

The Azure MCP Server can list all tables in a storage account. This functionality helps you manage your structured NoSQL data.

**Example prompts** include:

- **List tables**: "Show me all tables in my 'mystorageaccount' storage account."
- **View tables**: "What tables do I have in storage account 'app_data'?"
- **Find tables**: "List all tables in my storage 'user_data'"
- **Query tables**: "Show available tables in my storage account"
- **Check tables**: "Get all storage tables in my 'analytics_data' account"
