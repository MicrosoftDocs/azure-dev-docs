---
title: Azure Storage Tools 
description: "Learn how to use Azure MCP Server with Azure Storage tools to manage storage accounts, containers, blobs, and tables using natural language prompts."
keywords: azure mcp server, azmcp, storage account, blob storage, table storage
author: diberry
ms.author: diberry
ms.date: 01/27/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
reviewers: alzimmermsft, jongio, xiangyan99
--- 

# Azure Storage tools for the Azure MCP Server overview

The Azure MCP Server lets you manage Azure Storage resources, including storage accounts, containers, blobs, and tables with natural language prompts.

[Azure Storage](/azure/storage/common/storage-introduction) is Microsoft's cloud storage solution for modern data storage scenarios.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Account: Create

<!-- storage account create -->

Create a new Azure Storage account.

**Prerequisites**: The conversation context establishes [global parameters](index.md#tool-parameters) (subscription, resource group). Caller must have Storage Account Contributor role or equivalent permissions on the target subscription.

Example prompts include:

- **Create storage account**: "Create a storage account named 'mystorageaccount' in resource group 'my-resource-group' in location 'eastus'."
- **With SKU**: "Create a storage account 'mydata' in resource group 'my-resource-group' in location 'eastus' with Standard_GRS."
- **Enable Data Lake**: "Create a storage account 'datalakeacct' in resource group 'my-resource-group' in location 'westeurope' with hierarchical namespace enabled."

| Parameter | Required or optional | Description |
|-----------------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **Storage account** |  Required |The globally unique name of the Azure Storage account (3-24 characters, lowercase letters, and numbers only). |
| **Location** |  Required | The Azure region where Azure creates the storage account (for example, `eastus`, `westus2`). |
| **SKU** |  Optional | The storage account SKU. Valid values: `Standard_LRS`, `Standard_GRS`, `Standard_RAGRS`, `Standard_ZRS`, `Premium_LRS`, `Premium_ZRS`, `Standard_GZRS`, `Standard_RAGZRS`. |
| **Access tier** |  Optional | The default access tier for blob storage. Valid values: `Hot`, `Cool`. |
| **Enable hierarchical namespace** |  Optional | Whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |

**Success verification**: The tool returns the created storage account details.

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage account create](../includes/tools/annotations/azure-storage-account-create-annotations.md)]

## Account: Get details

<!-- storage account get -->

Retrieves detailed information about Azure Storage accounts, including account name, location, SKU, kind, hierarchical namespace status, HTTPS-only settings, and blob public access configuration. If you don't provide a specific account name, the tool returns details for all accounts in the subscription.

**Prerequisites**: The conversation context establishes [global parameters](index.md#tool-parameters) (subscription, authentication). Caller must have Storage Account Reader role or equivalent permissions.

Example prompts include:

- **Get storage account details**: "Show me details for the storage account 'mystorageaccount'."
- **List all accounts**: "What storage accounts are in my subscription?"
- **Check properties**: "What are the settings for storage account 'mydata'?"

| Parameter | Required or optional | Description |
|-----------|----------|-------------|
| **Storage account** | Optional | The globally unique name of the Azure Storage account (for example, 'mystorageaccount'). |

**Success verification**: Returns JSON with storage account properties or a list of all accounts if you don't specify a name.

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage account get](../includes/tools/annotations/azure-storage-account-get-annotations.md)]

## Container: Create container

<!-- storage blob container create -->

Create a blob container with optional blob public access.

**Prerequisites**: The conversation context establishes [global parameters](index.md#tool-parameters) (subscription, authentication). Caller must have Storage Blob Data Contributor role or equivalent on the storage account.

Example prompts include:

- **Create container**: "Create a private container named 'mycontainer' in storage account 'mystorageaccount'."
- **With access level**: "Create a blob container named 'logs' in storage account 'mydata' with access level 'private'."

| Parameter | Required or optional | Description |
|-----------|----------|-------------|
| **Storage account** |  Required | The globally unique name of the Azure Storage account (for example, 'mystorageaccount'). |
| **Container** |  Required | The name of the container to create within the storage account. |

**Success verification**: The tool returns the created container properties.

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage blob container create](../includes/tools/annotations/azure-storage-blob-container-create-annotations.md)]


## Container: Get container details

<!-- storage blob container get -->

List all blob containers in a storage account or show details for a specific container. Displays container properties including access policies, lease status, and metadata.

