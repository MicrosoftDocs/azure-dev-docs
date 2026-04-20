---
title: Azure MCP Server tools for Azure Monitor and Workbooks
description: Use Azure MCP Server tools to query Azure Monitor logs and metrics, monitor resource health, and manage Azure Workbooks with natural language prompts from your IDE.
author: diberry
ms.author: diberry
ms.service: azure-mcp-server
ms.date: 04/07/2026
content_well_notification: 
  - AI-contribution
ai-usage: ai-generated
ms.topic: concept-article
ms.custom: build-2025
tool_count for monitor: 16
tool_count for workbooks: 5
ms.reviewer: jong
reviewer: jongio
mcp-cli.version: 2.0.0-beta.39
---
# Azure MCP Server tools for Azure Monitor and Workbooks


The Azure Model Context Protocol (MCP) Server lets you manage Azure Monitor and Workbooks resources with natural language prompts. You can query Log Analytics workspaces, analyze operational data, monitor resource health, retrieve performance metrics, and manage Azure Monitor workbooks.

[Azure Monitor](/azure/azure-monitor/overview) helps you maximize the availability and performance of your applications and services. It provides a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. 

Workbooks provide a flexible canvas for data analysis and the creation of rich visual reports within the Azure portal. They allow you to tap into multiple data sources from across Azure and combine them into unified interactive experiences. Workbooks let you combine multiple kinds of visualizations and analyses, making them great for freeform exploration. For more information, see [Azure Monitor workbooks documentation](/azure/azure-monitor/visualize/workbooks-overview).

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Activity Log: Get activity logs

<!-- @mcpcli monitor activitylog list -->

Lists Azure Monitor activity logs for a specified Azure resource for a given number of past hours. This tool helps you understand resource deployment history, configuration changes, and access patterns. It returns activity log events that include timestamp, operation name, status, and caller information. Use the results to investigate failed deployments, unexpected changes, or access issues.

Example prompts include:

- "List the activity logs for the last '720' hours for resource 'webapp-prod'."

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Required | The name of the Azure resource to retrieve activity logs for. |
| **Event level** |  Optional | The level of activity logs to retrieve. Valid levels are: `Critical`, `Error`, `Informational`, `Verbose`, `Warning`. If not provided, returns all levels. |
| **Hours** |  Optional | The number of hours before now to retrieve activity logs for. |
| **Resource type** |  Optional | The type of the Azure resource (for example, `'Microsoft.Storage/storageAccounts'`). Only provide this if needed to disambiguate between multiple resources with the same name. |
| **Top** |  Optional | The maximum number of activity logs to retrieve. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Web Tests: Create or update web test

<!-- @mcpcli monitor webtests createorupdate -->

Part of the Model Context Protocol (MCP) tooling, this tool creates or updates a standard web test in Azure Monitor to check endpoint availability. You specify monitoring settings such as the URL, frequency, locations, and expected responses. If the test doesn't exist, this tool creates it; otherwise it updates the existing test with the new settings.

Example prompts include:

- "Create a new Standard Web Test with webtest resource 'webtest-prod-availability' in resource group 'rg-prod-monitoring' and associate it with AppInsights component '/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/rg-ai/providers/microsoft.insights/components/appinsights-prod'."
- "Update an existing Standard Web Test for webtest resource 'webtest-prod-availability' in resource group 'rg-prod-monitoring' to link it to AppInsights component '/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/rg-ai/providers/microsoft.insights/components/appinsights-prod'."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **Webtest resource** | Required | The name of the Web Test resource to operate on. |
| **Appinsights component** | Optional | The resource ID of the Application Insights component to associate with the web test. |
| **Description** | Optional | A brief description of the web test. |
| **Enabled** | Optional | Whether the web test is enabled. |
| **Expected status code** | Optional | Expected HTTP status code. |
| **Follow redirects** | Optional | Whether to follow HTTP redirects. |
| **Frequency** | Optional | Test frequency in seconds. Supported values: 300, 600, 900. |
| **Headers** | Optional | HTTP headers to include in the request, as comma-separated KEY=VALUE pairs. |
| **HTTP verb** | Optional | HTTP method to use, for example get or post. |
| **Ignore status code** | Optional | Whether to ignore the status code validation. |
| **Location** | Optional | The location where the web test resource is created. This should match the Application Insights component location. |
| **Parse requests** | Optional | Whether to parse dependent requests. |
| **Request body** | Optional | The body to send with the request. |
| **Request URL** | Optional | The absolute URL to test. |
| **Retry enabled** | Optional | Whether retries are enabled. |
| **SSL check** | Optional | Whether to validate SSL certificates. |
| **SSL lifetime check** | Optional | Number of days to check SSL certificate lifetime. |
| **Timeout** | Optional | Request timeout in seconds. Supported values: 30, 60, 90, 120. |
| **Web test name** | Optional | The name of the test within the web test resource. |
| **Webtest locations** | Optional | Comma-separated list of locations to run the test from. Location refers to the geo-location population tag for Availability Tests. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Web Tests: Get web test

<!-- @mcpcli monitor webtests get -->

This tool gets details for a specific web test or lists all web tests. When you specify the Webtest resource, this tool returns detailed information for that web test. When you don't specify the Webtest resource, this tool returns a list of all web tests in the subscription, and you can filter the list by resource group.

Example prompts include:

- "Get Web Test details for webtest resource 'webtest-prod' in my subscription in resource group 'rg-monitoring'."
- "List all Web Test resources in my subscription."
- "List all Web Test resources in my subscription in resource group 'rg-prod'."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Webtest resource** | Optional | The name of the Web Test resource to operate on. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Log Analytics: List workspaces

<!-- @mcpcli monitor workspace list -->

This tool lists Log Analytics workspaces in a subscription. It retrieves each workspace's name, ID, location, and other key properties. You can use it to identify workspaces before you query their logs or examine workspace settings.

Example prompts include:

- "List Log Analytics workspaces in my subscription."
- "Display my Log Analytics workspaces."
- "Get the Log Analytics workspaces in my subscription."

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Log Analytics: List tables

<!-- @mcpcli monitor table list -->

This tool lists all tables in a Log Analytics workspace. For example, list tables in workspace 'prod-law' in resource group 'rg-monitoring' to preview available columns and data types. It returns table names and schemas you use to build Kusto Query Language (KQL) queries. You can filter by table type, for example `CustomLog` or `AzureMetrics`.

Example prompts include:

- "List all tables in Log Analytics workspace 'prod-law' of table type 'CustomLog' in resource group 'rg-prod'."
- "Show me tables of table type 'AzureMetrics' for workspace 'f1b2c3d4-5678-90ab-cdef-1234567890ab' in resource group 'rg-monitoring'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workspace name** | Optional | The Log Analytics workspace ID or name. This can be either the unique identifier (GUID) or the display name of your workspace. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Log Analytics: Get table types

<!-- @mcpcli monitor table type list -->

This Model Context Protocol (MCP) tool lists available table types in an Azure Log Analytics workspace. It returns the names of the table types. You can use those names when you write queries against Azure Monitor Logs.

Example prompts include:

- "List all available table types in Log Analytics workspace name 'prod-law-01' in resource group 'rg-prod'."
- "What table types are available in Log Analytics workspace name 'analytics-workspace' in resource group 'rg-logs'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group that contains the workspace. |
| **Workspace name** | Required | The name or ID of the Log Analytics workspace. You can use the workspace GUID or the display name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Log Analytics: Query workspace logs

<!-- @mcpcli monitor workspace log query -->

Query logs across an entire Log Analytics workspace using Kusto Query Language (KQL). This tool runs workspace-wide queries that return logs across all resources and tables in the workspace. This tool is part of the Model Context Protocol (MCP) tools. For example, you can ask: 'show all errors in my workspace', 'what happened in my workspace in the last 24 hours', 'list failed requests across the workspace'.

