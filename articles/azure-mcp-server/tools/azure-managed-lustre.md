---
title: Azure Managed Lustre Tools for Azure MCP Server
description: Learn how to use Azure MCP Server tools with Azure Managed Lustre to manage, create, update, and analyze scalable Lustre file systems for AI and HPC workloads.
keywords: azure mcp server, azmcp, azure managed lustre, lustre file systems
ai-usage: ai-assisted
content_well_notification: 
  - AI-contribution
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.topic: concept-article
ms.date: 02/02/2026
#reviewers: @wolfgang-desalvador @rebecca-makar
---

# Azure Managed Lustre tools for Azure MCP Server overview

Azure MCP Server enables you to manage Azure resources, including Azure Managed Lustre, by using natural language prompts, streamlining infrastructure operations for AI training and HPC environments. Learn how to optimize AI and HPC workloads with scalable Lustre file systems.

[Azure Managed Lustre](/azure/azure-managed-lustre/amlfs-overview) is a high-performance, scalable file system built on the open-source Lustre technology and optimized for AI and HPC workloads on Azure. It provides the throughput, parallelism, and low-latency access required for large-scale simulation, model training, and fine-tuning.‌ With [autoimport](/azure/azure-managed-lustre/auto-import) and [autoexport](/azure/azure-managed-lustre/auto-export) capabilities, you can seamlessly sync data between Azure Blob Storage and your Lustre filesystem.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## File system: Create a file system

<!-- managedlustre fs create -->

Create an Azure Managed Lustre (AMLFS) file system using the specified network, capacity, maintenance window, and availability zone.

Example prompts include:

- **Basic filesystem creation**: "Create Azure Managed Lustre filesystem 'amlfs-prod-001' in resource group 'my-resource-group' in eastus with SKU 'AMLFS-Durable-Premium-125', size 128 TiB, in subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.Network/virtualNetworks/vnet-001/subnets/subnet-001', zone 1, maintenance on Sunday at 02:00"
- **Development environment**: "Create test filesystem 'dev-amlfs' in resource group 'my-resource-group' in westus2 using 'AMLFS-Durable-Premium-40' SKU with 32-TiB capacity in subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/dev-rg/providers/Microsoft.Network/virtualNetworks/dev-vnet/subnets/amlfs-subnet', availability zone 2, maintenance Wednesday at 14:00"
- **Secure filesystem with encryption**: "Create encrypted filesystem 'secure-amlfs' in resource group 'my-resource-group' in northeurope with 'AMLFS-Durable-Premium-125' SKU, 64-TiB capacity, subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/security-rg/providers/Microsoft.Network/virtualNetworks/secure-vnet/subnets/lustre-subnet', zone 1, maintenance Friday at 23:00, using custom encryption with key vault '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/security-rg/providers/Microsoft.KeyVault/vaults/secure-kv' and key 'https://secure-kv.vault.azure.net/keys/lustre-key/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p'"
- **Budget-optimized setup**: "Create cost-effective filesystem 'budget-fs' in resource group 'my-resource-group' in eastus2 with 'AMLFS-Durable-Premium-40', 48 TiB, subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/budget-rg/providers/Microsoft.Network/virtualNetworks/budget-vnet/subnets/storage-subnet', zone 1, maintenance Sunday at 05:00"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The AMLFS resource name. Must be DNS-friendly (letters, numbers, hyphens). Example: `amlfs-001`. |
| **Location** |  Required | Azure region/region short name (use Azure location token, lowercase). Examples: `uaenorth`, `swedencentral`, `eastus`. |
| **SKU** |  Required | The AMLFS SKU. Exact allowed values: `AMLFS-Durable-Premium-40`, `AMLFS-Durable-Premium-125`, `AMLFS-Durable-Premium-250`, `AMLFS-Durable-Premium-500`. |
| **Size** |  Required | The AMLFS size in TiB as an integer (no unit). Examples: `4`, `12`, `128`. |
| **Subnet ID** |  Required | Full subnet resource ID. Required format: `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/{subnet}`. Example: `/subscriptions/0000/resourceGroups/my-rg/providers/Microsoft.Network/virtualNetworks/vnet-001/subnets/subnet-001`. |
| **Zone** |  Required | Availability zone identifier. Use a single digit string matching the region's availability zone labels (for example `1`). Example: `1`. |
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

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs create](../includes/tools/annotations/azure-managed-lustre-file-system-create-annotations.md)]