**Prerequisites**: The conversation context establishes [global parameters](index.md#tool-parameters) (subscription, authentication). Caller must have Storage Blob Data Reader role or equivalent on the storage account.

Example prompts include:

- **Get container details**: "Show me details about the 'documents' container in storage account 'mystorageaccount'."
- **List containers**: "What containers are in storage account 'media_files'?"
- **Check access policy**: "Check access policy for container 'user_data' in storage account 'prodstore'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Storage account** | Required | The globally unique name of the Azure Storage account. |
| **Container** | Optional | The name of the container. If you don't specify a name, the tool lists all containers in the storage account. |

**Success verification**: Returns JSON with container properties or a list of all containers if you don't specify a name.

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage blob container get](../includes/tools/annotations/azure-storage-blob-container-get-annotations.md)]

## Blob: Get blob details

<!-- storage blob get -->

List blobs in a container or get details for a specific blob. Shows blob properties including metadata, size, last modification time, and content properties.

**Prerequisites**: The conversation context establishes [global parameters](index.md#tool-parameters) (subscription, authentication). Caller must have Storage Blob Data Reader role or equivalent on the storage account.

Example prompts include:

- **Get blob details**: "Show me details for 'file.txt' in container 'documents' in storage account 'mystorageaccount'."
- **List blobs**: "What blobs are in container 'photos' in storage account 'mediafiles'?"
- **Blob metadata**: "What is the metadata for 'backup.zip' in container 'backups' in storage account 'mydata'?"

| Parameter | Required or optional | Description |
|-----------------------------|----------------------|-------------|
| **Storage account** | Required | The globally unique name of the Azure Storage account (for example, 'mystorageaccount'). |
| **Container** | Required | The name of the container within the storage account. |
| **Blob** | Optional | The name of the blob within the container, including the full path (for example, `file.txt` or `folder/file.txt`). If you don't specify a name, the tool lists all blobs in the container. |

**Success verification**: Returns JSON with blob properties or a list of all blobs if you don't specify a name.

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage blob get](../includes/tools/annotations/azure-storage-blob-get-annotations.md)]

## Blob: Upload

<!-- storage blob upload -->

Uploads a local file to a blob in Azure Storage if the blob doesn't exist.

**Prerequisites**: The conversation context establishes [global parameters](index.md#tool-parameters) (subscription, authentication). Caller must have Storage Blob Data Contributor role or equivalent on the storage account. Local file must exist and be accessible.

Example prompts include:

- **Upload file**: "Upload local file 'report.pdf' to blob 'documents/report.pdf' in container 'documents' in storage account 'mystorageaccount'."
- **Upload and overwrite**: "Upload local file 'data.csv' to blob 'archive/data.csv' in container 'archive' in storage account 'mydata', overwriting if it exists'."

| Parameter |  Required or optional| Description |
|-----------|----------|-------------|
| **Storage account** |  Required | The globally unique name of the Azure Storage account (for example, `mystorageaccount`). |
| **Container** |  Required | The name of the container within the storage account. |
| **Blob** | Required | The name of the blob within the container, including the full path (for example, `file.txt` or `folder/file.txt`). |
| **Local file path** | Required | The full path to the local file on your system. |

**Success verification**: The tool returns the last modified time, ETag, and content hash of the uploaded blob.

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage blob upload](../includes/tools/annotations/azure-storage-blob-upload-annotations.md)]

## Table: List

<!-- storage table list -->

List all tables in an Azure Storage account. 

**Prerequisites**: The conversation context establishes [global parameters](index.md#tool-parameters) (subscription, authentication). Caller must have Storage Account Reader role or equivalent permissions.

Example prompts include:

- "Show me all tables in storage account 'dataarchives' within resource group 'rg-analytics-prod'"
- "List every table in storage account 'storagesample01' from resource group 'rg-devops-test'"
- "Get details for table 'UserLogs' in storage account 'appstorage01' under resource group 'rg-appservices'"
- "I need to see the table named 'InventoryRecords' in storage account 'warehouseacct' within resource group 'rg-supplychain'"
- "Can you provide the tables inside storage account 'mystorageaccount' for resource group 'rg-marketing'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Storage account** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |

**Success verification**: The tool returns the list of tables in the specified storage account.

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage table list](../includes/tools/annotations/azure-storage-table-list-annotations.md)]

---

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Storage](/azure/storage/common/storage-introduction)