Example prompts include:

- "Show logs with query 'errors' from table 'Syslog' in Log Analytics workspace 'my-workspace' in resource group 'rg-prod'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Query** | Required | The Kusto Query Language (KQL) query to run against the Log Analytics workspace. You can use predefined queries by name: `recent` shows the most recent logs, ordered by TimeGenerated; `errors` shows error-level logs, ordered by TimeGenerated. Or, provide a custom KQL query. |
| **Resource group** | Required | The name of the Azure resource group that contains the workspace. |
| **Table name** | Required | The name of the table to query within the workspace. |
| **Workspace name** | Required | The Log Analytics workspace ID or name. You can provide either the globally unique identifier (GUID) or the display name of the workspace. |
| **Hours** | Optional | The number of hours to query back from now. |
| **Limit** | Optional | The maximum number of results to return. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Log Analytics: Query resource logs

<!-- @mcpcli monitor resource log query -->

Query diagnostic and activity logs for a specific Azure resource in a Log Analytics workspace by using Kusto Query Language (KQL). This tool filters results to the specified resource and runs the provided KQL query against the chosen table. For example, ask "Show logs for resource 'app-monitor' for the last 24 hours."

Example prompts include:

- "Show logs with query 'recent' for resource ID '/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/rg-prod/providers/Microsoft.Compute/virtualMachines/my-vm' in table 'AzureDiagnostics'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Query** | Required | The KQL query to execute against the Log Analytics workspace. You can use predefined queries by name: `recent` shows the most recent logs ordered by TimeGenerated; `errors` shows error-level logs ordered by TimeGenerated. Otherwise, provide a custom KQL query. |
| **Resource ID** | Required | The Azure Resource ID of the resource to query. Example: /subscriptions/&lt;sub&gt;/resourceGroups/&lt;rg&gt;/providers/Microsoft.OperationalInsights/workspaces/&lt;ws&gt;. |
| **Table name** | Required | The name of the table to query within the workspace. |
| **Hours** | Optional | The number of hours to query back from now. |
| **Limit** | Optional | The maximum number of results to return. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Health: Get entity health

<!-- @mcpcli monitor healthmodels entity get -->

This tool retrieves the health status and recent health events for a specific entity in an Azure Monitor health model. The Model Context Protocol (MCP) tool reports application-level health based on custom health models, not basic resource availability. For basic resource availability, use Azure Resource Health or the `azmcp_resourcehealth_availability-status_get` tool. To query logs in a Log Analytics workspace, use `azmcp_monitor_workspace_log_query`. To query logs for a specific Azure resource, use `azmcp_monitor_resource_log_query`.

Example prompts include:

- "Show me the health status of entity 'order-service' using the health model 'app-health-v1' in resource group 'rg-prod'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Entity name** | Required | The entity to get health for. |
| **Health model** | Required | The name of the health model for which to get the health. |
| **Resource group** | Required | The name of the Azure resource group. This resource group is a logical container for Azure resources. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Metrics: Query metrics

<!-- @mcpcli monitor metrics query -->

Query Azure Monitor metrics for a resource. This tool returns time series data for the specified metrics, helping you analyze resource performance and availability. This tool is part of the Model Context Protocol (MCP) tools.

Example prompts include:

- "Analyze performance trends and response times for Application Insights resource 'appinsights-prod' with metrics 'requests/duration' and metric namespace 'microsoft.insights/components'."
- "Check the availability metric 'availabilityResults/availabilityPercentage' for Application Insights resource 'appinsights-staging' using metric namespace 'microsoft.insights/components'?"
- "Get the metric 'requests/duration' with aggregation 'Average' and interval 'PT1M' for resource 'appinsights-prod' using metric namespace 'microsoft.insights/components'."
- "Investigate error rates and failed requests for Application Insights resource 'appinsights-prod' using metrics 'requests/failed,exceptions/count' and metric namespace 'microsoft.insights/components'."
- "Query the metric 'requests/count' for resource type 'Microsoft.Insights/components' resource 'appinsights-qa' with metric namespace 'microsoft.insights/components' and interval 'PT5M'."
- "What's the requests per second rate using metric 'requests/count' with aggregation 'Count' for Application Insights resource 'appinsights-prod' and metric namespace 'microsoft.insights/components'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Metric names** | Required | The names of metrics to query, comma-separated. |
| **Metric namespace** | Required | The metric namespace to query. Obtain this value from the azmcp-monitor-metrics-definitions tool. |
| **Resource name** | Required | The name of the Azure resource to query metrics for. |
| **Aggregation** | Optional | The aggregation type to use, such as Average, Maximum, Minimum, Total, or Count. |
| **End time** | Optional | The end time for the query in ISO format (for example, `2023-01-01T00:00:00Z`). Defaults to now. |
| **Filter** | Optional | The OData filter to apply to the metrics query. |
| **Interval** | Optional | The time interval for data points (for example, `PT1H` for 1 hour, `PT5M` for 5 minutes). |
| **Max buckets** | Optional | The maximum number of time buckets to return. Defaults to 50. |
| **Resource type** | Optional | The Azure resource type (for example, `Microsoft.Storage/storageAccounts`, `Microsoft.Compute/virtualMachines`). If not specified, the tool attempts to infer the type from the resource name. |
| **Start time** | Optional | The start time for the query in ISO format (for example, `2023-01-01T00:00:00Z`). Defaults to 24 hours ago. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Metrics: List metric definitions

<!-- @mcpcli monitor metrics definitions -->

This tool lists metric definitions for an Azure resource. It returns metadata about each metric, including namespaces, descriptions, and aggregation types, so you can determine which metrics to query for a resource.

Example prompts include:

- "Get metric definitions for resource name 'app-insights-prod'."
- "List metric definitions for resource name 'mystorageacct' with resource type 'Microsoft.Storage/storageAccounts' and metric namespace 'Storage'."
- "Show metric definitions for resource name 'vm-prod-01' with search string 'cpu' and limit '20'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource name** | Required | The name of the Azure resource to query metrics for. |
| **Limit** | Optional | The maximum number of metric definitions to return. Defaults to 10. |
| **Metric namespace** | Optional | The metric namespace to query. Obtain this value from the azmcp-monitor-metrics-definitions tool. |
| **Resource type** | Optional | The Azure resource type (for example, `Microsoft.Storage/storageAccounts`, `Microsoft.Compute/virtualMachines`). If you don't specify it, the tool attempts to infer the resource type from the resource name. |
| **Search string** | Optional | A string to filter the metric definitions. The filter performs case-insensitive matching on metric name and description. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Instrumentation: Get learning resource

<!-- @mcpcli monitor instrumentation get-learning-resource -->

This tool lists all available learning resources for Azure Monitor instrumentation, or it retrieves the content of a specific resource by path. By default, the tool returns all resource paths. If you specify a path, the tool returns the full resource content. To instrument an application, use the orchestrator-start tool.

Example prompts include:

- "Get the onboarding learning resource at path 'onboarding/get-started.md'."
- "Show me the content of the Azure Monitor onboarding learning resource at path 'onboarding/quickstart.md'."
- "Retrieve the content of the Azure Monitor learning resource file at path 'samples/instrumentation-guide.html'."
- "List all Azure Monitor onboarding learning resources."
- "Show me all learning resource paths for Azure Monitor instrumentation."
- "Which learning resources are available for Azure Monitor instrumentation onboarding?"

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Path** | Optional | Learning resource path. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ✅

## Instrumentation: Start orchestration

<!-- @mcpcli monitor instrumentation orchestrator-start -->

