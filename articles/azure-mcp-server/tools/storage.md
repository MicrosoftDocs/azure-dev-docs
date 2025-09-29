---
title: Azure Storage Tools 
description: Learn how to use the Azure MCP Server with Azure Storage.
keywords: azure mcp server, azmcp, storage account, blob storage
author: diberry
ms.author: diberry
ms.date: 09/24/2025
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

## Account: Create

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
| **Region** | Required | The Azure region where you want to create the storage account (for example, 'eastus', 'westus2'). |
| **SKU** | Optional | The storage account SKU. Valid values: Standard_LRS, Standard_GRS, Standard_RAGRS, Standard_ZRS, Premium_LRS, Premium_ZRS, Standard_GZRS, Standard_RAGZRS. |
| **Kind** | Optional | The storage account kind. Valid values: Storage, StorageV2, BlobStorage, FileStorage, BlockBlobStorage. |
| **Default access tier for blobs** | Optional | The default access tier for blob storage. Valid values: Hot, Cool. |
| **Require secure transfer (HTTPS)** | Optional | Whether to require secure transfer (HTTPS) for the storage account. |
| **Allow public access to blobs** | Optional | Whether to allow public access to blobs in the storage account. |
| **Enable hierarchical namespace (Data Lake)** | Optional | Whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |

## Account: Get details

Get detailed information about a specific Azure Storage account. This functionality retrieves comprehensive metadata for the specified storage account including name, location, SKU, access settings, and configuration details. 

Example prompts include:

- **Get account details**: "Show me details for the storage account 'mystorageaccount'."
- **Account info**: "Get information about my 'datastore2025' storage account."
- **View account configuration**: "What are the settings for storage account 'mydata'?"
- **Check account properties**: "Check the properties of 'securestore' storage account."
- **Account metadata**: "Show metadata for my storage account 'datalakeacct'."


| Parameter | Required or optional | Description |
|-----------|----------|-------------|
| **Account** | Required | The name of the Azure Storage account. This name is unique to Azure (for example, 'mystorageaccount'). |


## Container: Create container

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
| **Access level** | Optional | The [access tier](/azure/storage/blobs/access-tiers-overview). Default: `private`. Valid values: `private`, `blob` (allows public read access to blobs), `container` (allows public read access to both blobs and container metadata).  |



## Container: Get container details

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

## Blob: Get blob details

Get blob properties, metadata, and general information. 

Example prompts include:

- **Get blob details**: "Show me details for 'file.txt' in container 'documents' in storage account 'mystorageaccount'."
- **Blob properties**: "Get properties of blob 'image1.png' in container 'photos' in storage account 'mediafiles'."
- **Blob metadata**: "What is the metadata for 'backup.zip' in 'backups' container in 'mydata' storage account?"

| Parameter | Required or optional | Description |
|-----------------------------|----------------------|-------------|
| **Account** | Required | The name of the Azure Storage account. This name is unique across Azure (for example, 'mystorageaccount'). |
| **Container** | Required | The name of the container to access within the storage account. |
| **Blob** | Required | The name of the blob to access within the container. This name includes the full path within the container (for example, 'file.txt' or 'folder/file.txt'). |

## Blob: Upload

Uploads a local file to a blob in Azure Storage with the option to overwrite if the blob if it already exists. 

Example prompts include:

- **Upload file to blob**: "Upload file 'report.pdf' to blob 'documents/report.pdf' in container 'documents' in storage account 'mystorageaccount'."
- **Upload and overwrite blob**: "Upload 'data.csv' to blob 'archive/data.csv' in container 'archive' in storage account 'mydata', overwriting if it exists."
- **Overwrite blob with file**: "Overwrite blob 'images/photo.jpg' in container 'images' in storage account 'mediafiles' with local file 'C:\\photos\\photo.jpg'."
- **Upload file to container**: "Upload 'backup.zip' to container 'backups' in storage account 'securestore'."
- **Replace blob content**: "Replace the content of blob 'logs/app.log' in container 'logs' in storage account 'prodstore' with file 'app.log'."

| Parameter |  Required or optional| Description |
|-----------|----------|-------------|
| **Account** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container** |  Required | The name of the container to access within the storage account. |
| **Blob** | Required | The name of the blob to access within the container. This should be the full path within the container (for example, `file.txt` or `folder/file.txt`). |
| **Local file path** | Required | The local file path to read content from or to write content to. This should be the full path to the file on your local system. |
| **Overwrite**  | Optional | Whether to overwrite content if it already exists. Defaults to false. |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
