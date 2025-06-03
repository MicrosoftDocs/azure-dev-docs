---
title: Monitor JavaScript applications in Azure with logs, metrics, and alerts
description: Learn how to monitor your Azure resources and applications.
ms.topic: article
ms.date: 06/03/2024
ms.custom: devx-track-js
# intent: As a developer new to Azure, I want to understand how to monitor my applications and resources using logs, metrics, and alerts.
---

# Monitor your Azure resources and applications

Use Azure Monitor to collect logs, metrics, and alerts across your JavaScript applications and the Azure services they depend on. [Azure Monitor](/azure/azure-monitor/) is the central platform service that collects and stores your telemetry. You can instrument your applications with [Application Insights](/azure/azure-monitor/app/app-insights-overview). You should monitor your hosted application service, the Azure services the application integrates with, and the application source code itself.

## Understand logs, metrics, and alerts

Telemetry is the data collected from your applications and services to monitor their health, performance, and usage. In Azure, telemetry is categorized into logs, metrics, and alerts. 

Azure offers four kinds of telemetry:

| Telemetry type  | What it gives you                               | Where to find it for each service                 |
| --------------- | ----------------------------------------------- | ------------------------------------------------- |
| Metrics         | Numeric, time-series data (CPU, memory, etc.)   | **Metrics** in portal or `az monitor metrics` CLI |
| Alerts          | Proactive notifications when thresholds hit     | **Alerts** in portal or `az monitor metrics alert` CLI |
| Logs            | Text-based events and diagnostics (web, app)    | App Service **Logs** , Functions **Monitor**, Container Apps **Diagnostics** |
| Custom logs     | Your own application telemetry via App Insights | Your Application Insights resource’s **Logs (Trace)** table |

Pick the right telemetry for your question:

| Scenario                                                                               | Use logs…                                         | Use metrics…                                       | Use alerts…                                           |
| -------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| “Did my web app start and respond?”                                                     | App Service web-server logs (Logs)          | N/A                                                | N/A                                                   |
| “Is my function timing out or failing?”                                                | Function invocation logs (Monitor)          | Function execution duration metric                 | Alert on “Function Errors >0”                         |
| “How busy is my service and can it scale?”                                             | N/A                                               | Service throughput/CPU in Metrics             | Autoscale alert on CPU% > 70%                         |
| “What exceptions is my code throwing?”                                                 | Custom Trace logs in Application Insights         | N/A                                                | Alert on “ServerExceptions >0”                        |
| “Have I exceeded my transaction or quota limits?”                                      | N/A                                               | Quota-related metrics (Transactions, Throttling)   | Alert on “ThrottlingCount >0”                         |

## Cost optimization

You can significantly reduce your [cost for Azure Monitor](/azure/azure-monitor/fundamentals/cost-usage) by understanding [best practices](/azure/azure-monitor/fundamentals/best-practices-cost) for configuration options and opportunities to reduce the amount of data that it collects. 

## Enable logging and metrics for all Azure resources

Each service in Azure has its own logging and metrics capabilities. Enable logging on each Azure resource to ensure you have the telemetry you need to monitor your entire end to end application.

## Create Azure Monitor resource

You can create an Azure Monitor resource to collect logs and metrics from your Azure resources. This resource is typically a Log Analytics workspace, which is where logs and metrics are stored.

