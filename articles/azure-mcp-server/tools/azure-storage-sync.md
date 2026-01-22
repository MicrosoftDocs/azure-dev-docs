---
title: Azure Storage Sync Tools
description: "Learn how to use Azure MCP Server with Azure Storage Sync tools for the Azure File Sync service to manage storage sync services, sync groups, and endpoints using natural language prompts."
keywords: azure mcp server, azmcp, storage sync, sync group, cloud endpoint, server endpoint
author: diberry
ms.author: diberry
ms.date: 01/22/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
--- 
# Azure Storage Sync Tools

Azure Storage Sync tools in Azure MCP Server help you manage Azure File Sync services through natural language prompts. You can manage Storage Sync services, register servers, create sync groups, configure cloud endpoints, and set up server endpoints to synchronize files between on-premises servers and Azure File Shares. These tools simplify storage sync management and reduce configuration complexity.

[Azure File Sync](/azure/storage/file-sync) is a service that centralizes an organization's file shares in Azure Files while keeping the flexibility, performance, and compatibility of a Windows file server.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Storage Sync service: Create service

<!-- @mcpcli storagesync service create -->

Create a new Azure Storage Sync service resource in a resource group. This service acts as the top-level service container that manages sync groups, registered servers, and synchronization workflows.

Example prompts include:

- "Create a storage sync service named 'FileSyncService01' in resource group 'rg-storage-sync' at location 'EastUS'"
- "Please set up a storage sync service called 'BackupSyncService' inside 'rg-backup' resource group located in 'WestEurope'"
- "I need a new storage sync service with name 'DataSyncProd' deployed to 'rg-prod-sync' resource group in 'CentralUS'"
- "Can you create a storage sync service named 'ArchiveSync' within resource group 'rg-archive' located at 'NorthEurope'?"
- "Set up storage sync service 'SyncServiceWest' in the resource group 'rg-west-sync' at Azure region 'WestUS2'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Location** |  Required | The Azure region or location name (for example, `EastUS`, `WestEurope`). |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync service create](../includes/tools/annotations/azure-storagesync-service-create-annotations.md)]

## Storage Sync service: Delete service

<!-- @mcpcli storagesync service delete -->

Delete an Azure Storage Sync service and all its associated resources.

Example prompts include:

- "Delete the storage sync service named 'SyncServiceEastUS' in resource group 'rg-storage-prod'"
- "Can you remove the storage sync service 'FilesSync01' from resource group 'rg-file-sync'?"
- "Please delete storage sync service 'BackupSyncService' located in resource group 'rg-backups'"
- "I need to delete the storage sync service called 'CorporateSync' within resource group 'rg-corp-resources'"
- "Remove the storage sync service 'DataSyncPrimary' from resource group 'rg-data-sync'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync service delete](../includes/tools/annotations/azure-storagesync-service-delete-annotations.md)]

## Storage Sync service: Get service

<!-- @mcpcli storagesync service get -->

Retrieve Azure Storage Sync service details or list all Storage Sync services. The command shows service properties, location, provisioning state, and configuration. If you provide the resource name parameter, the command returns a specific Storage Sync service. Otherwise, it lists all Storage Sync services in the subscription or resource group.

Example prompts include:

- "Get details for the storage sync service named 'SyncServiceEastUS'"
- "Can you retrieve info on storage sync service 'CorporateFileSync'?"
- "I need to see the configuration of the service called 'DataSyncProd'"
- "Show me the storage sync service with the name 'BackupSync01'"
- "Fetch the service details for 'SyncServiceWestEurope' storage sync"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Name** |  Optional | The name of the storage sync service. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync service get](../includes/tools/annotations/azure-storagesync-service-get-annotations.md)]

## Storage Sync service: Update service

<!-- @mcpcli storagesync service update -->

Update properties of an existing Azure Storage Sync service.

Example prompts include:

