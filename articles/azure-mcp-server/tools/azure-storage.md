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


## Account

### Account: create

<!-- @mcpcli storage account create -->

This tool creates an Azure Storage account in the specified resource group and location. It returns the storage account's details, including name, location, SKU, access tier, access settings, and configuration. This tool runs under the Model Context Protocol (MCP).

Example prompts include:

- "Create a new storage account named 'testaccount123' in location 'eastus' in resource group 'rg-prod'."
- "Create a storage account 'premiumacct01' with SKU 'Premium_LRS' in location 'westus2' in resource group 'rg-storage'."
- "Create a new storage account 'datalakeacct01' with hierarchical namespace set to 'true' in location 'eastus2' in resource group 'rg-analytics'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account to create. Must be globally unique, 3 to 24 characters, and use only lowercase letters and numbers. |
| **Location** |  Required | The Azure region where the storage account is created, for example `eastus` or `westus2`. |
| **Resource group** |  Required | The name of the Azure resource group. A resource group is a logical container for Azure resources. |
| **Access tier** |  Optional | The default access tier for blob storage. Valid values: `Hot`, `Cool`. |
| **Enable hierarchical namespace** |  Optional | Whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |
| **Learn** |  Optional | Discover available tools and their parameters without making changes in Azure. Use it on a tool group or on a specific tool to list available options. |
| **SKU** |  Optional | The storage account SKU. Valid values: `Standard_LRS`, `Standard_GRS`, `Standard_RAGRS`, `Standard_ZRS`, `Premium_LRS`, `Premium_ZRS`, `Standard_GZRS`, `Standard_RAGZRS`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

#### CLI

Creates an Azure Storage account in the specified resource group and location and returns the created storage account information including name, location, SKU, access settings, and configuration details.

```bash
azmcp storage account create --account <unique-account-name> \
                             --resource-group <resource-group> \
                             --location <location> \
                             [--sku <sku>] \
                             [--access-tier <access-tier>] \
                             [--enable-hierarchical-namespace <true|false>]
```

| Switch | Required | Type | Description |
|--------|----------|------|-------------|
| `--account` | ✅ | string | The name of the Azure Storage account to create. Must be globally unique, 3-24 characters, lowercase letters and numbers only. |
| `--resource-group` | ✅ | string | The name of the Azure resource group. This is a logical container for Azure resources. |
| `--location` | ✅ | string | The Azure region where the storage account will be created (e.g., 'eastus', 'westus2'). |
| `--sku` | ❌ | string | The storage account SKU. Valid values: Standard_LRS, Standard_GRS, Standard_RAGRS, Standard_ZRS, Premium_LRS, Premium_ZRS, Standard_GZRS, Standard_RAGZRS. |
| `--access-tier` | ❌ | string | The default access tier for blob storage. Valid values: Hot, Cool. |
| `--enable-hierarchical-namespace` | ❌ | string | Whether to enable hierarchical namespace (Data Lake Storage Gen2) for the storage account. |

### Account: get

<!-- @mcpcli storage account get -->

This Model Context Protocol (MCP) tool retrieves detailed information about Azure Storage accounts. It returns account name, location, SKU, kind, hierarchical namespace status, secure transfer required (HTTPS-only) setting, and blob public access configuration. The tool returns details for a specific storage account when you provide an account name. If you don't provide an account name, this tool returns details for all storage accounts in the subscription.

Example prompts include:

- "Show me the details for storage account 'mystorageaccount'."
- "Get details about storage account 'prodstorageacct' including location and SKU."
- "List all storage accounts in my subscription, including their location and SKU."
- "Show me my storage accounts and whether hierarchical namespace (HNS) is enabled."
- "Show me storage accounts in my subscription and include HTTPS-only and public blob access settings."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Optional | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Learn** |  Optional | Discover available sub-tools and their parameters without executing any Azure operation. For example, use azmcp storage --learn to list all tools in the storage group, or use azmcp storage account list --learn to see its options. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### CLI

Retrieves detailed information about Azure Storage accounts, including account name, location, SKU, kind, hierarchical namespace status, HTTPS-only settings, and blob public access configuration. If a specific account name is not provided, the command will return details for all accounts in a subscription.

```bash
azmcp storage account get [--account <account>]
```

| Switch | Required | Type | Description |
|--------|----------|------|-------------|
| `--account` | ❌ | string | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |

## Blob container

### Blob container: create

<!-- @mcpcli storage blob container create -->

Create a new Azure Storage blob container in a storage account.

This tool creates a new blob container in an Azure Storage account. Required: account, container, and subscription. Optional: tenant.

Returns: name, lastModified, eTag, leaseStatus, publicAccessLevel, hasImmutabilityPolicy, and hasLegalHold.

This tool creates a logical container to organize blobs within the storage account.

Example prompts include:

- "Create container 'mycontainer' in storage account 'mystorageaccount'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Required | The name of the container to create within the storage account. |
| **Learn** |  Optional | Discover available sub-commands and their parameters without executing any Azure operation. Use it on a command group, for example, azmcp storage, to list all commands in that group, or on a specific command, for example, azmcp storage account list, to show its options. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

#### CLI

Create/provision a new Azure Storage blob container in a storage account. Required: --account, --container, --subscription. Optional: --tenant. Returns: container name, lastModified, eTag, leaseStatus, publicAccessLevel, hasImmutabilityPolicy, hasLegalHold. Creates a logical container for organizing blobs within a storage account.

```bash
azmcp storage blob container create --account <account> \
                                    --container <container>
```

| Switch | Required | Type | Description |
|--------|----------|------|-------------|
| `--account` | ✅ | string | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |
| `--container` | ✅ | string | The name of the container to access within the storage account. |

### Blob container: get

<!-- @mcpcli storage blob container get -->

Show or list blob containers in an Azure Storage account. This tool lists all blob containers in the specified Azure Storage account, or shows details for a specific container. If you don't specify a container, the tool lists all containers, and you can filter the results by prefix. The prefix is ignored when you specify a container. Example: Get containers in storage account 'mystorageacct' with prefix 'prod-'.

Required: account, subscription  
Optional: container, tenant, prefix

Returns: container name, last modified time, lease status, public access level, metadata, and container properties.

Example prompts include:

- "Show me the properties of the storage container 'images' in the storage account 'mystorageaccount'."
- "List all blob containers in the storage account 'companydata2024'."
- "Show me the containers in the storage account 'archiveacct'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Optional | The name of the container within the Azure Storage account. |
| **Learn** |  Optional | Discover available sub-commands and their parameters without executing any Azure operation. For example, run `azmcp storage --learn` on a command group to list its commands, or run `azmcp storage account list --learn` on a specific tool to see its options. |
| **Prefix** |  Optional | Filter listed containers by name prefix. Only containers whose names start with the specified prefix are returned. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### CLI

Show/list containers in a storage account. Use this tool to list all blob containers in the storage account or show details for a specific Storage container. If no container specified, shows all containers in the storage account, optionally filtering on a prefix. The prefix is ignored if a container is specified.

```bash
azmcp storage blob container get --account <account> \
                                 [--container <container>] \
                                 [--prefix <prefix>]
```

| Switch | Required | Type | Description |
|--------|----------|------|-------------|
| `--account` | ✅ | string | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |
| `--container` | ❌ | string | The name of the container to access within the storage account. |
| `--prefix` | ❌ | string | The prefix to filter containers when listing containers in a storage account. Only containers whose names start with the specified prefix will be listed. |

## Blob

### Blob: get

<!-- @mcpcli storage blob get -->

The Model Context Protocol (MCP) storage blob get tool lists blobs in a container or returns properties for a specific blob in an Azure Storage account. If you specify a blob name, this tool returns details for that blob. If you don't specify a blob name, this tool lists all blobs in the container, optionally filtering by prefix.

Required: account, container, subscription  
Optional: blob, tenant, prefix

Returns: blob name, size, lastModified, content type, content hash, metadata, and other blob properties.

Example prompts include:

- "Show me the properties for blob 'photos/2024/image1.jpg' in container 'images' in storage account 'mystorageaccount'."
- "Get the details about blob 'reports/summary.pdf' in container 'documents' in storage account 'companydata2024'."
- "List all blobs in the blob container 'backups' in storage account 'backupstore'."
- "Show me the blobs in the blob container 'logs' in storage account 'prodstorage'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Container name** |  Required | The name of the container to access within the storage account. |
| **Blob name** |  Optional | The name of the blob to access within the container. Include the path in the container (for example, `file.txt` or `folder/file.txt`). |
| **Learn** |  Optional | Show available tool groups and options without making Azure calls. Use on a tool group or on an individual tool to list available actions and parameters. |
| **Prefix** |  Optional | Filter listed blobs to those whose names start with the specified prefix. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

