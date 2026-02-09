---
title: Azure Monitor Tools 
description: "Use the Azure MCP Server with Azure Monitor to query Log Analytics workspaces, analyze metrics, and manage workbooks using natural language prompts."
keywords: azure mcp server, azmcp, azure monitor, log analytics
author: diberry
ms.author: diberry
ms.date: 12/05/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: concept-article
ms.custom: build-2025
--- 
# Azure Monitor tools for the Azure MCP Server overview

The Azure MCP Server allows you to manage Azure Monitor resources using natural language prompts. You can query Log Analytics workspaces, analyze operational data, monitor resource health, retrieve performance metrics, and manage Azure Monitor workbooks without needing to know complex KQL syntax.

[Azure Monitor](/azure/azure-monitor/overview) helps you maximize the availability and performance of your applications and services. It provides a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Activity Log: List activity log

<!-- monitor activitylog list -->

List activity logs for the specified Azure resource over the given prior number of hours.

Example prompts include:

- **Recent critical events**: "Show activity logs for resource 'web-app-prod' for the last 4 hours with Critical and Error events only"
- **Storage account activity**: "Get activity logs for resource 'mystorageaccount' of type 'Microsoft.Storage/storageAccounts' from the last 24 hours, limit to top 50 entries"
- **VM monitoring**: "List all activity logs for resource 'production-vm01' from the past 12 hours"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Required | The name of the Azure resource to retrieve activity logs for. |
| **Resource type** |  Optional | The type of the Azure resource (for example, `Microsoft.Storage/storageAccounts`). Only provide this if needed to disambiguate between multiple resources with the same name. |
| **Hours** |  Optional | The number of hours prior to now to retrieve activity logs for. |
| **Event level** |  Optional | The level of activity logs to retrieve. Valid levels are: Critical, Error, Informational, Verbose, Warning. If not provided, returns all levels. |
| **Top** |  Optional | The maximum number of activity logs to retrieve. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor activitylog list](../includes/tools/annotations/azure-monitor-activity-log-list-annotations.md)]

## Web Tests: Create web tests

<!-- monitor webtests create -->

Create a new standard web test in Azure Monitor. Ping/Multistep web tests are deprecated and aren't supported.

Example prompts include:

- **Basic web test**: "Create web test 'api-health-check' in resource group 'my-resource-group' for Application Insights '/subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/components/myapp-insights' in East US location, testing URL 'https://api.mycompany.com/health' from locations 'us-east-2-azr,us-west-2-azr'"
- **Custom frequency test**: "Create web test 'homepage-monitor' in resource group 'my-resource-group' for Application Insights '/subscriptions/xyz789/resourceGroups/prod/providers/Microsoft.Insights/components/web-insights' in West Europe, testing 'https://www.mysite.com' from 'eu-west-1-azr,eu-north-1-azr' locations with frequency 300 seconds and timeout 60 seconds"
- **POST request test**: "Create web test 'login-endpoint' in resource group 'my-resource-group' for Application Insights '/subscriptions/def456/resourceGroups/test/providers/Microsoft.Insights/components/test-insights' in Central US, testing 'https://api.myapp.com/login' from 'us-central-azr,us-south-central-azr' with HTTP verb 'post', request body '{\"username\":\"test\"}', and headers 'Content-Type=application/json'"
- **SSL monitoring test**: "Create web test 'secure-api-check' in resource group 'my-resource-group' for Application Insights '/subscriptions/ghi789/resourceGroups/security/providers/Microsoft.Insights/components/security-insights' in Australia East, testing 'https://secure.myservice.com/api' from 'au-east-azr,au-southeast-azr' with SSL check enabled, SSL lifetime check 30 days, and expected status code 200"
- **Comprehensive test**: "Create web test 'ecommerce-checkout' in resource group 'my-resource-group' for Application Insights '/subscriptions/jkl012/resourceGroups/ecommerce/providers/Microsoft.Insights/components/shop-insights' in North Europe, testing 'https://shop.mystore.com/checkout' from 'eu-north-1-azr,eu-west-1-azr,eu-central-1-azr' with description 'Monitor checkout process', frequency 900 seconds, follow redirects enabled, parse requests enabled, retry enabled, and timeout 120 seconds"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Webtest resource** |  Required | The name of the Web Test resource to operate on. |
| **Appinsights component** |  Required | The resource ID of the Application Insights component to associate with the web test. |
| **Location** |  Required | The location where the web test resource is created. This should be the same as the AppInsights component location. |
| **Webtest locations** |  Required | List of locations to run the test from (comma-separated values). Location refers to the geo-location population tag specific to Availability Tests. |
| **Request URL** |  Required | The absolute URL to test. |
| **Webtest** |  Optional | The name of the test in web test resource. |
| **Description** |  Optional | The description of the web test. |
| **Enabled** |  Optional | Whether the web test is enabled. |
| **Expected status code** |  Optional | Expected HTTP status code. |
| **Follow redirects** |  Optional | Whether to follow redirects. |
| **Frequency** |  Optional | Test frequency in seconds. Supported values `300`, `600`, `900` seconds. |
| **Headers** |  Optional | HTTP headers to include in the request. Comma-separated KEY=VALUE. |
| **HTTP verb** |  Optional | HTTP method (examples are: `get`, `post`). |
| **Ignore status code** |  Optional | Whether to ignore the status code validation. |
| **Parse requests** |  Optional | Whether to parse dependent requests. |
| **Request body** |  Optional | The body of the request. |
| **Retry enabled** |  Optional | Whether retries are enabled. |
| **SSL check** |  Optional | Whether to check SSL certificates. |
| **SSL lifetime check** |  Optional | Number of days to check SSL certificate lifetime. |
| **Timeout** |  Optional | Request timeout in seconds (max 2 minutes). Supported values: `30`, `60`, `90`, `120` seconds. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor webtests create](../includes/tools/annotations/azure-monitor-web-tests-create-annotations.md)]

