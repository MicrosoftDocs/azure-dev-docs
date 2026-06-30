---
title: Azure MCP Server Tools for Azure Backup
description: Use Azure MCP Server tools to manage Azure Backup resources, including vaults, policies, protected items, and governance settings, with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.reviewer: shrja
ms.date: 05/13/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-generated
content_well_notification:
  - AI-contribution
tool_count: 19
mcp-cli.version: "3.0.0-beta.15+a1e1192261fcf727c3bb284346423b37e8bd6e17"
---

# Azure MCP Server tools for Azure Backup

The Azure Model Context Protocol (MCP) Server lets you manage Azure Backup resources with natural language prompts. You can create and configure backup vaults, define and update backup policies, protect and undelete items, manage governance settings like soft delete and immutability, configure multi-user authorization, and monitor backup jobs and recovery points.

Azure Backup is an Azure service that provides cloud-based capabilities for your applications. For more information, see [Azure Backup documentation](/azure/backup/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]


## Backup: get status

<!-- @mcpcli azurebackup backup status -->

This tool checks the backup status of an Azure resource through Azure Backup, and returns whether the resource is protected, along with vault and policy details. Use it to verify whether a virtual machine, disk, storage account, or other datasource is currently backed up. It requires the Azure Resource Manager (ARM) resource ID for the datasource and the Azure region where the resource exists.

Example prompts include:

- "Is the virtual machine (VM) protected for datasource ID '/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/webvm' in location 'eastus'?"
- "Check backup status for datasource ID '/subscriptions/22222222-2222-2222-2222-222222222222/resourceGroups/rg-backup/providers/Microsoft.Compute/disks/dataDisk1' in location 'westus2'."
- "Get the protection details for datasource ID '/subscriptions/33333333-3333-3333-3333-333333333333/resourceGroups/rg-storage/providers/Microsoft.Storage/storageAccounts/mystorageacct' in location 'centralus'."
- "Verify protection for datasource ID 'SAPHanaDatabase;instance;ProdDB' in location 'eastus2'."
- "Show available subcommands and parameters for the backup status check for datasource ID '/subscriptions/44444444-4444-4444-4444-444444444444/resourceGroups/rg-app/providers/Microsoft.Web/sites/mywebapp' in location 'eastus' with --learn."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Datasource ID** |  Required | The datasource identifier. For virtual machine, FileShare, and DPP workloads, provide the Azure Resource Manager (ARM) resource ID. For example, `/subscriptions/.../virtualMachines/myvm`. For Recovery Services vault in-guest workloads, such as SQL or SAP HANA, provide the protectable item name returned by `protectableitem list`. For example, `SAPHanaDatabase;instance;dbname`. |
| **Location** |  Required | The Azure region. For example, `eastus` or `westus2`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Disaster recovery: enable cross-region restore

<!-- @mcpcli azurebackup disasterrecovery enable-crr -->

This tool enables cross-region restore on a geo-redundant storage (GRS)-enabled backup vault. It activates cross-region restore so you can recover backups from a secondary region.

Example prompts include:

- "Enable Cross-Region Restore for vault name 'backup-vault-prod' in resource group 'rg-prod'."
- "Enable Cross-Region Restore on Recovery Services vault 'rsv-backup' in resource group 'rg-disaster' with vault type 'rsv'."
- "How do I run enable-crr for vault 'site-backup' in resource group 'rg-staging' using --learn?"
- "Enable CRR for vault 'dr-vault-east' in resource group 'rg-eus' with vault type 'dpp'."
- "Run azurebackup disasterrecovery enable-crr for vault name 'backupvault01' in resource group 'rg-apps'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group that contains the vault. |
| **Vault name** |  Required | The name of the backup vault, such as a Recovery Services vault or a Backup vault. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere, auto-detected if omitted. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Governance: list resources without backup policy

<!-- @mcpcli azurebackup governance find-unprotected -->

This tool scans your subscription and lists Azure resources that aren't protected by any Azure Backup policy. You can filter results by resource type, resource group, or tags. For example, find unprotected resources in resource group 'rg-prod', or find unprotected virtual machines with tag 'environment=production'.

Example prompts include:

- "Find all resources in my subscription that aren't protected by any backup policy."
- "Find unprotected resources with resource type filter 'Microsoft.Compute/virtualMachines,Microsoft.Sql/servers'."
- "List unprotected resources with tag filter 'environment=production'."
- "Show unprotected resources with resource type filter 'Microsoft.Storage/storageAccounts' and tag filter 'backup=required'."
- "Show available subcommands and parameters using Learn '--learn'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource type filter** |  Optional | Resource types to filter, comma-separated. |
| **Tag filter** |  Optional | Tag-based filter in key=value format (for example, `environment=production`). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Governance: configure immutability state

<!-- @mcpcli azurebackup governance immutability -->