Start here for Model Context Protocol (MCP) tools that instrument Azure Monitor. This tool analyzes the workspace and returns the first action to execute. After you execute the action, call orchestrator-next to continue. Follow the action in the `instruction` field exactly.

Example prompts include:

- "Start Azure Monitor instrumentation orchestration for workspace path '/home/dev/workspace-monitoring'."
- "Analyze workspace path '/src/projects/my-app-workspace' and return the first Azure Monitor instrumentation step."
- "Begin guided Azure Monitor onboarding for project at workspace path '/workspace/my-app' and give me step one."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Workspace path** | Required | Absolute path to the workspace folder. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

## Instrumentation: Continue orchestration

<!-- @mcpcli monitor instrumentation orchestrator-next -->

Get the next instrumentation action after you complete the current one.

This tool is part of the Model Context Protocol (MCP) suite.

After you execute the exact `instruction` from the previous response, run this tool to receive the next action.

Expected workflow:
1. You receive an action from orchestrator-start or orchestrator-next.
1. You execute the `instruction` field exactly.
1. You run this tool with a concise `Completion note` to get the next action.

Returns: The next action to execute, or `complete` status when all steps are done.

Example prompts include:

- "After completing the previous Azure Monitor instrumentation step, get the next action for session ID 'session-abc123' with completion note 'Added UseAzureMonitor() to Program.cs'."
- "Get the next onboarding action for session ID 'workspace/session-2026' with completion note 'Ran dotnet add package Microsoft.ApplicationInsights'."
- "After finishing the previous instrumentation step, return the next step for session ID 'session-789xyz' with completion note 'Updated appsettings.json to enable Application Insights'."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Completion note** | Required | One sentence describing what you executed, for example, 'Ran dotnet add package command' or 'Added UseAzureMonitor() to Program.cs'. |
| **Session ID** | Required | The workspace path returned as sessionId from orchestrator-start. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

## Instrumentation: Send brownfield analysis

<!-- @mcpcli monitor instrumentation send-brownfield-analysis -->

Sends brownfield code analysis findings after `orchestrator-start` returns status `analysis_needed`. This tool is part of the Model Context Protocol (MCP) workflow. You must scan the workspace source files and fill in the analysis template before you call this tool. After this tool succeeds, continue with `orchestrator-next`.

Example prompts include:

- "Send brownfield code analysis findings JSON '{"serviceOptions":null,"initializers":null,"processors":null,"clientUsage":null,"sampling":{"found":false,"hasCustomSampling":false},"telemetryPipeline":null,"logging":null}' to Azure Monitor instrumentation session 'workspace-7a3b' after analysis was requested."
- "Continue migration orchestration by submitting findings JSON '{"serviceOptions":{"found":true,"details":"AddApplicationInsightsTelemetry used"},"initializers":[],"processors":[],"clientUsage":null,"sampling":{"found":false,"hasCustomSampling":false},"telemetryPipeline":null,"logging":null}' to session 'sess-01234'."
- "Send completed brownfield telemetry analysis as findings JSON '{"serviceOptions":null,"initializers":null,"processors":null,"clientUsage":{"found":true},"sampling":{"found":false,"hasCustomSampling":false},"telemetryPipeline":null,"logging":{"found":true}}' for onboarding session 'session-9f3b'."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Findings JSON** | Required | JSON object with brownfield analysis findings. Required properties: serviceOptions (service options findings from analyzing AddApplicationInsightsTelemetry() call, null if not found), initializers (telemetry initializer findings from analyzing ITelemetryInitializer or IConfigureOptions&lt;TelemetryConfiguration&gt; implementations, null if none found), processors (telemetry processor findings from analyzing ITelemetryProcessor implementations, null if none found), clientUsage (TelemetryClient usage findings from analyzing direct TelemetryClient usage, null if not found), sampling (custom sampling configuration findings, null if no custom sampling), telemetryPipeline (custom ITelemetryChannel or TelemetrySinks usage findings, null if not found), logging (explicit logger provider and filter findings, null if not found). For sections that don't exist in the codebase, pass an empty default object, for example found: `false` or hasCustomSampling: `false`, instead of null. |
| **Session ID** | Required | The workspace path returned as `sessionId` from `orchestrator-start`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

