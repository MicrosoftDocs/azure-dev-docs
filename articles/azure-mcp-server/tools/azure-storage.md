---
title: Azure MCP Server Tools for Azure Storage
description: Use Azure MCP Server tools to manage Azure Storage resources such as storage accounts, blob containers, blobs, and tables with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.reviewer: mbaldwin
ms.date: 05/11/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-generated
content_well_notification:
  - AI-contribution
tool_count: 7
mcp-cli.version: "3.0.0-beta.6+34e8edcfb64a98102a133a7a62216f4d7df9face"
---

# Azure MCP Server tools for Azure Storage

The Azure MCP Server lets you manage Azure Storage resources, including: create, get, list, and upload, with natural language prompts.

Azure Storage is an Azure service that provides cloud-based capabilities for your applications. For more information, see [Azure Storage documentation](/azure/storage/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Create account
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage account create -->

This Model Context Protocol (MCP) tool creates an Azure Storage account in the specified resource group and location, and returns the storage account's name, location, SKU, access tier, access settings, and configuration details.

Example prompts include:

- "Create a new storage account named 'testaccount123' in location 'eastus' within resource group 'rg-prod'."
- "Create a storage account named 'premiumacct01' in location 'westus2' within resource group 'rg-production' using SKU 'Premium_LRS'."
- "Create a new storage account named 'datalakeacct' in location 'eastus2' under resource group 'rg-datalake' with hierarchical namespace enabled."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account to create. It must be globally unique, 3-24 characters, and use only lowercase letters and numbers. |
| **Location** |  Required | The Azure region where the storage account is created, for example `eastus` or `westus2`. |
| **Resource group** |  Required | The name of the Azure resource group. A resource group is a logical container for Azure resources. |
| **Access tier** |  Optional | The default access tier for blob storage. Valid values: `Hot`, `Cool`. |
| **Enable hierarchical namespace** |  Optional | Whether to enable hierarchical namespace for Data Lake Storage Gen2 on the storage account. |
| **Learn** |  Optional | Discover available tools and their parameters without executing any Azure operation. Use on a tool group, for example azmcp storage, to list all tools in that group, or on a specific tool, for example azmcp storage account list, to see options. |
| **SKU** |  Optional | The storage account SKU. Valid values: `Standard_LRS`, `Standard_GRS`, `Standard_RAGRS`, `Standard_ZRS`, `Premium_LRS`, `Premium_ZRS`, `Standard_GZRS`, `Standard_RAGZRS`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Creates an Azure Storage account in the specified resource group and location and returns the created storage account
information including name, location, SKU, access settings, and configuration details.

**Example CLI command**

```console
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

## Create blob container
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage blob container create -->

This tool, part of the Model Context Protocol (MCP) tools, creates a new Azure Storage blob container in a storage account. The tool creates a logical container for organizing blobs in an Azure Storage account.

Required: account, container, subscription. Optional: tenant.

Returns: container name, lastModified, eTag, leaseStatus, publicAccessLevel, hasImmutabilityPolicy, hasLegalHold.
Creates a logical container for organizing blobs within a storage account.

Example prompts include:

- "Create the storage container 'mycontainer' in storage account 'mystorageaccount'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Required | The name of the container to access within the storage account. |
| **Learn** |  Optional | Discover available sub-commands and their parameters without executing any Azure operation. Use on a command group (for example, `'azmcp storage --learn'`) to list all commands in that group, or on a specific command (for example, `'azmcp storage account list --learn'`) to see its options. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Create/provision a new Azure Storage blob container in a storage account.

Required: --account, --container, --subscription
Optional: --tenant

Returns: container name, lastModified, eTag, leaseStatus, publicAccessLevel, hasImmutabilityPolicy, hasLegalHold.
Creates a logical container for organizing blobs within a storage account.

**Example CLI command**

```console
azmcp storage blob container create \
  --account <account> \
  --container <container>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |
| `--container` | string | Yes | The name of the container to access within the storage account. |

---

## Get account
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage account get -->

Retrieve detailed information about Azure Storage accounts, including account name, location, SKU, kind, hierarchical namespace status, HTTPS-only settings, and blob public access configuration. This tool is part of the Model Context Protocol (MCP) tools. If you don't provide an account name, the tool returns details for all storage accounts in your subscription.

Example prompts include:

- "Show details for storage account 'mystorageaccount'."
- "Get properties of storage account 'companydata2024' including location and SKU."
- "List all storage accounts in my subscription with location and SKU."
- "Show storage accounts in my subscription and indicate whether hierarchical namespace (HNS) is enabled."
- "Show storage accounts in my subscription with HTTPS-only and public blob access settings."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Optional | The name of the Azure Storage account, for example `mystorageaccount`. |
| **Learn** |  Optional | Discover available sub-tools and their parameters without executing any Azure operation. Use it on a tool group, for example 'azmcp storage --learn', to list all tools in that group, or on a specific tool, for example 'azmcp storage account list --learn', to see its options. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Retrieves detailed information about Azure Storage accounts, including account name, location, SKU, kind, hierarchical namespace status, HTTPS-only settings, and blob public access configuration. If a specific account name isn't provided, the command will return details for all accounts in a subscription.

**Example CLI command**

```console
azmcp storage account get \
  [--account <account>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | No | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |

---

## Get blob
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage blob get -->

List blobs in a container or get properties for a specific blob in an Azure Storage account. The Model Context Protocol (MCP) tool get returns either a list of blobs or details for a single blob. If you specify a blob name, this tool returns details for that blob. If you don't specify a blob, this tool lists all blobs in the container, and you can filter the list by prefix. When you specify a blob, the prefix is ignored.

Returns blob name, size, lastModified, contentType, contentHash, metadata, and blob properties.

Example prompts include:

- "Show me the properties for blob 'logs/2026-01-01.log' in container 'logs' in storage account 'mystorageaccount'."
- "Get the details about blob 'folder/file.txt' in the container 'documents' in storage account 'companydata2024'."
- "List all blobs in the blob container 'backups' in the storage account 'backupstorage'."
- "Show me the blobs in the blob container 'images' in the storage account 'mediaacct'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for the storage account (for example, `mystorageaccount`). |
| **Container name** |  Required | The name of the container to access within the storage account. |
| **Blob name** |  Optional | The name of the blob to access within the container. This should be the full path within the container (for example, `file.txt` or `folder/file.txt`). |
| **Learn** |  Optional | Discover available tools and their parameters without executing any Azure operation. Use `--learn` on a tool group, for example `azmcp storage --learn`, to list all tools in that group, or on a specific tool, for example `azmcp storage account list --learn`, to see its options. |
| **Prefix** |  Optional | Filter the listed blobs to those whose names start with the specified prefix. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List/get/show blobs in a blob container in Storage account. Use this tool to list the blobs in a container or
get details for a specific blob. If no blob specified, lists all blobs present in the container, optionally
filtering on a prefix. The prefix is ignored if a blob is specified.

Required: --account, --container, --subscription
Optional: --blob, --tenant, --prefix

Returns: blob name, size, lastModified, contentType, contentHash, metadata, and blob properties.
Don't use this tool to list containers in the storage account.

**Example CLI command**

```console
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

## Get blob container
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage blob container get -->

This tool, part of the Model Context Protocol (MCP) tools, lists blob containers in an Azure Storage account. You can list all containers, or show details for a specific container. If you don't specify a container, the tool lists all containers and you can filter results by prefix. The prefix is ignored when you specify a container. Required: account and subscription. Optional: container, tenant, and prefix. Returns container name, lastModified, leaseStatus, publicAccess, metadata, and container properties.

Example prompts include:

- "Show the properties of container 'logs' in storage account 'mystorageacct'."
- "List all blob containers in storage account 'companydata2024'."
- "What containers are in storage account 'prodstorage'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account, for example `mystorageaccount`. |
| **Container name** |  Optional | The name of the container to access within the storage account. |
| **Learn** |  Optional | Discover available sub-commands and their parameters without executing any Azure operation. Use on a command group (for example, `'azmcp storage --learn'`) to list all commands in that group, or on a specific command (for example, `'azmcp storage account list --learn'`) to see its options. |
| **Prefix** |  Optional | The prefix to filter containers when listing containers in a storage account. Only containers whose names start with the specified prefix are listed. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Show/list containers in a storage account. Use this tool to list all blob containers in the storage account or
show details for a specific Storage container. If no container specified, shows all containers in the storage
account, optionally filtering on a prefix. The prefix is ignored if a container is specified.

Required: --account, --subscription
Optional: --container, --tenant, --prefix

Returns: container name, lastModified, leaseStatus, publicAccess, metadata, and container properties.
Don't use this tool to list blobs in a container.

**Example CLI command**

```console
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

## Get tables
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage table list -->

This tool, part of the Model Context Protocol (MCP), lists all tables in an Azure Storage account and returns their names. Specify the storage account and the subscription, and optionally the tenant.

Example prompts include:

- "List all tables in storage account 'mystorageaccount'."
- "Show me the tables in storage account 'companydata2024'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Learn** |  Optional | Discover available tools and their parameters without executing any Azure operation. Use on a tool group, for example 'azmcp storage --learn', to list all tools in that group. Use on a specific tool, for example 'azmcp storage account list --learn', to see its options. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### [Azure MCP CLI](#tab/azure-mcp-cli)

List all tables in an Azure Storage account. Shows table names for the specified storage account. Required: account, subscription. Optional: tenant. Returns: table names. Don't use this tool for Cosmos DB tables or Kusto/Data Explorer tables.

**Example CLI command**

```console
azmcp storage table list \
  --account <account>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `--account` | string | Yes | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, 'mystorageaccount'). |

---

## Upload blob
#### [MCP Server](#tab/mcp-server)


<!-- @mcpcli storage blob upload -->

Use this tool to upload a local file to an Azure Storage blob only if the blob doesn't already exist. The tool returns the blob's last modified time, ETag, and content hash.

Example prompts include:

- "Upload local file path '/home/alice/report.pdf' to storage blob 'documents/report.pdf' in container 'backups' in account 'mystorageaccount'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The Azure Storage account name, for example `mystorageaccount`. |
| **Blob name** |  Required | The name of the blob in the container, including any path, for example `file.txt` or `folder/file.txt`. |
| **Container name** |  Required | The name of the container in the storage account. |
| **Local file path** |  Required | The full path to the local file to upload. |
| **Learn** |  Optional | Show available sub-tools and their parameters without performing an Azure operation. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

#### [Azure MCP CLI](#tab/azure-mcp-cli)

Uploads a local file to an Azure Storage blob, only if the blob doesn't exist, returning the last modified time,
ETag, and content hash of the uploaded blob.

**Example CLI command**

```console
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

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Storage documentation](/azure/storage/)
