---
title: Azure Storage Sync Tools
description: "Learn how to use Azure MCP Server with Azure Storage Sync tools for the Azure File Sync service to manage storage sync services, sync groups, and endpoints using natural language prompts."
keywords: azure mcp server, azmcp, storage sync, sync group, cloud endpoint, server endpoint
author: diberry
ms.author: diberry
ms.date: 01/08/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
--- 
# Azure Storage Sync Tools

Azure Storage Sync tools in Azure MCP Server enable you to manage Azure File Sync services, sync groups, cloud endpoints, and server endpoints using natural language prompts. These tools facilitate the administration of file synchronization between on-premises servers and Azure File Shares.

[Azure File Sync](/azure/storage/file-sync) is a service for centralizing an organization's file shares in Azure Files while keeping the flexibility, performance, and compatibility of a Windows file server.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Cloud endpoint

### Create cloud endpoint

<!-- storagesync cloudendpoint create -->

Add a cloud endpoint to a sync group by connecting an Azure File Share. Cloud endpoints represent the Azure storage side of the sync relationship.

Example prompts include:

- "Create a cloud endpoint named 'FinanceShare' in sync group 'DataSync01' using storage account ID '/subscriptions/123/resourceGroups/rg-eastus/providers/Microsoft.Storage/storageAccounts/financestorage' within resource group 'rg-eastus'"
- "I need to add cloud endpoint 'ReportsEndpoint' to the sync group 'SyncGroupA' in storage sync service 'StorageSyncSvc1' under resource group 'corp-resources', linking to Azure file share 'reports-files' on storage account resource ID '/subscriptions/abc/resourceGroups/corp-resources/providers/Microsoft.Storage/storageAccounts/reportstorage'"
- "Setup a cloud endpoint called 'BackupPoint' in sync group 'BackupSync' for storage sync service 'BackupService' inside resource group 'backup-rg' using Azure file share 'backupshare' on storage account '/subscriptions/xyz/resourceGroups/backup-rg/providers/Microsoft.Storage/storageAccounts/backupstorage'"
- "Please create the cloud endpoint 'HRDocuments' in resource group 'hr-files-rg' with sync group 'HRSyncGroup' and storage sync service 'HRSyncService', pointing to Azure file share 'hrsharedata' on storage account ID '/subscriptions/456/resourceGroups/hr-files-rg/providers/Microsoft.Storage/storageAccounts/hrstorageacct'"
- "Add cloud endpoint 'ProjectShare' to the 'ProjectSync' sync group in 'DevSyncService' within 'dev-resources' resource group, linked to Azure file share 'projectfiles' on storage account '/subscriptions/789/resourceGroups/dev-resources/providers/Microsoft.Storage/storageAccounts/devstorage01'"



| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Cloud endpoint name** |  Required | The name of the cloud endpoint. |
| **Storage account resource ID** |  Required | The resource ID of the Azure storage account. |
| **Azure file share name** |  Required | The name of the Azure file share. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync cloudendpoint create](../includes/tools/annotations/azure-storagesync-cloudendpoint-create-annotations.md)]

### Delete cloud endpoint

<!-- storagesync cloudendpoint delete -->

Delete a cloud endpoint from a sync group.

Example prompts include:

- "Delete the cloud endpoint named 'BackupEndpoint' in sync group 'SyncGroupEast' under storage sync service 'FileSyncService1' within resource group 'rg-westus-prod'"
- "Can you remove cloud endpoint 'ArchiveStorage' from sync group 'MainSyncGroup' on the storage sync service 'CorpFileSync' in resource group 'enterprise-rg'"
- "I need to delete cloud endpoint 'SalesDataEndpoint' from the sync group 'SalesSync' using storage sync service 'SalesFileSync' in resource group 'sales-rg-eu'"
- "Remove cloud endpoint 'ProjectXEndpoint' associated with sync group 'ProjectXSync' in storage sync service 'DevFileSync' located in resource group 'dev-rg-central'"
- "Please delete the cloud endpoint 'LogsCloudEndpoint' from sync group 'LoggingSyncGroup' inside storage sync service 'LoggingSyncService' in resource group 'prod-logging-rg'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Cloud endpoint name** |  Required | The name of the cloud endpoint. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync cloudendpoint delete](../includes/tools/annotations/azure-storagesync-cloudendpoint-delete-annotations.md)]

### Get cloud endpoint

<!-- storagesync cloudendpoint get -->

List all cloud endpoints in a sync group or retrieve details about a specific cloud endpoint. Returns cloud endpoint properties including Azure File Share configuration, storage account details, and provisioning state. Use --cloud-endpoint-name for a specific endpoint.