Examples

- List all blobs in account 'mystorageaccount', container 'web-logs'.  
- Get properties for blob 'backups/2026-05-01.bak' in account 'mystorageaccount', container 'database-backups'.

#### CLI

List/get/show blobs in a blob container in Storage account. Use this tool to list the blobs in a container or get details for a specific blob. If no blob specified, lists all blobs present in the container, optionally filtering on a prefix. The prefix is ignored if a blob is specified.

```bash
azmcp storage blob get --account <account> \
                       --container <container> \
                       [--blob <blob>] \
                       [--prefix <prefix>]
```

| Switch | Required | Type | Description |
|--------|----------|------|-------------|
| `--account` | ✅ | string | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |
| `--container` | ✅ | string | The name of the container to access within the storage account. |
| `--blob` | ❌ | string | The name of the blob to access within the container. This should be the full path within the container (e.g., 'file.txt' or 'folder/file.txt'). |
| `--prefix` | ❌ | string | The prefix to filter blobs when listing blobs in a container. Only blobs whose names start with the specified prefix will be listed. |

### Blob: upload

<!-- @mcpcli storage blob upload -->

This Model Context Protocol (MCP) tool uploads a local file to an Azure Storage blob if the blob doesn't exist. This tool returns the blob's last modified time, ETag, and content hash. For example, upload 'C:\data\invoice.pdf' to account 'mystorageaccount', container 'invoices', blob '2026/invoice.pdf'.

Example prompts include:

- "Upload local file path '/home/alice/report.pdf' to blob 'reports/2026/report.pdf' in container 'documents' in storage account 'mystorageacct'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Blob name** |  Required | The name of the blob within the container. Provide the full path within the container (for example, `file.txt` or `folder/file.txt`). |
| **Container name** |  Required | The name of the container within the storage account. |
| **Local file path** |  Required | The local file path to upload from. Provide the full path on your local system. |
| **Learn** |  Optional | Discover available sub-commands and their parameters without executing any Azure operation. Use the learn option on a command group, for example 'azmcp storage', to list all commands in that group. Use it on a specific command, for example 'azmcp storage account list', to see its options. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

#### CLI

Uploads a local file to an Azure Storage blob, only if the blob does not exist, returning the last modified time, ETag, and content hash of the uploaded blob.

```bash
azmcp storage blob upload --account <account> \
                          --container <container> \
                          --blob <blob> \
                          --local-file-path <path-to-local-file>
```

| Switch | Required | Type | Description |
|--------|----------|------|-------------|
| `--account` | ✅ | string | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |
| `--container` | ✅ | string | The name of the container to access within the storage account. |
| `--blob` | ✅ | string | The name of the blob to access within the container. This should be the full path within the container (e.g., 'file.txt' or 'folder/file.txt'). |
| `--local-file-path` | ✅ | string | The local file path to read content from or to write content to. This should be the full path to the file on your local system. |

## Table

### Table: list

<!-- @mcpcli storage table list -->

Model Context Protocol (MCP) tools use a consistent interface. This tool lists all tables in an Azure Storage account and returns their names. It doesn't list tables in Azure Cosmos DB or Azure Data Explorer.

Example prompts include:

- "List all tables in storage account 'mystorageacct'."
- "Show me the tables in storage account 'companydata2024'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Account name** |  Required | The name of the Azure Storage account. This is the unique name you chose for your storage account (for example, `mystorageaccount`). |
| **Learn** |  Optional | Discover available sub-commands and their parameters without executing any Azure operation. Use it on a command group, for example `azmcp storage --learn`, to list all commands in that group, or on a specific command, for example `azmcp storage account list --learn`, to see its options. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

#### CLI

List all tables in an Azure Storage account. Shows table names for the specified storage account. Required: --account, --subscription. Optional: --tenant. Returns: table names. Do not use this tool for Cosmos DB tables or Kusto/Data Explorer tables.

```bash
azmcp storage table list --account <account>
```

| Switch | Required | Type | Description |
|--------|----------|------|-------------|
| `--account` | ✅ | string | The name of the Azure Storage account. This is the unique name you chose for your storage account (e.g., 'mystorageaccount'). |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Storage documentation](/azure/storage/)
