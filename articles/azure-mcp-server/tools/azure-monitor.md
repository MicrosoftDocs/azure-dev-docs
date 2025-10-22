---
title: Azure Monitor Tools 
description: "Use the Azure MCP Server with Azure Monitor to query Log Analytics workspaces, analyze metrics, and manage workbooks using natural language prompts."
keywords: azure mcp server, azmcp, azure monitor, log analytics
author: diberry
ms.author: diberry
ms.date: 10/22/2025
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
ms.topic: reference
ms.custom: build-2025
--- 
# Azure Monitor tools for the Azure MCP Server

The Azure MCP Server allows you to manage Azure Monitor resources using natural language prompts. You can query Log Analytics workspaces, analyze operational data, monitor resource health, retrieve performance metrics, and manage Azure Monitor workbooks without needing to know complex KQL syntax.

[Azure Monitor](/azure/azure-monitor/overview) helps you maximize the availability and performance of your applications and services. It provides a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

[!INCLUDE [tip-about-params](../includes/tools/parameter-consideration.md)]

## Activity Log: List activity log

List activity logs for the specified Azure resource over the given prior number of hours.

Example prompts include:

- **Recent critical events**: "Show activity logs for my 'web-app-prod' resource for the last 4 hours with Critical and Error events only"
- **Storage account activity**: "Get activity logs for 'mystorageaccount' resource of type 'Microsoft.Storage/storageAccounts' from the last 24 hours, limit to top 50 entries"
- **VM monitoring**: "List all activity logs for my 'production-vm01' virtual machine from the past 12 hours"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Resource name** |  Required | The name of the Azure resource to retrieve activity logs for. |
| **Resource type** |  Optional | The type of the Azure resource (for example, 'Microsoft.Storage/storageAccounts'). Only provide this if needed to disambiguate between multiple resources with the same name. |
| **Hours** |  Optional | The number of hours prior to now to retrieve activity logs for. |
| **Event level** |  Optional | The level of activity logs to retrieve. Valid levels are: Critical, Error, Informational, Verbose, Warning. If not provided, returns all levels. |
| **Top** |  Optional | The maximum number of activity logs to retrieve. |

## Web Tests: Create web tests

Create a new standard web test in Azure Monitor. Ping/Multistep web tests are deprecated and aren't supported.

Example prompts include:

- **Basic web test**: "Create web test 'api-health-check' for Application Insights '/subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/components/myapp-insights' in East US location, testing URL 'https://api.mycompany.com/health' from locations 'us-east-2-azr,us-west-2-azr'"
- **Custom frequency test**: "Create web test 'homepage-monitor' for Application Insights '/subscriptions/xyz789/resourceGroups/prod/providers/Microsoft.Insights/components/web-insights' in West Europe, testing 'https://www.mysite.com' from 'eu-west-1-azr,eu-north-1-azr' locations with frequency 300 seconds and timeout 60 seconds"
- **POST request test**: "Create web test 'login-endpoint' for Application Insights '/subscriptions/def456/resourceGroups/test/providers/Microsoft.Insights/components/test-insights' in Central US, testing 'https://api.myapp.com/login' from 'us-central-azr,us-south-central-azr' with HTTP verb 'post', request body '{\"username\":\"test\"}', and headers 'Content-Type=application/json'"
- **SSL monitoring test**: "Create web test 'secure-api-check' for Application Insights '/subscriptions/ghi789/resourceGroups/security/providers/Microsoft.Insights/components/security-insights' in Australia East, testing 'https://secure.myservice.com/api' from 'au-east-azr,au-southeast-azr' with SSL check enabled, SSL lifetime check 30 days, and expected status code 200"
- **Comprehensive test**: "Create web test 'ecommerce-checkout' for Application Insights '/subscriptions/jkl012/resourceGroups/ecommerce/providers/Microsoft.Insights/components/shop-insights' in North Europe, testing 'https://shop.mystore.com/checkout' from 'eu-north-1-azr,eu-west-1-azr,eu-central-1-azr' with description 'Monitor checkout process', frequency 900 seconds, follow redirects enabled, parse requests enabled, retry enabled, and timeout 120 seconds"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
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

## Web Tests: Get web tests

Get details for a specific web test in the provided resource group based on webtest resource name.

Example prompts include:

- **Get test details**: "Get details for web test 'api-health-check'"
- **View test configuration**: "Show me the configuration of web test 'homepage-monitor'"
- **Check test status**: "Get information about web test 'login-endpoint'"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
| **Webtest resource** |  Required | The name of the Web Test resource to operate on. |


