---
title: Azure Managed Lustre Tools for Azure MCP Server
description: Learn how to use Azure MCP Server tools with Azure Managed Lustre to manage and analyze scalable Lustre file systems. 
keywords: azure mcp server, azmcp, azure managed lustre, lustre file systems
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: reference
ms.date: 10/27/2025
---

# Azure Managed Lustre tools for Azure MCP Server

Azure MCP Server enables you to manage Azure resources, including Azure Managed Lustre, by using natural language prompts, streamlining infrastructure operations for AI training and HPC environments. Learn how to optimize AI and HPC workloads with scalable Lustre file systems.

[Azure Managed Lustre](/azure/azure-managed-lustre/amlfs-overview) is a high-performance, scalable file system built on the open-source Lustre technology and optimized for AI and HPC workloads on Azure. It provides the throughput, parallelism, and low-latency access required for large-scale simulation, model training, and fine-tuning.‌

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## File system: Create a file system

<!-- managedlustre fs create -->

Create an Azure Managed Lustre (AMLFS) file system using the specified network, capacity, maintenance window, and availability zone.

Example prompts include:

- **Basic filesystem creation**: "Create Azure Managed Lustre filesystem 'amlfs-prod-001' in eastus with SKU 'AMLFS-Durable-Premium-125', size 128 TiB, in subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.Network/virtualNetworks/vnet-001/subnets/subnet-001', zone 1, maintenance on Sunday at 02:00"
- **Development environment**: "Create test filesystem 'dev-amlfs' in westus2 using 'AMLFS-Durable-Premium-40' SKU with 32 TiB capacity in subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/dev-rg/providers/Microsoft.Network/virtualNetworks/dev-vnet/subnets/amlfs-subnet', availability zone 2, maintenance Wednesday at 14:00"
- **Secure filesystem with encryption**: "Create encrypted filesystem 'secure-amlfs' in northeurope with 'AMLFS-Durable-Premium-125' SKU, 64 TiB capacity, subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/security-rg/providers/Microsoft.Network/virtualNetworks/secure-vnet/subnets/lustre-subnet', zone 1, maintenance Friday at 23:00, using custom encryption with key vault '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/security-rg/providers/Microsoft.KeyVault/vaults/secure-kv' and key 'https://secure-kv.vault.azure.net/keys/lustre-key/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p'"
- **Budget-optimized setup**: "Create cost-effective filesystem 'budget-fs' in eastus2 with 'AMLFS-Durable-Premium-40', 48 TiB, subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/budget-rg/providers/Microsoft.Network/virtualNetworks/budget-vnet/subnets/storage-subnet', zone 1, maintenance Sunday at 05:00"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Required | The AMLFS resource name. Must be DNS-friendly (letters, numbers, hyphens). Example: `amlfs-001`. |
| **Location** |  Required | Azure region/region short name (use Azure location token, lowercase). Examples: `uaenorth`, `swedencentral`, `eastus`. |
| **SKU** |  Required | The AMLFS SKU. Exact allowed values: `AMLFS-Durable-Premium-40`, `AMLFS-Durable-Premium-125`, `AMLFS-Durable-Premium-250`, `AMLFS-Durable-Premium-500`. |
| **Size** |  Required | The AMLFS size in TiB as an integer (no unit). Examples: `4`, `12`, `128`. |
| **Subnet ID** |  Required | Full subnet resource ID. Required format: `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/{subnet}`. Example: `/subscriptions/0000/resourceGroups/my-rg/providers/Microsoft.Network/virtualNetworks/vnet-001/subnets/subnet-001`. |
| **Zone** |  Required | Availability zone identifier. Use a single digit string matching the region's AZ labels (for example `1`). Example: `1`. |
| **Maintenance day** |  Required | Preferred maintenance day. Allowed values: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`. |
| **Maintenance time** |  Required | Preferred maintenance time in UTC. Format: `HH:MM` (24-hour). Examples: `00:00`, `23:00`. |
| **HSM container** |  Optional | Full blob container resource ID for HSM integration. HPC Cache Resource Provider must have before deployment Storage Blob Data Contributor and Storage Account Contributor roles on parent Storage Account. Format: `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}/blobServices/default/containers/{container}`. Example: `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/stacc/blobServices/default/containers/hsm-container`. |
| **HSM log container** |  Optional | Full blob container resource ID for HSM logging. HPC Cache Resource Provider must have before deployment Storage Blob Data Contributor and Storage Account Contributor roles on parent Storage Account. Same format as HSM container. Example: `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.Storage/storageAccounts/stacc/blobServices/default/containers/hsm-logs`. |
| **Import prefix** |  Optional | Optional HSM import prefix (path prefix inside the container starting with `/`). Examples: `'/ingest/'`, `'/archive/2019/'`. |
| **Root squash mode** |  Optional | Root squash mode. Allowed values: `All`, `RootOnly`, `None`. |
| **No squash NID list** |  Optional | Comma-separated list of NIDs (network identifiers) not to squash. Example: `'10.0.2.4@tcp;10.0.2.[6-8]@tcp'`. |
| **Squash UID** |  Optional | Numeric UID to squash root to. Required in case root squash mode isn't `None`. Example: `1000`. |
| **Squash GID** |  Optional | Numeric GID to squash root to. Required in case root squash mode isn't `None`. Example: `1000`. |
| **Custom encryption** |  Optional | Enable customer-managed encryption using a Key Vault key. When `true`, key URL and source vault required, with a user-assigned identity already configured for Key Vault key access. |
| **Key URL** |  Optional | Full Key Vault key URL. Format: `https://{vaultName}.vault.azure.net/keys/{keyName}/{keyVersion}`. Example: `https://kv-amlfs-001.vault.azure.net/keys/key-amlfs-001/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p`. |
| **Source vault** |  Optional | Full Key Vault resource ID. Format: `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.KeyVault/vaults/{vaultName}`. Example: `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.KeyVault/vaults/kv-amlfs-001`. |
| **User assigned identity ID** |  Optional | User-assigned managed identity resource ID (full resource ID) to use for Key Vault access when custom encryption is enabled. The identity must have RBAC role to access the encryption key. Format: `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{name}`. Example: `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1`. |

 [!INCLUDE [managedlustre fs create](../includes/tools/annotations/azure-managed-lustre-file-system-create-annotations.md)]

