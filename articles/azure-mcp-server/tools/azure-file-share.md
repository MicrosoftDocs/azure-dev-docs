---
title: Azure File Shares Tools
description: Learn to use Azure MCP Server tools to manage file shares with natural language prompts. Create, update, delete, and snapshot file shares with ease.
keywords: azure mcp server, azmcp, file shares, azure services
author: diberry
ms.author: diberry
ms.date: 01/23/2026
content_well_notification:
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
reviewer: ankushbindlish2
---

# Azure File Shares tools for the Azure MCP Server overview

The Azure MCP Server lets you manage Azure file shares with natural language prompts. You don't need to remember specific command syntax.

[Azure File Shares](/azure/storage/files/storage-files-introduction) is a managed file sharing service in the cloud that allows you to create and manage file shares accessible via the NFS protocol. File shares provide high-performance, fully managed storage for your applications and workloads.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Get limits

<!-- @mcpcli fileshares limits -->

Get file share limits for a subscription and location.

Example prompts include:

- "Show me the current file share limits in the 'eastus' location"
- "What are the file share limits for location 'westeurope'?"
- "Get the file share limits for location 'centralus'"
- "Please provide the file share limits for location 'eastus2'"
- "Retrieve file share limits for the 'westus' region"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Location** |  Required | The Azure region/location name (for example, `eastus`, `westeurope`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares limits](../includes/tools/annotations/azure-fileshares-limits-annotations.md)]

## Get usage

<!-- @mcpcli fileshares usage -->

Get file share usage data for a subscription and location.

Example prompts include:

- "Show me the usage details for file shares in location 'eastus'"
- "I want to see usage for file shares in region 'westeurope'"
- "Get usage statistics for file shares in location 'centralus'"
- "Can you provide usage information for file shares in 'eastus2'?"
- "Display usage for file shares in the 'westus' region"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Location** |  Required | The Azure region/location name (for example, `eastus`, `westeurope`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares usage](../includes/tools/annotations/azure-fileshares-usage-annotations.md)]

## Get recommendations

<!-- @mcpcli fileshares rec -->

Get provisioning parameter recommendations for a file share based on desired storage size.

Example prompts include:

- "Get recommendations for a 1000 GiB file share in location 'eastus'"
- "Can you provide recommendations for a 500 GiB file share in 'westeurope'?"
- "Get details for a 2000 GiB file share in location 'centralus'"
- "I want to see recommendations for a 5000 GiB file share in 'eastus2'"
- "Retrieve recommendations for a 250 GiB file share in the 'westus' region"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Location** |  Required | The Azure region/location name (for example, `eastus`, `westeurope`). |
| **Provisioned storage in GiB (gibibytes)** |  Required | The desired provisioned storage size of the share in GiB. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares rec](../includes/tools/annotations/azure-fileshares-rec-annotations.md)]


## File Share: Check name availability

<!-- @mcpcli fileshares fileshare check-name-availability -->

Check if a file share name is available in a specific location.

Example prompts include:

- "Can you check if the fileshare name 'projectdata' is available in location 'eastus'?"
- "I want to see if 'salesbackup' is an available fileshare name in 'westeurope'"
- "Check the availability of the fileshare name 'teamfiles' in location 'EastUS'"
- "Is the name 'archive2024' free for a new fileshare in 'WestUS'?"
- "Verify whether 'clientdocs' can be used as a fileshare name in location 'centralus'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Required | The name of the file share. |
| **Location** |  Required | The Azure region/location name (for example, `EastUS`, `WestEurope`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares fileshare check-name-availability](../includes/tools/annotations/azure-fileshares-fileshare-check-name-availability-annotations.md)]

## File Share: Create file share

<!-- @mcpcli fileshares fileshare create -->

Create a new Azure file share resource in a resource group. This creates a high-performance, fully managed file share accessible via NFS protocol.

Example prompts include:

- "Create a new fileshare named 'project-data' in resource group 'rg-prod' at location 'eastus'"
- "I need to create a fileshare called 'backupshare' in resource group 'rg-backup' at location 'westeurope'"
- "Set up a fileshare 'userdocs' in resource group 'rg-dev' at location 'centralus'"
- "Create the fileshare 'archive2024' in resource group 'rg-archive' at location 'eastus2'"
- "Generate a fileshare named 'mediafiles' in resource group 'rg-media' at location 'westus'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the file share. |
| **Location** |  Required | The Azure region/location name (for example, `EastUS`, `WestEurope`). |
| **Mount name** |  Optional | The mount name of the file share as seen by end users. |
| **Media tier** |  Optional | The storage media tier (for example, `SSD`). |
| **Redundancy** |  Optional | The redundancy level (for example, `Local`, `Zone`). |
| **Protocol** |  Optional | The file sharing protocol (for example, `NFS`). |
| **Provisioned storage in GiB (gibibytes)** |  Optional | The desired provisioned storage size of the share in GiB. |
| **Provisioned io per sec** |  Optional | The provisioned IO operations per second. |
| **Provisioned throughput in MiB per sec (mebibytes)** |  Optional | The provisioned throughput in MiB per second. |
| **Public network access** |  Optional | Public network access setting (`Enabled` or `Disabled`). |
| **Nfs root squash** |  Optional | NFS root squash setting (`NoRootSquash`, `RootSquash`, or `AllSquash`). |
| **Allowed subnets** |  Optional | Comma-separated list of subnet IDs allowed to access the file share. |
| **Tags** |  Optional | Resource tags as JSON (for example, `{"key1":"value1","key2":"value2"}`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares fileshare create](../includes/tools/annotations/azure-fileshares-fileshare-create-annotations.md)]

## File Share: Delete file share

<!-- @mcpcli fileshares fileshare delete -->

Delete a file share permanently. This operation cannot be undone.

Example prompts include:

- "Delete the fileshare named 'backup-share' in resource group 'rg-prod'"
- "Remove the fileshare 'project-files' in resource group 'rg-marketing'"
- "I want to delete the fileshare 'temp-data' in resource group 'rg-dev'"
- "Can you delete the fileshare 'archive-old' in resource group 'rg-archive'?"
- "Please remove the fileshare 'cleanup-share' from resource group 'rg-cleanup'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the file share. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares fileshare delete](../includes/tools/annotations/azure-fileshares-fileshare-delete-annotations.md)]

## File Share: Get file share

<!-- @mcpcli fileshares fileshare get -->

Get details of a specific file share or list all file shares. If name is provided, returns a specific file share; otherwise, lists all file shares in the subscription or resource group.

Example prompts include:

- "Show me all file shares in storage account 'dataaccount01'"
- "List every file share available under the storage account 'backupstorage99'"
- "Get details for the file share 'reports2024' in storage account 'filesacctprod'"
- "Can you retrieve information on file share 'archive-logs' for storage account 'filestorageeast'"
- "I need to see the file share 'projectfiles' from storage account 'devstorageacct'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Optional | The name of the file share. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares fileshare get](../includes/tools/annotations/azure-fileshares-fileshare-get-annotations.md)]

## File Share: Update file share

<!-- @mcpcli fileshares fileshare update -->

Update an existing Azure file share resource. Allows updating mutable properties like provisioned storage, IOPS, throughput, and network access settings.

Example prompts include:

- "Update the fileshare named 'projectdocs' in storage account 'storageacct01' to modify its quota"
- "Make changes to the fileshare 'shareddata' within storage account 'filescanstorage' by updating access tiers"
- "Apply new settings to all fileshares in storage account 'datahubstorage' at once"
- "Change configuration settings for every fileshare in storage account 'prodstorageacct'"
- "I need to update the fileshare 'reports2024' on storage account 'corpfilesstorage'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the file share. |
| **Provisioned storage in GiB (gibibytes)** |  Optional | The desired provisioned storage size of the share in GiB. |
| **Provisioned io per sec** |  Optional | The provisioned IO operations per second. |
| **Provisioned throughput in MiB per sec (mebibytes)** |  Optional | The provisioned throughput in MiB per second. |
| **Public network access** |  Optional | Public network access setting (`Enabled` or `Disabled`). |
| **Nfs root squash** |  Optional | NFS root squash setting (`NoRootSquash`, `RootSquash`, or `AllSquash`). |
| **Allowed subnets** |  Optional | Comma-separated list of subnet IDs allowed to access the file share. |
| **Tags** |  Optional | Resource tags as JSON (for example, `{"key1":"value1","key2":"value2"}`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares fileshare update](../includes/tools/annotations/azure-fileshares-fileshare-update-annotations.md)]

## File Share Snapshot: Create snapshot

<!-- @mcpcli fileshares fileshare snapshot create -->