## Instrumentation: Send enhancement selection

<!-- @mcpcli monitor instrumentation send-enhancement-select -->

Submit the user's enhancement selection after `orchestrator-start` returns status `enhancement_available`. Present the enhancement choices to the user, then call this tool with the chosen enhancement keys. You can select multiple enhancements by passing a comma-separated list, for example, `redis,processors`. After this tool succeeds, continue with `orchestrator-next`.

Example prompts include:

- "Submit enhancement keys 'redis,processors' for Azure Monitor instrumentation session ID 'workspaces/my-app/session-abc123'."
- "Continue instrumentation enhancement flow by sending enhancement keys 'redis' to session ID 'workspaces/prod-app/session-789'."
- "Send chosen enhancement keys 'entityframework,otlp' for onboarding session ID 'workspaces/onboard/session-456'."

| Parameter | Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Enhancement keys** | Required | One or more enhancement keys, comma-separated (for example, `redis`, `redis,processors`, `entityframework,otlp`). |
| **Session ID** | Required | The workspace path returned as `sessionId` from `orchestrator-start`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ✅

## Workbooks: List workbooks

<!-- @mcpcli workbooks list -->

Search Azure Workbooks using Resource Graph for fast metadata queries. This tool helps you discover, filter, and count workbooks across different scopes.

It returns workbook metadata, including `id`, `name`, `location`, `category`, and timestamps. By default, it doesn't return full workbook content (`serializedData`) — use the show tool for that, or set `Output format` to `full`.

By default, the search targets workbooks in your current Azure context (tenant/subscription). You can use `Resource group` to explicitly specify your search scope. The tool returns the server-side total count by default. The maximum results returned is 50, with a maximum limit of 1000; adjust this with `Max results`. Choose `Output format` as `summary` for minimal tokens or `full` for complete `serializedData` output.

Example prompts include:

- "Show me all workbooks in resource group 'monitoring-rg'."
- "List the shared workbooks in resource group 'prod-rg'."
- "What workbooks were modified after 2024-01-15 in resource group 'analytics-rg'?"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Optional | The name of the Azure resource group to scope the search. |
| **Category** | Optional | Filter workbooks by category (for example, `workbook`, `sentinel`, `TSG`). If not specified, all categories are returned. |
| **Include total count** | Optional | Include the total count of all matching workbooks in the response (default: true). |
| **Kind** | Optional | Filter workbooks by kind (for example, `shared`, `user`). If not specified, all kinds are returned. |
| **Max results** | Optional | Maximum number of results to return (default: 50, max: 1000). |
| **Modified after** | Optional | Filter workbooks modified after this date (ISO 8601 format, for example, `2024-01-15`). |
| **Name contains** | Optional | Filter workbooks where the display name contains this text (case-insensitive). |
| **Output format** | Optional | Output format: `summary` (ID and name only, minimal tokens), `standard` (metadata without content, default), `full` (includes `serializedData`). |
| **Source ID** | Optional | Filter workbooks by source resource ID (for example, `/subscriptions/abc123/resourceGroups/prod/providers/Microsoft.Insights/components/myapp`). If not specified, all workbooks are returned. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Workbooks: Show workbook details

<!-- @mcpcli workbooks show -->

Retrieve full workbook details via the Azure Resource Manager (ARM) API, including the `serializedData` content. This command lets you get the complete workbook definition, including the visualization JSON.

It returns full workbook properties, `serializedData`, tags, and `ETag`. You can provide multiple `Workbook IDs` for batch operations. The command reports partial failures for individual workbooks. For better performance, use the list tool to discover workbooks first, then use show for specific workbooks.

Example prompts include:

- "Show me the details of the workbook with resource ID '/subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1'."
- "Get the full definition of the workbook '/subscriptions/xyz789/resourceGroups/prod-rg/providers/Microsoft.Insights/workbooks/b1b1b1b1-cccc-dddd-eeee-f2f2f2f2f2f2'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook IDs** | Required | The Azure resource IDs of the workbooks to retrieve. Supports multiple values for batch operations. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ❌ | Idempotent: ✅ | Open World: ❌ | Read Only: ✅ | Secret: ❌ | Local Required: ❌

## Workbooks: Create workbook

<!-- @mcpcli workbooks create -->

Create a new workbook in the specified resource group and subscription. You can set the display name and the serialized JSON content for the workbook. This command returns the created workbook information upon successful completion.

Example prompts include:

- "Create a new workbook named 'Performance Dashboard' in resource group 'monitoring-rg' with the serialized content for a basic notebook."
- "Create a workbook called 'Infrastructure Overview' in resource group 'prod-rg' with content showing VM metrics."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Display name** | Required | The display name of the workbook. |
| **Resource group** | Required | The name of the Azure resource group containing the workbook. |
| **Serialized content** | Required | The serialized JSON content of the workbook. |
| **Source ID** | Optional | The linked resource ID for the workbook. By default, this is `azure monitor`. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ❌ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Workbooks: Update workbook

<!-- @mcpcli workbooks update -->

Update properties of an existing Azure workbook by adding new steps, modifying content, or changing the display name. This action returns the updated workbook details. You need the workbook resource ID and can specify either new serialized content or a new display name.

Example prompts include:

- "Update the workbook '/subscriptions/abc123/resourceGroups/monitoring-rg/providers/Microsoft.Insights/workbooks/a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1' with display name 'Monthly Report'."
- "Change the serialized content of workbook '/subscriptions/xyz789/resourceGroups/prod-rg/providers/Microsoft.Insights/workbooks/b1b1b1b1-cccc-dddd-eeee-f2f2f2f2f2f2' to include a new metrics chart."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The Azure resource ID of the workbook to update. |
| **Display name** | Optional | The display name of the workbook. |
| **Serialized content** | Optional | The JSON serialized content of the workbook. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Workbooks: Delete workbooks

<!-- @mcpcli workbooks delete -->

Delete one or more workbooks by their Azure resource IDs. This command performs a soft delete on workbooks, retaining them for 90 days. You can restore them from the Recycle Bin through the Azure portal if needed.

For batch operations, you can provide multiple `Workbook IDs` values. The command reports partial failures per workbook, ensuring that individual failures don't affect the entire batch operation.

To learn more, see [Manage Azure Monitor workbooks](/azure/azure-monitor/visualize/workbooks-manage).

Example prompts include:

- "Delete the workbook with resource ID '/subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/a0a0a0a0-bbbb-cccc-dddd-e1e1e1e1e1e1'."
- "Remove the workbooks with resource IDs '/subscriptions/xyz789/resourceGroups/prod-rg/providers/Microsoft.Insights/workbooks/b1b1b1b1-cccc-dddd-eeee-f2f2f2f2f2f2' and '/subscriptions/def456/resourceGroups/analytics-rg/providers/Microsoft.Insights/workbooks/c2c2c2c2-dddd-eeee-ffff-a3a3a3a3a3a3'."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook IDs** | Required | The Azure resource IDs of the workbooks to delete. Supports multiple values for batch operations. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

Destructive: ✅ | Idempotent: ✅ | Open World: ❌ | Read Only: ❌ | Secret: ❌ | Local Required: ❌

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Monitor](/azure/azure-monitor/overview)
- [Application Insights](/azure/azure-monitor/app/app-insights-overview)
- [Workbooks in Azure Monitor](/azure/azure-monitor/visualize/workbooks-overview)
- [Metrics in Azure Monitor](/azure/azure-monitor/platform/tutorial-metrics)