## Web Tests: Get web tests

<!-- monitor webtests get -->

Get details for a specific web test in the provided resource group based on webtest resource name.

Example prompts include:

- **Get test details**: "Get details for web test 'api-health-check' in resource group 'my-resource-group'"
- **View test configuration**: "Show me the configuration of web test 'homepage-monitor' in resource group 'my-resource-group'"
- **Check test status**: "Get information about web test 'login-endpoint' in resource group 'my-resource-group'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Webtest resource** |  Required | The name of the Web Test resource to operate on. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor webtests get](../includes/tools/annotations/azure-monitor-web-tests-get-annotations.md)]

## Web Tests: List web tests

<!-- monitor webtests list -->

List all web tests in a specified subscription and optionally, a resource group.

Example prompts include:

- **List all tests**: "List all web tests in my subscription"
- **View tests by resource group**: "Show web tests in the 'monitoring' resource group"
- **Get test inventory**: "What web tests do I have configured?"

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor webtests list](../includes/tools/annotations/azure-monitor-web-tests-list-annotations.md)]

## Web Tests: Update web tests

<!-- monitor webtests update -->

Update an existing standard web test in Azure Monitor. Ping/Multistep web tests are deprecated and aren't supported.

Example prompts include:

- **Update test frequency**: "Update web test 'api-health-check' in resource group 'my-resource-group' to run every 300 seconds"
- **Change test URL**: "Update web test 'homepage-monitor' in resource group 'my-resource-group' to test URL 'https://www.newsite.com' with timeout 90 seconds"
- **Modify test configuration**: "Update web test 'login-endpoint' in resource group 'my-resource-group' with new headers 'Authorization=Bearer token123' and expected status code 201"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Webtest resource** |  Required | The name of the Web Test resource to operate on. |
| **Appinsights component** |  Optional | The resource ID of the Application Insights component to associate with the web test. |
| **Location** |  Optional | The location where the web test resource is created. This should be the same as the AppInsights component location. |
| **Webtest locations** |  Optional | List of locations to run the test from (comma-separated values). Location refers to the geo-location population tag specific to Availability Tests. |
| **Request URL** |  Optional | The absolute URL to test. |
| **Webtest** |  Optional | The name of the test in web test resource. |
| **Description** |  Optional | The description of the web test. |
| **Enabled** |  Optional | Whether the web test is enabled. |
| **Expected status code** |  Optional | Expected HTTP status code. |
| **Follow redirects** |  Optional | Whether to follow redirects. |
| **Frequency** |  Optional | Test frequency in seconds. Supported values 300, 600, 900 seconds. |
| **Headers** |  Optional | HTTP headers to include in the request. Comma-separated KEY=VALUE. |
| **HTTP verb** |  Optional | HTTP method (get, post, etc.). |
| **Ignore status code** |  Optional | Whether to ignore the status code validation. |
| **Parse requests** |  Optional | Whether to parse dependent requests. |
| **Request body** |  Optional | The body of the request. |
| **Retry enabled** |  Optional | Whether retries are enabled. |
| **SSL check** |  Optional | Whether to check SSL certificates. |
| **SSL lifetime check** |  Optional | Number of days to check SSL certificate lifetime. |
| **Timeout** |  Optional | Request timeout in seconds (max 2 minutes). Supported values: 30, 60, 90, 120 seconds. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor webtests update](../includes/tools/annotations/azure-monitor-web-tests-update-annotations.md)]

