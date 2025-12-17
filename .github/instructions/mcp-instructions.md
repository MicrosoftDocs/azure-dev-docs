# Azure MCP Server Tool Example Prompt Validation Instructions

## Purpose

Validate and fix example prompts in Azure MCP Server tool documentation to ensure all required parameters are explicitly present. This ensures users see complete, working examples that can be used as-is.

## Core Principles

1. **Only fix prompts missing required parameters** - Do not reformat, rephrase, or change prompts that already contain all required parameters
2. **Preserve original intent** - Keep the prompt's purpose and optional parameters intact
3. **Add minimal changes** - Only add what is strictly required according to the parameter table
4. **Use explicit values** - Add specific placeholder values, not generic phrases like "my database" or "my resource"
5. **Check conditional requirements** - Some tools require "one of" multiple parameters (e.g., Cluster URI OR Cluster name + Subscription)

## Validation Process

For each tool in a documentation file:

1. **Read the parameter table** - Identify which parameters are marked as "Required" vs "Optional"
2. **Check each example prompt** - Verify that every required parameter is explicitly present
3. **Fix only missing required parameters** - Add them with appropriate placeholder values
4. **Leave compliant prompts unchanged** - Do not modify prompts that already have all required parameters
5. **Change the ms.date** field** - Update it to the current date after making changes

## Parameter Detection Rules

These rules help determine whether a required parameter is already included in an example prompt. A parameter is considered **satisfied/included** when it meets the criteria below.

### Common Azure Parameters

- **Resource group**: Included if the prompt mentions `resource group 'name'` or `in resource group`
- **Subscription**: Included if the prompt mentions subscription ID, subscription name, or "my subscription"
- **Location/Region**: Included if the prompt mentions Azure region names (eastus, westus, centralus, etc.)
- **Resource name** (Server, Database, Account, etc.): Included if explicitly named with quotes or clear identifier

### Service-Specific Parameters

- **Endpoint/URL**: Included if the prompt contains `https://` or `http://` URL pattern
- **File/Path**: Included if the prompt mentions filename with extension (`.wav`, `.txt`, `.csv`) or path pattern (`./`, `C:\`)
- **Query**: Included if the prompt contains explicit SQL/KQL query text in quotes or after "query" keyword
  - For SQL: `SELECT`, `INSERT`, `UPDATE`, `DELETE` statements
  - For KQL: Kusto syntax like `TableName | where ...` or predefined query names like `recent`, `errors`
- **Text**: Included if the prompt contains quoted string content
- **Namespace**: Included if the prompt mentions namespace name (e.g., Service Bus, Event Hubs)
- **User**: Included if the prompt mentions username or "with user 'name'"
- **Model**: Included if the prompt mentions model name (e.g., 'gpt-4', 'text-embedding-ada-002')

### Conditional Parameters

Some tools have "one of" requirements:
- **Azure Data Explorer**: Requires (Cluster URI) OR (Cluster name + Subscription + Resource group)
- **Azure Virtual Desktop**: Requires (Host pool name) OR (Host pool resource ID)

When conditional parameters are present, verify at least ONE complete option is provided.

## Placeholder Value Conventions

Use specific, realistic placeholders instead of generic references:

- **Endpoint**: `'https://myservice.cognitiveservices.azure.com/'`
- **File paths**: `'./sample-audio.wav'`, `'./output.txt'`, `'C:/data/file.csv'`
- **Resource group**: `'prod-rg'`, `'dev-rg'`, `'monitoring-rg'`, `'database-rg'`
- **Server/Account names**: `'prod-mysql-server'`, `'mystorageaccount'`, `'analytics-server'`
- **Database/Container**: `'salesdb'`, `'inventory'`, `'mycontainer'`
- **User**: `'dbadmin'`, `'appuser'`, `'developer'`
- **Query**: Full explicit query text, e.g., `'SELECT * FROM users WHERE id = 1'` or `'Logs | take 10'`
- **Region**: `'eastus'`, `'westus2'`, `'centralus'`
- **Subscription ID**: `'/subscriptions/abc123...'` (full ARM resource ID format)
- **Namespace**: `'app-messaging'`, `'messaging-hub'`, `'retail-messaging'`
- **Resource ID**: Full ARM format: `'/subscriptions/abc123/resourceGroups/rg/providers/Microsoft.Service/type/name'`

## Common Fixes by Service

### Database Services (MySQL, PostgreSQL, SQL)
- Ensure Server, Database, User, Resource group are present
- For queries, include explicit SQL query text

### Azure Monitor / Log Analytics
- Ensure Workspace, Resource group are present for workspace operations
- For queries, include explicit KQL query text, Table name
- For metrics, include Resource name, Metric namespace, Metrics

### Azure Storage
- Ensure Account is present for all operations
- Container required for blob operations

### Messaging Services (Service Bus, Event Hubs, Event Grid)
- Ensure Namespace is always present
- For topics/subscriptions, ensure Topic name is present
- For Event Grid, include explicit JSON Data for send operations

### Azure Data Explorer
- Ensure Query includes explicit KQL query text
- Check conditional parameters: Cluster URI OR (Cluster + Subscription + Resource group)

### Azure Functions
- Ensure explicit query text is present when mentioning "query"

## Examples of Correct Fixes

### Before (Missing Required Parameter):
```
"Show tables in my workspace"
```
Required: Resource group, Workspace

### After (Fixed):
```
"Show tables in workspace 'centralmonitoring' in resource group 'monitoring-rg'"
```

### Before (Missing Query Text):
```
"Query errors from last hour in workspace 'my-workspace' in resource group 'my-resource-group'"
```
Required: Resource group, Workspace, Table, Query

### After (Fixed):
```
"Query table 'AzureDiagnostics' with query 'AzureDiagnostics | where Level == \"Error\" | take 100' in workspace 'app-monitoring' in resource group 'monitoring-rg' for last 1 hour"
```

## What NOT to Do

❌ **Don't** reformat prompts that already have required parameters
❌ **Don't** change parameter values that are already present
❌ **Don't** add optional parameters unless they were in the original prompt
❌ **Don't** change the prompt's purpose or workflow
❌ **Don't** use escape characters for single quotes in SQL queries (use plain single quotes)
❌ **Don't** use generic placeholders like "my resource" or "my database"

## Workflow

1. Open the tool documentation file
2. For each tool section:
   - Read the parameter table to identify required vs optional parameters
   - Check each example prompt
   - If prompt is missing required parameters, add them with explicit placeholder values
   - If prompt has all required parameters, leave it unchanged
3. Use `multi_replace_string_in_file` for efficient batch edits
4. Verify changes preserve the original prompt intent