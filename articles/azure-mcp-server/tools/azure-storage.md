---

title: Azure MCP Server tools for Azure Storage
description: Use Azure MCP Server tools to manage Azure Storage resources such as storage accounts, blob containers, blobs, and tables with natural language prompts from your IDE.
ms.date: 05/09/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 7
mcp-cli.version: 3.0.0-beta.5+4637b2434cd6e8dcf285de245a71074bb00664db
author: diberry
ms.author: diberry
ms.reviewer: mbaldwin
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
---

# Azure MCP Server tools for Azure Storage

The Azure MCP Server lets you manage Azure Storage resources, including: create, get, list, and upload, with natural language prompts.

Azure Storage is an Azure service that provides cloud-based capabilities for your applications. For more information, see [Azure Storage documentation](/azure/storage/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Account: Create

<!-- @mcpcli storage account create -->

#### [MCP tool](#tab/mcp-tool)

This tool creates an Azure Storage account in the specified resource group and location, and returns the account's name, location, SKU, access settings, and configuration details.

Example prompts include:

- "Create a new storage account called 'testaccount123' in location 'eastus' within resource group 'rg-prod'."
- "Create storage account 'premiumacct01' in 'westus2' under resource group 'rg-storage' with SKU 'Premium_LRS'."
- "Create a new storage account 'datalakeacct' in 'eastus2' within resource group 'rg-datalake' with hierarchical namespace enabled."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account to create. Must be globally unique, 3-24 characters, lowercase letters and numbers only. |
| **Location** |  Required | The Azure region where the storage account is created (for example, `eastus`, `westus2`). |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Access tier** |  Optional | The default access tier for blob storage. Valid values: `Hot`, `Cool`. |
| **Enable hierarchical namespace** |  Optional | Whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |
| **SKU** |  Optional | The storage account SKU. Valid values: `Standard_LRS`, `Standard_GRS`, `Standard_RAGRS`, `Standard_ZRS`, `Premium_LRS`, `Premium_ZRS`, `Standard_GZRS`, `Standard_RAGZRS`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Create an Azure Storage account in the specified resource group and location, returning the account's name, location, SKU, access settings, and configuration details.

**Example CLI command**

```azurecli
azmcp storage account create \
  --resource-group <resource-group> \
  --account <account> \
  --location <location> \
  [--sku <sku>] \
  [--access-tier <access-tier>] \
  [--enable-hierarchical-namespace <enable-hierarchical-namespace>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | Yes | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--account` | string | Yes | The name of the Azure Storage account to create. Must be globally unique, 3-24 characters, lowercase letters and numbers only. |
| `--location` | string | Yes | The Azure region where the storage account will be created (for example, 'eastus', 'westus2'). |
| `--sku` | string | No | The storage account SKU. Valid values: Standard_LRS, Standard_GRS, Standard_RAGRS, Standard_ZRS, Premium_LRS, Premium_ZRS, Standard_GZRS, Standard_RAGZRS. |
| `--access-tier` | string | No | The default access tier for blob storage. Valid values: Hot, Cool. |
| `--enable-hierarchical-namespace` | string | No | Whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |

---

## Account: Get

<!-- @mcpcli storage account get -->

#### [MCP tool](#tab/mcp-tool)

This tool retrieves detailed information about Azure Storage accounts. It shows the account name, location, SKU, kind, hierarchical namespace status, HTTPS-only setting, and blob public access configuration. If you don't provide an account name, the tool returns details for all storage accounts in the subscription.

Example prompts include:

- "Show me the details for storage account 'mystorageaccount'."
- "Get details about storage account 'companydata2024'."
- "List all storage accounts in my subscription with their location and SKU."
- "Show storage accounts in my subscription and whether hierarchical namespace (HNS) is enabled."
- "Show storage accounts in my subscription including HTTPS-only and public blob access settings."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Optional | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Retrieve detailed information about Azure Storage accounts, including account name, location, SKU, kind, hierarchical namespace status, HTTPS-only settings, and blob public access configuration. If a specific account name isn't provided, returns details for all accounts in the subscription.

**Example CLI command**

```azurecli
azmcp storage account get \
  [--account <account>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | No | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |

---

## Blob container: Create

<!-- @mcpcli storage blob container create -->

#### [MCP tool](#tab/mcp-tool)

This tool creates a new Azure Storage blob container in a storage account. A blob container organizes blobs within a storage account. The tool returns container name, lastModified, eTag, leaseStatus, publicAccessLevel, hasImmutabilityPolicy, and hasLegalHold.

Example prompts include:

- "Create the storage container 'mycontainer' in storage account 'mystorageaccount'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Required | The name of the container. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Create a new Azure Storage blob container in a storage account. A blob container organizes blobs within a storage account. Returns container name, lastModified, eTag, leaseStatus, publicAccessLevel, hasImmutabilityPolicy, and hasLegalHold.

**Example CLI command**

```azurecli
azmcp storage blob container create \
  --account <account> \
  --container <container>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| `--container` | string | Yes | The name of the container to access within the storage account. |

---

## Blob container: Get

<!-- @mcpcli storage blob container get -->

#### [MCP tool](#tab/mcp-tool)

Lists blob containers in an Azure Storage account, or shows details for a specific container. If you don't specify a container, this tool lists all containers in the account and can filter results by a prefix. If you specify a container, the prefix is ignored.

Returns container name, lastModified, leaseStatus, publicAccess, metadata, and container properties.

Example prompts include:

- "Show the properties of storage container 'backups' in storage account 'mystorageaccount'."
- "List all blob containers in storage account 'mystorageacct'."
- "Show the containers in storage account 'companydata2024'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Optional | The name of the container to access within the storage account. |
| **Prefix** |  Optional | Filter container names by prefix when listing. Only containers whose names start with the specified prefix are listed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

List blob containers in an Azure Storage account, or show details for a specific container. If you don't specify a container, lists all containers in the account and can filter results by a prefix. If you specify a container, the prefix is ignored. Returns container name, lastModified, leaseStatus, publicAccess, metadata, and container properties.

**Example CLI command**

```azurecli
azmcp storage blob container get \
  --account <account> \
  [--container <container>] \
  [--prefix <prefix>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| `--container` | string | No | The name of the container to access within the storage account. |
| `--prefix` | string | No | The prefix to filter containers when listing containers in a storage account. Only containers whose names start with the specified prefix will be listed. |

---

## Blob: Get

<!-- @mcpcli storage blob get -->

#### [MCP tool](#tab/mcp-tool)

This tool lists blobs in a container or gets details for a specific blob in an Azure Storage account. If you don't specify a blob, the tool lists all blobs in the container, optionally filtering by prefix. When you specify a blob, the prefix is ignored.

Returns: blob name, size, last modified, content type, content hash, metadata, and blob properties.

Example prompts include:

- "Show the properties for blob 'documents/report.pdf' in container 'invoices' in storage account 'mystorageaccount'."
- "Get details for blob 'backup/2025-01-01.zip' from container 'backups' in storage account 'companydata2024'."
- "List all blobs in container 'images' in storage account 'mediaacct'."
- "Show the blobs in container 'logs' in storage account 'mystorageaccount'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Required | The name of the container to access within the storage account. |
| **Blob name** |  Optional | The name of the blob to access within the container. This should be the full path within the container (for example, `file.txt` or `folder/file.txt`). |
| **Prefix** |  Optional | The prefix to filter blobs when listing blobs in a container. Only blobs whose names start with the specified prefix are listed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

List blobs in a container or get details for a specific blob in an Azure Storage account. If you don't specify a blob, lists all blobs in the container, optionally filtering by prefix. When you specify a blob, the prefix is ignored. Returns blob name, size, last modified, content type, content hash, metadata, and blob properties.

**Example CLI command**

```azurecli
azmcp storage blob get \
  --account <account> \
  --container <container> \
  [--blob <blob>] \
  [--prefix <prefix>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| `--container` | string | Yes | The name of the container to access within the storage account. |
| `--blob` | string | No | The name of the blob to access within the container. This should be the full path within the container (for example, 'file.txt' or 'folder/file.txt'). |
| `--prefix` | string | No | The prefix to filter blobs when listing blobs in a container. Only blobs whose names start with the specified prefix will be listed. |

---

## Blob: Upload

<!-- @mcpcli storage blob upload -->

#### [MCP tool](#tab/mcp-tool)

This tool uploads a local file to an Azure Storage blob if the blob doesn't exist. It returns the blob's last modified time, ETag, and content hash.

Example prompts include:

- "Upload local file path '/home/alice/report.pdf' to storage blob 'folder/report.pdf' in container 'uploads' in storage account 'mystorageaccount'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for the storage account, for example `mystorageaccount`. |
| **Blob name** |  Required | The name of the blob to create in the container. Use the full path within the container, for example `file.txt` or `folder/file.txt`. |
| **Container name** |  Required | The name of the container in the storage account, for example `documents`. |
| **Local file path** |  Required | The full path to the local file to read and upload, for example `C:\Users\alice\Documents\file.txt` or `/home/alice/documents/file.txt`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

#### [CLI](#tab/cli)

Upload a local file to an Azure Storage blob if the blob doesn't exist. Returns the blob's last modified time, ETag, and content hash.

**Example CLI command**

```azurecli
azmcp storage blob upload \
  --account <account> \
  --container <container> \
  --blob <blob> \
  --local-file-path <local-file-path>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| `--container` | string | Yes | The name of the container to access within the storage account. |
| `--blob` | string | Yes | The name of the blob to access within the container. This should be the full path within the container (for example, 'file.txt' or 'folder/file.txt'). |
| `--local-file-path` | string | Yes | The local file path to read content from or to write content to. This should be the full path to the file on your local system. |

---

## Table: List

<!-- @mcpcli storage table list -->

#### [MCP tool](#tab/mcp-tool)

List all tables in an Azure Storage account. You specify the account and subscription, and you can optionally specify the tenant. The tool returns table names. This tool lists tables in Azure Storage only.

Example prompts include:

- "List all tables in storage account 'mystorageaccount'."
- "Show me the tables in storage account 'companydata2024'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

List all tables in an Azure Storage account and return the table names. This tool lists Azure Storage tables only; don't use it for Azure Cosmos DB or Azure Data Explorer tables.

**Example CLI command**

```azurecli
azmcp storage table list \
  --account <account>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |

---

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Storage documentation](/azure/storage/)
