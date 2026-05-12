---
title: Azure MCP Server tools for Azure File Shares
description: Use Azure MCP Server tools to manage Azure File Shares with natural language prompts from your IDE.
ms.date: 04/08/2026
ms.service: azure-mcp-server
ms.topic: concept-article
tool_count: 14
mcp-cli.version: 2.0.0-beta.39
author: diberry
ms.author: diberry
ai-usage: ai-generated
ms.custom: build-2025
content_well_notification:
  - AI-contribution
reviewer: ankushbindlish2
---

# Azure MCP Server tools for Azure File Shares

The Azure Model Context Protocol (MCP) Server lets you manage Azure file shares (`Microsoft.FileShares`) by using natural language prompts. You don't need to remember specific command syntax.

:heavy_check_mark: **Applies to:** File shares created with the `Microsoft.FileShares` resource provider (preview)

:heavy_multiplication_x: **Doesn't apply to:** Classic file shares created with the `Microsoft.Storage` resource provider

[Azure Files](/azure/storage/files/storage-files-introduction) is a managed file sharing service in the cloud. Azure file shares provide high-performance, fully managed storage for your applications and workloads. This article applies only to file shares created with the `Microsoft.FileShares` resource provider (preview), which is currently only available for Network File System (NFS) file shares. It doesn't apply to classic file shares created with the `Microsoft.Storage` resource provider.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Get limits

<!-- @mcpcli fileshares limits -->

Get file share limits for a subscription and location.

Example prompts include:

- "Show me the current file share limits in the 'eastus' location."
- "What are the file share limits for location 'westeurope?'"
- "Get the file share limits for location 'centralus.'"
- "Provide the file share limits for location 'eastus2.'"
- "Retrieve file share limits for the 'westus' region."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Location** | Required | The Azure region or location name (for example, `eastus`, `westeurope`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get usage

<!-- @mcpcli fileshares usage -->

Get file share usage data for a subscription and location.

Example prompts include:

- "Show me the usage details for file shares in location 'eastus.'"
- "I want to see usage for file shares in region 'westeurope.'"
- "Get usage statistics for file shares in location 'centralus.'"
- "Can you provide usage information for file shares in 'eastus2?'"
- "Display usage for file shares in the 'westus' region."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Location** | Required | The Azure region or location name (for example, `eastus`, `westeurope`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Get recommendations

<!-- @mcpcli fileshares rec -->

Get provisioning parameter recommendations for a file share based on the desired storage size.

Example prompts include:

- "Get recommendations for a 1,000-GiB file share in location 'eastus.'"
- "Can you provide recommendations for a 500-GiB file share in 'westeurope?'"
- "Get details for a 2,000-GiB file share in location 'centralus.'"
- "I want to see recommendations for a 5,000-GiB file share in 'eastus2.'"
- "Retrieve recommendations for a 250-GiB file share in the 'westus' region."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Location** | Required | The Azure region or location name (for example, `eastus`, `westeurope`). |
| **Provisioned storage in GiB (gibibytes)** | Required | The desired provisioned storage size of the share in GiB. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## File Share: Check name availability

<!-- @mcpcli fileshares fileshare check-name-availability -->

Check if a file share name is available in a specific location.

Example prompts include:

- "Can you check if the file share name 'projectdata' is available in location 'eastus?'"
- "I want to see if 'salesbackup' is an available file share name in 'westeurope.'"
- "Check the availability of the file share name 'teamfiles' in location 'EastUS.'"
- "Is the name 'archive2024' free for a new file share in 'WestUS?'"
- "Verify whether 'clientdocs' can be used as a file share name in location 'centralus.'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** | Required | The name of the file share. |
| **Location** | Required | The Azure region or location name (for example, `EastUS`, `WestEurope`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## File Share: Create file share

<!-- @mcpcli fileshares fileshare create -->

Create a new Azure file share resource in a resource group. This operation creates a high-performance, fully managed file share accessible through the NFS protocol.

Example prompts include:

- "Create a new file share named 'project-data' in resource group 'rg-prod' at location 'eastus.'"
- "I need to create a file share called 'backupshare' in resource group 'rg-backup' at location 'westeurope.'"
- "Set up a file share 'userdocs' in resource group 'rg-dev' at location 'centralus.'"
- "Create the file share 'archive2024' in resource group 'rg-archive' at location 'eastus2.'"
- "Generate a file share named 'mediafiles' in resource group 'rg-media' at location 'westus.'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **Name** | Required | The name of the file share. |
| **Location** | Required | The Azure region or location name (for example, `EastUS`, `WestEurope`). |
| **Mount name** | Optional | The mount name of the file share as seen by end users. |
| **Media tier** | Optional | The storage media tier (for example, `SSD`). |
| **Redundancy** | Optional | The redundancy level (for example, `Local`, `Zone`). |
| **Protocol** | Optional | The file sharing protocol (for example, `NFS`). |
| **Provisioned storage in GiB (gibibytes)** | Optional | The desired provisioned storage size of the share in GiB. |
| **Provisioned io per sec** | Optional | The provisioned IO operations per second. |
| **Provisioned throughput in MiB per sec (mebibytes)** | Optional | The provisioned throughput in MiB per second. |
| **Public network access** | Optional | Public network access setting (`Enabled` or `Disabled`). |
| **NFS root squash** | Optional | NFS root squash setting (`NoRootSquash`, `RootSquash`, or `AllSquash`). |
| **Allowed subnets** | Optional | Comma-separated list of subnet IDs allowed to access the file share. |
| **Tags** | Optional | Resource tags as JSON (for example, `{"key1":"value1","key2":"value2"}`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## File Share: Get file share

<!-- @mcpcli fileshares fileshare get -->

Get details of a specific file share or list all file shares. If you provide a name, the command returns a specific file share. Otherwise, it lists all file shares in the subscription or resource group.

Example prompts include:

- "Show me all file shares in resource group 'rg-prod.'"
- "List every file share available under the resource group 'rg-backup.'"
- "Get details for the file share 'reports2024' in resource group 'rg-production.'"
- "Can you retrieve information on file share 'archive-logs' for resource group 'rg-data.'"
- "I need to see the file share 'projectfiles' from resource group 'rg-dev.'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Optional | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **Name** | Optional | The name of the file share. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## File Share: Update file share

<!-- @mcpcli fileshares fileshare update -->

Update an existing Azure file share resource. You can update mutable properties such as provisioned storage, input/output operations per second (IOPS), throughput, and network access settings.

Example prompts include:

- "Update the file share named 'projectdocs' in resource group 'rg-prod' to modify its quota."
- "Make changes to the file share 'shareddata' within resource group 'rg-backup' by updating access settings."
- "Apply new settings to the file share 'datahub' in resource group 'rg-data' to increase throughput."
- "Change configuration settings for the file share 'prod-share' in resource group 'rg-production.'"
- "I need to update the file share 'reports2024' in resource group 'rg-analytics.'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **Name** | Required | The name of the file share. |
| **Provisioned storage in GiB (gibibytes)** | Optional | The desired provisioned storage size of the share in GiB. |
| **Provisioned io per sec** | Optional | The provisioned IO operations per second. |
| **Provisioned throughput in MiB per sec (mebibytes)** | Optional | The provisioned throughput in MiB per second. |
| **Public network access** | Optional | Public network access setting (`Enabled` or `Disabled`). |
| **NFS root squash** | Optional | NFS root squash setting (`NoRootSquash`, `RootSquash`, or `AllSquash`). |
| **Allowed subnets** | Optional | Comma-separated list of subnet IDs allowed to access the file share. |
| **Tags** | Optional | Resource tags as JSON (for example, `{"key1":"value1","key2":"value2"}`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## File Share: Delete file share

<!-- @mcpcli fileshares fileshare delete -->

Delete a file share permanently. You can't undo this operation.

Example prompts include:

- "Delete the file share named 'backup-share' in resource group 'rg-prod.'"
- "Remove the file share 'project-files' in resource group 'rg-marketing.'"
- "I want to delete the file share 'temp-data' in resource group 'rg-dev.'"
- "Can you delete the file share 'archive-old' in resource group 'rg-archive?'"
- "Remove the file share 'cleanup-share' from resource group 'rg-cleanup.'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **Name** | Required | The name of the file share. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Private Endpoint Connection: Get private endpoint connection

<!-- @mcpcli fileshares fileshare peconnection get -->

Get details of a specific private endpoint connection or list all private endpoint connections for a file share. If you provide `connection-name`, the command returns a specific connection. Otherwise, it lists all connections.

Example prompts include:

- "List all private endpoint connections for file share 'projectfiles' in resource group 'rg-prod.'"
- "Get the private endpoint connection named 'myconnection' for file share 'datashare' in resource group 'rg-data.'"
- "Show me private endpoint connections on file share 'backupshare' in resource group 'rg-backup.'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **File share name** | Required | The name of the file share. |
| **Connection name** | Optional | The name of the private endpoint connection. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Private Endpoint Connection: Update private endpoint connection

<!-- @mcpcli fileshares fileshare peconnection update -->

Update the state of a private endpoint connection for a file share. Use this operation to approve or reject private endpoint connection requests.

Example prompts include:

- "Approve the private endpoint connection 'myconnection' for file share 'projectfiles' in resource group 'rg-prod.'"
- "Reject the private endpoint connection named 'extconnection' on file share 'datashare' in resource group 'rg-data' with description 'Not authorized.'"
- "Update the private endpoint connection 'pendingconn' to 'Approved' for file share 'backupshare' in resource group 'rg-backup.'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **File share name** | Required | The name of the file share. |
| **Connection name** | Required | The name of the private endpoint connection. |
| **Status** | Required | The connection status (`Approved`, `Rejected`, or `Pending`). |
| **Description** | Optional | Description for the connection state change. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## File Share Snapshot: Create snapshot

<!-- @mcpcli fileshares fileshare snapshot create -->

Create a snapshot of an Azure file share. Snapshots are read-only point-in-time copies used for backup and recovery.

Example prompts include:

- "Create a snapshot named 'backup-snap-jan23' for file share 'backups' in resource group 'rg-data-prod'"
- "I want to create a snapshot called 'project-snapshot' for the file share 'projectfiles' in resource group 'rg-marketing'"
- "Generate a snapshot named 'weekly-backup' for file share 'companyshare' in resource group 'rg-finance'"
- "Create a snapshot called 'reports-snapshot' on the file share 'reports' in resource group 'rg-analytics'"
- "Initiate snapshot creation named 'dev-snapshot-01' for file share 'devfiles' in resource group 'rg-development'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **File share name** | Required | The name of the parent file share. |
| **Snapshot name** | Required | The name of the snapshot. |
| **Metadata** | Optional | Custom metadata for the snapshot as a JSON object (for example, `{"key1":"value1","key2":"value2"}`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## File Share Snapshot: Get snapshot

<!-- @mcpcli fileshares fileshare snapshot get -->

Get details of a specific file share snapshot or list all snapshots. If you provide the snapshot name, the command returns a specific snapshot. Otherwise, it lists all snapshots for the file share.

Example prompts include:

- "Show me all snapshots for file share 'projectfileshare' in resource group 'rg-prod.'"
- "List snapshots available on the file share 'teamdata' in resource group 'rg-finance.'"
- "Get the snapshot named 'snapshot20240601' from file share 'backupshare' in resource group 'rg-backup.'"
- "Retrieve details for the snapshot 'dailybackup' on file share 'reports' in resource group 'rg-analytics.'"
- "I need to see the snapshot 'weekendcopy' from file share 'mediafiles' in resource group 'rg-media.'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **File share name** | Required | The name of the parent file share. |
| **Snapshot name** | Optional | The name of the snapshot. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## File Share Snapshot: Update snapshot

<!-- @mcpcli fileshares fileshare snapshot update -->

Update the properties and metadata of an Azure file share snapshot, such as tags or retention policies.

Example prompts include:

- "Update the snapshot 'backup-snap-jan23' for file share 'backupshare' in resource group 'rg-backup.'"
- "Apply updates to snapshot 'data-snapshot' on file share 'datafiles' in resource group 'rg-data.'"
- "Can you update snapshot 'snapshot2024' for file share 'reports' in resource group 'rg-analytics.'"
- "Update the snapshot named 'endofmonth' on file share 'finance-data' in resource group 'rg-finance.'"
- "Modify the properties of snapshot 'weeklybackup' for file share 'devfileshare' in resource group 'rg-dev.'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **File share name** | Required | The name of the parent file share. |
| **Snapshot name** | Required | The name of the snapshot. |
| **Metadata** | Optional | Custom metadata for the snapshot as a JSON object (for example, `{"key1":"value1","key2":"value2"}`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## File share snapshot: Delete snapshot

<!-- @mcpcli fileshares fileshare snapshot delete -->

Delete a file share snapshot permanently. This operation can't be undone.

Example prompts include:

- "Delete snapshot 'backup-snap-jan15' from file share 'datafiles' in resource group 'rg-prod.'"
- "Remove snapshot 'weekly-backup' from file share 'backupshare' in resource group 'rg-backup.'"
- "Delete snapshot 'snapshot2024-03-15' from file share 'reports' in resource group 'rg-analytics.'"
- "Delete the snapshot 'dailybackup' from file share 'projectfiles' in resource group 'rg-dev.'"
- "Remove snapshot 'weeklysnap' from file share 'archive' in resource group 'rg-archive.'"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. The resource group is a logical container for Azure resources. |
| **File share name** | Required | The name of the parent file share. |
| **Snapshot name** | Required | The name of the snapshot. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Files](/azure/storage/files/storage-files-introduction)