Example prompts include:

- "Get the cloud endpoint details for sync group 'SyncGroupEast' in storage sync service 'FileSyncService1' within resource group 'rg-datafiles'"
- "Show me the cloud endpoint info for storage sync service 'StorageSyncProd', sync group 'MainSyncGroup', resource group 'rg-production'"
- "Retrieve cloud endpoint data from resource group 'rg-backups' for storage sync named 'BackupSyncSrv' and sync group 'BackupSync'"
- "I need the cloud endpoint for sync group 'UserDataSync' under the storage sync service 'UserSyncService' in resource group 'rg-userfiles'"
- "Fetch cloud endpoint details in resource group 'rg-devzone' for the sync group 'DevSyncGroup' and storage sync service 'DevSyncService'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Cloud endpoint name** |  Optional | The name of the cloud endpoint. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync cloudendpoint get](../includes/tools/annotations/azure-storagesync-cloudendpoint-get-annotations.md)]

### Trigger change detection for cloud endpoint

<!-- storagesync cloudendpoint triggerchangedetection -->

Trigger change detection on a cloud endpoint to sync file changes.

Example prompts include:

- "Trigger change detection on cloud endpoint 'photosbackup' within sync group 'dailySync' for storage sync service 'FileSyncService' in resource group 'rg-storage-sync-prod'"
- "I need to start change detection on the cloud endpoint named 'endpoint1' in sync group 'syncGroupA' of storage sync service 'MainSyncService' under resource group 'rg-app-services'"
- "Can you trigger change detection for cloud endpoint 'clientdata' from sync group 'syncGroupX' in the storage sync service 'SyncServiceEastUS' located in resource group 'rg-sync-eastus'?"
- "Activate the change detection process for cloud endpoint 'backupEndpoint' belonging to sync group 'weeklySync' for 'CorpStorageSync' in resource group 'rg-data-archive'"
- "Please initiate cloud endpoint change detection for the cloud endpoint 'archiveEndpoint' in sync group 'monthlySyncGroup' of the storage sync service 'ArchiveSyncService' within resource group 'rg-archive-services'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Cloud endpoint name** |  Required | The name of the cloud endpoint. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync cloudendpoint triggerchangedetection](../includes/tools/annotations/azure-storagesync-cloudendpoint-triggerchangedetection-annotations.md)]

## Registered server

### Get registered server

<!-- storagesync registeredserver get -->

List all registered servers in a Storage Sync service or retrieve details about a specific registered server. Returns server properties including server ID, registration status, agent version, OS version, and last heartbeat. Use --server-id for a specific server.

Example prompts include:

- "Get details of the registered server named 'Srv-Backup01' in resource group 'rg-filesync' under storage sync service 'FileSyncServiceEast'"
- "Show me the registered server info for 'primaryserver' within resource group 'data-sync-rg' and storage sync service 'CorpSyncService'"
- "Retrieve registeredserver 'Server123' from storage sync service 'SyncServiceWest' in the 'sync-resources' resource group"
- "Fetch the registered server data called 'ArchiveNode' in resource group 'file-sync-prod' and storage sync service 'ProdSyncService'"
- "I need the info for registeredserver 'server-alpha' under the storage sync service 'SyncSvc01' in resource group 'rg-sync-env'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Server ID** |  Optional | The ID/name of the registered server. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync registeredserver get](../includes/tools/annotations/azure-storagesync-registeredserver-get-annotations.md)]

### Unregister registered server

<!-- storagesync registeredserver unregister -->

Unregister a server from a Storage Sync service.

Example prompts include:

- "Unregister the server with ID 'server123' from storage sync service 'BackupSync' in resource group 'rg-westus'"
- "Please remove registered server 'srv-456' from storage sync 'FileSyncService' within resource group 'prod-resources'"
- "I need to unregister registered server 'dataserver01' from the storage sync service named 'SyncService01' in 'data-center-rg'"
- "How can I unregister the server 'sync-server-9' from 'CloudSyncService' in resource group 'enterprise-rg'?"
- "Can you unregister the registered server 'server789' under storage sync 'MainSync' located in resource group 'contoso-rg'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Server ID** |  Required | The ID/name of the registered server. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync registeredserver unregister](../includes/tools/annotations/azure-storagesync-registeredserver-unregister-annotations.md)]

### Update registered server

<!-- storagesync registeredserver update -->

Update properties of a registered server.

Example prompts include:

- "Update the registered server 'server123' in storage sync service 'SyncServiceEast' within resource group 'rg-data-sync'"
- "Can you update 'Server456' registered under 'StorageSyncProd' in the resource group 'prod-resource-group'?"
- "Please update registered server 'srv789' for the storage sync service named 'SyncServiceWest' in 'resource-group-west'"
- "I need to update the registered server 'backupServer01' in storage sync service 'CentralSync' located in resource group 'rg-central-sync'"
- "Modify the registered server with ID 'server321' from storage sync service 'SyncServiceNorth' in resource group 'rg-north-sync'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Server ID** |  Required | The ID/name of the registered server. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync registeredserver update](../includes/tools/annotations/azure-storagesync-registeredserver-update-annotations.md)]

## Server endpoint

### Create server endpoint

<!-- storagesync serverendpoint create -->

Add a server endpoint to a sync group by specifying a local server path to sync. Server endpoints represent the on-premises side of the sync relationship and include cloud tiering configuration.

Example prompts include:

- "Create a server endpoint named 'sales-data' in sync group 'EastUSSync' for storage sync service 'DataSyncService' in resource group 'prod-rg' using server resource ID '/subscriptions/abc123/resourceGroups/prod-rg/providers/Microsoft.Compute/servers/server01' with local path 'D:/SyncFolder'"
- "I need to add a server endpoint called 'BackupEndpoint1' in sync group 'BackupSyncGroup' under storage sync service 'CorpSyncService' in resource group 'corp-resource-group' with server local path 'C:/Data' and server ID '/subscriptions/xyz789/resourceGroups/corp-resource-group/providers/Microsoft.Compute/servers/server02'"
- "Set up a new server endpoint named 'ArchivePoint' for sync group 'ArchiveSync' under storage sync service 'ArchiveSyncService' in resource group 'archival-rg' with server resource ID '/subscriptions/123456/resourceGroups/archival-rg/providers/Microsoft.Compute/servers/archive01' and folder path 'E:/ArchiveData'"
- "Can you create the server endpoint 'FinanceSyncServer' within sync group 'FinanceGroup' in storage sync service 'FinanceSyncService' in resource group 'fin-rg' on server '/subscriptions/555abc/resourceGroups/fin-rg/providers/Microsoft.Compute/servers/fin01' syncing folder 'F:/FinanceFiles'?"
- "Add a server endpoint titled 'DevSyncEndpoint' in sync group 'DevGroup' to storage sync service 'DevSyncService' in 'development-rg' resource group, syncing from server resource ID '/subscriptions/777def/resourceGroups/development-rg/providers/Microsoft.Compute/servers/devserver' at local path 'G:/DevData'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Server endpoint name** |  Required | The name of the server endpoint. |
| **Server resource ID** |  Required | The resource ID of the registered server. |
| **Server local path** |  Required | The local folder path on the server for syncing. |
| **Cloud tiering** |  Optional | Enable cloud tiering on this endpoint. |
| **Volume free space percent** |  Optional | Volume free space percentage to maintain (1-99, default `20`). |
| **Tier files older than days** |  Optional | Archive files not accessed for this many days. |
| **Local cache mode** |  Optional | Local cache mode: DownloadNewAndModifiedFiles, UpdateLocallyCachedFiles. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync serverendpoint create](../includes/tools/annotations/azure-storagesync-serverendpoint-create-annotations.md)]

### Delete server endpoint

<!-- storagesync serverendpoint delete -->

Delete a server endpoint from a sync group.

Example prompts include:

- "Delete the server endpoint named 'fileserver01' from sync group 'SyncGroupEast' in storage sync service 'FileSyncService' within resource group 'rg-data-backup'"
- "Can you remove the server endpoint 'endpoint123' under sync group 'PrimarySync' and storage sync service 'StorageSyncProd' in resource group 'rg-prod-storage'?"
- "I need to delete server endpoint 'backup-endpoint' from storage sync service 'SyncServiceWest' and sync group 'GroupA' in resource group 'rg-westus'"
- "Within resource group 'rg-media-resources', remove the 'mediaServer' server endpoint in sync group 'MediaSyncGroup' of storage sync service 'MediaSyncService'"
- "Please delete server endpoint 'endpoint42' from the sync group 'SyncGroup42' in storage sync service 'StorageSync42' within resource group 'rg-test-environment'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Server endpoint name** |  Required | The name of the server endpoint. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync serverendpoint delete](../includes/tools/annotations/azure-storagesync-serverendpoint-delete-annotations.md)]

### Get server endpoint

<!-- storagesync serverendpoint get -->

List all server endpoints in a sync group or retrieve details about a specific server endpoint. Returns server endpoint properties including local path, cloud tiering status, sync health, and provisioning state. Use --name for a specific endpoint.

Example prompts include:

- "Get details of the server endpoint named 'FileServer01' in sync group 'SyncGroupA' under resource group 'rg-storage-sync' and storage sync service 'StorageSyncService1'"
- "Show me the server endpoint info for 'BackupEndpoint' within the sync group 'PrimarySync' from the storage sync service 'MainSyncService' in resource group 'enterprise-rg'"
- "Retrieve server endpoint data for sync group 'ArchiveGroup' in storage sync service 'ArchiveSyncService' located in resource group 'rg-data-archive'"
- "I need the info of the server endpoint called 'Endpoint42' on storage sync service 'FastSyncService' inside resource group 'rg-fast-sync' and sync group 'FastSyncGroup'"
- "Get the server endpoint details for the sync group 'ProjectSync' from 'ProjectStorageSync' service within resource group 'rg-project-sync'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Server endpoint name** |  Optional | The name of the server endpoint. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync serverendpoint get](../includes/tools/annotations/azure-storagesync-serverendpoint-get-annotations.md)]

### Update server endpoint

<!-- storagesync serverendpoint update -->

Update properties of a server endpoint.

Example prompts include:

- "Update the server endpoint 'endpointEast' in sync group 'SyncGroupA' for storage sync service 'FileSyncService1' within resource group 'rg-data-sync'"
- "I need to update server endpoint 'ServerEndpoint01' under sync group 'PrimarySyncGroup' in storage sync service 'StorageSyncMain' inside resource group 'prod-rg'"
- "Can you update the server endpoint named 'BackupEndpoint' in sync group 'DailyBackup' for the storage sync service 'MySyncService' in resource group 'resource-group-01'?"
- "Modify the server endpoint 'ArchiveServer' within sync group 'ArchiveSync' of storage sync service 'ArchiveSyncService' in the 'dev-resources' resource group"
- "Please perform an update on server endpoint 'endpoint-west' from sync group 'WestSync' in storage sync service 'SyncServiceWest' located in resource group 'west-rg'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |
| **Server endpoint name** |  Required | The name of the server endpoint. |
| **Cloud tiering** |  Optional | Enable cloud tiering on this endpoint. |
| **Volume free space percent** |  Optional | Volume free space percentage to maintain (1-99, default `20`). |
| **Tier files older than days** |  Optional | Archive files not accessed for this many days. |
| **Local cache mode** |  Optional | Local cache mode: DownloadNewAndModifiedFiles, UpdateLocallyCachedFiles. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync serverendpoint update](../includes/tools/annotations/azure-storagesync-serverendpoint-update-annotations.md)]

## Storage Sync service

### Create service

<!-- storagesync service create -->

Create a new Azure Storage Sync service resource in a resource group. This is the top-level service container that manages sync groups, registered servers, and synchronization workflows.

Example prompts include:

- "Create a storage sync service named 'SyncServiceProd' in the resource group 'rg-storage-sync' located in 'EastUS'"
- "I need to set up a storage sync service called 'BackupSync' within 'core-resources' resource group at location 'WestEurope'"
- "Can you create storage sync service 'FileSync01' in the 'data-services' group and place it in 'CentralUS' region?"
- "Set up a storage sync service named 'SyncServiceX' in 'app-resources' resource group located at 'EastUS2'"
- "Please create a storage sync service 'SyncServiceAlpha' under resource group 'sync-group' in the region 'NorthEurope'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Location** |  Required | The Azure region/location name (for example, `EastUS`, `WestEurope`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync service create](../includes/tools/annotations/azure-storagesync-service-create-annotations.md)]

### Delete service

<!-- storagesync service delete -->

Delete an Azure Storage Sync service and all its associated resources.

Example prompts include:

- "Delete the storage sync service named 'SyncServiceEast' in resource group 'rg-prod-storage'"
- "I need to remove the service 'FileSyncService01' within the 'resource-group-west' resource group"
- "Can you delete storage sync service 'BackupSync' from resource group 'rg-backup-dev'?"
- "Please remove the 'SyncServicePrimary' from the 'rg-enterprise-files' resource group"
- "How do I delete the service called 'DataSync01' in resource group 'rg-data-sync-prod'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync service delete](../includes/tools/annotations/azure-storagesync-service-delete-annotations.md)]

### Get service

<!-- storagesync service get -->

Retrieve Azure Storage Sync service details or list all Storage Sync services. Use --name to get a specific service, or omit it to list all services in the subscription or resource group. Shows service properties, location, provisioning state, and configuration.

Example prompts include:

- "Get details for the storage sync service named 'SyncServiceEastUS' in resource group 'rg-sync-east'"
- "Show me the configuration of 'CorporateSyncService' in resource group 'rg-corporate'"
- "Fetch information about storage sync service 'filesync-prod' in resource group 'rg-prod-storage'"
- "I need to retrieve the status of 'BackupSyncService' in resource group 'rg-backup'"
- "What are the properties of the storage sync service called 'DataSyncCentral' in resource group 'rg-data-sync'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Optional | The name of the storage sync service. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync service get](../includes/tools/annotations/azure-storagesync-service-get-annotations.md)]

### Update service

<!-- storagesync service update -->

Update properties of an existing Azure Storage Sync service.

Example prompts include:

- "Update the storage sync service named 'SyncServiceWest' in resource group 'rg-backup-west'"
- "Change settings for 'FileSyncService01' located in resource group 'prod-data-rg'"
- "I need to update the service 'AzureSyncProd' in the resource group 'resourcegroup-east'"
- "Modify the storage sync service 'CorpFileSync' under resource group 'rg-corporate-files'"
- "Please update the service 'SyncManager' within the resource group 'data-sync-rg'"


| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Incoming traffic policy** |  Optional | Incoming traffic policy for the service (`AllowAllTraffic` or `AllowVirtualNetworksOnly`). |
| **Tags** |  Optional | Tags to assign to the service (space-separated key=value pairs). |
| **Identity type** |  Optional | Managed service identity type (`None`, `SystemAssigned`, `UserAssigned`, `SystemAssigned,UserAssigned`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync service update](../includes/tools/annotations/azure-storagesync-service-update-annotations.md)]

## Sync group

### Create sync group

<!-- storagesync syncgroup create -->

Create a sync group within an existing Storage Sync service. Sync groups define a sync topology and contain cloud endpoints (Azure File Shares) and server endpoints (local server paths) that sync together.

Example prompts include:

- "Create a sync group named 'FinanceSyncGroup' in storage sync service 'FileSyncService01' within resource group 'corp-data-rg'"
- "I need to set up a sync group called 'PhotosBackup' under storage sync service 'PhotoSyncService' in the resource group 'media-resources'"
- "Please create the sync group 'DailyReports' for storage sync service 'ReportSyncService' inside resource group 'analytics-prod'"
- "Can you create a sync group named 'HRSyncGroup' in the 'EmployeeFiles' storage sync service located in resource group 'human-resources-rg'?"
- "Setup a new sync group 'ProjectSync2024' under storage sync service 'ProjectFilesService' within resource group 'dev-team-rg'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync syncgroup create](../includes/tools/annotations/azure-storagesync-syncgroup-create-annotations.md)]

### Delete sync group

<!-- storagesync syncgroup delete -->

Remove a sync group from a Storage Sync service. Deleting a sync group also removes all associated cloud endpoints and server endpoints within that group.

Example prompts include:

- "Delete the sync group named 'SyncGroupA' from storage sync service 'FileSyncService' in the resource group 'rg-production'"
- "I need to remove sync group 'ProjectXSync' under the storage sync service 'CorpSyncService' in resource group 'rg-corp-westus'"
- "Please delete the sync group 'BackupSync2024' for the storage sync service called 'BackupFiles' located in resource group 'rg-backup'"
- "Can you delete sync group 'UserDataSync' from the storage sync service 'UserProfilesService' within resource group 'rg-userservices'"
- "Remove the sync group 'DevTestSync' found in 'DevSyncService' under the resource group named 'rg-development'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Required | The name of the sync group. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync syncgroup delete](../includes/tools/annotations/azure-storagesync-syncgroup-delete-annotations.md)]

### Get sync group

<!-- storagesync syncgroup get -->

Get details about a specific sync group or list all sync groups. If --sync-group-name is provided, returns a specific sync group; otherwise, lists all sync groups in the Storage Sync service.

Example prompts include:

- "Get the sync group details for service 'FileSyncService' in resource group 'data-sync-prod'"
- "Show me the storage sync group from 'BackupSyncService' within 'rg-sync-eastus'"
- "Retrieve sync group info for storage sync service 'CorpFileSync' located in 'resource-group-north'"
- "Can you fetch the sync group for 'EnterpriseSyncService' under the 'rg-internal-backup' resource group?"
- "I need to get sync group data from 'AzureFilesSync' service in resource group 'sync-rg-west'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group**| Required | The resource group name for the storage sync resource. |
| **Resource name** |  Required | The name of the storage sync service. |
| **Sync group name** |  Optional | The name of the sync group. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [storagesync syncgroup get](../includes/tools/annotations/azure-storagesync-syncgroup-get-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure File Sync](/azure/storage/file-sync)