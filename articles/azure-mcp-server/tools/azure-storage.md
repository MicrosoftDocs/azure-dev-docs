---
title: Azure Storage Tools 
description: "Learn how to use Azure MCP Server with Azure Storage tools to manage storage accounts, containers, and blobs using natural language prompts."
keywords: azure mcp server, azmcp, storage account, blob storage
author: diberry
ms.author: diberry
ms.date: 11/17/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
--- 

# Azure Storage tools for the Azure MCP Server overview

The Azure MCP Server lets you manage Azure Storage resources, including storage accounts, containers, tables, and blobs with natural language prompts. You don't need to remember specific command syntax.

[Azure Storage](/azure/storage/common/storage-introduction) is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers highly available, massively scalable, durable, and secure storage for various data objects in the cloud.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Account: Create

<!-- storage account create -->

Create a new Azure Storage account.

Example prompts include:

- **Create account**: "Create a storage account named 'mystorageaccount' in resource group 'my-resource-group' in location 'eastus'."
- **New storage**: "Set up a new storage account called 'datastore2025' in resource group 'my-resource-group' in region 'westus2'."
- **Specify SKU and kind**: "Create a storage account 'mydata' in resource group 'my-resource-group' in location 'eastus' with Standard_GRS."
- **Secure storage**: "Create a storage account 'securestore' in resource group 'my-resource-group' in location 'centralus' with HTTPS only."
- **Enable Data Lake**: "Set up a storage account 'datalakeacct' in resource group 'my-resource-group' in location 'westeurope' with hierarchical namespace enabled."

| Parameter | Required or optional | Description |
|-----------------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Account** |  Required | The name of the Azure Storage account to create. Must be globally unique, 3-24 characters, lowercase letters, and numbers only. |
| **Location** |  Required | The Azure region where the storage account will be created (for example, `eastus`, `westus2`). |
| **SKU** |  Optional | The storage account SKU. Valid values: `Standard_LRS`, `Standard_GRS`, `Standard_RAGRS`, `Standard_ZRS`, `Premium_LRS`, `Premium_ZRS`, `Standard_GZRS`, `Standard_RAGZRS`. |
| **Access tier** |  Optional | The default access tier for blob storage. Valid values: `Hot`, `Cool`. |
| **Enable hierarchical namespace** |  Optional | Whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage account create](../includes/tools/annotations/azure-storage-account-create-annotations.md)]

## Account: Get details

<!-- storage account get -->

Retrieves detailed information about Azure Storage accounts, including account name, location, SKU, kind, hierarchical namespace status, HTTPS-only settings, and blob public access configuration. If a specific account name isn't provided, the command will return details for all accounts in a subscription.

Example prompts include:

- **Get account details**: "Show me details for the storage account 'mystorageaccount'."
- **Account info**: "Get information about my 'datastore2025' storage account."
- **View account configuration**: "What are the settings for storage account 'mydata'?"
- **Check account properties**: "Check the properties of 'securestore' storage account."
- **Account metadata**: "Show metadata for my storage account 'datalakeacct'."

| Parameter | Required or optional | Description |
|-----------|----------|-------------|
| **Account** | Optional | The name of the Azure Storage account. This name is unique to Azure (for example, 'mystorageaccount'). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage account get](../includes/tools/annotations/azure-storage-account-get-annotations.md)]

## Container: Create container

<!-- storage blob container create -->

Create a blob container with optional blob public access.

Example prompts include:

- **Create private container**: "Create a private container named 'mycontainer' in storage account 'mystorageaccount'."
- **New private blob container**: "Make a new private blob container called 'images' in storage account 'mydata'."
- **Add private container**: "Add a private container named 'archive' to storage account 'contosostore'."
- **Set up private container**: "Set up a private blob container named 'logs' in storage account 'prodstore'."
- **Create private container (simple)**: "Create a private blob container called 'images' in storage account 'mystorageaccount'."
- **Create private container (explicit access)**: "Create a blob container named 'logs' in storage account 'mydata' with access level 'private'."

| Parameter | Required or optional | Description |
|-----------|----------|-------------|
| **Account** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| **Container** |  Required | The name of the container to access within the storage account. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage blob container create](../includes/tools/annotations/azure-storage-blob-container-create-annotations.md)]


## Container: Get container details

<!-- storage blob container get -->

Use this tool to list all blob containers in the storage account or show details for a specific Storage container. Displays container properties including access policies, lease status, and metadata. If no container specified, shows all containers in the storage account. 

Example prompts include:

- **Container details**: "Show me details about the 'documents' container in my 'mystorageaccount' storage account."
- **Container info**: "Get properties of container 'images' in storage account 'media_files'."
- **Container properties**: "What are the settings for my 'backups' container?"
- **Container status**: "Check access policy for 'user_data' container."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Account** | Required | The name of the Azure Storage account. |
| **Container** | Optional | The name of the container to access. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage blob container get](../includes/tools/annotations/azure-storage-blob-container-get-annotations.md)]

## Blob: Get blob details

<!-- storage blob get -->

 Use this tool to list the blobs in a container or get details for a specific blob. Shows blob properties including metadata, size, last modification time, and content properties. If no blob specified, lists all blobs present in the container.  

Example prompts include:

- **Get blob details**: "Show me details for 'file.txt' in container 'documents' in storage account 'mystorageaccount'."
- **Blob properties**: "Get properties of blob 'image1.png' in container 'photos' in storage account 'mediafiles'."
- **Blob metadata**: "What is the metadata for 'backup.zip' in 'backups' container in 'mydata' storage account?"

| Parameter | Required or optional | Description |
|-----------------------------|----------------------|-------------|
| **Account** | Required | The name of the Azure Storage account. This name is unique across Azure (for example, 'mystorageaccount'). |
| **Container** | Required | The name of the container to access within the storage account. |
| **Blob** | Optional | The name of the blob to access within the container. This name includes the full path within the container (for example, `file.txt` or `folder/file.txt`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage blob get](../includes/tools/annotations/azure-storage-blob-get-annotations.md)]

## Blob: Upload

<!-- storage blob upload -->

Uploads a local file to a blob in Azure Storage with the option to overwrite if the blob if it already exists. 

Example prompts include:

- **Upload file to blob**: "Upload local file 'report.pdf' to blob 'documents/report.pdf' in container 'documents' in storage account 'mystorageaccount'."
- **Upload and overwrite blob**: "Upload local file 'data.csv' to blob 'archive/data.csv' in container 'archive' in storage account 'mydata', overwriting if it exists."
- **Overwrite blob with file**: "Overwrite blob 'images/photo.jpg' in container 'images' in storage account 'mediafiles' with local file 'C:\\photos\\photo.jpg'."
- **Upload file to container**: "Upload local file 'backup.zip' to blob 'backup.zip' in container 'backups' in storage account 'securestore'."
- **Replace blob content**: "Replace the content of blob 'logs/app.log' in container 'logs' in storage account 'prodstore' with local file 'app.log'."

| Parameter |  Required or optional| Description |
|-----------|----------|-------------|
| **Account** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container** |  Required | The name of the container to access within the storage account. |
| **Blob** | Required | The name of the blob to access within the container. This should be the full path within the container (for example, `file.txt` or `folder/file.txt`). |
| **Local file path** | Required | The local file path to read content from or to write content to. This should be the full path to the file on your local system. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storage blob upload](../includes/tools/annotations/azure-storage-blob-upload-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Storage](/azure/storage/common/storage-introduction)