## File system: List file systems

<!-- managedlustre fs list -->

Get an inventory of Azure Managed Lustre file systems and check their properties.

Example prompts include:

- **List all file systems**: "List all Azure Managed Lustre file systems."
- **Show file system details**: "Get details for filesystem 'lustre-fs-01'."
- **Check file system status**: "What is the status of filesystem 'lustre-fs-01'?"
- **Filter by resource group**: "List Azure Managed Lustre file systems in resource group 'bigdata-rg'."
- **Filter by size**: "Show file systems larger than 100 TiB."

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs list](../includes/tools/annotations/azure-managed-lustre-file-system-list-annotations.md)]

## File system: Calculate required subnet size

<!-- managedlustre fs subnetsize ask -->

Calculates the required subnet size for an Azure Managed Lustre file system, given a SKU, and size. Use this calculation to plan network deployment for AMLFS.

Example prompts include:

- **Basic calculation**: "What is the required subnet size for filesystem with SKU 'AMLFS-Durable-Premium-125' and size 128 TiB?"
- **Small deployment**: "Calculate subnet size for Azure Managed Lustre filesystem with SKU 'AMLFS-Durable-Premium-250' and size 8 TiB"
- **Large scale planning**: "What subnet size do I need for a 512-TiB filesystem using 'AMLFS-Durable-Premium-500' SKU?"
- **Development environment**: "Calculate required subnet size for test filesystem with 'AMLFS-Durable-Premium-125' SKU and 32-TiB capacity"
- **Production planning**: "What is the subnet size requirement for production filesystem 'prod-amlfs-001' with 256 TiB using 'AMLFS-Durable-Premium-250'?"
- **High-performance setup**: "Calculate subnet requirements for AI training filesystem with 'AMLFS-Durable-Premium-500' and 1,024 TiB"
- **Research environment**: "What subnet size is needed for research filesystem 'ml-data-fs' with SKU 'AMLFS-Durable-Premium-125' and 64 TiB?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **SKU** |  Required | The AMLFS SKU. Allowed values: `AMLFS-Durable-Premium-40`, `AMLFS-Durable-Premium-125`, `AMLFS-Durable-Premium-250`, `AMLFS-Durable-Premium-500`. |
| **Size** |  Required | The AMLFS size in tebibytes (TiB). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

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

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs sku get](../includes/tools/annotations/azure-managed-lustre-file-system-sku-get-annotations.md)]

## File system: Update a file system

<!-- managedlustre fs update -->

Update maintenance window and/or root squash settings of an existing Azure Managed Lustre (AMLFS) file system. Provide either maintenance day and time or root squash fields (`no-squash-nid-list`, `squash-uid`, `squash-gid`). Root squash fields must be provided if root squash isn't None. If updating the maintenance window, both maintenance day and maintenance time should be provided.

Example prompts include:

- **Basic maintenance window update**: "Update the maintenance window of the Azure Managed Lustre filesystem 'amlfs-prod-001' in resource group 'my-resource-group' to Sunday at 02:00"
- **Weekend maintenance schedule**: "Change maintenance window for filesystem 'hpc-lustre-fs' in resource group 'my-resource-group' to Saturday at 23:00"
- **Business hours maintenance**: "Update Azure Managed Lustre filesystem 'dev-amlfs' in resource group 'my-resource-group' maintenance to Wednesday at 14:30"
- **Off-peak scheduling**: "Set maintenance window for filesystem 'analytics-lustre' in resource group 'my-resource-group' to Monday at 01:00"
- **Root squash configuration**: "Update filesystem 'secure-amlfs' in resource group 'my-resource-group' with root squash mode 'All' and squash UID 1000 and GID 1000 with no squash NID list '10.0.2.4@tcp;10.0.2.[6-8]@tcp'"
- **Combined update**: "Update filesystem 'ml-amlfs' in resource group 'my-resource-group' maintenance to Friday at 03:00 and set root squash mode to 'None'"
- **Security hardening**: "Configure Azure Managed Lustre filesystem 'production-fs' in resource group 'my-resource-group' with no squash NID list '10.0.2.4@tcp;10.0.2.[6-8]@tcp', and squash GID 999"
- **Development environment**: "Update filesystem 'test-lustre' in resource group 'my-resource-group' maintenance window to Thursday at 12:00 for development testing"
- **Regional maintenance**: "Set maintenance schedule for filesystem 'europe-amlfs' in resource group 'my-resource-group' to Tuesday at 04:00 for minimal impact"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. A resource group is a logical container for Azure resources. |
| **Name** |  Required | The AMLFS resource name. Must be DNS-friendly (letters, numbers, hyphens). Example: `amlfs-001`. |
| **Maintenance day** |  Optional | Preferred maintenance day. Allowed values: `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`, `Sunday`. |
| **Maintenance time** |  Optional | Preferred maintenance time in UTC. Format: `HH:MM` (24-hour). Examples: `00:00`, `23:00`. |
| **No squash NID list** |  Optional | Comma-separated list of NIDs (network identifiers) not to squash. Example: `'10.0.2.4@tcp;10.0.2.[6-8]@tcp'`. |
| **Squash UID** |  Optional | Numeric UID to squash root to. Required in case root squash mode isn't `None`. Example: `1000`. |
| **Squash GID** |  Optional | Numeric GID to squash root to. Required in case root squash mode isn't `None`. Example: `1000`. |
| **Root squash mode** |  Optional | Root squash mode. Allowed values: `All`, `RootOnly`, `None`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs update](../includes/tools/annotations/azure-managed-lustre-file-system-update-annotations.md)]