## File system: List file systems

<!-- managedlustre fs list -->

Get an inventory of Azure Managed Lustre file systems and check their properties.

Example prompts include:

- **List all file systems**: "List all Azure Managed Lustre file systems."
- **Show file system details**: "Get details for my file system 'my-lustre-fs'."
- **Check file system status**: "What is the status of my file system 'my-lustre-fs'?"
- **Filter by resource group**: "List Azure Managed Lustre file systems in resource group 'bigdata-rg'."
- **Filter by size**: "Show file systems larger than 100 TiB."

[!INCLUDE [managedlustre fs list](../includes/tools/annotations/azure-managed-lustre-file-system-list-annotations.md)]

## File system: Calculate required subnet size

<!-- managedlustre fs subnetsize ask -->

Calculates the required subnet size for an Azure Managed Lustre file system, given a SKU and size. Use this calculation to plan network deployment for AMLFS.

Example prompts include:

- **Basic calculation**: "What is the required subnet size for my file system 'my-lustre-fs' with SKU 'AMLFS-Durable-Premium-125' and size 128 TiB?"
- **Small deployment**: "Calculate subnet size for Azure Managed Lustre filesystem with SKU 'AMLFS-Durable-Premium-250' and size 8 TiB"
- **Large scale planning**: "What subnet size do I need for a 512 TiB filesystem using 'AMLFS-Durable-Premium-500' SKU?"
- **Development environment**: "Calculate required subnet size for test filesystem with 'AMLFS-Durable-Premium-125' SKU and 32 TiB capacity"
- **Production planning**: "What is the subnet size requirement for production filesystem 'prod-amlfs-001' with 256 TiB using 'AMLFS-Durable-Premium-250'?"
- **High-performance setup**: "Calculate subnet requirements for AI training filesystem with 'AMLFS-Durable-Premium-500' and 1024 TiB"
- **Research environment**: "What subnet size is needed for research filesystem 'ml-data-fs' with SKU 'AMLFS-Durable-Premium-125' and 64 TiB?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **SKU** |  Required | The AMLFS SKU. Allowed values: `AMLFS-Durable-Premium-40`, `AMLFS-Durable-Premium-125`, `AMLFS-Durable-Premium-250`, `AMLFS-Durable-Premium-500`. |
| **Size** |  Required | The AMLFS size in tebibytes (TiB). |

[!INCLUDE [managedlustre fs subnetsize ask](../includes/tools/annotations/azure-managed-lustre-file-system-subnet-size-ask-annotations.md)]

## File system: Get SKU

<!-- azuremanagedlustre filesystem sku get -->

Retrieves the available Azure Managed Lustre SKU, including increments, bandwidth, scale targets, and zonal support. 

Example prompts include: 

* **List available SKUs**: "Show me the available Azure Managed Lustre SKUs."
* **Get SKUs by region**: "Display the available Azure Managed Lustre SKUs in West Europe."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Location** |  Optional | Azure region. Examples: `uaenorth`, `swedencentral`, `eastus`. |

[!INCLUDE [managedlustre fs sku get](../includes/tools/annotations/azure-managed-lustre-file-system-sku-get-annotations.md)]

## File system: Update a file system

<!-- managedlustre fs update -->

Update maintenance window and/or root squash settings of an existing Azure Managed Lustre (AMLFS) file system. Provide either maintenance day and time or root squash fields (`no-squash-nid-list`, `squash-uid`, `squash-gid`). Root squash fields must be provided if root squash isn't None. If updating the maintenance window, both maintenance day and maintenance time should be provided.