This tool configures the immutability state for a backup vault. Set the state to `Disabled`, `Enabled`, or `Locked`. Warning: `Locked` is irreversible.

Example prompts include:

- "Set immutability state 'Enabled' for vault name 'backup-vault' in resource group 'rg-prod'."
- "Enable immutability state 'Locked' for vault name 'rsv-vault-01' in resource group 'rg-secure'."
- "Change immutability state 'Disabled' for vault name 'dppvault1' in resource group 'rg-dev'."
- "Can you set immutability state 'Enabled' for vault name 'prod-backup' in resource group 'rg-production' with vault type 'rsv'?"
- "Show immutability subcommands with --learn for vault name 'test-vault' in resource group 'rg-test'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Immutability state** |  Required | Immutability state: `Disabled`, `Enabled`, or `Locked` (irreversible). |
| **Resource group** |  Required | Name of the Azure resource group that contains the vault. |
| **Vault name** |  Required | Name of the backup vault, such as a Recovery Services vault or Backup vault. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required when creating a vault; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Governance: configure soft-delete

<!-- @mcpcli azurebackup governance soft-delete -->

This tool configures soft delete settings for a backup vault. You set the soft delete state to `AlwaysOn`, `On`, or `Off`. You can optionally specify the soft delete retention period in days (14–180). For example, enable soft delete 'On' with a 30-day retention for vault 'contosoBackupVault' in resource group 'rg-backup'.

Example prompts include:

- "Enable soft delete 'AlwaysOn' for vault name 'backup-vault-prod' in resource group 'rg-prod' with soft delete retention days '90'."
- "Turn soft delete 'Off' for vault name 'rsv-main' in resource group 'rg-backups'."
- "Can you set soft delete 'On' for vault name 'dpp-vault' in resource group 'rg-dev' with vault type 'dpp' and soft delete retention days '30'?"
- "Show me help for soft-delete with resource group 'rg-tools', vault name 'backup-vault-test', and soft delete 'On' using --learn."
- "Configure soft delete 'On' for vault name 'rs-vault-prod' in resource group 'rg-prod' and specify vault type 'rsv'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group that contains the vault. |
| **Soft delete** |  Required | Soft delete state: `AlwaysOn`, `On`, or `Off`. |
| **Vault name** |  Required | The name of the backup vault, such as a Recovery Services vault or a Backup vault. |
| **Soft delete retention days** |  Optional | Soft delete retention period in days. Range: 14–180. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required when creating a vault; optional elsewhere. The tool auto-detects the type if omitted. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Job: get backup job information

<!-- @mcpcli azurebackup job get -->

This tool retrieves backup job information from a vault. When you specify the job ID, this tool returns detailed information about that job, including operation type, status, start and end times, error codes, and data source details. When you omit the job ID, this tool lists all backup jobs in the vault.

Example prompts include:

- "List all backup jobs in resource group 'rg-backup-prod' for vault 'rsv-prod-vault'."
- "Get backup job 'job-9f7c3a2b' in resource group 'rg-backup-prod' from vault 'rsv-prod-vault'."
- "What is the status of job 'd3b2e7f4' in vault 'backupvault-eus' within resource group 'rg-eus-backup'?"
- "Show command options for 'azurebackup job get' in resource group 'rg-backup-dev' for vault 'dev-backup-vault' with --learn."
- "List all backup jobs in resource group 'rg-dpp-test' for vault 'dpp-test-vault' with vault type 'dpp'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group that contains the vault. |
| **Vault name** |  Required | The name of the vault, for example a Recovery Services vault or a Backup vault. |
| **Job ID** |  Optional | The backup job ID. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Policy: create backup policy

<!-- @mcpcli azurebackup policy create -->

This tool creates a backup policy for a specified workload type, and lets you set schedule and retention rules.

Example prompts include:

- "Create backup policy 'daily-vm-policy' in resource group 'rg-prod' for vault 'rsv-vault-west' with workload type 'VM'."
- "I need a backup policy 'sql-weekly-policy' in resource group 'rg-db' for vault 'db-backups' targeting workload type 'SQL' with daily retention days '30' and schedule time '03:00'."
- "Can you create policy 'aks-backup' in resource group 'rg-aks' for vault 'dpp-aks-vault' with workload type 'AKS' and vault type 'dpp'?"
- "Create policy 'azureblob-monthly' in resource group 'rg-storage' for vault 'blob-backups' with workload type 'AzureBlob' and daily retention days '7'."
- "Create backup policy 'flexible-pg-policy' in resource group 'rg-data' for vault 'dpp-data-vault' with workload type 'PostgreSQLFlexible'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Policy name** |  Required | The name of the backup policy. |
| **Resource group** |  Required | The name of the Azure resource group, a logical container for related resources. |
| **Vault name** |  Required | The name of the backup vault, for example a Recovery Services vault or Backup vault. |
| **Workload type** |  Required | Workload type: `VM`, `SQL`, `SAPHANA`, `SAPASE`, `AzureFileShare` (RSV types); `AzureDisk`, `AzureBlob`, `AKS`, `ElasticSAN`, `PostgreSQLFlexible`, `ADLS`, `CosmosDB` (DPP types). Also accepts aliases like `AzureVM`, `SQLDatabase`, and others. |
| **Archive tier after days** |  Optional | Move recovery points to the archive tier after this many days. Pair with `--archive-tier-mode`. |
| **Archive tier mode** |  Optional | Archive tiering mode: `TierAfter` (always tier after `--archive-tier-after-days`) or `CopyOnExpiry` (copy to archive when the recovery point expires). Use `--smart-tier` for service-recommended tiering. |
| **Backup mode** |  Optional | Backup mode for storage workloads: `Continuous` (default for AzureBlob, ADLS) or `Vaulted` (discrete recovery points). DPP AzureBlob, AzureDataLakeStorage. |
| **Daily retention days** |  Optional | Daily recovery point retention in days. Defaults to the datasource-specific value if omitted. |
| **Differential retention days** |  Optional | Retention period in days for Differential backups. RSV VmWorkload only. |
| **Differential schedule days of week** |  Optional | Comma-separated days of the week for the Differential backup (for example, `Monday,Thursday`). RSV VmWorkload only. |
| **Enable snapshot backup** |  Optional | Enable snapshot/instance backups (HANA System Replication snapshot RPs). RSV SAPHANA only. |
| **Enable vault tier copy** |  Optional | Enable vault-tier copy of operational store backups. DPP AzureDisk only. |
| **Full schedule days of week** |  Optional | Comma-separated days of the week for the Full backup (for example, `Sunday`). Required when `--full-schedule-frequency` is `Weekly`. RSV VmWorkload only. |
| **Full schedule frequency** |  Optional | Full backup schedule frequency for SQL/SAPHANA/SAPASE: `Daily` or `Weekly`. RSV VmWorkload only. |
| **Hourly interval hours** |  Optional | Interval in hours between hourly backups. Valid values: 4, 6, 8, 12. Used only when `--schedule-frequency` is `Hourly` (RSV). |
| **Hourly window duration hours** |  Optional | Duration of the hourly backup window in hours (for example, `12`). Used only when `--schedule-frequency` is `Hourly` (RSV). |
| **Hourly window start time** |  Optional | Start time of the hourly backup window in 24h HH:mm format (for example, `08:00`). Used only when `--schedule-frequency` is `Hourly` (RSV). |
| **Incremental retention days** |  Optional | Retention period in days for Incremental backups. RSV SAPHANA / SAPASE only. |
| **Incremental schedule days of week** |  Optional | Comma-separated days of the week for the Incremental backup. RSV SAPHANA / SAPASE only. |
| **Instant rp resource group** |  Optional | Resource group that hosts the instant recovery point snapshots. RSV VM only. |
| **Instant rp retention days** |  Optional | Instant recovery point retention in days (1-30 for Standard, 1-7 for Enhanced). RSV VM only. |
| **Is compression** |  Optional | Enable backup compression at the policy level. RSV VmWorkload only. |
| **Is SQL compression** |  Optional | Enable SQL Server on VM native backup compression. RSV SQL only. |
| **Log frequency minutes** |  Optional | Transaction log backup frequency in minutes (for example, `15`, `30`, `60`). RSV VmWorkload only. |
| **Log retention days** |  Optional | Retention period in days for transaction log backups. RSV VmWorkload only. |
| **Monthly retention days of month** |  Optional | Comma-separated days of the month for monthly retention (1-28 or `Last`; for example, `1,15,Last`). Absolute scheme; mutually exclusive with `--monthly-retention-week-of-month`. |
| **Monthly retention days of week** |  Optional | Comma-separated days of the week for the monthly retention tag (for example, `Sunday`). Use with `--monthly-retention-week-of-month` (relative scheme). |
| **Monthly retention months** |  Optional | Number of months to keep monthly recovery points. Combine with either `--monthly-retention-days-of-month` (absolute) OR `--monthly-retention-week-of-month` + `--monthly-retention-days-of-week` (relative). |
| **Monthly retention week of month** |  Optional | Which week of the month to tag for monthly retention: `First`, `Second`, `Third`, `Fourth`, or `Last`. Use with `--monthly-retention-days-of-week` (relative scheme). |
| **PITR retention days** |  Optional | Point-in-time restore retention in days for continuous backups. DPP AzureBlob, AzureDataLakeStorage. |
| **Policy sub type** |  Optional | RSV VM policy sub-type: `Standard` or `Enhanced`. Enhanced is required for hourly schedules and Trusted Launch VMs. RSV VM only. |
| **Policy tags** |  Optional | Resource tags applied to the RSV backup policy as `k1=v1,k2=v2`. RSV only. |
| **Schedule days of week** |  Optional | Comma-separated days of the week the backup should run (for example, `Monday,Wednesday,Friday`). Required for Weekly schedules. |
| **Schedule frequency** |  Optional | Backup schedule frequency. RSV vaults accept `Daily`, `Weekly`, or `Hourly`. DPP (Backup) vaults accept ISO 8601 intervals: `PT4H`, `PT6H`, `PT8H`, `PT12H`, `P1D`, `P1W`, `P2W`, or `P1M`. |
| **Schedule time** |  Optional | Comma-separated list of backup times in 24h HH:mm format (for example, `02:00` or `02:00,14:00`). Interpreted in `--time-zone`. Defaults to 02:00 UTC if not specified. |
| **Smart tier** |  Optional | Enable smart-tiering (ML-based archive recommendation). RSV VM only. |
| **Snapshot consistency** |  Optional | Snapshot consistency mode for VM backups: `ApplicationConsistent` or `CrashConsistent`. RSV VM only. |
| **Snapshot instant rp resource group** |  Optional | Resource group prefix for snapshot instant RPs. RSV SAPHANA snapshot only. |
| **Snapshot instant rp retention days** |  Optional | Snapshot instant RP retention range in days. RSV SAPHANA snapshot only. |
| **Time zone** |  Optional | Windows time-zone identifier for the backup schedule (for example, `UTC`, `Pacific Standard Time`). If omitted, the schedule runs in UTC. |
| **Vault tier copy after days** |  Optional | Days after which an operational backup is copied to the vault tier. DPP AzureDisk only. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for `vault create`; optional elsewhere, auto-detected if omitted. |
| **Weekly retention days of week** |  Optional | Comma-separated days of the week tagged for weekly retention (for example, `Sunday`). Required alongside `--weekly-retention-weeks`. |
| **Weekly retention weeks** |  Optional | Number of weeks to keep weekly recovery points. Required alongside `--weekly-retention-days-of-week`. |
| **Yearly retention days of month** |  Optional | Comma-separated days of the selected month(s) for yearly retention (1-28 or `Last`). Absolute scheme; mutually exclusive with `--yearly-retention-week-of-month`. |
| **Yearly retention days of week** |  Optional | Comma-separated days of the week for the yearly retention tag (for example, `Sunday`). Use with `--yearly-retention-week-of-month` (relative scheme). |
| **Yearly retention months** |  Optional | Comma-separated months tagged for yearly retention (for example, `January` or `January,July`). |
| **Yearly retention week of month** |  Optional | Which week of the selected month(s) to tag for yearly retention: `First`, `Second`, `Third`, `Fourth`, or `Last`. Use with `--yearly-retention-days-of-week` (relative scheme). |
| **Yearly retention years** |  Optional | Number of years to keep yearly recovery points. Combine with `--yearly-retention-months` and either `--yearly-retention-days-of-month` (absolute) OR `--yearly-retention-week-of-month` + `--yearly-retention-days-of-week` (relative). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Policy: get policy