## Web Tests: List web tests

List all web tests in a specified subscription and optionally, a resource group.

Example prompts include:

- **List all tests**: "List all web tests in my subscription"
- **View tests by resource group**: "Show web tests in the 'monitoring' resource group"
- **Get test inventory**: "What web tests do I have configured?"

## Web Tests: Update web tests

Update an existing standard web test in Azure Monitor. Ping/Multistep web tests are deprecated and aren't supported.

Example prompts include:

- **Update test frequency**: "Update web test 'api-health-check' to run every 300 seconds"
- **Change test URL**: "Update web test 'homepage-monitor' to test URL 'https://www.newsite.com' with timeout 90 seconds"
- **Modify test configuration**: "Update web test 'login-endpoint' with new headers 'Authorization=Bearer token123' and expected status code 201"

| Parameter |  Required or optional | Description |
|-----------------------|----------------------|-------------|
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

## Log Analytics: List workspaces

The Azure MCP Server lists all Log Analytics workspaces in a subscription. This provides an overview of your monitoring resources.

Example prompts include:

- **List workspaces**: "Show me all Log Analytics workspaces in my subscription."
- **View workspaces**: "What workspaces do I have?"
- **Find workspaces**: "List monitoring workspaces."

## Log Analytics: List table types

Lists available table types in a Log Analytics workspace. 

Example prompts include:

- **List table types**: "Show me table types in the centralmonitoring workspace."
- **View available types**: "What table types are available in my Log Analytics workspace?"
- **Find table categories**: "List table types for security-logs workspace."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workspace** | Required | The Log Analytics workspace ID or name. This can be either the unique identifier (GUID) or the display name of your workspace. |

## Log Analytics: List tables

The Azure MCP Server lists all tables in a Log Analytics workspace. This helps you understand the data available for querying.

Example prompts include:

- **List tables**: "Show tables in centralmonitoring workspace."
- **View tables**: "What tables are in workspace app-monitoring?"
- **Find tables**: "List tables in security-logs workspace."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workspace** | Required | The Log Analytics workspace ID or name. |

## Log Analytics: Query workspace logs

The Azure MCP Server can execute Kusto Query Language (KQL) queries against a Log Analytics workspace. This powerful feature allows you to analyze your operational data.

Example prompts include:

- **Simple query**: "Query errors from last hour."
- **Filter query**: "Find failed login attempts in SecurityEvent table."
- **Complex query**: "Show CPU usage trend for web servers last 24 hours."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workspace** | Required | The Log Analytics workspace ID or name. |
| **Table** | Required | The name of the table to query. |
| **Query** | Required | The KQL query to execute against the Log Analytics workspace. |
| **Hours** | Optional | The number of hours to query back from now. |
| **Limit** | Optional | The maximum number of results to return. |

## Log Analytics: Query resource logs

Queries diagnostic and activity logs for a specific Azure resource in a Log Analytics workspace using Kusto Query Language (KQL). 

Example prompts include:

- **Query recent logs**: "Show recent logs for resource /subscriptions/abc123/resourceGroups/prod/providers/Microsoft.Web/sites/myapp."
- **Find errors**: "Query errors for my web app resource in the last 4 hours."
- **Resource diagnostics**: "Show diagnostic logs for storage account resource with limit 100."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource ID** | Required | The Azure Resource ID to query logs. Example: `/subscriptions/<YOUR-SUBSCRIPTION-ID>/resourceGroups/<YOUR-RESOURCE-GROUP>/providers/Microsoft.OperationalInsights/workspaces/<YOUR-WORKSPACE>`. |
| **Table** | Required | The name of the table to query. This is the specific table within the workspace. |
| **Query** | Required | The KQL query to execute against the Log Analytics workspace. You can use predefined queries by name such as `recent` which shows most recent logs ordered by TimeGenerated and `errors` which shows error-level logs ordered by TimeGenerated. Otherwise, provide a custom KQL query. |
| **Hours** | Optional | The number of hours to query back from now. |
| **Limit** | Optional | The maximum number of results to return. |


## Health: Get entity health

The Azure MCP Server gets the health status of an entity using Azure Monitor health models. This provides comprehensive health information and monitoring status for Azure resources and applications.

Example prompts include:

- **Check entity health**: "Get health for app-prod-001 with webapp-health model."
- **Monitor resource health**: "What's the health of web-app-prod using application-model?"
- **Check system status**: "Get health info for sql-prod database entity."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Model** | Required | The name of the health model. |
| **Entity** | Required | The entity ID to get health for. |

## Metrics: Query metrics

The Azure MCP Server queries Azure Monitor metrics for resources. This allows you to retrieve performance metrics, usage statistics, and monitoring data for your Azure resources over specified time periods.

Example prompts include:

- **Query VM metrics**: "Get CPU and memory for prod-vm01 from January 1 to January 2."
- **Query storage metrics**: "Show transaction metrics for mystorageaccount in storage group."
- **Query app metrics**: "Get response time for mywebapp last 24 hours."


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

## Metrics: List metric definitions

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

## Workbooks: List workbooks

The Azure MCP Server lists Azure Monitor workbooks in a resource group. This helps you discover and manage your monitoring dashboards and interactive reports.

Example prompts include:

- **List workbooks**: "Show workbooks in monitoring group."
- **List by category**: "List workbooks in Insights category."
- **List shared workbooks**: "Show shared workbooks in monitoring."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Resource group** | Required | The name of the Azure resource group. |
| **Category** | Optional | The category to filter workbooks by. |
| **Kind** | Optional | The kind of workbook (such as `shared`, `user`). |
| **Source ID** | Optional | The source resource ID to filter workbooks by. |

## Workbooks: Show workbook details

The Azure MCP Server shows details of a specific Azure Monitor workbook by its resource ID. This provides comprehensive information about the workbook's configuration and content.

Example prompts include:

- **Show workbook**: "Show workbook details for /subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/workbook-guid."
- **Get workbook info**: "Get info about workbook /subscriptions/xyz/resourceGroups/rg/providers/Microsoft.Insights/workbooks/my-workbook."
- **View workbook**: "Display workbook details for my performance workbook."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to retrieve. |

## Workbooks: Create workbook

The Azure MCP Server can create a new Azure Monitor workbook. This allows you to programmatically create monitoring dashboards and interactive reports.

Example prompts include:

- **Create workbook**: "Create workbook Performance Dashboard in monitoring group."
- **Create with source**: "Create workbook App Insights Analysis linked to my Application Insights."
- **Create monitoring workbook**: "Create new workbook Infrastructure Overview."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Display** | Required | The display name for the new workbook. |
| **Serialized content** | Required | The JSON content defining the workbook structure and queries. |
| **Source ID** | Optional | The source resource ID to associate with the workbook. |

## Workbooks: Update workbook

The Azure MCP Server updates an existing Azure Monitor workbook. This allows you to modify workbook properties and content programmatically.

Example prompts include:

- **Update name**: "Update workbook /subscriptions/abc/resourceGroups/rg/providers/Microsoft.Insights/workbooks/wb1 name to Updated Dashboard."
- **Update content**: "Update workbook content for /subscriptions/xyz/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/dashboard."
- **Modify workbook**: "Change name and content for workbook /subscriptions/123/resourceGroups/prod/providers/Microsoft.Insights/workbooks/analytics."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to update. |
| **Display** | Optional | The new display name for the workbook. |
| **Serialized content** | Optional | The updated JSON content for the workbook. |

## Workbooks: Delete workbooks

The Azure MCP Server deletes an Azure Monitor workbook. This permanently removes the workbook and all its associated content.

Example prompts include:

- **Delete workbook**: "Delete workbook /subscriptions/abc123/resourceGroups/monitoring/providers/Microsoft.Insights/workbooks/old-dashboard."
- **Remove workbook**: "Remove workbook /subscriptions/xyz/resourceGroups/rg/providers/Microsoft.Insights/workbooks/unused-workbook."
- **Clean up**: "Remove workbook at /subscriptions/123/resourceGroups/prod/providers/Microsoft.Insights/workbooks/deprecated."

| Parameter | Required or optional | Description |
|-----------|-------------|-------------|
| **Workbook ID** | Required | The full Azure resource ID of the workbook to delete. |


## Related content

- [What are the Azure MCP Server tools?](index.md)
- [Get started using Azure MCP Server](../get-started.md)
- [Azure Monitor](/azure/azure-monitor/overview)
- [Application Insights](/azure/azure-monitor/app/app-insights-overview)
- [Workbooks in Azure Monitor](/azure/azure-monitor/visualize/workbooks-overview)
- [Metrics in Azure Monitor](/azure/azure-monitor/platform/tutorial-metrics)