## File system: Validate subnet size

<!-- managedlustre fs subnetsize validate -->

Validates that the provided subnet can host an Azure Managed Lustre filesystem for the given SKU and size.

Example prompts include:

- **Basic validation**: "Validate if the network '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.Network/virtualNetworks/vnet-001/subnets/subnet-001' can host Azure Managed Lustre filesystem of size 128 TiB using the SKU 'AMLFS-Durable-Premium-125'"
- **Production environment**: "Check if subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/hpc-rg/providers/Microsoft.Network/virtualNetworks/hpc-vnet/subnets/lustre-subnet' can support AMLFS filesystem of 256 TiB with SKU 'AMLFS-Durable-Premium-250' in eastus"
- **Development setup**: "Validate subnet capacity for Azure Managed Lustre filesystem size 48 TiB using SKU 'AMLFS-Durable-Premium-40' in subnet '/subscriptions/dev-sub/resourceGroups/dev-rg/providers/Microsoft.Network/virtualNetworks/dev-vnet/subnets/amlfs-subnet' in westus2"
- **Large scale deployment**: "Can subnet '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ai-rg/providers/Microsoft.Network/virtualNetworks/ai-vnet/subnets/storage-subnet' host a 512-TiB Azure Managed Lustre filesystem using 'AMLFS-Durable-Premium-500' SKU in swedencentral?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **SKU** |  Required | The AMLFS SKU. Exact allowed values: `AMLFS-Durable-Premium-40`, `AMLFS-Durable-Premium-125`, `AMLFS-Durable-Premium-250`, `AMLFS-Durable-Premium-500`. |
| **Size** |  Required | The AMLFS size in TiB as an integer (no unit). Examples: `4`, `12`, `128`. |
| **Subnet ID** |  Required | Full subnet resource ID. Required format: `/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/{subnet}`. Example: `/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-rg/providers/Microsoft.Network/virtualNetworks/vnet-001/subnets/subnet-001`. |
| **Location** |  Required | Azure region/region short name (use Azure location token, lowercase). Examples: `uaenorth`, `swedencentral`, `eastus`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs subnetsize validate](../includes/tools/annotations/azure-managed-lustre-file-system-subnet-size-validate-annotations.md)]


## Blobs: Create blob import job 

<!-- managedlustre fs blob import create -->

Creates a one-time import job for an Azure Managed Lustre filesystem to import files from the linked blob storage container. The import job performs a one-time sync of data from the configured HSM blob container to the Lustre filesystem. Use this job to import specific prefixes or all data from blob storage into the filesystem at a point in time.

Example prompts include:

- "Create an autoimport job for filesystem 'LustreFs01' in resource group 'rg-lustre-prod'"
- "I want to start an autoimport job on the managed Lustre filesystem 'DataLakeFS' in resource group 'rg-data-core'"
- "Set up a new fs autoimport job for filesystem 'ProjectDataFS' within resource group 'rg-analytics'"
- "Can you initiate an autoimport job on managed Lustre filesystem 'ArchiveFS' specifying the container 'importcontainer' in resource group 'rg-mlustredemo'?"
- "Create an autoimport job for filesystem 'TrainingFS' in resource group 'rg-lustre-eastus'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Filesystem name** |  Required | The name of the Azure Managed Lustre filesystem. |
| **Job name** |  Optional | The name of the autoimport job. If not specified, the system generates a timestamped name. |
| **Conflict resolution mode** |  Optional | How the autoimport job handles conflicts. `Fail`: stop immediately on conflict. `Skip`: pass over the conflict. `OverwriteIfDirty`: delete and re-import if conflicting type, dirty, or currently released. `OverwriteAlways`: extends `OverwriteIfDirty` to include releasing restored but not dirty files. Default: `Skip`. Allowed values: `Fail`, `Skip`, `OverwriteIfDirty`, `OverwriteAlways`. |
| **Import prefixes** |  Optional | Array of blob paths or prefixes to import from blob storage. Default: `/`. Maximum: 100 paths. Examples: `/data`, `/logs`. |
| **Maximum errors** |  Optional | Total non-conflict-oriented errors (for example, OS errors) that the import job tolerates before exiting with failure. `-1`: infinite. `0`: exit immediately on any error. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob import create](../includes/tools/annotations/azure-managed-lustre-file-system-blob-import-create-annotations.md)]

## Blobs: Get blob import job 

<!-- managedlustre fs blob import get -->

Gets import job details or lists all import jobs for an Azure Managed Lustre filesystem. If the job name is provided, return details for that specific job. If job name is omitted, return a list of all import jobs for the filesystem.

Example prompts include:

- "Show me all autoimport jobs for managed Lustre filesystem 'LustreFs01' in resource group 'rg-storageprod'"
- "List every autoimport job in managed Lustre filesystem 'BackupFS' under resource group 'rg-lustre-dev'"
- "Get details for autoimport job 'import123' from filesystem 'DataLakeFS' in resource group 'rg-storageprod'"
- "Retrieve information about autoimport job 'dailybackup' on filesystem 'ArchiveFS' within resource group 'rg-lustre-dev'"
- "Can you show all autoimport jobs linked to managed Lustre filesystem 'ProjectDataFS' in resource group 'rg-storageprod'?"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. A resource group is a logical container for Azure resources. |
| **Filesystem name** |  Required | The name of the Azure Managed Lustre filesystem. |
| **Job name** |  Optional | The name of the autoimport job. If not specified, the system generates a timestamped name. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob import get](../includes/tools/annotations/azure-managed-lustre-file-system-blob-import-get-annotations.md)]

## Blobs: Cancel blob import job

<!-- managedlustre fs blob import cancel -->

Cancels a running import job for an Azure Managed Lustre filesystem. This stops the import operation and prevents further processing. The job can't be resumed after cancellation.

Example prompts include:

- "Cancel the autoimport job 'import1234' for filesystem 'LustreFs01' in resource group 'rg-storage-prod'"
- "I need to cancel the fs autoimport job 'backup-sync' on filesystem 'DataLakeFS' in resource group 'rg-lustre-dev'"
- "Cancel the autoimport job with ID 'dailybackup-import' from the managed Lustre filesystem 'ArchiveFS' in resource group 'rg-fileservices'"
- "Stop the fs autoimport job 'import5678' on filesystem 'ProjectDataFS' in resource group 'rg-ml-prod'"
- "Cancel the managed Lustre fs autoimport job named 'weeklysync' on filesystem 'TrainingFS' within resource group 'rg-analytics'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. A resource group is a logical container for Azure resources. |
| **Filesystem name** |  Required | The name of the Azure Managed Lustre filesystem. |
| **Job name** |  Required | The name of the autoexport or autoimport job. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob import cancel](../includes/tools/annotations/azure-managed-lustre-file-system-blob-import-cancel-annotations.md)]


## Blobs: Delete blob import job

<!-- managedlustre fs blob import delete -->

Deletes an import job for an Azure Managed Lustre filesystem. This operation removes the job record and history. The job must be completed or cancelled before it can be deleted.

Example prompts include:

- "Delete the autoimport job 'import123' from filesystem 'LustreFs01' in resource group 'rg-lustre-prod'"
- "Remove the autoimport job 'import456' on filesystem 'DataLakeFS' within resource group 'rg-data-central'"
- "Delete the fs autoimport job with ID 'import789' from filesystem 'ArchiveFS' in resource group 'rg-backup'"
- "Remove fs autoimport job 'importJob42' from filesystem 'ProjectDataFS' under resource group 'rg-analytics'"
- "Delete the autoimport job 'syncJob01' on filesystem 'LustreFsX' within resource group 'rg-cluster-01'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. A resource group is a logical container for Azure resources. |
| **Filesystem name** |  Required | The name of the Azure Managed Lustre filesystem. |
| **Job name** |  Required | The name of the autoexport or autoimport job. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob import delete](../includes/tools/annotations/azure-managed-lustre-file-system-blob-import-delete-annotations.md)]