<!-- @mcpcli azurebackup policy get -->

This tool retrieves backup policy information including detailed information for a single policy when the `policy` parameter is specified. When the `policy` parameter is omitted, this tool lists all backup policies configured in the vault.

Example prompts include:

- "List all backup policies in resource group 'rg-prod' for vault 'backup-vault'."
- "Get details of policy 'DailyBackup' in resource group 'rg-app' from vault 'app-backup'."
- "What's the configuration for policy 'WeeklyRetention' in resource group 'rg-archive' on vault 'archive-vault' with vault type 'rsv'?"
- "Show all backup policies in resource group 'rg-tools' for vault 'tool-vault' with --learn."
- "Retrieve full information for policy 'SQLServerPolicy' in resource group 'rg-databases' from vault 'db-backup', including datasource types and protected item counts."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group that contains the vault. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Policy name** |  Optional | The name of the backup policy. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Policy: update policy

<!-- @mcpcli azurebackup policy update -->

This tool modifies an existing Recovery Services vault (RSV) backup policy. You can update the backup schedule time and daily retention days for VM, SQL, SAP HANA, and file share workload policies. The named policy must already exist in the vault.

Example prompts include:

- "Update backup policy 'daily-vm-policy' in resource group 'rg-prod' for vault 'rsv-vault-west' with schedule time '04:00'."
- "Change daily retention days to '60' for policy 'sql-weekly-policy' in resource group 'rg-db' on vault 'db-backups'."
- "Update schedule time to '02:00' and daily retention days to '30' for policy 'fileshare-policy' in resource group 'rg-storage' on vault 'storage-vault'."
- "Modify backup policy 'sap-policy' in resource group 'rg-sap' for vault 'sap-backup-vault' with vault type 'rsv' and schedule time '06:00'."
- "Show learn options for azurebackup policy update with policy 'help-policy' in resource group 'rg-help' and vault 'help-vault' and --learn."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Policy name** |  Required | The name of the backup policy. |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the backup vault (Recovery Services vault or Backup vault). |
| **Daily retention days** |  Optional | Daily recovery point retention in days. Defaults to the datasource-specific value if omitted. |
| **Schedule time** |  Optional | Backup time in UTC (for example, `02:00`). |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Protectable item: list protectable items

