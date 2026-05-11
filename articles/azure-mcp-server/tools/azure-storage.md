---

title: Azure MCP Server tools for Azure Storage
description: Use Azure MCP Server tools to manage Azure Storage resources such as storage accounts, blob containers, blobs, and tables with natural language prompts from your IDE.
ms.date: 05/11/2026
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


## Create account
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage account create -->

This tool creates an Azure Storage account in the specified resource group and location, and returns the storage account's properties, including name, location, SKU, access tier, access settings, and configuration details.

Example prompts include:

- "Create a new storage account 'testaccount123' in location 'eastus' within resource group 'rg-prod'."
- "Create storage account 'premiumacct01' in location 'westus2' under resource group 'rg-prem' with SKU 'Premium_LRS'."
- "Create a new storage account 'datalakeacct1' in location 'eastus2' within resource group 'rg-datalake' with enable hierarchical namespace 'true'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account to create. It must be globally unique, 3–24 characters, and use only lowercase letters and numbers. |
| **Location** |  Required | The Azure region for the storage account, for example, `eastus` or `westus2`. |
| **Resource group** |  Required | The name of the Azure resource group, a logical container for related Azure resources. |
| **Access tier** |  Optional | The default access tier for blob storage. Valid values: `Hot`, `Cool`. |
| **Enable hierarchical namespace** |  Optional | Specifies whether the storage account enables hierarchical namespace (Azure Data Lake Storage Gen2). |
| **SKU** |  Optional | The storage account SKU. Valid values: `Standard_LRS`, `Standard_GRS`, `Standard_RAGRS`, `Standard_ZRS`, `Premium_LRS`, `Premium_ZRS`, `Standard_GZRS`, `Standard_RAGZRS`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Creates an Azure Storage account in the specified resource group and location and returns the created storage account
information including name, location, SKU, access settings, and configuration details.

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
| `--location` | string | Yes | The Azure region where the storage account will be created (e.g., 'eastus', 'westus2'). |
| `--sku` | string | No | The storage account SKU. Valid values: Standard_LRS, Standard_GRS, Standard_RAGRS, Standard_ZRS, Premium_LRS, Premium_ZRS, Standard_GZRS, Standard_RAGZRS. |
| `--access-tier` | string | No | The default access tier for blob storage. Valid values: Hot, Cool. |
| `--enable-hierarchical-namespace` | string | No | Whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |

---

## Create blob container
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage blob container create -->

This tool creates a new Azure Storage blob container in a storage account. This tool is part of the Model Context Protocol (MCP) tool set.

Required: account, container, subscription  
Optional: tenant

Returns the container name, lastModified, eTag, leaseStatus, publicAccessLevel, hasImmutabilityPolicy, and hasLegalHold. Creates a logical container to organize blobs within a storage account.

Example prompts include:

- "Create the storage container 'mycontainer' in storage account 'mystorageaccount'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Required | The name of the container to access within the storage account. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Create/provision a new Azure Storage blob container in a storage account.

Required: --account, --container, --subscription
Optional: --tenant

Returns: container name, lastModified, eTag, leaseStatus, publicAccessLevel, hasImmutabilityPolicy, hasLegalHold.
Creates a logical container for organizing blobs within a storage account.

**Example CLI command**

