---

title: Azure MCP Server tools for Azure Storage
description: Use Azure MCP Server tools to manage Azure Storage resources such as storage accounts, blob containers, blobs, and tables with natural language prompts from your IDE.
ms.date: 05/06/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 7
mcp-cli.version: 3.0.0-beta.6+34e8edcfb64a98102a133a7a62216f4d7df9face
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


This tool creates an Azure Storage account in the specified resource group and location. You specify the account name, location, and resource group, and the tool returns the created storage account details, including name, location, SKU, access tier, and configuration settings. Use the examples to build realistic requests.

Example prompts include:

- "Create a new storage account 'testaccount123' in location 'eastus' within resource group 'rg-prod'."
- "Create a storage account 'premiumacct01' in location 'westus2' within resource group 'rg-staging' with SKU 'Premium_LRS'."
- "Create a new storage account 'datalakeacct' in location 'eastus' within resource group 'rg-datalake' and enable hierarchical namespace 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account to create. Must be globally unique, 3-24 characters, lowercase letters and numbers only. |
| **Location** |  Required | The Azure region where the storage account is created, for example, `eastus`, `westus2`. |
| **Resource group** |  Required | The name of the Azure resource group that contains the storage account. |
| **Access tier** |  Optional | The default access tier for blob storage. Valid values: `Hot`, `Cool`. |
| **Enable hierarchical namespace** |  Optional | Specify whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |
| **SKU** |  Optional | The storage account SKU. Valid values: `Standard_LRS`, `Standard_GRS`, `Standard_RAGRS`, `Standard_ZRS`, `Premium_LRS`, `Premium_ZRS`, `Standard_GZRS`, `Standard_RAGZRS`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Creates a new Azure Storage account with custom configuration in the specified resource group and location.

**Example CLI command**

```azurecli
azmcp storage account create --resource-group <resource-group> --account <account> --location <location>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--resource-group` | string | Yes | The name of the Azure resource group. This value is a logical container for Azure resources. |
| `--account` | string | Yes | The name of the Azure Storage account to create. Must be globally unique, 3-24 characters, lowercase letters and numbers only. |
| `--location` | string | Yes | The Azure region where the storage account is created (for example, 'eastus', 'westus2'). |
| `--sku` | string | No | The storage account SKU. Valid values: Standard_LRS, Standard_GRS, Standard_RAGRS, Standard_ZRS, Premium_LRS, Premium_ZRS, Standard_GZRS, Standard_RAGZRS. |
| `--access-tier` | string | No | The default access tier for blob storage. Valid values: Hot, Cool. |
| `--enable-hierarchical-namespace` | string | No | Whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |

---


## Account: Get details

<!-- @mcpcli storage account get -->

#### [MCP tool](#tab/mcp-tool)


This tool retrieves detailed information about Azure Storage accounts. Returns the account name, location, SKU, kind, hierarchical namespace status, HTTPS-only settings, and blob public access configuration. If you don't specify an account name, this tool returns details for all storage accounts in the subscription.

Example prompts include:

- "Show me the details for storage account 'mystorageaccount'."
- "Get details about storage account 'companydata2024'."
- "List all storage accounts in my subscription including their location and SKU."
- "Show my storage accounts with whether hierarchical namespace (HNS) is enabled."
- "Show the storage accounts in my subscription and include HTTPS-only and public blob access settings."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Optional | The name of the Azure Storage account. Use the unique account name, for example, `mystorageaccount`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Retrieves detailed information about Azure Storage accounts, including account name, location, SKU, kind, hierarchical namespace status, HTTPS-only settings, and blob public access configuration. If a specific account name isn't provided, the command returns details for all accounts in a subscription.

**Example CLI command**

```azurecli
azmcp storage account get
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | No | The name of the Azure Storage account. This value is the unique name you chose for your storage account (for example, 'mystorageaccount'). |

---


## Container: Create container

<!-- @mcpcli storage blob container create -->

#### [MCP tool](#tab/mcp-tool)


This tool creates a new Azure Storage blob container in a storage account. A blob container organizes blobs within the storage account. Returns container name, lastModified, eTag, leaseStatus, publicAccessLevel, hasImmutabilityPolicy, and hasLegalHold.

Example prompts include:

- "Create the storage container 'mycontainer' in storage account 'mystorageaccount'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This value is the unique name you chose for the account (for example, `mystorageaccount`). |
| **Container name** |  Required | The name of the container to create within the storage account. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Creates a new Azure Storage blob container in an Azure Storage account.

**Example CLI command**

```azurecli
azmcp storage blob container create --account <account> --container <container>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This value is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| `--container` | string | Yes | The name of the container to access within the storage account. |

---


## Container: Get container details

<!-- @mcpcli storage blob container get -->

#### [MCP tool](#tab/mcp-tool)


This tool lists blob containers in an Azure Storage account and shows details for a specific container. If you don't specify a container, the tool lists all containers and optionally filters them by prefix. If you specify a container, the tool ignores the prefix. Returns container name, lastModified, leaseStatus, publicAccess, metadata, and container properties.