Create a snapshot of an Azure file share. Snapshots are read-only point-in-time copies used for backup and recovery.

Example prompts include:

- "Create a snapshot named 'backup-snap-jan23' for fileshare 'backups' in resource group 'rg-data-prod'"
- "I want to create a snapshot called 'project-snapshot' for the fileshare 'projectfiles' in resource group 'rg-marketing'"
- "Generate a snapshot named 'weekly-backup' for fileshare 'companyshare' in resource group 'rg-finance'"
- "Please create a snapshot called 'reports-snapshot' on the fileshare 'reports' in resource group 'rg-analytics'"
- "Initiate snapshot creation named 'dev-snapshot-01' for fileshare 'devfiles' in resource group 'rg-development'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **File share name** |  Required | The name of the parent file share. |
| **Snapshot name** |  Required | The name of the snapshot. |
| **Metadata** |  Optional | Custom metadata for the snapshot as a JSON object (for example, `{"key1":"value1","key2":"value2"}`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares fileshare snapshot create](../includes/tools/annotations/azure-fileshares-fileshare-snapshot-create-annotations.md)]

## File Share Snapshot: Delete snapshot

<!-- @mcpcli fileshares fileshare snapshot delete -->

Delete a file share snapshot permanently. This operation cannot be undone.

Example prompts include:

- "Delete snapshot 'backup-snap-jan15' from fileshare 'datafiles' in resource group 'rg-prod'"
- "Remove snapshot 'weekly-backup' from fileshare 'backupshare' in resource group 'rg-backup'"
- "Delete snapshot 'snapshot2024-03-15' from fileshare 'reports' in resource group 'rg-analytics'"
- "Please delete the snapshot 'dailybackup' from fileshare 'projectfiles' in resource group 'rg-dev'"
- "Remove snapshot 'weeklysnap' from fileshare 'archive' in resource group 'rg-archive'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **File share name** |  Required | The name of the parent file share. |
| **Snapshot name** |  Required | The name of the snapshot. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares fileshare snapshot delete](../includes/tools/annotations/azure-fileshares-fileshare-snapshot-delete-annotations.md)]

## File Share Snapshot: Get snapshot

<!-- @mcpcli fileshares fileshare snapshot get -->

Get details of a specific file share snapshot or list all snapshots. If the `snapshot name is provided, returns a specific snapshot; otherwise, lists all snapshots for the file share.

Example prompts include:

- "Show me all snapshots for file share 'projectfileshare' in resource group 'rg-prod'"
- "List snapshots available on the file share 'teamdata' in resource group 'rg-finance'"
- "Get the snapshot named 'snapshot20240601' from file share 'backupshare' in resource group 'rg-backup'"
- "Retrieve details for the snapshot 'dailybackup' on file share 'reports' in resource group 'rg-analytics'"
- "I need to see the snapshot 'weekendcopy' from file share 'mediafiles' in resource group 'rg-media'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **File share name** |  Required | The name of the parent file share. |
| **Snapshot name** |  Optional | The name of the snapshot. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares fileshare snapshot get](../includes/tools/annotations/azure-fileshares-fileshare-snapshot-get-annotations.md)]

## File Share Snapshot: Update snapshot

<!-- @mcpcli fileshares fileshare snapshot update -->

Update properties and metadata of an Azure file share snapshot, such as tags or retention policies.

Example prompts include:

- "Update the snapshot 'backup-snap-jan23' for fileshare 'backupshare' in resource group 'rg-backup'"
- "Apply updates to snapshot 'data-snapshot' on fileshare 'datafiles' in resource group 'rg-data'"
- "Can you update snapshot 'snapshot2024' for fileshare 'reports' in resource group 'rg-analytics'"
- "Please update the snapshot named 'endofmonth' on fileshare 'finance-data' in resource group 'rg-finance'"
- "Modify the properties of snapshot 'weeklybackup' for fileshare 'devfileshare' in resource group 'rg-dev'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **File share name** |  Required | The name of the parent file share. |
| **Snapshot name** |  Required | The name of the snapshot. |
| **Metadata** |  Optional | Custom metadata for the snapshot as a JSON object (for example, `{"key1":"value1","key2":"value2"}`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [fileshares fileshare snapshot update](../includes/tools/annotations/azure-fileshares-fileshare-snapshot-update-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Files](/azure/storage/files/storage-files-introduction)
