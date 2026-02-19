# =============================================================================
# MANAGED LUSTRE SERVICE-SPECIFIC INSTRUCTIONS
# =============================================================================
# These instructions apply ONLY to Managed Lustre example prompts.
# They are based on PR review feedback from the Azure Managed Lustre team.
# Source: https://github.com/MicrosoftDocs/azure-dev-docs-pr/pull/8353
# =============================================================================

## TERMINOLOGY REQUIREMENTS

### Use "job" for import, auto-import, and auto-export entities
The Managed Lustre service refers to import, auto-import, and auto-export operations as "jobs". Avoid using "configuration", "settings", or "task" for these entities in example prompts or documentation.

- ✅ CORRECT: "Get the auto-import jobs for filesystem 'LustreFs01' in resource group 'rg-storage-prod'"
- ✅ CORRECT: "Cancel the auto-export job named 'archiveJob' on filesystem 'TrainingDataFs'"
- ✅ CORRECT: "Get the import jobs for filesystem 'LustreFs01' in resource group 'rg-storage-prod'"
- ❌ WRONG: "Get the auto-import settings for filesystem 'LustreFs01' in resource group 'rg-storage-prod'"
- ❌ WRONG: "Show me the blob auto-import configuration for filesystem 'archiveLustre'"

### Use "auto-import", "auto-export", and "import" consistently
- Use "auto-import" and "auto-export" (with dash, no space) for jobs that continuously sync data, matching official documentation and command names.
- Use "import job" (no auto-) for one-time/manual jobs that sync data from blob storage to Lustre filesystem.
- Do not use "autoimport", "autoexport", or "manual import"—use the official forms.
- When describing manual jobs, use "manual import job" for clarity.

- ✅ CORRECT: "Create an auto-import job for filesystem 'ProjectDataFS'"
- ✅ CORRECT: "Create an import job for filesystem 'ProjectDataFS'"
- ✅ CORRECT: "Create a manual import job for filesystem 'ProjectDataFS'"
- ✅ CORRECT: "The auto-export job syncs data to blob storage"
- ❌ WRONG: "Create an autoimport job for filesystem 'ProjectDataFS'"
- ❌ WRONG: "Create a manual job for filesystem 'ProjectDataFS'"
- ❌ WRONG: "The autoexport job syncs data"

### Use lowercase "filesystem" and "resource group" in prompts
Use lowercase for "filesystem" and "resource group" when referring to these entities in example prompts.

- ✅ CORRECT: "filesystem 'LustreFs01' in resource group 'rg-storage-prod'"
- ❌ WRONG: "Filesystem 'LustreFs01' in Resource Group 'rg-storage-prod'"

## SERVICE-SPECIFIC DISTINCTIONS

### Manual import, auto-import, and auto-export jobs sync data between Lustre filesystem and blob storage
- Manual import jobs perform a one-time sync from the linked blob storage container to the Lustre filesystem.
- Auto-import jobs continuously sync data from the linked blob storage container to the Lustre filesystem.
- Auto-export jobs continuously sync data from the Lustre filesystem to the linked blob storage container.

### Conflict resolution modes for auto-import jobs
The conflict resolution mode parameter controls how conflicts are handled during auto-import jobs. Allowed values and behavior:

- `Fail`: Stops immediately on conflict.
- `Skip`: Skips the conflict (default).
- `OverwriteIfDirty`: Deletes and re-imports if conflicting type, dirty, or currently released.
- `OverwriteAlways`: Extends `OverwriteIfDirty` to include releasing restored but not dirty files.

Both conflict resolution mode and auto-import prefixes are optional parameters with defaults.

### Auto-import prefixes and auto-export prefix usage
- Auto-import jobs support multiple prefixes (up to 100) to specify blob paths or prefixes to import.
- Manual import jobs also support multiple prefixes.
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

## ALIGNMENT WITH OFFICIAL DOCUMENTATION AND AZURE MCP COMMANDS

- Always document and retain all tools and commands listed in the Azure MCP commands file and official documentation, including file system management tools (such as get, delete, create, update, etc.) and job-based tools (import job, manual import job, auto-import job, auto-export job).
- Do not remove tools from the documentation unless they are officially deprecated and removed from the Azure MCP commands file and published documentation.
- Example prompt structure and terminology should match the published articles:
  - <https://learn.microsoft.com/en-us/azure/azure-managed-lustre/blob-integration>
  - <https://learn.microsoft.com/en-us/azure/azure-managed-lustre/create-import-job>
  - <https://learn.microsoft.com/en-us/azure/azure-managed-lustre/auto-import>
  - <https://learn.microsoft.com/en-us/azure/azure-managed-lustre/export-with-archive-jobs>
  - <https://learn.microsoft.com/en-us/azure/azure-managed-lustre/auto-export>
- Command names and prompt language should match the Azure MCP commands file:
  - <https://github.com/microsoft/mcp/blob/main/servers/Azure.Mcp.Server/docs/azmcp-commands.md#azure-managed-lustre>