## Autoimport: Get details of autoimport jobs

<!-- managedlustre fs blob autoimport get -->

Get status, configuration, and progress details of [autoimport](/azure/azure-managed-lustre/auto-import) jobs for an Azure Managed Lustre filesystem. Autoimport jobs sync data from the linked blob storage container to the Lustre filesystem. If you provide a job name, the tool returns details of that specific job. Otherwise, it returns all jobs for the filesystem.

Example prompts include:

- "Get the autoimport jobs for filesystem 'LustreFs01' in resource group 'rg-storage-prod'"
- "Show me the blob autoimport jobs for filesystem 'archiveLustre' within resource group 'rg-data-lake'"
- "Retrieve autoimport job details of the Managed Lustre filesystem 'fastLustreCompute' in resource group 'rg-hpc-environment'"
- "Can you fetch the autoimport job info for filesystem 'Lustre2024' from resource group 'rg-lustre-main'"
- "I need to get the fs blob autoimport job details for filesystem 'analyticsLustreFS' under resource group 'rg-analytics'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. A resource group is a logical container for Azure resources. |
| **Filesystem name** |  Required | The name of the Azure Managed Lustre filesystem. |
| **Job name** |  Optional | The name of the auto export or auto import job. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob autoimport get](../includes/tools/annotations/managedlustre-file-system-blob-autoimport-get-annotations.md)]


## Autoimport: Create an autoimport job

<!-- managedlustre fs blob autoimport create -->

Create an [autoimport](/azure/azure-managed-lustre/auto-import) job to continuously import new or modified files from the linked blob storage container to your Azure Managed Lustre filesystem. The job syncs changes from the configured HSM blob container to the Lustre filesystem, keeping your filesystem updated with changes in blob storage.

Example prompts include:

- "Create an autoimport job for filesystem 'ProjectDataFS' in resource group 'rg-managedlustre-prod'"
- "Set up a blob autoimport on filesystem 'LustreMainFS' within resource group 'rg-dev-cluster'"
- "I need to create a Managed Lustre autoimport for filesystem 'AnalyticsFS' in resource group 'rg-analytics-eastus'"
- "Start an autoimport for the filesystem named 'ResearchFS' in resource group 'rg-research-lustre'"
- "Establish an autoimport job on filesystem 'FSBackup' under resource group 'rg-backup-westus2'"
- "Create an autoimport job for filesystem 'DataFS' in resource group 'rg-prod' with prefix '/data/incoming' and conflict resolution mode 'OverwriteIfDirty'"
- "Create an autoimport job for filesystem 'trainingLustre01' in resource group 'rg-training-lustre' with prefix '/datasets' and conflict resolution mode 'OverwriteAlways'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | Azure resource group name. |
| **Filesystem name** |  Required | Azure Managed Lustre filesystem name. |
| **Job name** |  Optional | Autoimport job name. If you don't specify a name, a timestamped name is generated. |
| **Conflict resolution mode** |  Optional | Conflict resolution method for the autoimport job. `Fail`: stops immediately on conflict. `Skip`: skips the conflict. `OverwriteIfDirty`: deletes and re-imports if conflicting type, dirty, or currently released. `OverwriteAlways`: extends `OverwriteIfDirty` to include releasing restored but not dirty files. Default: `Skip`. Allowed values: `Fail`, `Skip`, `OverwriteIfDirty`, `OverwriteAlways`. |
| **Autoimport prefixes** |  Optional | Array of blob paths or prefixes to autoimport to the cluster namespace. Default: `/`. Maximum: 100 paths. Example: `/data`, `/logs`. |
| **Admin status** |  Optional | Administrative status of the autoimport job. `Enable`: job is active. `Disable`: disables the current active autoimport job. Default: `Enable`. Allowed values: `Enable`, `Disable`. |
| **Enable deletions** |  Optional | Specifies whether to enable deletions during autoimport. This parameter only affects overwrite-dirty mode. Default: `false`. |
| **Maximum errors** |  Optional | Total non-conflict-oriented errors (for example, OS errors) that the import can tolerate before exiting with failure. `-1`: infinite. `0`: exits immediately on any error. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob autoimport create](../includes/tools/annotations/managedlustre-file-system-blob-autoimport-create-annotations.md)]