You can create this resource in several ways:
- **Azure portal**: Use the [Azure portal](https://portal.azure.com) to create a Log Analytics workspace and configure diagnostic settings for your resources.
- **Azure CLI**: Use the [Azure CLI](/cli/azure/) to create a Log Analytics workspace and configure diagnostic settings for your resources.
- **PowerShell**: Use [PowerShell]() to create a Log Analytics workspace and configure diagnostic settings for your resources.
- **Bicep**: Use Bicep templates to define and deploy your Azure Monitor resources declaratively.

### Create a Log Analytics workspace using the Azure CLI

Use the Azure CLI to create a Log Analytics workspace, which is where logs and metrics are stored. Example:

```bash
# Variables
resourceGroup="myResourceGroup"
location="eastus"
workspaceName="myWorkspace"
webAppName="myWebApp"
diagName="${webAppName}/appServiceLogging"

# 1) Create a Log Analytics workspace
workspaceId=$(az monitor log-analytics workspace create \
  --resource-group $resourceGroup \
  --workspace-name $workspaceName \
  --location $location \
  --query id -o tsv)

# 2) Enable diagnostic settings on your App Service
az monitor diagnostic-settings create \
  --name "$diagName" \
  --resource "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$resourceGroup/providers/Microsoft.Web/sites/$webAppName" \
  --workspace $workspaceId \
  --logs '[{"category": "Administrative", "enabled": true},{"category":"AppServiceConsoleLogs","enabled":true},{"category":"AppServiceHTTPLogs","enabled":true}]' \
  --metrics '[{"category":"AllMetrics","enabled":true}]'
```

### Create a Log Analytics workspace using Bicep

Use Bicep to define and deploy your Azure Monitor resources declaratively. This example creates a Log Analytics workspace and configures diagnostic settings for an App Service:

```bicep

Include logging, metrics, and alerting in your IaC templates with a [Bicep diagnosticSettings resource reference](/azure/templates/microsoft.insights/diagnosticsettings). Example (Bicep):

```bicep
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'myWorkspace'
  location: resourceGroup().location
}

resource diagSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: '${webApp.name}/appServiceLogging'
  properties: {
    workspaceId: logAnalytics.id
    logs: [
      { category: 'AppServiceConsoleLogs'; enabled: true }
      { category: 'AppServiceHTTPLogs'; enabled: true }
    ]
    metrics: [
      { category: 'AllMetrics'; enabled: true }
    ]
  }
}
```

### Create alerts for your resources

You can set up alerts for metrics in the [Azure portal](https://portal.azure.com) or by using the [Azure CLI](/cli/azure/monitor/metrics/alert). Alerts can include specific metrics, communication streams (such as email), and frequency.

Use the following examples to create metric alerts in the portal or programmatically:
- Azure CLI: quick setup via `az monitor metrics alert`
- Bicep: declarative IaC definition for `Microsoft.Insights/metricAlerts`

Alerts can specify target metrics, notification channels (email, webhook), severity, evaluation frequency, and action groups.

```azurecli
az monitor metrics alert create \
  --name HighCpuAlert \
  --resource-group MyResourceGroup \
  --scopes /subscriptions/{sub}/resourceGroups/MyResourceGroup/providers/Microsoft.Web/sites/myApp \
  --condition "avg CpuPercentage > 70" \
  --description "Alert when CPU goes above 70%" \
  --severity 2 \
  --window-size 5m \
  --evaluation-frequency 1m \
  --action /subscriptions/{sub}/resourceGroups/MyResourceGroup/providers/microsoft.insights/actionGroups/MyActionGroup