<!-- @mcpcli azurebackup protectableitem list -->

This tool lists items that you can back up (protectable items) in a Recovery Services vault. Examples include SQL databases and SAP HANA databases that the tool discovers on registered virtual machines. Use this tool to find databases and workloads available for backup protection. This tool supports Recovery Services vaults only. Data Protection (DPP) datasources use Azure Resource Manager (ARM) resource IDs for protection. Filter results by workload type, for example, SQL or SAP HANA, or by container.

Example prompts include:

- "List all protectable items in resource group 'rg-prod' and vault name 'rsv-backup-vault'."
- "List protectable items with workload type 'SQL' in resource group 'rg-data' and vault name 'backup-vault-east'."
- "Show protectable items in container 'iaasvmcontainer-01' for resource group 'rg-prd-backup' and vault name 'rsv-prod-vault'."
- "What protectable VMs are available with workload type 'VM' and vault type 'rsv' in resource group 'rg-staging' and vault name 'staging-backup-vault'?"
- "Show command options with --learn for azurebackup protectableitem list in resource group 'rg-tools' and vault name 'tools-rsv-vault'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. |
| **Vault name** |  Required | The name of the backup vault (Recovery Services vault or Backup vault). |
| **Container name** |  Optional | The Recovery Services vault (RSV) protection container name. Only applicable to Recovery Services vaults. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere. The tool auto-detects the vault type if you omit this parameter. |
| **Workload type** |  Optional | Workload types for Recovery Services vaults include `VM`, `SQL`, `SAPHANA` (SAP HANA), `SAPASE`, and `AzureFileShare`. Workload types for DPP include `AzureDisk`, `AzureBlob`, `AKS` (Azure Kubernetes Service), `ElasticSAN`, `PostgreSQLFlexible`, `ADLS` (Azure Data Lake Storage), and `CosmosDB`. The parameter also accepts aliases like `AzureVM` and `SQLDatabase`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Protected item: get information

<!-- @mcpcli azurebackup protecteditem get -->

Retrieves protected item information from a backup vault.

This tool returns detailed information about a single backup instance when you specify the protected item. Details include protection status, data source information, policy assignment, and last backup time. Specify the container for Recovery Services vault items. When you omit the protected item, this tool lists all protected items (backup instances) in the vault.

Example prompts include:

- "List all protected items in resource group 'rg-prod' and vault name 'rsv-vault'."
- "Get protected item 'vm-prod-01' in container 'rsv-container-01' for resource group 'rg-prod' and vault name 'rsv-vault'."
- "Retrieve protected item 'db-backup-2026' from resource group 'rg-dpp' and vault name 'dpp-vault' with vault type 'dpp'."
- "What protected items are in resource group 'prod-rg' and vault name 'backup-vault'?"
- "Show command options for azurebackup protecteditem get in resource group 'rg-prod' and vault name 'rsv-vault' with --learn."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the backup vault (Recovery Services vault or Backup vault). |
| **Container name** |  Optional | The RSV protection container name. Only applicable for Recovery Services vaults. |
| **Protected item** |  Optional | The name of the protected item or backup instance. |
| **Vault type** |  Optional | The type of backup vault: 'rsv' (Recovery Services vault) or 'dpp' (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Protected item: configure backup protection

<!-- @mcpcli azurebackup protecteditem protect -->

Configure backup protection for an Azure resource by creating a protected item or a backup instance. This tool protects virtual machines, disks, file shares, SQL databases, SAP HANA databases, and other supported data sources. For VMs, provide the VM ARM resource ID as the `Datasource ID`. For SQL and SAP HANA workloads, specify the protectable item name as the `Datasource ID` (for example, `SAPHanaDatabase;instance;dbname`) and specify the `Container name`. Specify the backup policy with the `Policy` parameter. The operation runs asynchronously, so monitor the protection job until it completes.

Example prompts include:

- "Protect datasource ID '/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/prod-rg/providers/Microsoft.Compute/virtualMachines/webapp-prod' with policy 'daily-policy' in resource group 'prod-rg' and vault 'backup-vault'."
- "Enable protection for datasource ID 'MSSQLDatabase;sqlserver01;salesdb' using policy 'weekly-sql-policy' in resource group 'rg-sql' and vault 'rsv-vault', container 'sql-container'."
- "Create protection for datasource ID '/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/rg-storage/providers/Microsoft.Compute/disks/data-disk1' with policy 'disk-backup-policy' in resource group 'rg-storage' and vault 'dpp-vault', datasource type 'AzureDisk'."
- "Can you protect datasource ID 'SAPHanaDatabase;HANA01;db01' with policy 'hana-policy' in resource group 'rg-hana' and vault 'rsv-hana' and container 'hana-container'?"
- "Start protection for datasource ID '/subscriptions/9f8b7c6d-1234-4bcd-9e8f-abcdef012345/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/api-staging' using policy 'api-policy' in resource group 'rg-prod' and vault 'backup-vault'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Datasource ID** |  Required | The datasource identifier. For virtual machines, disks, and file shares, use the ARM resource ID (for example, `'/subscriptions/.../virtualMachines/myvm'`). For in-guest workloads protected by a Recovery Services vault (RSV), use the protectable item name from the protectable items list (for example, `'SAPHanaDatabase;instance;dbname'`). |
| **Policy name** |  Required | The name of the backup policy. |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the backup vault. Use the Recovery Services vault name for RSV scenarios. |
| **AKS excluded namespaces** |  Optional | Comma-separated list of namespaces to exclude from the AKS backup policy default scope. DPP AKS only. |
| **AKS include cluster scope resources** |  Optional | Include cluster-scoped resources in the AKS backup policy. DPP AKS only. |
| **AKS included namespaces** |  Optional | Comma-separated list of namespaces to include in the AKS backup policy default scope. DPP AKS only. |
| **AKS label selectors** |  Optional | Comma-separated label selectors (for example, `app=frontend,tier=web`) applied to the AKS backup policy default scope. DPP AKS only. |
| **AKS snapshot resource group** |  Optional | Resource group used to store AKS volume snapshots created by Backup. DPP AKS only. |
| **Container name** |  Optional | The Recovery Services vault (RSV) protection container name. Only applicable for Recovery Services vaults. |
| **Datasource type** |  Optional | The workload type hint. Supported Recovery Services vault types include VM, SQL, SAPHANA, SAPASE, and AzureFileShare. Supported Backup vault (DPP) types include AzureDisk, AzureBlob, AKS, ElasticSAN, PostgreSQLFlexible, ADLS, and CosmosDB. The parameter also accepts common aliases such as AzureVM and SQLDatabase. |
| **Vault type** |  Optional | The type of backup vault: 'rsv' (Recovery Services vault) or 'dpp' (Backup vault / Data Protection). Required for vault create; optional elsewhere. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Protected item: restore soft-delete item

<!-- @mcpcli azurebackup protecteditem undelete -->

This tool restores a soft-deleted backup item to an active protection state. It helps you recover accidentally deleted backups or protected items. For Recovery Services vaults, specify the datasource ARM resource ID with the `datasource-id` parameter. For Backup vaults, specify the datasource ARM resource ID with the `datasource-id` parameter. Optionally, specify the `container` parameter for Recovery Services vault workload items such as SQL or SAP HANA. The operation runs asynchronously, and you monitor progress with `azurebackup job get`.

Example prompts include:

- "Undelete protected item with datasource ID '/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/myvm', resource group 'rg-backups', and vault name 'rsv-vault-prod'."
- "Undelete protected item for datasource ID 'SAPHanaDatabase;instance01;db01' in resource group 'prod-backups' and vault name 'rsv-vault-prod' with container 'sql-container-01'."
- "Please undelete the protected item for datasource ID '/subscriptions/22222222-2222-2222-2222-222222222222/resourceGroups/rg-dpp/providers/Microsoft.Storage/storageAccounts/mydata/fileServices/default/shares/backupshare', resource group 'rg-dpp', and vault name 'backupvault01'."
- "Can you undelete the protected item for datasource ID '/subscriptions/33333333-3333-3333-3333-333333333333/resourceGroups/web-rg/providers/Microsoft.Compute/virtualMachines/webapp-prod' in resource group 'web-rg' from vault name 'rsv-vault-staging'?"
- "Undelete protected item with datasource ID 'SAPHanaDatabase;instance02;db02', resource group 'rg-sql', vault name 'rsv-vault-eu', and vault type 'rsv'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Datasource ID** |  Required | The datasource identifier. For VM/FileShare/DPP workloads, use the ARM resource ID (for example, `'/subscriptions/.../virtualMachines/myvm'`). For RSV in-guest workloads (SQL/SAPHANA), use the protectable item name from 'protectableitem list' (for example, `'SAPHanaDatabase;instance;dbname'`). |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the backup vault (Recovery Services vault or Backup vault). |
| **Container name** |  Optional | The protection container name for Recovery Services vaults. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Recovery point: get recovery point information

<!-- @mcpcli azurebackup recoverypoint get -->

This tool retrieves recovery point information for a protected item. When you specify the recovery point, this tool returns detailed information about that recovery point, including time and type. When you omit the recovery point, this tool lists all available recovery points for the protected item.

Example prompts include:

- "List all recovery points for protected item 'vm-prod-01' in resource group 'rg-prod-backup' and vault name 'vault-prod'."
- "Get recovery point 'rp-2025-01-15T02:00:00Z' for protected item 'db-backup-02' in resource group 'rg-db' from vault name 'db-vault' with container 'rsv-container' and vault type 'rsv'."
- "What recovery points are available for protected item 'fileshare01' in resource group 'rg-files' under vault name 'backup-vault'?"
- "Show details for recovery point 'rp-2026-05-01-08' of protected item 'appservice-backup' in resource group 'rg-apps' and vault name 'app-vault' with vault type 'dpp'."
- "Display the command options using --learn for protected item 'vm-test' in resource group 'rg-test' and vault name 'test-vault'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Protected item name** |  Required | The name of the protected item or backup instance. |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the backup vault (Recovery Services vault or Backup vault). |
| **Container name** |  Optional | The Recovery Services vault (RSV) protection container name. Only applicable for Recovery Services vaults. |
| **Recovery point ID** |  Optional | The recovery point ID. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Security: configure encryption

<!-- @mcpcli azurebackup security configure-encryption -->

This tool configures Customer-Managed Key (CMK) encryption on a backup vault by using a key from Azure Key Vault. Both Recovery Services vaults (RSV) and Backup vaults (DPP) are supported. The vault's managed identity must have the Key Vault Crypto Service Encryption User role on the Key Vault. Use `identity-type` to specify `SystemAssigned` or `UserAssigned` identity, and provide `user-assigned-identity-id` when using a user-assigned identity.

Example prompts include:

- "Configure CMK encryption on vault `rsv-prod` in resource group `rg-backup` using key `backup-key` from key vault `https://kv-security-prod.vault.azure.net/` with system-assigned identity."

- "Set up customer-managed key encryption on vault `dpp-vault-west` in resource group `rg-west` with key vault URI `https://kv-compliance.vault.azure.net/`, key name `cmk-backup`, and user-assigned identity `/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-identity/providers/Microsoft.ManagedIdentity/userAssignedIdentities/backup-identity`."

- "Enable CMK encryption on vault `rsv-staging` in resource group `rg-staging` using key `staging-key` version `abc123` from `https://kv-staging.vault.azure.net/` with vault type `rsv`."

- "Configure encryption for vault `backup-vault-eus` in resource group `rg-dr` with key vault URI `https://kv-dr.vault.azure.net/`, key name `dr-key`, and identity type `SystemAssigned`."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** | Required | The name of the backup vault (Recovery Services vault or Backup vault). |
| **Key vault URI** | Required | Key Vault URI (for example, `https://kv-security-prod.vault.azure.net/`). |
| **Key name** | Required | Name of the encryption key in the Key Vault. |
| **Identity type** | Required | Managed identity type: `SystemAssigned`, `UserAssigned`, or `None`. |
| **Key version** | Optional | Specific key version. Omit to always use the latest version. |
| **User assigned identity ID** | Optional | ARM resource ID of the user-assigned managed identity for Key Vault access. Required when identity type is `UserAssigned`. |
| **Vault type** | Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Security: configure multi-user authorization

<!-- @mcpcli azurebackup security configure-mua -->

This tool configures Multi-User Authorization (MUA) on a backup vault by linking or unlinking a Resource Guard. Provide a resource guard ID to enable MUA, which protects critical operations such as disabling soft delete, removing immutability, and stopping protection, so they require approval from a security admin with permissions on the Resource Guard. Omit the resource guard ID to disable MUA. Disabling MUA is itself a protected operation that requires the Backup MUA Operator role on the Resource Guard.

Example prompts include:

- "Enable MUA on vault 'rsv-prod' in resource group 'rg-backup' with resource guard ID '/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-security/providers/Microsoft.DataProtection/resourceGuards/myGuard'."
- "Configure multi-user authorization for vault 'backup-vault-eus' in resource group 'rg-dr' by linking resource guard '/subscriptions/22222222-2222-2222-2222-222222222222/resourceGroups/rg-compliance/providers/Microsoft.DataProtection/resourceGuards/complianceGuard'."
- "Disable MUA on vault 'rsv-staging' in resource group 'rg-staging' with vault type 'rsv'."
- "Link resource guard to vault 'dpp-vault-west' in resource group 'rg-west' with vault type 'dpp' and resource guard ID '/subscriptions/33333333-3333-3333-3333-333333333333/resourceGroups/rg-guards/providers/Microsoft.DataProtection/resourceGuards/westGuard'."
- "Show available options for azurebackup security configure-mua with vault 'help-vault' in resource group 'rg-help' and --learn."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the backup vault (Recovery Services vault or Backup vault). |
| **Resource guard ID** |  Optional | ARM resource ID of the Resource Guard to link for Multi-User Authorization (for example, `/subscriptions/.../resourceGroups/.../providers/Microsoft.DataProtection/resourceGuards/myGuard`). |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Vault: create backup vault

<!-- @mcpcli azurebackup vault create -->

This tool creates a new backup vault. You specify the vault type as `rsv` for a Recovery Services vault or `dpp` for a Backup vault (Data Protection). For `dpp` vaults, this tool enables a system-assigned managed identity by default, so the vault can authenticate to protected data sources such as storage accounts, disks, and PostgreSQL Flexible Server. You can change the identity type later. After creation, this tool returns the vault details.

Example prompts include:

- "Create a vault with vault name 'rsv-vault-prod' in resource group 'rg-prod-backup' at location 'eastus' with vault type 'rsv'."
- "Create a backup vault with vault name 'dpp-vault-staging' in resource group 'rg-staging' at location 'westus2' and storage type 'GeoRedundant'."
- "Can you create a vault with vault name 'vault-eastus-01' in resource group 'rg-dev' at location 'eastus' using SKU 'Standard'?"
- "Create vault name 'archive-vault' in resource group 'rg-archive' at location 'centralus' with vault type 'rsv' and storage type 'LocallyRedundant'."
- "Show available options for azurebackup vault create with location 'eastus', resource group 'rg-prod-backup', vault name 'rsv-vault-prod' and --learn."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Location** |  Required | The Azure region, for example `eastus` or `westus2`. |
| **Resource group** |  Required | The name of the Azure resource group. |
| **Vault name** |  Required | The name of the backup vault (Recovery Services vault or Backup vault). |
| **SKU** |  Optional | The vault SKU. |
| **Storage type** |  Optional | Storage redundancy: `GeoRedundant`, `LocallyRedundant`, or `ZoneRedundant`. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Vault: get backup vault 

<!-- @mcpcli azurebackup vault get -->

This tool retrieves backup vault information. When you specify a vault and a resource group, this tool returns detailed information about that vault, including vault type, location, SKU, and storage redundancy. If you omit those parameters, this tool lists all backup vaults in the subscription, including Recovery Services vaults and Backup vaults (Data Protection). Optionally, filter results by vault type `rsv` or `dpp`, or by resource group, to narrow the list.

Example prompts include:

- "List all backup vaults in my subscription."
- "Get details for vault 'backup-vault-prod' in resource group 'rg-prod'."
- "Show all backup vaults with vault type 'rsv'."
- "Run 'azurebackup vault get' with --learn to list available subcommands and parameters."
- "What backup vaults are in resource group 'rg-test' with vault type 'dpp'?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Vault name** |  Optional | The name of the backup vault (Recovery Services vault or Backup vault). |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Vault: update vault settings

<!-- @mcpcli azurebackup vault update -->

This tool updates vault-level settings for a Recovery Services vault or Backup vault. You can change storage redundancy, enable or disable soft delete, configure immutability, and set the managed identity type.

Example prompts include:

- "Update vault name 'rsv-main' in resource group 'rg-backup-prod' to redundancy 'ZoneRedundant', soft delete 'AlwaysOn', and soft delete retention days '30'."
- "Enable identity type 'SystemAssigned' for vault name 'backup-vault-eus' in resource group 'rg-dr' and add tags '{"env":"prod","owner":"backup"}'."
- "Set immutability state 'Locked' on vault name 'rsv-compliance' in resource group 'rg-compliance' and specify vault type 'dpp'."
- "Can you update vault name 'vault-test' in resource group 'rg-test' to identity type 'None', immutability state 'Disabled', and redundancy 'LocallyRedundant'?"
- "Show learn '--learn' for azurebackup vault update on vault name 'help-vault' in resource group 'rg-help'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the backup vault (Recovery Services vault or Backup vault). |
| **Identity type** |  Optional | Managed identity type: `SystemAssigned`, `UserAssigned`, or `None`. |
| **Immutability state** |  Optional | Immutability state: `Disabled`, `Enabled`, or `Locked` (irreversible). |
| **Redundancy type** |  Optional | Storage redundancy: `GeoRedundant`, `LocallyRedundant`, `ZoneRedundant`, or `ReadAccessGeoZoneRedundant`. |
| **Soft delete state** |  Optional | Soft delete state: `AlwaysOn`, `On`, or `Off`. |
| **Soft delete retention days** |  Optional | Soft delete retention period (14-180 days). |
| **Tags** |  Optional | Resource tags as a JSON key-value object. |
| **Vault type** |  Optional | The type of backup vault: `rsv` (Recovery Services vault) or `dpp` (Backup vault / Data Protection). Required for vault create; optional elsewhere (auto-detected if omitted). |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