## Log Analytics: List workspaces

<!-- monitor workspace list -->

The Azure MCP Server lists all Log Analytics workspaces in a subscription. This provides an overview of your monitoring resources.

Example prompts include:

- **List workspaces**: "Show me all Log Analytics workspaces in my subscription."
- **View workspaces**: "What workspaces do I have?"
- **Find workspaces**: "List monitoring workspaces."

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor workspace list](../includes/tools/annotations/azure-monitor-workspace-list-annotations.md)]

## Log Analytics: List table types

<!-- monitor table type list -->

Lists available table types in a Log Analytics workspace. 

Example prompts include:

- **List table types**: "Show me table types in the centralmonitoring workspace in resource group 'my-resource-group'"
- **View available types**: "What table types are available in my Log Analytics workspace in resource group 'my-resource-group'?"
- **Find table categories**: "List table types for security-logs workspace in resource group 'my-resource-group'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Workspace** | Required | The Log Analytics workspace ID or name. This can be either the unique identifier (GUID) or the display name of your workspace. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor table type list](../includes/tools/annotations/azure-monitor-table-type-list-annotations.md)]

## Log Analytics: List tables

<!-- monitor table list -->

The Azure MCP Server lists all tables in a Log Analytics workspace. This helps you understand the data available for querying.

Example prompts include:

- **List tables**: "Show tables in centralmonitoring workspace in resource group 'my-resource-group'"
- **View tables**: "What tables are in workspace app-monitoring in resource group 'my-resource-group'?"
- **Find tables**: "List tables in security-logs workspace in resource group 'my-resource-group'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Workspace** | Required | The Log Analytics workspace ID or name. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor table list](../includes/tools/annotations/azure-monitor-table-list-annotations.md)]

## Log Analytics: Query workspace logs

<!-- monitor workspace log query -->

The Azure MCP Server can execute Kusto Query Language (KQL) queries against a Log Analytics workspace. This powerful feature allows you to analyze your operational data.

Example prompts include:

- **Simple query**: "Query table 'AzureDiagnostics' with query 'AzureDiagnostics | where Level == "Error" | take 100' in workspace 'app-monitoring' in resource group 'monitoring-rg' for last 1 hour"
- **Filter query**: "Query table 'SecurityEvent' with query 'SecurityEvent | where EventID == 4625 | project TimeGenerated, Account, Computer' in workspace 'security-workspace' in resource group 'security-rg'"
- **Complex query**: "Query table 'Perf' with query 'Perf | where CounterName == "% Processor Time" and Computer contains "web" | summarize avg(CounterValue) by bin(TimeGenerated, 1h)' in workspace 'monitoring-workspace' in resource group 'prod-rg' for last 24 hours"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Workspace** | Required | The Log Analytics workspace ID or name. |
| **Table** | Required | The name of the table to query. |
| **Query** | Required | The KQL query to execute against the Log Analytics workspace. |
| **Hours** | Optional | The number of hours to query back from now. |
| **Limit** | Optional | The maximum number of results to return. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor workspace log query](../includes/tools/annotations/azure-monitor-workspace-log-query-annotations.md)]

## Log Analytics: Query resource logs

<!-- monitor resource log query -->

Queries diagnostic and activity logs for a specific Azure resource in a Log Analytics workspace using Kusto Query Language (KQL). 

Example prompts include:

- **Query recent logs**: "Query table 'AppServiceConsoleLogs' with query 'recent' for resource '/subscriptions/abc123/resourceGroups/prod/providers/Microsoft.Web/sites/myapp'"
- **Find errors**: "Query table 'AppServiceHTTPLogs' with query 'errors' for resource '/subscriptions/abc123/resourceGroups/prod/providers/Microsoft.Web/sites/mywebapp' in the last 4 hours"
- **Resource diagnostics**: "Query table 'StorageBlobLogs' with query 'StorageBlobLogs | take 100' for resource '/subscriptions/abc123/resourceGroups/prod/providers/Microsoft.Storage/storageAccounts/mystorage' with limit 100"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource ID** | Required | The Azure Resource ID to query logs. Example: `/subscriptions/<YOUR-SUBSCRIPTION-ID>/resourceGroups/<YOUR-RESOURCE-GROUP>/providers/Microsoft.OperationalInsights/workspaces/<YOUR-WORKSPACE>`. |
| **Table** | Required | The name of the table to query. This is the specific table within the workspace. |
| **Query** | Required | The KQL query to execute against the Log Analytics workspace. You can use predefined queries by name such as `recent` which shows most recent logs ordered by TimeGenerated and `errors` which shows error-level logs ordered by TimeGenerated. Otherwise, provide a custom KQL query. |
| **Hours** | Optional | The number of hours to query back from now. |
| **Limit** | Optional | The maximum number of results to return. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor resource log query](../includes/tools/annotations/azure-monitor-resource-log-query-annotations.md)]