## Autoimport: Cancel an autoimport job

<!-- managedlustre fs blob autoimport cancel -->

Cancel a running [autoimport](/azure/azure-managed-lustre/auto-import) job for your Azure Managed Lustre filesystem. This action stops the ongoing sync operation from the linked blob storage container to the Lustre filesystem.

Example prompts include:

- "Cancel the autoimport job named 'dailySyncJob' on filesystem 'LustreFs01' in resource group 'rg-storage-prod'"
- "I need to stop the job 'autoimportJob42' for filesystem 'ProjectLustre' within 'rg-data-central'"
- "Cancel the autoimport job 'importJobA1' on the Lustre filesystem 'FsBackup2024' in the resource group 'rg-backup'"
- "How do I cancel the job 'nightlyAutoImport' running on filesystem 'fastLustreFs' in resource group 'rg-performance'?"
- "Stop the autoimport job 'urgentSync' on Managed Lustre filesystem 'MainLustreFS' inside resource group 'rg-enterprise'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | Azure resource group name. |
| **Filesystem name** |  Required | Azure Managed Lustre filesystem name. |
| **Job name** |  Required | Autoimport job name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob autoimport cancel](../includes/tools/annotations/managedlustre-file-system-blob-autoimport-cancel-annotations.md)]

## Autoimport: Delete an autoimport job

<!-- managedlustre fs blob autoimport delete -->

Delete an [autoimport](/azure/azure-managed-lustre/auto-import) job for your Azure Managed Lustre filesystem. This action permanently removes the job record from the filesystem. Use this tool to clean up completed, failed, or canceled autoimport jobs.

Example prompts include:

- "Delete the autoimport job named 'importJob123' from filesystem 'LustreFs1' in resource group 'rg-lustre-prod'"
- "Remove autoimport job 'dailySync' for filesystem 'FsData2024' within resource group 'rg-storage-eus'"
- "I want to delete the job 'autoImportApril' from Managed Lustre filesystem 'DataLakeFs' inside resource group 'rg-datalake-west'"
- "Delete the fs blob autoimport job 'syncJob01' on filesystem 'LustreFsX' located in resource group 'rg-cluster-01'"
- "Can you delete the autoimport job 'weekly-import' on filesystem 'LustreMain' under resource group 'rg-enterprise-services'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | Azure resource group name. |
| **Filesystem name** |  Required | Azure Managed Lustre filesystem name. |
| **Job name** |  Required | Autoimport job name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob autoimport delete](../includes/tools/annotations/managedlustre-file-system-blob-autoimport-delete-annotations.md)]

## Autoexport: Get details of an autoexport job

<!-- managedlustre fs blob autoexport get -->

Get status, configuration, and progress details of [autoexport](/azure/azure-managed-lustre/auto-export) jobs for your Azure Managed Lustre filesystem. Autoexport jobs sync data from the Lustre filesystem to the linked blob storage container. If you provide a job name, the tool returns details of that specific job. Otherwise, it returns all jobs for the filesystem.

Example prompts include:

- "Get the blob autoexport jobs for filesystem 'LustreFs01' in resource group 'rg-lustre-prod'"
- "Show me the autoexport jobs of the Managed Lustre filesystem named 'AnalyticsFs' within 'rg-data-center'"
- "Retrieve blob autoexport job details for filesystem 'ProjectXFs' in resource group 'rg-projectx'"
- "Can you provide the autoexport job information for the Lustre filesystem 'SalesDataFs' under resource group 'rg-salesapp'?"
 - "Can you provide the autoexport job information for the Lustre filesystem 'TrainingDataFs' under resource group 'rg-training'?"
- "I need to see the blob autoexport jobs for 'ArchiveFs' in resource group 'rg-archives'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | Azure resource group name. |
| **Filesystem name** |  Required | Azure Managed Lustre filesystem name. |
| **Job name** |  Optional | Auto export job name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob autoexport get](../includes/tools/annotations/managedlustre-file-system-blob-autoexport-get-annotations.md)]

## Autoexport: Create an autoexport job

<!-- managedlustre fs blob autoexport create -->

