# =============================================================================
# MANAGED LUSTRE SERVICE-SPECIFIC INSTRUCTIONS
# =============================================================================
# These instructions apply ONLY to Managed Lustre example prompts.
# They are based on PR review feedback from the Azure Managed Lustre team.
# Source: https://github.com/MicrosoftDocs/azure-dev-docs-pr/pull/8353
# =============================================================================

## TERMINOLOGY REQUIREMENTS

### Use "job" or "task" instead of "configuration" or "settings" for auto-import/export entities
The Managed Lustre service refers to auto-import and auto-export operations as "jobs" or "tasks". Avoid using "configuration" or "settings" when describing these entities in example prompts or documentation, as it is less appropriate and less aligned with the service semantics.

- ✅ CORRECT: "Get the autoimport jobs for filesystem 'LustreFs01' in resource group 'rg-storage-prod'"
- ✅ CORRECT: "Cancel the autoimport job named 'dailySyncJob' on filesystem 'LustreFs01'"
- ❌ WRONG: "Get the autoimport settings for filesystem 'LustreFs01' in resource group 'rg-storage-prod'"
- ❌ WRONG: "Show me the blob autoimport configuration for filesystem 'archiveLustre'"

### Use "auto-import" and "auto-export" consistently as hyphenated terms
Refer to the features as "auto-import" and "auto-export" (with hyphen) to align with official service terminology.

- ✅ CORRECT: "Create an autoimport job for filesystem 'ProjectDataFS'"
- ❌ WRONG: "Create an auto import job for filesystem 'ProjectDataFS'"

### Use lowercase "filesystem" and "resource group" in prompts
Use lowercase for "filesystem" and "resource group" when referring to these entities in example prompts.

- ✅ CORRECT: "filesystem 'LustreFs01' in resource group 'rg-storage-prod'"
- ❌ WRONG: "Filesystem 'LustreFs01' in Resource Group 'rg-storage-prod'"

## SERVICE-SPECIFIC DISTINCTIONS

### Auto-import and auto-export jobs sync data between Lustre filesystem and blob storage
- Auto-import jobs sync data from the linked blob storage container to the Lustre filesystem.
- Auto-export jobs sync data from the Lustre filesystem to the linked blob storage container.

### Conflict resolution modes for auto-import jobs
The conflict resolution mode parameter controls how conflicts are handled during auto-import jobs. Allowed values and behavior:

- `Fail`: Stops immediately on conflict.
- `Skip`: Skips the conflict (default).
- `OverwriteIfDirty`: Deletes and re-imports if conflicting type, dirty, or currently released.
- `OverwriteAlways`: Extends `OverwriteIfDirty` to include releasing restored but not dirty files.

Both conflict resolution mode and autoimport prefixes are optional parameters with defaults.

### Autoimport prefixes and autoexport prefix usage
- Auto-import jobs support multiple prefixes (up to 100) to specify blob paths or prefixes to import.
- Auto-export jobs support only one prefix.
- Default prefix is `/`.

### Administrative status and enable deletions parameters for auto-import jobs
- `Admin status`: `Enable` (default) or `Disable` to activate or deactivate the job.
- `Enable deletions`: Boolean, only affects overwrite-dirty mode, default is `false`.

### Maximum errors parameter for auto-import jobs
- Specifies the number of tolerated non-conflict errors before the job fails.
- `-1` means infinite tolerance.
- `0` means exit immediately on any error.

## NAMING CONVENTIONS

### Use meaningful example names related to HPC and training workloads
- Use resource group names like `rg-training`, `rg-managedlustre-prod`, `rg-hpc-environment`.
- Use filesystem names like `TrainingDataFs`, `LustreFs01`, `AnalyticsLustreFS`, `ProjectDataFS`.
