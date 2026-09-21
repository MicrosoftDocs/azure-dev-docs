---
title: Azure MCP Server Tools for Azure Backup
description: Use Azure MCP Server tools with natural language prompts or Azure MCP CLI commands to manage Azure Backup resources, including vaults, policies, protected items, and governance settings.
author: diberry
ms.author: diberry
ms.reviewer: shrja
ms.date: 08/27/2026
ms.service: azure-mcp-server
ms.topic: concept-article
ms.custom:
  - build-2025
ai-usage: ai-generated
content_well_notification:
  - AI-contribution
tool_count: 19
mcp-cli.version: "3.0.0-beta.37+19951caeceada3430e56e2487379817219a98df5"
---

# Azure MCP Server tools for Azure Backup

When you use Azure MCP Server, you can manage Azure Backup resources through natural language prompts by using the Model Context Protocol (MCP). Azure Backup supports two vault types: the Recovery Services vault (RSV) and the Backup vault, which is also known as the Data Protection Platform (DPP). You can create and configure backup vaults, define and update backup policies, and protect and undelete items. You can also manage governance settings like soft delete and immutability, configure multiuser authorization (MUA), and monitor backup jobs and recovery points.

Azure Backup provides cloud-based capabilities for your applications. For more information, see the [Azure Backup documentation](/azure/backup/).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Backup: Get status

This tool checks the backup status of an Azure resource through Azure Backup. It returns whether the resource is protected, along with vault and policy details. Use it to verify whether a virtual machine, disk, storage account, or other data source is backed up. It requires the Azure Resource Manager resource ID for the data source and the Azure region where the resource exists.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup backup status \
  --datasource-id <datasource-id> \
  --location <location>
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `datasource-id` | string | Yes | The datasource identifier. For VM/FileShare/DPP workloads, use the Resource Manager resource ID (for example, `/subscriptions/.../virtualMachines/myvm`). For RSV in-guest workloads (SQL/SAPHANA), use the protectable item name from `protectableitem list` (for example, `SAPHanaDatabase;instance;dbname`). |
| `location` | string | Yes | The Azure region (for example, `eastus`, `westus2`). |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup backup status -->

Example prompts include:

- "Is the virtual machine (VM) protected for data source ID `/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/webvm` in location `eastus`?"
- "Check backup status for data source ID `/subscriptions/22222222-2222-2222-2222-222222222222/resourceGroups/rg-backup/providers/Microsoft.Compute/disks/dataDisk1` in location `westus2`."
- "Get the protection details for data source ID `/subscriptions/33333333-3333-3333-3333-333333333333/resourceGroups/rg-storage/providers/Microsoft.Storage/storageAccounts/mystorageacct` in location `centralus`."
- "Verify protection for data source ID `SAPHanaDatabase;instance;ProdDB` in location `eastus2`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Datasource ID** |  Required | The data source identifier. For `VM`, `FileShare`, or `DPP` workloads, provide the Azure Resource Manager resource ID. For example, `/subscriptions/.../virtualMachines/myvm`. For Recovery Services vault (RSV) in-guest workloads, such as SQL or SAP HANA, provide the protectable item name that `protectableitem list` returns. For example, `SAPHanaDatabase;instance;dbname`. |
| **Location** |  Required | The Azure region. For example, `eastus` or `westus2`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Disaster recovery: Enable cross-region restore

This tool enables cross-region restore (CRR) on a geo-redundant storage-enabled backup vault so that you can recover backups from a secondary region.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup disasterrecovery enable-crr \
  --vault <vault> \
  --resource-group <resource-group> \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup disasterrecovery enable-crr -->

Example prompts include:

- "Enable Cross-Region Restore for vault name `backup-vault-prod` in resource group `rg-prod`."
- "Enable Cross-Region Restore on Recovery Services vault `rsv-backup` in resource group `rg-disaster` with vault type `rsv`."
- "Enable CRR for vault `dr-vault-east` in resource group `rg-eus` with vault type `dpp`."
- "Run `azurebackup disasterrecovery enable-crr` for vault name `backupvault01` in resource group `rg-apps`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group that contains the vault. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Governance: List resources without backup policy

This tool scans your subscription and lists Azure resources that aren't protected by any Azure Backup policy. It uses two discovery paths: ARM resource enumeration finds top-level unprotected resources, and Recovery Services vault discovery finds protectable sub-resources that a vault discovers but doesn't yet protect. Results include a `discoverySource` value (`arm` or `vault`), and vault-discovered items include `protectionState` so you can distinguish never-protected items from items where protection stopped.

You can filter results by resource type, resource group, or tags. Tag filtering applies only to ARM-discovered resources because vault-discovered sub-resources don't carry ARM tags. Coverage includes IaaS VMs, SQL in IaaS VMs, SAP HANA in IaaS VMs, Azure File Shares, Blob Storage, ADLS Gen2, AKS, Managed Disks, PostgreSQL Flexible Server, Cosmos DB, and Elastic SAN.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup governance find-unprotected \
  [--resource-type-filter <resource-type-filter>] \
  [--tag-filter <tag-filter>] \
  [--resource-group <resource-group>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resource-type-filter` | string | No | Resource types to filter (comma-separated). |
| `tag-filter` | string | No | Tag-based filter in key=value format (for example, `environment=production`). |
| `resource-group` | string | No | The Azure resource group name. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup governance find-unprotected -->

Example prompts include:

- "Find all resources in my subscription that aren't protected by any backup policy."
- "Find unprotected resources with resource type filter `Microsoft.Compute/virtualMachines,Microsoft.Sql/servers`."
- "List unprotected resources with tag filter `environment=production`."
- "Show unprotected resources with resource type filter `Microsoft.Storage/storageAccounts` and tag filter `backup=required`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource type filter** |  Optional | Resource types to filter, comma-separated. |
| **Tag filter** |  Optional | Tag-based filter in key=value format (for example, `environment=production`). |
| **Resource group** |  Optional | The name of the Azure resource group. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Governance: Configure immutability state

This tool configures the immutability state for a backup vault. Set the state to `Disabled`, `Enabled`, or `Locked`. Warning: `Locked` is irreversible.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup governance immutability \
  --immutability-state <immutability-state> \
  --vault <vault> \
  --resource-group <resource-group> \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `immutability-state` | string | Yes | Immutability state: `Disabled`, `Enabled`, or `Locked` (irreversible). |
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup governance immutability -->

Example prompts include:

- "Set immutability state `Enabled` for vault name `backup-vault` in resource group `rg-prod`."
- "Enable immutability state `Locked` for vault name `rsv-vault-01` in resource group `rg-secure`."
- "Change immutability state `Disabled` for vault name `dppvault1` in resource group `rg-dev`."
- "Can you set immutability state `Enabled` for vault name `prod-backup` in resource group `rg-production` with vault type `rsv`?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Immutability state** |  Required | Immutability state: `Disabled`, `Enabled`, or `Locked` (irreversible). |
| **Resource group** |  Required | The name of the Azure resource group that contains the vault. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Governance: Configure soft delete