## Health: Get entity health

<!-- monitor healthmodels entity get -->

The Azure MCP Server gets the health status of an entity using Azure Monitor health models. This provides comprehensive health information and monitoring status for Azure resources and applications.

Example prompts include:

- **Check entity health**: "Get health for entity 'app-prod-001' with model 'webapp-health' in resource group 'prod-rg'"
- **Monitor resource health**: "What's the health of entity 'web-app-prod' using model 'application-health' in resource group 'monitoring-rg'?"
- **Check system status**: "Get health info for entity 'sql-prod-db' with model 'database-health' in resource group 'data-rg'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** |  Required | The name of the Azure resource group. This is a logical container for Azure resources. |
| **Model** | Required | The name of the health model. |
| **Entity** | Required | The entity ID to get health for. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor healthmodels entity get](../includes/tools/annotations/azure-monitor-health-models-entity-get-annotations.md)]

## Metrics: Query metrics

<!-- monitor metrics query -->

The Azure MCP Server queries Azure Monitor metrics for resources. This allows you to retrieve performance metrics, usage statistics, and monitoring data for your Azure resources over specified time periods.

Example prompts include:

- **Query VM metrics**: "Get metrics 'Percentage CPU,Available Memory Bytes' with namespace 'Microsoft.Compute/virtualMachines' for resource 'prod-vm01' from January 1 to January 2"
- **Query storage metrics**: "Show metrics 'Transactions,Availability' with namespace 'Microsoft.Storage/storageAccounts' for resource 'mystorageaccount'"
- **Query app metrics**: "Get metrics 'ResponseTime,Requests' with namespace 'Microsoft.Web/sites' for resource 'mywebapp' last 24 hours"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource** | Required | The name of the resource to query metrics for. |
| **Metric namespace** | Required | The metric namespace. |
| **Metrics** | Required | The metric names to query. |
| **Resource type** | Optional | The type of the resource. |
| **Start time** | Optional | The start time for the query. |
| **End time** | Optional | The end time for the query. |
| **Interval** | Optional | The interval for aggregation. |
| **Aggregation** | Optional | The aggregation method. |
| **Filter** | Optional | Filter for the metrics query. |
| **Max buckets** | Optional | Maximum number of buckets. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor metrics query](../includes/tools/annotations/azure-monitor-metrics-query-annotations.md)]

## Metrics: List metric definitions

<!-- monitor metrics definitions -->

The Azure MCP Server lists available metric definitions for a resource. This helps you discover what metrics are available for monitoring before querying specific metric data.

Example prompts include:

- **List storage metrics**: "Show metrics for mystorageaccount."
- **Find transaction metrics**: "Find transaction metrics for storageacct."
- **List VM metrics**: "List metrics for prod-vm in production group."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource name** | Required | The name of the resource. |
| **Resource type** | Optional | The type of the resource. |
| **Metric namespace** | Optional | The metric namespace. |
| **Search string** | Optional | Search string to filter metrics. |
| **Limit** | Optional | Maximum number of results to return. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [monitor metrics definitions](../includes/tools/annotations/azure-monitor-metrics-definitions-annotations.md)]

## Workbooks: List workbooks

<!-- workbooks list -->

The Azure MCP Server lists Azure Monitor workbooks in a resource group. This helps you discover and manage your monitoring dashboards and interactive reports.

Example prompts include:

- **List workbooks**: "Show workbooks in resource group 'my-resource-group'"
- **List by category**: "List workbooks in Insights category in resource group 'my-resource-group'"
- **List shared workbooks**: "Show shared workbooks in resource group 'my-resource-group'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **Category** | Optional | The category to filter workbooks by. |
| **Kind** | Optional | The kind of workbook (such as `shared`, `user`). |
| **Source ID** | Optional | The source resource ID to filter workbooks by. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [workbooks list](../includes/tools/annotations/azure-workbooks-list-annotations.md)]

## Workbooks: Show workbook details

<!-- workbooks show -->