- "Update the storage sync service named 'filesyncservice01' in resource group 'rg-storage-prod'"
- "Can you update the service 'sync-service-eastus' within the resource group 'rg-sync-eastus'?"
- "Please update the storage sync service 'CorpFileSync' located in resource group 'rg-corp-filesync'"
- "Make changes to storage sync service 'ArchiveSyncService' in the resource group 'rg-archive-data'"
- "I need to update the service called 'BackupSync' in resource group 'rg-backup-resources'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Incoming traffic policy** |  Optional | Incoming traffic policy for the service (`AllowAllTraffic` or `AllowVirtualNetworksOnly`). |
| **Tags** |  Optional | Tags to assign to the service (space-separated key=value pairs). |
| **Identity type** |  Optional | Managed service identity type (`None`, `SystemAssigned`, `UserAssigned`, `SystemAssigned,UserAssigned`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync service update](../includes/tools/annotations/azure-storagesync-service-update-annotations.md)]


## Registered server: Get registered server

<!-- @mcpcli storagesync registeredserver get -->

List all registered servers in a Storage Sync service or retrieve details about a specific registered server. The command returns server properties including server ID, registration status, agent version, OS version, and last heartbeat. If you provide the server ID parameter, the command returns a specific registered server. Otherwise, it lists all registered servers in the Storage Sync service.

Example prompts include:

- "Get details of the registered server for storage sync service 'SyncServiceWest' in resource group 'rg-storage-west'"
- "Show me the registered server for storage sync 'FileSyncService' within resource group 'rg-europe-central'"
- "Retrieve info on the registered server named 'RegisteredServer01' in resource group 'rg-prod-storage' for sync service 'ProdFileSync'"
- "Can you fetch the registered server for the storage sync service 'BackupSync' located in resource group 'rg-backup'"
- "I need the registered server data for storage sync service 'CorpSync' under resource group 'rg-corp-data'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Server ID** |  Optional | The ID/name of the registered server. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync registeredserver get](../includes/tools/annotations/azure-storagesync-registeredserver-get-annotations.md)]

## Registered server: Unregister registered server

<!-- @mcpcli storagesync registeredserver unregister -->

Unregister a server from a Storage Sync service.


Example prompts include:

- "Unregister the registered server with ID 'server123' from the storage sync service 'SyncServiceWest' in resource group 'rg-storage-sync'"
- "Can you unregister the server named 'server456' from storage sync service 'FileSyncService' within resource group 'prod-storage-rg'?"
- "Please remove the registered server 'backupServer01' from the storage sync service 'DataSyncService' in resource group 'dev-sync-resources'"
- "I need to unregister the server ID 'syncServer789' from the storage sync service called 'MainStorageSync' located in resource group 'rg-sync-apps'"
- "How do I unregister the registered server 'appServer42' from storage sync service 'SyncServiceEast' under resource group 'rg-eastern-storage'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Server ID** |  Required | The ID/name of the registered server. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync registeredserver unregister](../includes/tools/annotations/azure-storagesync-registeredserver-unregister-annotations.md)]

## Registered server: Update registered server

<!-- @mcpcli storagesync registeredserver update -->

Update properties of a registered server.

Example prompts include:

- "Update the registered server with ID 'server123' in storage sync service 'SyncServiceOne' within resource group 'rg-sync-prod'"
- "Can you update the registered server named 'serverABC' for storage sync service 'DataSyncService' in resource group 'rg-data-sync'?"
- "Please update the registered server 'server789' in storage sync service 'MySyncService' under resource group 'rg-sync-dev'"
- "I need to update registered server 'server456' in 'SyncServicePrimary' storage sync service located in resource group 'rg-sync-main'"
- "Modify the registered server having ID 'server321' for the storage sync service 'BackupSync' inside resource group 'rg-backup-sync'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Server ID** |  Required | The ID/name of the registered server. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync registeredserver update](../includes/tools/annotations/azure-storagesync-registeredserver-update-annotations.md)]

## Sync group: Create sync group

<!-- @mcpcli storagesync syncgroup create -->

Create a sync group within an existing Storage Sync service. Sync groups define a sync topology and contain cloud endpoints (Azure File Shares) and server endpoints (local server paths) that sync together.