This tool configures soft-delete settings for a backup vault. Set the soft-delete state to `AlwaysOn`, `On`, or `Off`. Optionally, specify the soft-delete retention period in days (14 to 180). For example, enable soft delete `On` with a 30-day retention for the vault `contosoBackupVault` in the resource group `rg-backup`.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup governance soft-delete \
  --soft-delete <soft-delete> \
  --vault <vault> \
  --resource-group <resource-group> \
  [--soft-delete-retention-days <soft-delete-retention-days>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `soft-delete` | string | Yes | Soft-delete state: `AlwaysOn`, `On`, or `Off`. |
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `soft-delete-retention-days` | string | No | Soft delete retention period (14-180 days). |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup governance soft-delete -->

Example prompts include:

- "Enable soft delete `AlwaysOn` for vault name `backup-vault-prod` in resource group `rg-prod` with soft delete retention days `90`."
- "Turn soft delete `Off` for vault name `rsv-main` in resource group `rg-backups`."
- "Can you set soft delete `On` for vault name `dpp-vault` in resource group `rg-dev` with vault type `dpp` and soft delete retention days `30`?"
- "Configure soft delete `On` for vault name `rs-vault-prod` in resource group `rg-prod` and specify vault type `rsv`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group that contains the vault. |
| **Soft delete** |  Required | Soft-delete state: `AlwaysOn`, `On`, or `Off`. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Soft delete retention days** |  Optional | Soft-delete retention period in days. Range: 14 to 180. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Job: Get backup job information

This tool retrieves backup job information from a vault. When you specify the job ID, the tool returns detailed information about that job. The information includes operation type, status, start and end times, error codes, and data source details. When you omit the job ID, the tool lists all backup jobs in the vault.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup job get \
  --vault <vault> \
  --resource-group <resource-group> \
  [--job <job>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `job` | string | No | The backup job ID. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup job get -->

Example prompts include:

- "List all backup jobs in resource group `rg-backup-prod` for vault `rsv-prod-vault`."
- "Get backup job `job-9f7c3a2b` in resource group `rg-backup-prod` from vault `rsv-prod-vault`."
- "What is the status of job `d3b2e7f4` in vault `backupvault-eus` within resource group `rg-eus-backup`?"
- "List all backup jobs in resource group `rg-dpp-test` for vault `dpp-test-vault` with vault type `dpp`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group that contains the vault. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Job ID** |  Optional | The backup job ID. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)]|

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Policy: Create backup policy

This tool creates a backup policy for the workload type you specify and lets you set schedule and retention rules.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup policy create \
  --policy <policy> \
  --workload-type <workload-type> \
  --vault <vault> \
  --resource-group <resource-group> \
  [--daily-retention-days <daily-retention-days>] \
  [--time-zone <time-zone>] \
  [--schedule-frequency <schedule-frequency>] \
  [--schedule-times <schedule-times>] \
  [--schedule-days-of-week <schedule-days-of-week>] \
  [--hourly-interval-hours <hourly-interval-hours>] \
  [--hourly-window-start-time <hourly-window-start-time>] \
  [--hourly-window-duration-hours <hourly-window-duration-hours>] \
  [--weekly-retention-weeks <weekly-retention-weeks>] \
  [--weekly-retention-days-of-week <weekly-retention-days-of-week>] \
  [--monthly-retention-months <monthly-retention-months>] \
  [--monthly-retention-week-of-month <monthly-retention-week-of-month>] \
  [--monthly-retention-days-of-week <monthly-retention-days-of-week>] \
  [--monthly-retention-days-of-month <monthly-retention-days-of-month>] \
  [--yearly-retention-years <yearly-retention-years>] \
  [--yearly-retention-months <yearly-retention-months>] \
  [--yearly-retention-week-of-month <yearly-retention-week-of-month>] \
  [--yearly-retention-days-of-week <yearly-retention-days-of-week>] \
  [--yearly-retention-days-of-month <yearly-retention-days-of-month>] \
  [--archive-tier-after-days <archive-tier-after-days>] \
  [--archive-tier-mode <archive-tier-mode>] \
  [--policy-sub-type <policy-sub-type>] \
  [--instant-rp-retention-days <instant-rp-retention-days>] \
  [--instant-rp-resource-group <instant-rp-resource-group>] \
  [--snapshot-consistency <snapshot-consistency>] \
  [--full-schedule-frequency <full-schedule-frequency>] \
  [--full-schedule-days-of-week <full-schedule-days-of-week>] \
  [--differential-schedule-days-of-week <differential-schedule-days-of-week>] \
  [--differential-retention-days <differential-retention-days>] \
  [--incremental-schedule-days-of-week <incremental-schedule-days-of-week>] \
  [--incremental-retention-days <incremental-retention-days>] \
  [--log-frequency-minutes <log-frequency-minutes>] \
  [--log-retention-days <log-retention-days>] \
  [--is-compression <is-compression>] \
  [--is-sql-compression <is-sql-compression>] \
  [--smart-tier <smart-tier>] \
  [--enable-snapshot-backup <enable-snapshot-backup>] \
  [--snapshot-instant-rp-retention-days <snapshot-instant-rp-retention-days>] \
  [--snapshot-instant-rp-resource-group <snapshot-instant-rp-resource-group>] \
  [--enable-vault-tier-copy <enable-vault-tier-copy>] \
  [--vault-tier-copy-after-days <vault-tier-copy-after-days>] \
  [--backup-mode <backup-mode>] \
  [--pitr-retention-days <pitr-retention-days>] \
  [--policy-tags <policy-tags>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `policy` | string | Yes | The name of the backup policy. |
| `workload-type` | string | Yes | Workload type: VM, SQL, SAPHANA, SAPASE, AzureFileShare (RSV types); AzureDisk, AzureBlob, AKS, ElasticSAN, PostgreSQLFlexible, ADLS, CosmosDB (DPP types). Also accepts aliases such as AzureVM and SQLDatabase. |
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `daily-retention-days` | string | No | Daily recovery point retention in days. Defaults to a data source-specific value if you don't specify one. |
| `time-zone` | string | No | Windows time-zone identifier for the backup schedule (for example, `UTC`, `Pacific Standard Time`, `India Standard Time`). If you omit it, the schedule runs in UTC. |
| `schedule-frequency` | string | No | Backup schedule frequency. RSV vaults accept `Daily`, `Weekly`, or `Hourly`. DPP (Backup) vaults accept ISO 8601 intervals: `PT4H`, `PT6H`, `PT8H`, `PT12H`, `P1D`, `P1W`, `P2W`, or `P1M`. |
| `schedule-times` | string | No | Comma-separated list of backup times in 24h HH:mm format (for example, `02:00` or `02:00,14:00`). Interpreted in `--time-zone`. Defaults to `02:00` UTC if you don't specify a value. Only the first time serves as the schedule start time. |
| `schedule-days-of-week` | string | No | Comma-separated days of the week the backup should run (for example, `Monday,Wednesday,Friday`). Required for `Weekly` schedules. |
| `hourly-interval-hours` | string | No | Interval in hours between hourly backups. Valid values: `4`, `6`, `8`, `12`. Applies only when `--schedule-frequency` is `Hourly` (RSV). |
| `hourly-window-start-time` | string | No | Start time of the hourly backup window in 24h HH:mm format (for example, `08:00`). Applies only when `--schedule-frequency` is `Hourly` (RSV). |
| `hourly-window-duration-hours` | string | No | Duration of the hourly backup window in hours (for example, `12`). Applies only when `--schedule-frequency` is `Hourly` (RSV). |
| `weekly-retention-weeks` | string | No | Number of weeks to keep weekly recovery points. Required alongside `--weekly-retention-days-of-week`. |
| `weekly-retention-days-of-week` | string | No | Comma-separated days of the week tagged for weekly retention (for example, `Sunday` or `Saturday,Sunday`). Required alongside `--weekly-retention-weeks`. |
| `monthly-retention-months` | string | No | Number of months to keep monthly recovery points. Combine with either `--monthly-retention-days-of-month` (absolute) OR `--monthly-retention-week-of-month` + `--monthly-retention-days-of-week` (relative). |
| `monthly-retention-week-of-month` | string | No | Which week of the month to tag for monthly retention: `First`, `Second`, `Third`, `Fourth`, or `Last`. Use with `--monthly-retention-days-of-week` (relative scheme). |
| `monthly-retention-days-of-week` | string | No | Comma-separated days of the week for the monthly retention tag (for example, `Sunday`). Use with `--monthly-retention-week-of-month` (relative scheme). |
| `monthly-retention-days-of-month` | string | No | Comma-separated days of the month for monthly retention (1 to 28 or `Last`; for example, `1,15,Last`). Absolute scheme; mutually exclusive with `--monthly-retention-week-of-month`. |
| `yearly-retention-years` | string | No | Number of years to keep yearly recovery points. Combine with `--yearly-retention-months` and either `--yearly-retention-days-of-month` (absolute) OR `--yearly-retention-week-of-month` + `--yearly-retention-days-of-week` (relative). |
| `yearly-retention-months` | string | No | Comma-separated months tagged for yearly retention (for example, `January` or `January,July`). |
| `yearly-retention-week-of-month` | string | No | Which week of the selected month or months to tag for yearly retention: `First`, `Second`, `Third`, `Fourth`, or `Last`. Use with `--yearly-retention-days-of-week` (relative scheme). |
| `yearly-retention-days-of-week` | string | No | Comma-separated days of the week for the yearly retention tag (for example, `Sunday`). Use with `--yearly-retention-week-of-month` (relative scheme). |
| `yearly-retention-days-of-month` | string | No | Comma-separated days of the selected month or months for yearly retention (1 to 28 or `Last`; for example, `1,Last`). Absolute scheme; mutually exclusive with `--yearly-retention-week-of-month`. |
| `archive-tier-after-days` | string | No | Move recovery points to the archive tier after this many days. Pair with `--archive-tier-mode`. |
| `archive-tier-mode` | string | No | Archive tiering mode: `TierAfter` (always tier after `--archive-tier-after-days`) or `CopyOnExpiry` (copy to archive when the recovery point expires). Use `--smart-tier` for service-recommended tiering. |
| `policy-sub-type` | string | No | RSV VM policy sub-type: `Standard` or `Enhanced`. `Enhanced` is required for hourly schedules and Trusted Launch VMs. RSV VM only. |
| `instant-rp-retention-days` | string | No | Instant recovery point retention in days (1 to 30 for Standard, 1 to 7 for Enhanced). RSV VM only. |
| `instant-rp-resource-group` | string | No | Resource group that hosts the instant recovery point snapshots. RSV VM only. |
| `snapshot-consistency` | string | No | Snapshot consistency mode for VM backups: `ApplicationConsistent` or `CrashConsistent`. RSV VM only. |
| `full-schedule-frequency` | string | No | Full backup schedule frequency for SQL/SAPHANA/SAPASE: `Daily` or `Weekly`. RSV VmWorkload only. |
| `full-schedule-days-of-week` | string | No | Comma-separated days of the week for the Full backup (for example, `Sunday`). Required when `--full-schedule-frequency` is `Weekly`. RSV VmWorkload only. |
| `differential-schedule-days-of-week` | string | No | Comma-separated days of the week for the Differential backup (for example, `Monday,Thursday`). RSV VmWorkload only. |
| `differential-retention-days` | string | No | Retention period in days for Differential backups. RSV VmWorkload only. |
| `incremental-schedule-days-of-week` | string | No | Comma-separated days of the week for the Incremental backup. RSV SAPHANA / SAPASE only. |
| `incremental-retention-days` | string | No | Retention period in days for Incremental backups. RSV SAPHANA / SAPASE only. |
| `log-frequency-minutes` | string | No | Transaction log backup frequency in minutes (for example, `15`, `30`, `60`). RSV VmWorkload only. |
| `log-retention-days` | string | No | Retention period in days for transaction log backups. RSV VmWorkload only. |
| `is-compression` | string | No | Enable backup compression at the policy level. RSV VmWorkload only. |
| `is-sql-compression` | string | No | Enable SQL Server on VM native backup compression. RSV SQL only. |
| `smart-tier` | string | No | Enable smart-tiering (machine learning-based archive recommendation). RSV VM only. Equivalent to `TieringMode=TierRecommended`. Stays separate from `--archive-tier-mode` because it emits a structurally different tiering shape (`Duration=0`, `DurationType=Invalid`). |
| `enable-snapshot-backup` | string | No | Enable snapshot/instance backups (HANA System Replication snapshot recovery points). RSV SAPHANA only. |
| `snapshot-instant-rp-retention-days` | string | No | Snapshot instant recovery point retention range in days. RSV SAPHANA snapshot only. |
| `snapshot-instant-rp-resource-group` | string | No | Resource group prefix for snapshot instant recovery points. RSV SAPHANA snapshot only. |
| `enable-vault-tier-copy` | string | No | Enable vault-tier copy of operational store backups. DPP AzureDisk only. |
| `vault-tier-copy-after-days` | string | No | Days after which an operational backup is copied to the vault tier. DPP AzureDisk only. |
| `backup-mode` | string | No | Backup mode for storage workloads: `Continuous` (default for AzureBlob, ADLS) or `Vaulted` (discrete recovery points). DPP AzureBlob, AzureDataLakeStorage. |
| `pitr-retention-days` | string | No | Point-in-time restore retention in days for continuous backups. DPP AzureBlob, AzureDataLakeStorage. |
| `policy-tags` | string | No | Resource tags applied to the RSV backup policy as `k1=v1,k2=v2`. RSV only. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup policy create -->

Example prompts include:

- "Create backup policy `daily-vm-policy` in resource group `rg-prod` for vault `rsv-vault-west` with workload type `VM`."
- "I need a backup policy `sql-weekly-policy` in resource group `rg-db` for vault `db-backups` targeting workload type `SQL` with daily retention days `30` and schedule time `03:00`."
- "Can you create policy `aks-backup` in resource group `rg-aks` for vault `dpp-aks-vault` with workload type `AKS` and vault type `dpp`?"
- "Create policy `azureblob-monthly` in resource group `rg-storage` for vault `blob-backups` with workload type `AzureBlob` and daily retention days `7`."
- "Create backup policy `flexible-pg-policy` in resource group `rg-data` for vault `dpp-data-vault` with workload type `PostgreSQLFlexible`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Policy name** |  Required | The name of the backup policy. |
| **Resource group** |  Required | The name of the Azure resource group, a logical container for related resources. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Workload type** |  Required | Workload type: `VM`, `SQL`, `SAPHANA`, `SAPASE`, `AzureFileShare` (RSV types) or `AzureDisk`, `AzureBlob`, `AKS`, `ElasticSAN`, `PostgreSQLFlexible`, `ADLS`, `CosmosDB` (DPP types). Also accepts aliases like `AzureVM` and `SQLDatabase`. |
| **Archive tier after days** |  Optional | Move recovery points to the archive tier after specified days. Pair with `--archive-tier-mode`. |
| **Archive tier mode** |  Optional | Archive tiering mode: `TierAfter` (always tier after `--archive-tier-after-days`) or `CopyOnExpiry` (copy to archive when the recovery point expires). Use `--smart-tier` for service-recommended tiering. |
| **Backup mode** |  Optional | Backup mode for storage workloads: `Continuous` (default for `AzureBlob`, `ADLS`) or `Vaulted` (discrete recovery points). `DPP` `AzureBlob`, `AzureDataLakeStorage`. |
| **Daily retention days** |  Optional | Daily recovery point retention in days. Defaults to the data source-specific value if omitted. |
| **Differential retention days** |  Optional | Retention period in days for Differential backups. RSV `VmWorkload` only. |
| **Differential schedule days of week** |  Optional | Comma-separated days of the week for the Differential backup (for example, `Monday,Thursday`). RSV `VmWorkload` only. |
| **Enable snapshot backup** |  Optional | Enable snapshot/instance backups (HANA System Replication snapshot recovery points). RSV `SAPHANA` only. |
| **Enable vault tier copy** |  Optional | Enable vault-tier copy of operational store backups. DPP `AzureDisk` only. |
| **Full schedule days of week** |  Optional | Comma-separated days of the week for the Full backup (for example, `Sunday`). Required when `--full-schedule-frequency` is `Weekly`. RSV `VmWorkload` only. |
| **Full schedule frequency** |  Optional | Full backup schedule frequency for `SQL`/`SAPHANA`/`SAPASE`: `Daily` or `Weekly`. RSV `VmWorkload` only. |
| **Hourly interval hours** |  Optional | Interval in hours between hourly backups. Valid values: `4`, `6`, `8`, `12`. Applies only when `--schedule-frequency` is `Hourly` (RSV). |
| **Hourly window duration hours** |  Optional | Duration of the hourly backup window in hours (for example, `12`). Applies only when `--schedule-frequency` is `Hourly` (RSV). |
| **Hourly window start time** |  Optional | Start time of the hourly backup window in 24h HH:mm format (for example, `08:00`). Applies only when `--schedule-frequency` is `Hourly` (RSV). |
| **Incremental retention days** |  Optional | Retention period in days for Incremental backups. RSV `SAPHANA` / `SAPASE` only. |
| **Incremental schedule days of week** |  Optional | Comma-separated days of the week for the Incremental backup. RSV `SAPHANA` / `SAPASE` only. |
| **Instant recovery-point resource group** |  Optional | Resource group that hosts the instant recovery point snapshots. RSV VM only. |
| **Instant recovery-point retention days** |  Optional | Instant recovery point retention in days (1 to 30 for Standard, 1 to 7 for Enhanced). RSV VM only. |
| **Is compression** |  Optional | Enable backup compression at the policy level. RSV `VmWorkload` only. |
| **Is SQL compression** |  Optional | Enable SQL Server on VM native backup compression. RSV SQL only. |
| **Log frequency minutes** |  Optional | Transaction log backup frequency in minutes (for example, `15`, `30`, `60`). RSV `VmWorkload` only. |
| **Log retention days** |  Optional | Retention period in days for transaction log backups. RSV `VmWorkload` only. |
| **Monthly retention days of month** |  Optional | Comma-separated days of the month for monthly retention (1 to 28 or `Last`; for example, `1,15,Last`). Absolute scheme. Mutually exclusive with `--monthly-retention-week-of-month`. |
| **Monthly retention days of week** |  Optional | Comma-separated days of the week for the monthly retention tag (for example, `Sunday`). Use with `--monthly-retention-week-of-month` (relative scheme). |
| **Monthly retention months** |  Optional | Number of months to keep monthly recovery points. Combine with either `--monthly-retention-days-of-month` (absolute) or `--monthly-retention-week-of-month` + `--monthly-retention-days-of-week` (relative). |
| **Monthly retention week of month** |  Optional | Which week of the month to tag for monthly retention: `First`, `Second`, `Third`, `Fourth`, or `Last`. Use with `--monthly-retention-days-of-week` (relative scheme). |
| **PITR retention days** |  Optional | Point-in-time restore retention in days for continuous backups. DPP `AzureBlob`, `AzureDataLakeStorage`. |
| **Policy subtype** |  Optional | RSV VM policy subtype: `Standard` or `Enhanced`. `Enhanced` is required for hourly schedules and Trusted Launch VMs. RSV VM only. |
| **Policy tags** |  Optional | Resource tags applied to the RSV backup policy as `k1=v1,k2=v2`. RSV only. |
| **Schedule days of week** |  Optional | Comma-separated days of the week that the backup should run (for example, `Monday,Wednesday,Friday`). Required for `Weekly` schedules. |
| **Schedule frequency** |  Optional | Backup schedule frequency. Recovery Services vaults accept `Daily`, `Weekly`, or `Hourly`. Backup vaults accept ISO 8601 intervals: `PT4H`, `PT6H`, `PT8H`, `PT12H`, `P1D`, `P1W`, `P2W`, or `P1M`. |
| **Schedule time** |  Optional | Comma-separated list of backup times in 24h HH:mm format (for example, `02:00` or `02:00,14:00`). Interpreted in `--time-zone`. Defaults to 02:00 UTC if not specified. |
| **Smart tier** |  Optional | Enable smart-tiering (machine learning-based archive recommendation). RSV VM only. |
| **Snapshot consistency** |  Optional | Snapshot consistency mode for VM backups: `ApplicationConsistent` or `CrashConsistent`. RSV VM only. |
| **Snapshot instant recovery-point resource group** |  Optional | Resource group prefix for snapshot instant recovery points. RSV `SAPHANA` snapshot only. |
| **Snapshot instant recovery-point retention days** |  Optional | Snapshot instant recovery-point retention range in days. RSV `SAPHANA` snapshot only. |
| **Time zone** |  Optional | Windows time-zone identifier for the backup schedule (for example, `UTC`, `Pacific Standard Time`). If omitted, the schedule runs in UTC. |
| **Vault tier copy after days** |  Optional | Days after which an operational backup is copied to the vault tier. DPP `AzureDisk` only. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |
| **Weekly retention days of week** |  Optional | Comma-separated days of the week tagged for weekly retention (for example, `Sunday`). Required alongside `--weekly-retention-weeks`. |
| **Weekly retention weeks** |  Optional | Number of weeks to keep weekly recovery points. Required alongside `--weekly-retention-days-of-week`. |
| **Yearly retention days of month** |  Optional | Comma-separated days of the selected months for yearly retention (1 to 28 or `Last`). Absolute scheme. Mutually exclusive with `--yearly-retention-week-of-month`. |
| **Yearly retention days of week** |  Optional | Comma-separated days of the week for the yearly retention tag (for example, `Sunday`). Use with `--yearly-retention-week-of-month` (relative scheme). |
| **Yearly retention months** |  Optional | Comma-separated months tagged for yearly retention (for example, `January` or `January,July`). |
| **Yearly retention week of month** |  Optional | Which week of the selected months to tag for yearly retention: `First`, `Second`, `Third`, `Fourth`, or `Last`. Use with `--yearly-retention-days-of-week` (relative scheme). |
| **Yearly retention years** |  Optional | Number of years to keep yearly recovery points. Combine with `--yearly-retention-months` and either `--yearly-retention-days-of-month` (absolute) or `--yearly-retention-week-of-month` + `--yearly-retention-days-of-week` (relative). |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Policy: Get policy

This tool retrieves backup policy information. The tool provides detailed information for a single policy when you specify the `policy` parameter. When you omit the `policy` parameter, the tool lists all the backup policies configured in the vault.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup policy get \
  --vault <vault> \
  --resource-group <resource-group> \
  [--policy <policy>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `policy` | string | No | The name of the backup policy. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup policy get -->

Example prompts include:

- "List all backup policies in resource group `rg-prod` for vault `backup-vault`."
- "Get details of policy `DailyBackup` in resource group `rg-app` from vault `app-backup`."
- "What's the configuration for policy `WeeklyRetention` in resource group `rg-archive` on vault `archive-vault` with vault type `rsv`?"
- "Retrieve full information for policy `SQLServerPolicy` in resource group `rg-databases` from vault `db-backup`, including data source types and protected item counts."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group that contains the vault. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Policy name** |  Optional | The name of the backup policy. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Policy: Update policy

This tool modifies an existing Recovery Services vault backup policy. You can update the backup schedule time and daily retention days for VM, SQL, SAP HANA, and file share workload policies. The named policy must already exist in the vault.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup policy update \
  --policy <policy> \
  --vault <vault> \
  --resource-group <resource-group> \
  [--schedule-time <schedule-time>] \
  [--daily-retention-days <daily-retention-days>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `policy` | string | Yes | The name of the backup policy. |
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `schedule-time` | string | No | Backup time in `HH:mm` 24-hour format (for example, `02:00`), interpreted in the policy's time zone. |
| `daily-retention-days` | string | No | Daily recovery point retention in days. Defaults to a data source-specific value if you don't specify one. |
| `vault-type` | string | No | The type of backup vault. Only `rsv` is supported for policy update; the tool autodetects the type when you omit this parameter. Policy update isn't supported for `dpp` (Backup vault) policies. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup policy update -->

Example prompts include:

- "Update backup policy `daily-vm-policy` in resource group `rg-prod` for vault `rsv-vault-west` with schedule time `04:00`."
- "Change daily retention days to `60` for policy `sql-weekly-policy` in resource group `rg-db` on vault `db-backups`."
- "Update schedule time to `02:00` and daily retention days to `30` for policy `fileshare-policy` in resource group `rg-storage` on vault `storage-vault`."
- "Modify backup policy `sap-policy` in resource group `rg-sap` for vault `sap-backup-vault` with vault type `rsv` and schedule time `06:00`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Policy name** |  Required | The name of the backup policy. |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Daily retention days** |  Optional | Daily recovery point retention in days. Defaults to the data source-specific value if you don't specify one. |
| **Schedule time** |  Optional | Backup time in `HH:mm` 24-hour format (for example, `02:00`), interpreted in the policy's time zone. |
| **Vault type** |  Optional | The type of backup vault. Only `rsv` is supported for policy update; the tool autodetects the type when you omit this parameter. Policy update isn't supported for `dpp` (Backup vault) policies. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Protectable item: List protectable items

This tool lists items that you can back up (protectable items) in a Recovery Services vault. Examples include SQL databases and SAP HANA databases that the tool discovers on registered VMs. Use the tool to find databases and workloads available for backup protection. This tool supports Recovery Services vaults only. Data Protection Platform data sources use Resource Manager resource IDs for protection. Filter results by workload type, such as SQL or SAP HANA, or by container.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup protectableitem list \
  --vault <vault> \
  --resource-group <resource-group> \
  [--workload-type <workload-type>] \
  [--container <container>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `workload-type` | string | No | Workload type: VM, SQL, SAPHANA, SAPASE, AzureFileShare (RSV types); AzureDisk, AzureBlob, AKS, ElasticSAN, PostgreSQLFlexible, ADLS, CosmosDB (DPP types). Also accepts aliases such as AzureVM and SQLDatabase. |
| `container` | string | No | The RSV protection container name. Applies only to Recovery Services vaults. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup protectableitem list -->

Example prompts include:

- "List all protectable items in resource group `rg-prod` and vault name `rsv-backup-vault`."
- "List protectable items with workload type `SQL` in resource group `rg-data` and vault name `backup-vault-east`."
- "Show protectable items in container `iaasvmcontainer-01` for resource group `rg-prd-backup` and vault name `rsv-prod-vault`."
- "What protectable VMs are available with workload type `VM` and vault type `rsv` in resource group `rg-staging` and vault name `staging-backup-vault`?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Container name** |  Optional | The Recovery Services vault protection container name. Applies only to Recovery Services vaults. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |
| **Workload type** |  Optional | Workload types for Recovery Services vaults include `VM`, `SQL`, `SAPHANA` (SAP HANA), `SAPASE`, and `AzureFileShare`. Workload types for DPP include `AzureDisk`, `AzureBlob`, `AKS` (Azure Kubernetes Service), `ElasticSAN`, `PostgreSQLFlexible`, `ADLS` (Azure Data Lake Storage), and `CosmosDB`. The parameter also accepts aliases like `AzureVM` and `SQLDatabase`. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Protected item: Get information

Retrieves protected item information from a backup vault.

This tool returns detailed information about a single backup instance when you specify the protected item. Details include protection status, data source information, policy assignment, and last backup time. Specify the container for Recovery Services vault items. When you omit the protected item, the tool lists all protected items (backup instances) in the vault.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup protecteditem get \
  --vault <vault> \
  --resource-group <resource-group> \
  [--protected-item <protected-item>] \
  [--container <container>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `protected-item` | string | No | The name of the protected item or backup instance. |
| `container` | string | No | The RSV protection container name. Applies only to Recovery Services vaults. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup protecteditem get -->

Example prompts include:

- "List all protected items in resource group `rg-prod` and vault name `rsv-vault`."
- "Get protected item `vm-prod-01` in container `rsv-container-01` for resource group `rg-prod` and vault name `rsv-vault`."
- "Retrieve protected item `db-backup-2026` from resource group `rg-dpp` and vault name `dpp-vault` with vault type `dpp`."
- "What protected items are in resource group `prod-rg` and vault name `backup-vault`?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Container name** |  Optional | The Recovery Services vault protection container name. Applies only to Recovery Services vaults. |
| **Protected item** |  Optional | The name of the protected item or backup instance. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Protected item: Configure backup protection

Configure backup protection for an Azure resource by creating a protected item or a backup instance. This tool protects VMs, disks, file shares, SQL databases, SAP HANA databases, and other supported data sources. For VMs, provide the VM Resource Manager resource ID as `Datasource ID`. For SQL and SAP HANA workloads, specify the protectable item name as `Datasource ID` (for example, `SAPHanaDatabase;instance;dbname`) and specify the `Container name`. Specify the backup policy with the `Policy` parameter. The operation runs asynchronously, so monitor the protection job until it finishes.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup protecteditem protect \
  --policy <policy> \
  --datasource-id <datasource-id> \
  --vault <vault> \
  --resource-group <resource-group> \
  [--datasource-type <datasource-type>] \
  [--aks-snapshot-resource-group <aks-snapshot-resource-group>] \
  [--aks-included-namespaces <aks-included-namespaces>] \
  [--aks-excluded-namespaces <aks-excluded-namespaces>] \
  [--aks-label-selectors <aks-label-selectors>] \
  [--aks-include-cluster-scope-resources <aks-include-cluster-scope-resources>] \
  [--protected-item <protected-item>] \
  [--container <container>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `policy` | string | Yes | The name of the backup policy. |
| `datasource-id` | string | Yes | The datasource identifier. For VM/FileShare/DPP workloads, use the Resource Manager resource ID (for example, `/subscriptions/.../virtualMachines/myvm`). For RSV in-guest workloads (SQL/SAPHANA), use the protectable item name from `protectableitem list` (for example, `SAPHanaDatabase;instance;dbname`). |
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `datasource-type` | string | No | The workload type hint: VM, SQL, SAPHANA, SAPASE, AzureFileShare (RSV types); AzureDisk, AzureBlob, AKS, ElasticSAN, PostgreSQLFlexible, ADLS, CosmosDB (DPP types). Also accepts aliases such as AzureVM and SQLDatabase. |
| `aks-snapshot-resource-group` | string | No | Resource group that stores the AKS volume snapshots that Backup creates. DPP AKS only. |
| `aks-included-namespaces` | string | No | Comma-separated list of namespaces to include in the AKS backup policy default scope. DPP AKS only. |
| `aks-excluded-namespaces` | string | No | Comma-separated list of namespaces to exclude from the AKS backup policy default scope. DPP AKS only. |
| `aks-label-selectors` | string | No | Comma-separated label selectors (for example, `app=frontend,tier=web`) that apply to the AKS backup policy default scope. DPP AKS only. |
| `aks-include-cluster-scope-resources` | string | No | Include cluster-scoped resources in the AKS backup policy. DPP AKS only. |
| `protected-item` | string | No | The name of the protected item or backup instance. |
| `container` | string | No | The RSV protection container name. Applies only to Recovery Services vaults. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup protecteditem protect -->

Example prompts include:

- "Protect data source ID `/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/prod-rg/providers/Microsoft.Compute/virtualMachines/webapp-prod` with policy `daily-policy` in resource group `prod-rg` and vault `backup-vault`."
- "Enable protection for data source ID `MSSQLDatabase;sqlserver01;salesdb` using policy `weekly-sql-policy` in resource group `rg-sql` and vault `rsv-vault`, container `sql-container`."
- "Create protection for data source ID `/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/rg-storage/providers/Microsoft.Compute/disks/data-disk1` with policy `disk-backup-policy` in resource group `rg-storage` and vault `dpp-vault`, data source type `AzureDisk`."
- "Can you protect data source ID `SAPHanaDatabase;HANA01;db01` with policy `hana-policy` in resource group `rg-hana` and vault `rsv-hana` and container `hana-container`?"
- "Start protection for data source ID `/subscriptions/9f8b7c6d-1234-4bcd-9e8f-abcdef012345/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/api-staging` using policy `api-policy` in resource group `rg-prod` and vault `backup-vault`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Datasource ID** |  Required | The data source identifier. For VMs, disks, and file shares, use the Resource Manager resource ID (for example, `/subscriptions/.../virtualMachines/myvm`). For in-guest workloads that a Recovery Services vault protects, use the protectable item name from the protectable items list (for example, `SAPHanaDatabase;instance;dbname`). |
| **Policy name** |  Required | The name of the backup policy. |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the backup vault. Use the Recovery Services vault name for RSV scenarios. |
| **AKS excluded namespaces** |  Optional | Comma-separated list of namespaces to exclude from the AKS backup policy default scope. DPP AKS only. |
| **AKS include cluster scope resources** |  Optional | Include cluster-scoped resources in the AKS backup policy. DPP AKS only. |
| **AKS included namespaces** |  Optional | Comma-separated list of namespaces to include in the AKS backup policy default scope. DPP AKS only. |
| **AKS label selectors** |  Optional | Comma-separated label selectors (for example, `app=frontend,tier=web`) that apply to the AKS backup policy default scope. DPP AKS only. |
| **AKS snapshot resource group** |  Optional | Resource group that stores the AKS volume snapshots that Backup creates. DPP AKS only. |
| **Container name** |  Optional | The Recovery Services vault protection container name. Applies only to Recovery Services vaults. |
| **Datasource type** |  Optional | The workload type hint. Supported Recovery Services vault types include `VM`, `SQL`, `SAPHANA`, `SAPASE`, and `AzureFileShare`. Supported Backup vault (DPP) types include `AzureDisk`, `AzureBlob`, `AKS`, `ElasticSAN`, `PostgreSQLFlexible`, `ADLS`, and `CosmosDB`. The parameter also accepts common aliases such as `AzureVM` and `SQLDatabase`. |
| **Protected item** |  Optional | The name of the protected item or backup instance. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Protected item: Restore soft-delete item

This tool restores a soft-deleted backup item to an active protection state. It helps you recover accidentally deleted backups or protected items. For Recovery Services vaults and Backup vaults, specify the data source Resource Manager resource ID with the `datasource-id` parameter. Optionally, specify the `container` parameter for Recovery Services vault workload items such as SQL or SAP HANA. The operation runs asynchronously, and you monitor progress with `azurebackup job get`.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup protecteditem undelete \
  --datasource-id <datasource-id> \
  --vault <vault> \
  --resource-group <resource-group> \
  [--container <container>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `datasource-id` | string | Yes | The datasource identifier. For VM/FileShare/DPP workloads, use the Resource Manager resource ID (for example, `/subscriptions/.../virtualMachines/myvm`). For RSV in-guest workloads (SQL/SAPHANA), use the protectable item name from `protectableitem list` (for example, `SAPHanaDatabase;instance;dbname`). |
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `container` | string | No | The RSV protection container name. Applies only to Recovery Services vaults. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup protecteditem undelete -->

Example prompts include:

- "Undelete protected item with data source ID `/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/myvm`, resource group `rg-backups`, and vault name `rsv-vault-prod`."
- "Undelete protected item for data source ID `SAPHanaDatabase;instance01;db01` in resource group `prod-backups` and vault name `rsv-vault-prod` with container `sql-container-01`."
- "Undelete the protected item for data source ID `/subscriptions/22222222-2222-2222-2222-222222222222/resourceGroups/rg-dpp/providers/Microsoft.Storage/storageAccounts/mydata/fileServices/default/shares/backupshare`, resource group `rg-dpp`, and vault name `backupvault01`."
- "Can you undelete the protected item for data source ID `/subscriptions/33333333-3333-3333-3333-333333333333/resourceGroups/web-rg/providers/Microsoft.Compute/virtualMachines/webapp-prod` in resource group `web-rg` from vault name `rsv-vault-staging`?"
- "Undelete protected item with data source ID `SAPHanaDatabase;instance02;db02`, resource group `rg-sql`, vault name `rsv-vault-eu`, and vault type `rsv`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Datasource ID** |  Required | The data source identifier. For `VM`, `FileShare`, or `DPP` workloads, use the Resource Manager resource ID (for example, `/subscriptions/.../virtualMachines/myvm`). For RSV in-guest workloads (`SQL`/`SAPHANA`), use the protectable item name from `protectableitem list` (for example, `SAPHanaDatabase;instance;dbname`). |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Container name** |  Optional | The Recovery Services vault protection container name. Applies only to Recovery Services vaults. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Recovery point: Get recovery point information

This tool retrieves recovery point information for a protected item. When you specify the recovery point, the tool returns detailed information about that recovery point, including time and type. When you omit the recovery point, the tool lists all available recovery points for the protected item.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup recoverypoint get \
  --protected-item <protected-item> \
  --vault <vault> \
  --resource-group <resource-group> \
  [--container <container>] \
  [--recovery-point <recovery-point>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `protected-item` | string | Yes | The name of the protected item or backup instance. |
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `container` | string | No | The RSV protection container name. Applies only to Recovery Services vaults. |
| `recovery-point` | string | No | The recovery point ID. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup recoverypoint get -->

Example prompts include:

- "List all recovery points for protected item `vm-prod-01` in resource group `rg-prod-backup` and vault name `vault-prod`."
- "Get recovery point `rp-2025-01-15T02:00:00Z` for protected item `db-backup-02` in resource group `rg-db` from vault name `db-vault` with container `rsv-container` and vault type `rsv`."
- "What recovery points are available for protected item `fileshare01` in resource group `rg-files` under vault name `backup-vault`?"
- "Show details for recovery point `rp-2026-05-01-08` of protected item `appservice-backup` in resource group `rg-apps` and vault name `app-vault` with vault type `dpp`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Protected item name** |  Required | The name of the protected item or backup instance. |
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Container name** |  Optional | The Recovery Services vault protection container name. Applies only to Recovery Services vaults. |
| **Recovery point ID** |  Optional | The recovery point ID. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Security: Configure encryption

This tool configures customer-managed key (CMK) encryption on a backup vault by using a key from Azure Key Vault. It supports both Recovery Services vaults and Backup vaults (DPP). The vault's managed identity must have the Key Vault Crypto Service Encryption User role on the key vault. Use `identity-type` to specify `SystemAssigned` or `UserAssigned` identity. Provide `user-assigned-identity-id` when you use a user-assigned identity.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup security configure-encryption \
  --key-vault-uri <key-vault-uri> \
  --key-name <key-name> \
  --identity-type <identity-type> \
  --vault <vault> \
  --resource-group <resource-group> \
  [--key-version <key-version>] \
  [--user-assigned-identity-id <user-assigned-identity-id>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `key-vault-uri` | string | Yes | Key Vault URI (for example, `https://kv-security-prod.vault.azure.net/`). |
| `key-name` | string | Yes | Name of the encryption key in the Key Vault. |
| `identity-type` | string | Yes | Managed identity type: `SystemAssigned`, `UserAssigned`, `SystemAssigned,UserAssigned`, or `None`. |
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `key-version` | string | No | Specific key version. Omit to always use the latest version. |
| `user-assigned-identity-id` | string | No | Resource Manager resource ID of the user-assigned managed identity for Key Vault access. Required when `--identity-type` is `UserAssigned`. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup security configure-encryption -->

Example prompts include:

- "Configure CMK encryption on vault `rsv-prod` in resource group `rg-backup` using key `backup-key` from key vault `https://kv-security-prod.vault.azure.net/` with system-assigned identity."
- "Set up customer-managed key encryption on vault `dpp-vault-west` in resource group `rg-west` with key vault URI `https://kv-compliance.vault.azure.net/`, key name `cmk-backup`, and user-assigned identity `/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-identity/providers/Microsoft.ManagedIdentity/userAssignedIdentities/backup-identity`."
- "Enable CMK encryption on vault `rsv-staging` in resource group `rg-staging` using key `staging-key` version `abc123` from `https://kv-staging.vault.azure.net/` with vault type `rsv` and identity type `SystemAssigned`."
- "Configure encryption for vault `backup-vault-eus` in resource group `rg-dr` with key vault URI `https://kv-dr.vault.azure.net/`, key name `dr-key`, and identity type `SystemAssigned`."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** | Required | The name of the Recovery Services vault or Backup vault. |
| **Key vault URI** | Required | Key Vault URI (for example, `https://kv-security-prod.vault.azure.net/`). |
| **Key name** | Required | The name of the encryption key in the key vault. |
| **Identity type** | Required | Managed identity type: `SystemAssigned`, `UserAssigned`, `SystemAssigned,UserAssigned`, or `None`. |
| **Key version** | Optional | Specific key version. Omit to always use the latest version. |
| **User assigned identity ID** | Optional | Resource Manager resource ID of the user-assigned managed identity for Key Vault access. Required when identity type is `UserAssigned`. |
| **Vault type** | Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Security: Configure multiuser authorization

This tool configures MUA on a backup vault by linking or unlinking a Resource Guard instance. Provide a Resource Guard ID to enable MUA, which protects critical operations such as disabling soft delete, removing immutability, and stopping protection. These operations require approval from a security admin with permissions on the Resource Guard instance. Omit the Resource Guard ID to disable MUA. Disabling MUA is a protected operation that requires the Backup MUA Operator role on the Resource Guard instance.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup security configure-mua \
  --vault <vault> \
  --resource-group <resource-group> \
  [--resource-guard-id <resource-guard-id>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `resource-guard-id` | string | No | ARM resource ID of the Resource Guard to link for multiuser authorization (for example, `/subscriptions/.../resourceGroups/.../providers/Microsoft.DataProtection/resourceGuards/myGuard`). |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup security configure-mua -->

Example prompts include:

- "Enable MUA on vault `rsv-prod` in resource group `rg-backup` with Resource Guard ID `/subscriptions/11111111-1111-1111-1111-111111111111/resourceGroups/rg-security/providers/Microsoft.DataProtection/resourceGuards/myGuard`."
- "Configure multiuser authorization for vault `backup-vault-eus` in resource group `rg-dr` by linking Resource Guard `/subscriptions/22222222-2222-2222-2222-222222222222/resourceGroups/rg-compliance/providers/Microsoft.DataProtection/resourceGuards/complianceGuard`."
- "Disable MUA on vault `rsv-staging` in resource group `rg-staging` with vault type `rsv`."
- "Link Resource Guard to vault `dpp-vault-west` in resource group `rg-west` with vault type `dpp` and Resource Guard ID `/subscriptions/33333333-3333-3333-3333-333333333333/resourceGroups/rg-guards/providers/Microsoft.DataProtection/resourceGuards/westGuard`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Resource Guard ID** |  Optional | Resource Manager resource ID of the Resource Guard instance to link for MUA (for example, `/subscriptions/.../resourceGroups/.../providers/Microsoft.DataProtection/resourceGuards/myGuard`). |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Vault: Create backup vault

This tool creates a new backup vault. Specify the vault type as `rsv` for a Recovery Services vault or `dpp` for a Backup vault (Data Protection Platform). For `dpp` vaults, the tool enables a system-assigned managed identity by default. The vault authenticates to protected data sources such as storage accounts, disks, and PostgreSQL flexible servers. You can change the identity type later. To use `ReadAccessGeoZoneRedundant`, create the vault with a supported redundancy type and then update it. After creation, the tool returns the vault details.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup vault create \
  --location <location> \
  --vault <vault> \
  --resource-group <resource-group> \
  [--sku <sku>] \
  [--storage-type <storage-type>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `location` | string | Yes | The Azure region (for example, `eastus`, `westus2`). |
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `sku` | string | No | The vault SKU. For Recovery Services vaults, accepted values are `Standard` and `RS0`. |
| `storage-type` | string | No | Storage redundancy: `GeoRedundant`, `LocallyRedundant`, or `ZoneRedundant`. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup vault create -->

Example prompts include:

- "Create a vault with vault name `rsv-vault-prod` in resource group `rg-prod-backup` at location `eastus` with vault type `rsv`."
- "Create a backup vault with vault name `dpp-vault-staging` in resource group `rg-staging` at location `westus2` and storage type `GeoRedundant`."
- "Can you create a vault with vault name `vault-eastus-01` in resource group `rg-dev` at location `eastus` using SKU `Standard`?"
- "Create vault name `archive-vault` in resource group `rg-archive` at location `centralus` with vault type `rsv` and storage type `LocallyRedundant`."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Location** |  Required | The Azure region, for example, `eastus` or `westus2`. |
| **Resource group** |  Required | The name of the Azure resource group. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **SKU** |  Optional | The vault SKU. For Recovery Services vaults, accepted values are `Standard` and `RS0`. |
| **Storage type** |  Optional | Storage redundancy: `GeoRedundant`, `LocallyRedundant`, or `ZoneRedundant`. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Vault: Get backup vault

This tool retrieves backup vault information. When you specify a vault and a resource group, the tool returns detailed information about that vault, including vault type, location, SKU, and storage redundancy. If you omit those parameters, the tool lists all backup vaults in the subscription, including Recovery Services vaults and Backup vaults (Data Protection Platform). To narrow the list, filter results by vault type `rsv` or `dpp`, or by resource group. Use the `--expand` parameter to include extra vault posture fields, such as the encryption key URI, cross-region restore state, and the multiuser authorization (MUA) resource guard link, in the response.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup vault get \
  [--vault <vault>] \
  [--vault-type <vault-type>] \
  [--resource-group <resource-group>] \
  [--expand <expand>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | No | The name of the backup vault (Recovery Services vault or Backup vault). |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |
| `resource-group` | string | No | The Azure resource group name. |
| `expand` | string | No | Comma-separated list of extra vault posture fields to include: `security`, `mua`, or `all`. |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup vault get -->

Example prompts include:

- "List all backup vaults in my subscription."
- "Get details for vault `backup-vault-prod` in resource group `rg-prod`."
- "Show all backup vaults with vault type `rsv`."
- "What backup vaults are in resource group `rg-test` with vault type `dpp`?"
- "Get vault `backup-vault-prod` in resource group `rg-prod` with expand `security` to show its encryption key URI and cross-region restore state."
- "Show vault `dpp-vault-01` in resource group `rg-dr` with expand `all` to include security and MUA posture fields."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Vault name** |  Optional | The name of the Recovery Services vault or Backup vault. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |
| **Resource group** |  Optional | The name of the Azure resource group. |
| **Expand** |  Optional | Comma-separated list of extra vault posture fields to include in the response: `security` (encryption key URI and cross-region restore state), `mua` (multiuser authorization resource guard link), or `all` (both). For Backup vaults (DPP), the tool also returns `encryptionState` when you specify `security` or `all`. Recovery Services vaults (RSV) omit `encryptionState` because the vault GET API doesn't return an explicit encryption state field. Omit this parameter to keep the default (unexpanded) response shape. |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |

## Vault: Update vault settings

This tool updates vault-level settings for a Recovery Services vault or Backup vault. You can change storage redundancy, enable or disable soft delete, configure immutability, and set the managed identity type.

#### [Azure MCP CLI](#tab/azure-mcp-cli)

**Example CLI command**

```console
azmcp azurebackup vault update \
  --vault <vault> \
  --resource-group <resource-group> \
  [--redundancy <redundancy>] \
  [--soft-delete <soft-delete>] \
  [--soft-delete-retention-days <soft-delete-retention-days>] \
  [--immutability-state <immutability-state>] \
  [--identity-type <identity-type>] \
  [--tags <tags>] \
  [--vault-type <vault-type>]
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vault` | string | Yes | The name of the backup vault (Recovery Services vault or Backup vault). |
| `resource-group` | string | Yes | The Azure resource group name. |
| `redundancy` | string | No | Storage redundancy: `GeoRedundant`, `LocallyRedundant`, `ZoneRedundant`, or `ReadAccessGeoZoneRedundant`. |
| `soft-delete` | string | No | Soft-delete state: `AlwaysOn`, `On`, or `Off`. |
| `soft-delete-retention-days` | string | No | Soft delete retention period (14-180 days). |
| `immutability-state` | string | No | Immutability state: `Disabled`, `Enabled`, or `Locked` (irreversible). |
| `identity-type` | string | No | Managed identity type: `SystemAssigned`, `UserAssigned`, `SystemAssigned,UserAssigned`, or `None`. |
| `tags` | string | No | Resource tags as JSON key-value object. |
| `vault-type` | string | No | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

#### [MCP Server](#tab/mcp-server)

<!-- @mcpcli azurebackup vault update -->

Example prompts include:

- "Update vault name `rsv-main` in resource group `rg-backup-prod` to redundancy `ZoneRedundant`, soft delete `AlwaysOn`, and soft delete retention days `30`."
- "Enable identity type `SystemAssigned` for vault name `backup-vault-eus` in resource group `rg-dr` and add tags `{"env":"prod","owner":"backup"}`."
- "Set immutability state `Locked` on vault name `rsv-compliance` in resource group `rg-compliance` and specify vault type `dpp`."
- "Can you update vault name `vault-test` in resource group `rg-test` to identity type `None`, immutability state `Disabled`, and redundancy `LocallyRedundant`?"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |
| **Vault name** |  Required | The name of the Recovery Services vault or Backup vault. |
| **Identity type** |  Optional | Managed identity type: `SystemAssigned`, `UserAssigned`, `SystemAssigned,UserAssigned`, or `None`. |
| **Immutability state** |  Optional | Immutability state: `Disabled`, `Enabled`, or `Locked` (irreversible). |
| **Redundancy type** |  Optional | Storage redundancy: `GeoRedundant`, `LocallyRedundant`, `ZoneRedundant`, or `ReadAccessGeoZoneRedundant`. |
| **Soft delete state** |  Optional | Soft delete state: `AlwaysOn`, `On`, or `Off`. |
| **Soft delete retention days** |  Optional | Soft delete retention period (14 to 180 days). |
| **Tags** |  Optional | Resource tags as a JSON key/value object. |
| **Vault type** |  Optional | [!INCLUDE [vault type parameter](../includes/tools/azure-backup-vault-type.md)] |

---

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

| Destructive | Idempotent | Open World | Read Only | Secret | Local Required |
|:-----------:|:----------:|:----------:|:---------:|:------:|:--------------:|
| ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started with the Azure MCP Server](../get-started.md)