```

```bicep
resource cpuAlert 'Microsoft.Insights/metricAlerts@2018-03-01' = {
  name: 'highCpuAlert'
  location: resourceGroup().location
  properties: {
    description: 'Alert when CPU goes above 70%'
    severity: 2
    enabled: true
    scopes: [
      webApp.id
    ]
    evaluationFrequency: 'PT1M'
    windowSize: 'PT5M'
    criteria: {
      allOf: [
        {
          criterionType: 'StaticThresholdCriterion'
          name: 'HighCpu'
          metricName: 'CpuPercentage'
          metricNamespace: 'Microsoft.Web/sites'
          operator: 'GreaterThan'
          threshold: 70
          timeAggregation: 'Average'
        }
      ]
    }
    autoMitigate: false
    actions: [
      {
        actionGroupId: '/subscriptions/{sub}/resourceGroups/MyResourceGroup/providers/microsoft.insights/actionGroups/MyActionGroup'
      }
    ]
  }
}
```

## View log data

To view log data in the Azure portal, navigate to your Log Analytics workspace and select **Logs**. You can run [Kusto Query Language (KQL)](/kusto/query/) queries against the logs.

### Stream logs

Use the following table to learn more about how to stream logs.

* [Azure Monitor](/azure/azure-monitor/platform/stream-monitoring-data-event-hubs)
* [App Service](/azure/app-service/troubleshoot-diagnostic-logs)
* [Azure Functions](/azure/azure-functions/streaming-logs?tabs=azure-portal)
* [Azure Container Apps](/azure/container-apps/log-streaming)

### Azure MCP Server

When developing locally, you can use the [Azure MCP Server](/azure/developer/azure-mcp-server) [**monitor**](/azure/developer/azure-mcp-server/tools/monitor) tool to query logs without leaving your IDE. Once you [install the server](/azure/developer/azure-mcp-server/get-started?tabs=one-click%2Cazure-cli&pivots=mcp-github-copilot#install-the-azure-mcp-server), example Copilot prompts include:

* List workspaces: "Show me all Log Analytics workspaces in my subscription."
* Find tables: "List all tables in my workspace 'security-logs'"
* Complex query: "Show me the CPU usage trend for my web servers over the last 24 hours"


## Add logging to your code

For application logging, Application Insights can provide:

* Standard logging in the Azure service and in your source code, depending on the initialization.
* Custom logging from your deployment pipeline and in your source code.

### Standard console logging (stdout/stderr)

Azure web apps and Azure Functions automatically provide custom logging to `stdout` and `stderr`, if you use the correct logging functions:

* Web apps use `console.log('your message here')`.
* Function apps use `context.log('your message here')`.

### Add custom Application Insights logging

You can add richer custom logging by using [Application Insights](/azure/azure-monitor/app/app-insights-overview) in Azure Monitor. Application Insights offers [server](/azure/azure-monitor/app/nodejs) (Node.js) and [client](/azure/azure-monitor/app/javascript) (browser) scenarios:

* Add the Application Insights SDK to your source code.
* Log from Node.js by using an [npm package](https://www.npmjs.com/package/applicationinsights).
  * Make sure to configure the Node.js SDK with `enableAutoCollectConsole: true` in order to collect custom console logs.
* Log from your client code by using an [npm package](https://www.npmjs.com/package/@microsoft/applicationinsights-web).
* Log from your [Kubernetes cluster](/azure/azure-monitor/insights/container-insights-overview) or [Azure virtual machine](/azure/azure-monitor/insights/vminsights-overview).


### Enable SDK pipeline logs (@Azure/logger)
Control SDK verbosity by using the `AZURE_LOG_LEVEL` environment variable or the [`@azure/logger` npm package](https://www.npmjs.com/package/@azure/logger):

```js
import { setLogLevel } from "@azure/logger";
// Options: 'error', 'warning', 'info', 'verbose'
setLogLevel(process.env.AZURE_LOG_LEVEL || "info");
```

### Configure Application Insights Node.js SDK
Initialize the [Application Insights for Node.js SDK](/azure/azure-monitor/app/nodejs) with sampling, dependency collection, and console log capture:

```js
import appInsights from "applicationinsights";
appInsights
  .setup("<INSTRUMENTATION_KEY>")
  .setAutoCollectConsole(true, true)        // collect console.log
  .setAutoCollectDependencies(true)        // track outgoing requests
  .setInternalLogging(false, true)         // SDK internal logs
  .start();

// Optional: add custom properties to all telemetry
appInsights.defaultClient.commonProperties = { serviceName: "my-service" };
```

### Add correlation and distributed tracing
The Application Insights SDK auto-injects operation and correlation IDs into requests. To add custom correlation or properties:

```js
appInsights.defaultClient.trackTrace({
  message: "Custom trace",
  properties: { userId: user.id }
});
```

Learn more: [distributed tracing guidance](/azure/azure-monitor/app/distributed-tracing)

### Flush telemetry in dev scripts
Ensure logs are sent before process exit during local development:

```js
appInsights.defaultClient.flush({
  callback: () => process.exit(0)
});
```

### Client-side telemetry setup
For client applications, use the [`@microsoft/applicationinsights-web` package](https://www.npmjs.com/package/@microsoft/applicationinsights-web) :

```js
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
const ai = new ApplicationInsights({ config: {
  instrumentationKey: "<INSTRUMENTATION_KEY>",
  enableAutoRouteTracking: true
}});
ai.loadAppInsights();
```

## Next steps

* [Azure Data Explorer (Kusto) overview](/azure/data-explorer/)
* [Enable diagnostics logging for apps in Azure App Service](/azure/app-service/troubleshoot-diagnostic-logs)
* [Learn how to work with Azure platform logs](/azure/azure-monitor/platform/platform-logs-overview)
* [Azure MCP Server monitor tool](/azure/developer/azure-mcp-server/tools/monitor)