The Azure MCP Server shows details of a specific Azure Monitor workbook by its resource ID. This provides comprehensive information about the workbook's configuration and content.

Example prompts include:

- **Show workbook**: "Show workbook details for '/subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/12345678-1234-1234-1234-123456789abc'"
- **Get workbook info**: "Get info about workbook '/subscriptions/xyz789/resourceGroups/prod-rg/providers/Microsoft.Insights/workbooks/87654321-4321-4321-4321-cba987654321'"
- **View workbook**: "Display workbook details for '/subscriptions/def456/resourceGroups/analytics-rg/providers/Microsoft.Insights/workbooks/abcdef12-ab12-ab12-ab12-abcdefabcdef'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to retrieve. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [workbooks show](../includes/tools/annotations/azure-workbooks-show-annotations.md)]

## Workbooks: Create workbook

<!-- workbooks create -->

The Azure MCP Server can create a new Azure Monitor workbook. This allows you to programmatically create monitoring dashboards and interactive reports.

Example prompts include:

- **Create workbook**: "Create workbook with display name 'Performance Dashboard' and serialized content '{\"version\":\"Notebook/1.0\",\"items\":[]}' in resource group 'monitoring-rg'"
- **Create with source**: "Create workbook with display name 'App Insights Analysis' and serialized content '{\"version\":\"Notebook/1.0\",\"items\":[]}' linked to source '/subscriptions/abc123/resourceGroups/prod/providers/Microsoft.Insights/components/myappinsights'"
- **Create monitoring workbook**: "Create new workbook with display name 'Infrastructure Overview' and serialized content '{\"version\":\"Notebook/1.0\",\"items\":[{\"type\":1,\"content\":{\"json\":\"## Infrastructure Metrics\"}}]}'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Display** | Required | The display name for the new workbook. |
| **Serialized content** | Required | The JSON content defining the workbook structure and queries. |
| **Source ID** | Optional | The source resource ID to associate with the workbook. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [workbooks create](../includes/tools/annotations/azure-workbooks-create-annotations.md)]

## Workbooks: Update workbook


<!-- workbooks update -->

The Azure MCP Server updates an existing Azure Monitor workbook. This allows you to modify workbook properties and content programmatically.

Example prompts include:

- **Update name**: "Update workbook '/subscriptions/abc123/resourceGroups/monitoring-rg/providers/Microsoft.Insights/workbooks/12345678-1234-1234-1234-123456789abc' with display name 'Updated Dashboard'"
- **Update content**: "Update workbook '/subscriptions/xyz789/resourceGroups/prod-rg/providers/Microsoft.Insights/workbooks/87654321-4321-4321-4321-cba987654321' with serialized content '{\"version\":\"Notebook/1.0\",\"items\":[]}'"
- **Modify workbook**: "Change display name to 'Analytics Dashboard' and serialized content '{\"version\":\"Notebook/1.0\",\"items\":[]}' for workbook '/subscriptions/def456/resourceGroups/analytics-rg/providers/Microsoft.Insights/workbooks/abcdef12-ab12-ab12-ab12-abcdefabcdef'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to update. |
| **Display** | Optional | The new display name for the workbook. |
| **Serialized content** | Optional | The updated JSON content for the workbook. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [workbooks update](../includes/tools/annotations/azure-workbooks-update-annotations.md)]

## Workbooks: Delete workbooks

<!-- workbooks delete -->

The Azure MCP Server deletes an Azure Monitor workbook. This permanently removes the workbook and all its associated content.

Example prompts include:

- **Delete workbook**: "Delete workbook '/subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/12345678-1234-1234-1234-123456789abc'"
- **Remove workbook**: "Remove workbook '/subscriptions/xyz789/resourceGroups/prod-rg/providers/Microsoft.Insights/workbooks/87654321-4321-4321-4321-cba987654321'"
- **Clean up**: "Remove workbook '/subscriptions/def456/resourceGroups/analytics-rg/providers/Microsoft.Insights/workbooks/abcdef12-ab12-ab12-ab12-abcdefabcdef'"

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to delete. |

[Tool annotation hints](index.md#tool-annotations-for-azure-mcp-server):

[!INCLUDE [workbooks delete](../includes/tools/annotations/azure-workbooks-delete-annotations.md)]

## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Monitor](/azure/azure-monitor/overview)
- [Application Insights](/azure/azure-monitor/app/app-insights-overview)
- [Workbooks in Azure Monitor](/azure/azure-monitor/visualize/workbooks-overview)
- [Metrics in Azure Monitor](/azure/azure-monitor/platform/tutorial-metrics)