```azurecli
azmcp storage blob container create \
  --account <account> \
  --container <container>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |
| `--container` | string | Yes | The name of the container to access within the storage account. |

---

## Get account
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage account get -->

This tool, part of the Model Context Protocol (MCP) tools, gets detailed information about Azure Storage accounts. It returns the account name, location, SKU, kind, hierarchical namespace status, HTTPS-only setting, and blob public access configuration. If you don't specify an account name, this tool returns details for all accounts in the subscription.

Example prompts include:

- "Show me the details for storage account 'mystorageacct'."
- "Get details about storage account 'companydata2024'."
- "List all storage accounts in my subscription including their location and SKU."
- "Show all storage accounts in my subscription with whether hierarchical namespace (HNS) is enabled."
- "Show storage accounts in my subscription and include HTTPS-only and public blob access settings."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Optional | The name of the Azure Storage account, for example, `mystorageaccount`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Retrieves detailed information about Azure Storage accounts, including account name, location, SKU, kind, hierarchical namespace status, HTTPS-only settings, and blob public access configuration. If a specific account name is not provided, the command will return details for all accounts in a subscription.

**Example CLI command**

```azurecli
azmcp storage account get \
  [--account <account>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | No | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |

---

## Get blob
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage blob get -->

This tool lists blobs in an Azure Storage container, or shows details for a specific blob. If you don't specify a blob, this tool lists all blobs in the container. You can filter the results by prefix. If you specify a blob, this tool ignores the prefix. This tool returns the blob name, size, lastModified, contentType, contentHash, metadata, and blob properties.

Example prompts include:

- "Show me the properties for blob 'folder/report.pdf' in container 'reports' in storage account 'mystorageaccount'."
- "Get the details about blob 'logs/2025-05-01.log' in container 'logs' in storage account 'companydata2024'."
- "List all blobs in container 'images' in storage account 'mediaacct'."
- "Show me the blobs in container 'backups' in storage account 'backupstore' with prefix 'daily/'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Required | The name of the container to access in the Azure Storage account. |
| **Blob name** |  Optional | The name of the blob to access within the container. This should be the full path within the container (for example, `file.txt` or `folder/file.txt`). |
| **Prefix** |  Optional | The prefix to filter blobs when listing blobs in a container. Only blobs whose names start with the specified prefix are listed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

List/get/show blobs in a blob container in Storage account. Use this tool to list the blobs in a container or
get details for a specific blob. If no blob specified, lists all blobs present in the container, optionally
filtering on a prefix. The prefix is ignored if a blob is specified.

Required: --account, --container, --subscription
Optional: --blob, --tenant, --prefix

Returns: blob name, size, lastModified, contentType, contentHash, metadata, and blob properties.
Do not use this tool to list containers in the storage account.

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
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |
| `--container` | string | Yes | The name of the container to access within the storage account. |
| `--blob` | string | No | The name of the blob to access within the container. This should be the full path within the container (e.g., 'file.txt' or 'folder/file.txt'). |
| `--prefix` | string | No | The prefix to filter blobs when listing blobs in a container. Only blobs whose names start with the specified prefix will be listed. |

---

## Get blob container
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage blob container get -->

This Model Context Protocol (MCP) tool lists blob containers in an Azure Storage account and shows details for a specific container. If you don't specify a container, the tool lists all containers and lets you filter results by prefix. If you specify a container, the prefix is ignored.

Required: account, subscription  
Optional: container, tenant, prefix

Returns: container name, lastModified, leaseStatus, publicAccess, metadata, and container properties.

Example prompts include:

- "Show properties for the storage container 'images' in storage account 'mystorageacct'."
- "List all blob containers in storage account 'companydata2024'."
- "Show me the containers in storage account 'prodstorageacct'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Optional | The name of the container to access within the storage account. |
| **Prefix** |  Optional | The prefix to filter containers when listing containers in a storage account. Only containers whose names start with the specified prefix is listed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

Show/list containers in a storage account. Use this tool to list all blob containers in the storage account or
show details for a specific Storage container. If no container specified, shows all containers in the storage
account, optionally filtering on a prefix. The prefix is ignored if a container is specified.

Required: --account, --subscription
Optional: --container, --tenant, --prefix

Returns: container name, lastModified, leaseStatus, publicAccess, metadata, and container properties.
Do not use this tool to list blobs in a container.

**Example CLI command**

```azurecli
azmcp storage blob container get \
  --account <account> \
  [--container <container>] \
  [--prefix <prefix>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |
| `--container` | string | No | The name of the container to access within the storage account. |
| `--prefix` | string | No | The prefix to filter containers when listing containers in a storage account. Only containers whose names start with the specified prefix will be listed. |

---

## Get tables
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage table list -->

This tool lists all tables in an Azure Storage account and returns their names. Specify the account name and subscription. You can also specify the tenant.

Example prompts include:

- "List all tables in storage account 'mystorageacct'."
- "Show me the tables in storage account 'companydata2024'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for the account, for example, `mystorageaccount`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [CLI](#tab/cli)

List all tables in an Azure Storage account. Shows table names for the specified storage account. Required: account, subscription. Optional: tenant. Returns: table names. Do not use this tool for Cosmos DB tables or Kusto/Data Explorer tables.

**Example CLI command**

```azurecli
azmcp storage table list \
  --account <account>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |

---

## Upload blob
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage blob upload -->

Uploads a local file to an Azure Storage blob only if the blob doesn't exist. The tool returns the blob's last modified time, ETag, and content hash.

This tool is part of the Model Context Protocol (MCP) tools.

Example prompts include:

- "Upload local file path '/home/alice/documents/report.pdf' to storage blob 'reports/2026/report.pdf' in container 'documents' in storage account 'mystorageacct'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Blob name** |  Required | The name of the blob to access within the container. Use the full path within the container (for example, `file.txt` or `folder/file.txt`). |
| **Container name** |  Required | The name of the container to access within the storage account. |
| **Local file path** |  Required | The local file path to read content from. Use the full path to the file on your local system (for example, `C:\Users\Alice\Documents\report.pdf` or `/home/alice/report.pdf`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

Examples

- Upload the file 'C:\Users\Alice\Documents\report.pdf' to blob 'reports/2026/report.pdf' in container 'reports' on storage account 'mystorageacct'.
- Upload the image '/home/bob/photos/vacation.jpg' to blob 'images/vacation.jpg' in container 'backups' on storage account 'prodstorage'.

#### [CLI](#tab/cli)

Uploads a local file to an Azure Storage blob, only if the blob does not exist, returning the last modified time,
ETag, and content hash of the uploaded blob.

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
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |
| `--container` | string | Yes | The name of the container to access within the storage account. |
| `--blob` | string | Yes | The name of the blob to access within the container. This should be the full path within the container (e.g., 'file.txt' or 'folder/file.txt'). |
| `--local-file-path` | string | Yes | The local file path to read content from or to write content to. This should be the full path to the file on your local system. |

---

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Storage documentation](/azure/storage/)