Create an [autoexport](/azure/azure-managed-lustre/auto-export) job to continuously export modified files from your Azure Managed Lustre filesystem to the linked blob storage container. The job syncs changes from the Lustre filesystem to the configured HSM blob container, keeping your blob storage updated with changes in the filesystem.

Example prompts include:

- "Create an autoexport job for filesystem 'DataLakeFS' in resource group 'rg-lustre-prod'"
- "Set up autoexport on Managed Lustre filesystem 'LustreMain' within resource group 'rg-hpc-cluster'"
- "I need to create a blob autoexport for filesystem 'faststorage' in resource group 'rg-data-analytics'"
- "Deploy a new autoexport task for the Lustre filesystem named 'ArchiveFS' under resource group 'rg-archive'"
- "Initiate autoexport on filesystem 'ResearchFS' located in resource group 'rg-science-projects'"
- "Create an autoexport job for filesystem 'OutputFS' in resource group 'rg-prod' with prefix '/results/processed'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | Azure resource group name. |
| **Filesystem name** |  Required | Azure Managed Lustre filesystem name. |
| **Job name** |  Optional | Autoexport job name. If you don't specify a name, a timestamped name is generated. |
| **Autoexport prefix** |  Optional | Blob path or prefix to autoexport from the cluster namespace. Default: `/`. Note: Only one prefix is supported for autoexport jobs. Example: `/data`. |
| **Admin status** |  Optional | Administrative status of the autoexport job. `Enable`: job is active. `Disable`: disables the current active autoexport job. Default: `Enable`. Allowed values: `Enable`, `Disable`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob autoexport create](../includes/tools/annotations/managedlustre-file-system-blob-autoexport-create-annotations.md)]

## Autoexport: Cancel an autoexport job

<!-- managedlustre fs blob autoexport cancel -->

Cancel a running [autoexport](/azure/azure-managed-lustre/auto-export) job for your Azure Managed Lustre filesystem. This action stops the ongoing sync operation from the Lustre filesystem to the linked blob storage container.

Example prompts include:

- "Cancel the autoexport job named 'dailyBackupJob' on filesystem 'lustreProdFs' in resource group 'rg-lustre-apps'"
- "Stop the job 'trainingLustre01-autoexport' for filesystem 'trainingLustre01' in resource group 'rg-training-lustre'"
- "I need to cancel the autoexport job 'weeklySync' from the 'dataLustreFs' filesystem in resource group 'rg-data-services'"
- "How do I cancel the autoexport job called 'exportJob123' on filesystem 'prodLustreFs' within resource group 'rg-production'"
- "Abort the autoexport job 'monthlyExport' on filesystem 'archiveLustre' under resource group 'rg-archive-management'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | Azure resource group name. |
| **Filesystem name** |  Required | Azure Managed Lustre filesystem name. |
| **Job name** |  Required | Autoexport job name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob autoexport cancel](../includes/tools/annotations/managedlustre-file-system-blob-autoexport-cancel-annotations.md)]

## Autoexport: Delete an autoexport job

<!-- managedlustre fs blob autoexport delete -->

Delete an [autoexport](/azure/azure-managed-lustre/auto-export) job for your Azure Managed Lustre filesystem. This action permanently removes the job record from the filesystem. Use this tool to clean up completed, failed, or canceled autoexport jobs.

Example prompts include:

- "Delete the autoexport job 'archiveExportJob' from filesystem 'LustreProdFs' in resource group 'rg-cloud-storage'"
- "Remove autoexport job 'dailyBackup' on filesystem 'LustreFS1' within resource group 'rg-datahub'"
- "Can you delete the job named 'autoExportJob42' for filesystem 'AzureLustreFs' in resource group 'rg-az-lustre'?"
- "Delete autoexport job 'monthlyExport' from the Managed Lustre filesystem 'LustreFsEast' located in resource group 'rg-eastus-lustre'"
- "I need to delete the autoexport job 'exportJob2024' in filesystem 'LustreMain' under resource group 'rg-production-lustre'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | Azure resource group name. |
| **Filesystem name** |  Required | Azure Managed Lustre filesystem name. |
| **Job name** |  Required | Auto export job name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [managedlustre fs blob autoexport delete](../includes/tools/annotations/managedlustre-file-system-blob-autoexport-delete-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Managed Lustre](/azure/azure-managed-lustre/amlfs-overview)
- [Learn more about autoimport](/azure/azure-managed-lustre/auto-import)
- [Learn more about autoexport](/azure/azure-managed-lustre/auto-export)