Example prompts include:

- "Create a sync group named 'FinanceSync' in storage sync service 'FinanceSyncService' within resource group 'rg-finance-prod'"
- "I need to create a sync group called 'HRSyncGroup' under storage sync service 'HRDataService' in 'rg-hr-resources'"
- "Set up a sync group with the name 'ProjectSync' for the storage sync service 'ProjectFilesService' inside resource group 'rg-projects-dev'"
- "Can you create a sync group named 'BackupSyncGroup' in 'BackupSyncService' located in resource group 'rg-backup-eastus'?"
- "Make a new sync group 'SalesDataSync' in the storage sync service 'SalesService' under resource group 'rg-sales-central'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync syncgroup create](../includes/tools/annotations/azure-storagesync-syncgroup-create-annotations.md)]

## Sync group: Delete sync group

<!-- @mcpcli storagesync syncgroup delete -->

Remove a sync group from a Storage Sync service. When you delete a sync group, you also remove all associated cloud endpoints and server endpoints within that group.

Example prompts include:

- "Delete the sync group named 'filesSyncGroup' in storage sync service 'DataSyncService' within resource group 'rg-storage-prod'"
- "Can you remove sync group 'backupSyncGroup' from storage sync service 'MySyncService' in resource group 'rg-westus'?"
- "Please delete sync group 'archiveSync' under the storage sync service 'ArchiveService' located in resource group 'rg-europe'"
- "Remove the sync group called 'syncGroup01' from 'FastSyncService' inside resource group 'rg-dev-storage'"
- "I want to delete the sync group 'photosSyncGroup' from storage sync service 'PhotoService' in resource group 'rg-photoapp'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync syncgroup delete](../includes/tools/annotations/azure-storagesync-syncgroup-delete-annotations.md)]

## Sync group: Get sync group

<!-- @mcpcli storagesync syncgroup get -->

Get details about a specific sync group or list all sync groups. If you provide the sync group name parameter, the command returns a specific sync group. Otherwise, it lists all sync groups in the Storage Sync service.

Example prompts include:

- "Get the sync group from storage sync service 'SyncServiceWestUS' in resource group 'rg-storage-prod'"
- "Show me the details of storage sync service 'BackupSyncService' located in resource group 'rg-data-archive'"
- "I need to retrieve sync group information from service 'FileSyncServiceEast' within resource group 'rg-enterprise-files'"
- "Can you fetch the sync group data for storage sync service 'CorpSyncService' in 'rg-corp-resources'?"
- "Retrieve the sync group for 'FileShareSync' storage sync service under resource group 'rg-devops-staging'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Optional | The name of the sync group. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync syncgroup get](../includes/tools/annotations/azure-storagesync-syncgroup-get-annotations.md)]



## Cloud endpoint: Create cloud endpoint 


<!-- @mcpcli storagesync cloudendpoint create -->

Add a cloud endpoint to a sync group by connecting an Azure File Share. Cloud endpoints represent the Azure storage side of the sync relationship.

Example prompts include:

- "Create a cloud endpoint named 'backupEndpoint' in sync group 'filesSync' within storage sync service 'FileSyncService1' and resource group 'rg-data' using storage account resource ID '/subscriptions/12345/resourceGroups/rg-data/providers/Microsoft.Storage/storageAccounts/storageacct01' with Azure file share 'backupshare'"
- "Set up cloud endpoint 'userDocsEndpoint' in sync group 'docSyncGroup' under storage sync service 'UserFilesService' inside resource group 'rg-users', linking to storage account resource ID '/subscriptions/67890/resourceGroups/rg-users/providers/Microsoft.Storage/storageAccounts/usersstorage' and Azure file share 'userdocs'"
- "I need to create a cloud endpoint called 'mediaEndpoint' for sync group 'mediaSync' on service 'MediaSyncService' in resource group 'rg-media', using storage account resource ID '/subscriptions/abcde/resourceGroups/rg-media/providers/Microsoft.Storage/storageAccounts/mediastorage' and the Azure file share 'mediashare1'"
- "Please add cloud endpoint 'logsEndpoint' within sync group 'logSyncGroup' for storage sync service 'LogSyncService' located in resource group 'rg-logs' with storage account resource ID '/subscriptions/54321/resourceGroups/rg-logs/providers/Microsoft.Storage/storageAccounts/logstor' referencing Azure file share 'logfiles'"
- "Create cloud endpoint 'archiveEndpoint' in 'archiveSyncGroup' sync group for the storage sync service named 'ArchiveService' inside resource group 'rg-archive' using storage account resource ID '/subscriptions/98765/resourceGroups/rg-archive/providers/Microsoft.Storage/storageAccounts/archivestorage' and file share 'archivefiles'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Cloud endpoint name** |  Required | The name of the cloud endpoint. |
| **Storage account resource ID** |  Required | The resource ID of the Azure storage account. |
| **Azure file share name** |  Required | The name of the Azure file share. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync cloudendpoint create](./../includes/tools/annotations/azure-storagesync-cloudendpoint-create-annotations.md)]

## Cloud endpoint: Delete cloud endpoint

<!-- @mcpcli storagesync cloudendpoint delete -->

Delete a cloud endpoint from a sync group.

Example prompts include:

- "Delete the cloud endpoint named 'ArchiveEndpoint' in sync group 'SyncGroupAlpha' of storage sync service 'StorageSyncWest' within resource group 'rg-storage-prod'"
- "Can you remove cloud endpoint 'BackupEndpoint01' from sync group 'MainSyncGroup' under storage sync service 'FileSyncService' in resource group 'rg-data-center'?"
- "I need to delete the cloud endpoint 'UserFilesEndpoint' from the sync group 'UserSyncGroup' in the storage sync service 'UserSyncServiceEast' located in resource group 'rg-eastus1'"
- "Please delete cloud endpoint 'LogsStorage' for sync group 'LogSyncGroup' in storage sync service 'LogsSyncService' inside the resource group 'rg-logging-prod'"
- "Remove cloud endpoint 'PhotosEndpoint' in the sync group 'MediaSync' from storage sync service 'MediaSyncService' in resource group 'rg-media-services'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Cloud endpoint name** |  Required | The name of the cloud endpoint. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync cloudendpoint delete](../includes/tools/annotations/azure-storagesync-cloudendpoint-delete-annotations.md)]

### Cloud endpoint: Get cloud endpoint

<!-- storagesync cloudendpoint get -->

List all cloud endpoints in a sync group or retrieve details about a specific cloud endpoint. The command returns cloud endpoint properties, including Azure File Share configuration, storage account details, and provisioning state. If you provide the cloud endpoint name parameter, the command returns a specific cloud endpoint. Otherwise, it lists all cloud endpoints in the sync group. 

Example prompts include:

- "Get the cloud endpoint details for sync group 'SyncGroup1' in storage sync service 'StorageSyncEast' within resource group 'rg-storage-sync'"
- "Show me the cloud endpoint info in resource group 'rg-syncservices', storage sync service 'FileSyncService', and sync group 'PrimarySync'"
- "Retrieve cloud endpoint from storage sync service 'BackupSyncService' and sync group 'GroupA' in resource group 'rg-backups'"
- "I need the cloud endpoint for sync group 'DataSync' under storage sync service 'SyncServiceWest' in 'rg-westus-sync'"
- "Fetch cloud endpoint data for sync group 'MainGroup' of storage sync service 'CentralStorageSync' located in resource group 'rg-central-storage'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Cloud endpoint name** |  Optional | The name of the cloud endpoint. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync cloudendpoint get](../includes/tools/annotations/azure-storagesync-cloudendpoint-get-annotations.md)]

### Cloud endpoint: Trigger change detection

<!-- @mcpcli storagesync cloudendpoint triggerchangedetection -->

Trigger change detection on a cloud endpoint to sync file changes.

Example prompts include:

Example prompts include:

- "Trigger change detection for cloud endpoint 'endpointOne' in sync group 'SyncGroupA' of storage sync service 'SyncService123' within resource group 'rg-storage-sync'"
- "Can you start the change detection on cloud endpoint 'filesBackup' for sync group 'PrimaryGroup' under storage sync service 'FileSyncService' in resource group 'rg-prod-sync'?"
- "Initiate cloud endpoint change detection named 'BackupEndpoint' in storage sync service 'DataSync' and sync group 'MainSync' within resource group 'rg-data-sync'"
- "I need to trigger the change detection process on cloud endpoint 'archiveEndpoint' under sync group 'GroupOne' of storage sync service 'StorageSync01' located in 'rg-sync-resources'"
- "Please activate change detection for cloud endpoint 'cloudEndpointX' in sync group 'GroupX' for storage sync service 'SyncServiceX' inside resource group 'rg-sync-project'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Cloud endpoint name** |  Required | The name of the cloud endpoint. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync cloudendpoint changedetection](../includes/tools/annotations/azure-storagesync-cloudendpoint-changedetection-annotations.md)]


## Server endpoint: Create server endpoint

<!-- @mcpcli storagesync serverendpoint create -->

Add a server endpoint to a sync group by specifying a local server path to sync. Server endpoints represent the on-premises side of the sync relationship and include cloud tiering configuration.

Example prompts include:

- "Create a server endpoint named 'syncEndpoint01' in sync group 'filesSyncGroup' using storage sync service 'FileSyncService' within resource group 'rg-storage' with server resource ID '/subscriptions/12345/resourceGroups/rg-storage/providers/Microsoft.StorageSync/registeredServers/server01' and local path 'D:\Data'"
- "I need to add a server endpoint called 'backupEndpoint' to sync group 'BackupGroup' under storage sync service 'BackupService' in resource group 'rg-backup' using server resource ID '/subscriptions/67890/resourceGroups/rg-backup/providers/Microsoft.StorageSync/registeredServers/serverBackup' with local path 'E:\Backup'"
- "Set up server endpoint 'MediaSync' for sync group 'MediaGroup' on storage sync service 'MediaSyncService' inside the resource group 'rg-media' specifying server resource ID '/subscriptions/abcde/resourceGroups/rg-media/providers/Microsoft.StorageSync/registeredServers/mediaServer' and local sync path 'C:\MediaFiles'"
- "Please create a server endpoint named 'LogsEndpoint' in resource group 'rg-logs' using storage sync service 'LogSyncService' with sync group 'LogSync' providing server resource ID '/subscriptions/fghij/resourceGroups/rg-logs/providers/Microsoft.StorageSync/registeredServers/logServer' and local folder 'F:\Logs'"
- "Can you add server endpoint 'DocsEndpoint' to the sync group 'DocsGroup' in 'DocSyncService' within resource group 'rg-docs'? The server resource ID is '/subscriptions/klmno/resourceGroups/rg-docs/providers/Microsoft.StorageSync/registeredServers/docServer' and the local path is 'G:\Documents'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Server endpoint name** |  Required | The name of the server endpoint. |
| **Server resource ID** |  Required | The resource ID of the registered server. |
| **Server local path** |  Required | The local folder path on the server for syncing. |
| **Cloud tiering** |  Optional | Enable cloud tiering on this endpoint. |
| **Volume free space percent** |  Optional | Volume free space percentage to maintain (1-99, default `20`). |
| **Tier files older than days** |  Optional | Archive files not accessed for this many days. |
| **Local cache mode** |  Optional | Local cache mode: `DownloadNewAndModifiedFiles`, `UpdateLocallyCachedFiles`. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync serverendpoint create](../includes/tools/annotations/azure-storagesync-serverendpoint-create-annotations.md)]

## Server endpoint: Delete server endpoint

<!-- @mcpcli storagesync serverendpoint delete -->

Delete a server endpoint from a sync group.

Example prompts include:

- "Delete the server endpoint 'BackupEndpoint01' from sync group 'MainSyncGroup' in storage sync service 'CorpSyncService' within resource group 'rg-data-sync'"
- "Please remove the server endpoint named 'FileServerEndpoint' in sync group 'DocumentsSync' belonging to storage sync service 'FileSyncService' located in resource group 'rg-file-services'"
- "I want to delete server endpoint 'ServerEndpoint3' under sync group 'DailySync' from the storage sync service 'DataSyncPrimary' in resource group 'rg-production-sync'"
- "Can you delete 'FinanceEndpoint' server endpoint from the 'FinanceSyncGroup' sync group at storage sync service 'FinanceDataSync' in resource group 'rg-finance'"
- "Remove the server endpoint 'ArchiveServer01' in sync group 'ArchiveSync' from storage sync service 'ArchiveSyncService' within resource group 'rg-archive-management'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Server endpoint name** |  Required | The name of the server endpoint. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync serverendpoint delete](../includes/tools/annotations/azure-storagesync-serverendpoint-delete-annotations.md)]

## Server endpoint: Get server endpoint

<!-- @mcpcli storagesync serverendpoint get -->

List all server endpoints in a sync group or retrieve details about a specific server endpoint. The command returns server endpoint properties, including local path, cloud tiering status, sync health, and provisioning state. If you provide the server endpoint name parameter, the command returns a specific server endpoint. Otherwise, it lists all server endpoints in the sync group.

Example prompts include:

- "Get details of the server endpoint named 'endpoint1' in sync group 'SyncGroupA' from storage sync service 'StorageSync01' within resource group 'rg-storage-sync'"
- "Show me the server endpoint information for sync group 'SyncGroupB' under storage sync service 'FastSync' in resource group 'resource-group-prod'"
- "Retrieve server endpoint data for storage sync service 'CentralSync' and sync group 'SyncMain' located in resource group 'rg-data-sync'"
- "I need to get the server endpoint for sync group 'GroupSyncX' in storage sync service 'SyncServiceX' from resource group 'rg-sync-services'"
- "Please fetch the server endpoint info belonging to sync group 'PrimarySyncGroup' and storage sync service 'SyncServicePro' in resource group 'rg-sync-prod'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Server endpoint name** |  Optional | The name of the server endpoint. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync serverendpoint get](../includes/tools/annotations/azure-storagesync-serverendpoint-get-annotations.md)]

## Server endpoint: Update server endpoint

<!-- @mcpcli storagesync serverendpoint update -->

Update properties of a server endpoint.

Example prompts include:

- "Update the server endpoint 'endpoint01' in sync group 'SyncGroupA' for storage sync service 'SyncServiceX' within resource group 'rg-filesync'"
- "Can you modify server endpoint 'FileServer01' under sync group 'PrimarySync' in storage sync service 'CorpSync' in resource group 'rg-data'?"
- "Please update server endpoint 'BackupEndpoint' on sync group 'BackupGroup' for storage sync service 'StorageSyncProd' located in resource group 'rg-prod-storage'"
- "Set new settings for server endpoint 'EdgeNode' in storage sync service 'SyncServiceEast' sync group 'EastSync' within resource group 'rg-east'"
- "I need to update the server endpoint named 'ArchiveEndpoint' in sync group 'ArchiveSync' of storage sync service 'ArchiveService' inside resource group 'rg-archives'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Server endpoint name** |  Required | The name of the server endpoint. |
| **Cloud tiering** |  Optional | Enable cloud tiering on this endpoint. |
| **Volume free space percent** |  Optional | Volume free space percentage to maintain (1-99, default `20`). |
| **Tier files older than days** |  Optional | Archive files not accessed for this many days. |
| **Local cache mode** |  Optional | Local cache mode: `DownloadNewAndModifiedFiles`, `UpdateLocallyCachedFiles`. |


[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync serverendpoint update](../includes/tools/annotations/azure-storagesync-serverendpoint-update-annotations.md)]


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure File Sync](/azure/storage/file-sync)