Example prompts include:

- "Show properties of storage container 'images' in storage account 'mystorageacct'."
- "List all blob containers in storage account 'companydata2024'."
- "Show the containers in storage account 'prodstorage'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This value is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Optional | The name of the container to access within the storage account. |
| **Prefix** |  Optional | The prefix to filter containers when listing containers in a storage account. Only containers whose names start with the specified prefix are listed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Lists and retrieves details about blob containers in an Azure Storage account. Returns container name, last modified, eTag, lease status, public access level, immutability policy, and legal hold status.

**Example CLI command**

```azurecli
azmcp storage blob container get --account <account>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This value is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| `--container` | string | No | The name of the container to access within the storage account. |
| `--prefix` | string | No | The prefix to filter containers when listing containers in a storage account. Only containers whose names start with the specified prefix are listed. |

---


## Blob: Get blob details

<!-- @mcpcli storage blob get -->

#### [MCP tool](#tab/mcp-tool)


This tool lists blobs in an Azure Storage account container or gets details for a specific blob. When you don't specify a blob, the tool lists all blobs in the container. When you specify a blob, the tool returns only that blob's details. You can filter listings by prefix; the prefix is ignored when you specify a blob. Returns blob name, size, lastModified, contentType, contentHash, metadata, and blob properties.

Example prompts include:

- "Show properties for blob 'folder/file.txt' in container 'images' in storage account 'mystorageaccount'."
- "Get details for blob 'report.pdf' in container 'documents' in storage account 'companydata2024'."
- "List all blobs in container 'backups' in storage account 'mystorageacct'."
- "Show blobs in container 'logs' in storage account 'projstorage' with prefix '2024/'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This value is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Required | The name of the container to access within the storage account. |
| **Blob name** |  Optional | The name of the blob to access within the container. This value should be the full path within the container (for example, `file.txt` or `folder/file.txt`). |
| **Prefix** |  Optional | The prefix to filter blobs when listing blobs in a container. Only blobs whose names start with the specified prefix are listed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Lists and retrieves details about blobs in an Azure Storage blob container. Returns blob name, type, size, content type, and last modified time.

**Example CLI command**

```azurecli
azmcp storage blob get --account <account> --container <container>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This value is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| `--container` | string | Yes | The name of the container to access within the storage account. |
| `--blob` | string | No | The name of the blob to access within the container. This value should be the full path within the container (for example, 'file.txt' or 'folder/file.txt'). |
| `--prefix` | string | No | The prefix to filter blobs when listing blobs in a container. Only blobs whose names start with the specified prefix are listed. |

---


## Blob: Upload

<!-- @mcpcli storage blob upload -->

#### [MCP tool](#tab/mcp-tool)


This tool uploads a local file to an Azure Storage blob only if the blob doesn't exist. It returns the blob's last modified time, ETag, and content hash.

Example prompts include:

- "Upload file at local file path '/home/user/data/report.pdf' to storage blob 'archive/report.pdf' in container 'backup' in storage account 'mystorageaccount'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This value is the unique name you chose for your storage account, for example, `mystorageaccount`. |
| **Blob name** |  Required | The name of the blob to access within the container. Use the full path within the container, for example, `file.txt` or `folder/file.txt`. |
| **Container name** |  Required | The name of the container to access within the storage account. |
| **Local file path** |  Required | The local file path to read content from. Use the full path to the file on your system, for example, `C:\Users\alice\Documents\file.txt` or `/home/alice/file.txt`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

#### [CLI](#tab/cli)

Uploads a local file to an Azure Storage blob, only if the blob doesn't exist, returning the last modified time, ETag, and content hash of the uploaded blob.

**Example CLI command**

```azurecli
azmcp storage blob upload --account <account> --container <container> --blob <blob> --local-file-path <local-file-path>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This value is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| `--container` | string | Yes | The name of the container to access within the storage account. |
| `--blob` | string | Yes | The name of the blob to access within the container. This value should be the full path within the container (for example, 'file.txt' or 'folder/file.txt'). |
| `--local-file-path` | string | Yes | The local file path to read content from or to write content to. This value should be the full path to the file on your local system. |

---


## Table: List

<!-- @mcpcli storage table list -->

#### [MCP tool](#tab/mcp-tool)


This tool lists all tables in an Azure Storage account, and returns the table names. The output includes only Azure Storage tables; it doesn't include Azure Cosmos DB or Azure Data Explorer tables.

Example prompts include:

- "List all tables in the storage account 'mystorageaccount'."
- "What tables are in storage account 'datahubstore'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This value is the unique name you chose for your storage account (for example, `mystorageaccount`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

List all tables in an Azure Storage account. Shows table names for the specified storage account. Don't use this tool for Cosmos DB tables or Kusto/Data Explorer tables.

**Example CLI command**

```azurecli
azmcp storage table list --account <account>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This value is the unique name you chose for your storage account (for example, 'mystorageaccount'). |

---


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Storage documentation](/azure/storage/)