Example prompts include:

- **Basic maintenance window update**: "Update the maintenance window of the Azure Managed Lustre filesystem 'amlfs-prod-001' to Sunday at 02:00"
- **Weekend maintenance schedule**: "Change maintenance window for filesystem 'hpc-lustre-fs' to Saturday at 23:00"
- **Business hours maintenance**: "Update Azure Managed Lustre filesystem 'dev-amlfs' maintenance to Wednesday at 14:30"
- **Off-peak scheduling**: "Set maintenance window for filesystem 'analytics-lustre' to Monday at 01:00"
- **Root squash configuration**: "Update filesystem 'secure-amlfs' with root squash mode 'All' and squash UID 1000 and GID 1000 with no squash NID list '10.0.2.4@tcp;10.0.2.[6-8]@tcp'"
- **Combined update**: "Update filesystem 'ml-amlfs' maintenance to Friday at 03:00 and set root squash mode to 'None'"
- **Security hardening**: "Configure Azure Managed Lustre filesystem 'production-fs' withno squash NID list '10.0.2.4@tcp;10.0.2.[6-8]@tcp', and squash GID 999"
- **Development environment**: "Update filesystem 'test-lustre' maintenance window to Thursday at 12:00 for development testing"
- **Regional maintenance**: "Set maintenance schedule for filesystem 'europe-amlfs' to Tuesday at 04:00 for minimal impact"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Required | The AMLFS resource name. Must be DNS-friendly (letters, numbers, hyphens). Example: `amlfs-001`. |
| **Maintenance day** |  Optional | Preferred maintenance day. Allowed values: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`. |
| **Maintenance time** |  Optional | Preferred maintenance time in UTC. Format: `HH:MM` (24-hour). Examples: `00:00`, `23:00`. |
| **No squash NID list** |  Optional | Comma-separated list of NIDs (network identifiers) not to squash. Example: `'10.0.2.4@tcp;10.0.2.[6-8]@tcp'`. |
| **Squash UID** |  Optional | Numeric UID to squash root to. Required in case root squash mode isn't `None`. Example: `1000`. |
| **Squash GID** |  Optional | Numeric GID to squash root to. Required in case root squash mode isn't `None`. Example: `1000`. |
| **Root squash mode** |  Optional | Root squash mode. Allowed values: `All`, `RootOnly`, `None`. |

[!INCLUDE [managedlustre fs update](../includes/tools/annotations/azure-managed-lustre-file-system-update-annotations.md)]

## File system: Validate subnet size

<!-- managedlustre fs subnetsize validate -->

Validates that the provided subnet can host an Azure Managed Lustre filesystem for the given SKU and size.

Example prompts include:

- **Basic validation**: "Validate if the network '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.Network/virtualNetworks/vnet-001/subnets/subnet-001' can host Azure Managed Lustre filesystem of size 128 TiB using the SKU 'AMLFS-Durable-Premium-125'"
- **Production environment**: "Check if subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/hpc-rg/providers/Microsoft.Network/virtualNetworks/hpc-vnet/subnets/lustre-subnet' can support AMLFS filesystem of 256 TiB with SKU 'AMLFS-Durable-Premium-250' in eastus"
- **Development setup**: "Validate subnet capacity for Azure Managed Lustre filesystem size 48 TiB using SKU 'AMLFS-Durable-Premium-40' in subnet '/subscriptions/dev-sub/resourceGroups/dev-rg/providers/Microsoft.Network/virtualNetworks/dev-vnet/subnets/amlfs-subnet' in westus2"
- **Large scale deployment**: "Can subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ai-rg/providers/Microsoft.Network/virtualNetworks/ai-vnet/subnets/storage-subnet' host a 512 TiB Azure Managed Lustre filesystem using 'AMLFS-Durable-Premium-500' SKU in swedencentral?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **SKU** |  Required | The AMLFS SKU. Exact allowed values: `AMLFS-Durable-Premium-40`, `AMLFS-Durable-Premium-125`, `AMLFS-Durable-Premium-250`, `AMLFS-Durable-Premium-500`. |
| **Size** |  Required | The AMLFS size in TiB as an integer (no unit). Examples: `4`, `12`, `128`. |
| **Subnet ID** |  Required | Full subnet resource ID. Required format: `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/{subnet}`. Example: `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.Network/virtualNetworks/vnet-001/subnets/subnet-001`. |
| **Location** |  Required | Azure region/region short name (use Azure location token, lowercase). Examples: `uaenorth`, `swedencentral`, `eastus`. |

[!INCLUDE [managedlustre fs subnetsize validate](../includes/tools/annotations/azure-managed-lustre-file-system-subnet-size-validate-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Managed Lustre](/azure/azure-managed-lustre/amlfs-overview)