---
title: JavaScript Logging, metrics, alerts in Azure
description: Learn about logging options in Azure
ms.topic: how-to
ms.date: 08/08/2022
ms.custom: devx-track-js
---

# Logging, metrics, and alerts in Azure

In order to understand how your Azure service is performing, you need to understand what logging, metrics, and alerts are available and how to use them.

## Why use logging, metrics and alerts?

Use the following table to understand what information you can learn about your Azure resources.


:::row:::
    :::column:::
      **Type**
    :::column-end:::
    :::column span="2":::
      **Example questions**
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
      **Azure hosting**
    :::column-end:::
    :::column span="2":::
      Hosting services such as Azure App Service and Azure Function provide several forms of feedback to answer questions such as:

        * Did my application (or container) deploy successfully? 
        * Did my application (or container) start successfully?
        * Is my application (or container) running successfully?
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
      **Azure service**
    :::column-end:::
    :::column span="2":::
      Azure offers metrics for services which allows you to get answers such as:

        * How busy is the service?
        * What errors is the service is producing?
        * Is my service so busy it isn't able to keep up with demand?
        * Have I reached my pricing tier transaction quota?
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
      **Azure SDK**
    :::column-end:::
    :::column span="2":::
      The Azure SDK provides access to Azure from many programming languages. The SDKs provides logging to allow you to ask questions such as:
        * What is the SDK itself doing? 
        * What is my code which uses the SDK doing?
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
      **Your code or container**
    :::column-end:::
    :::column span="2":::
      To understand how your own code or container is working, integrate Application Insights from [Azure Monitor](/azure/azure-monitor/overview). Application Insights allows you capture logs across services for a single application to ask questions such as:

        * What exceptions your code throws?
        * What events is your code triggering?
        * How is your code interacting with dependencies?
    :::column-end:::
:::row-end:::

## What is provided for logging, metrics, and telemetry?

|Type|Availability|Description|
|--|--|--|
|Metrics|Provided without configuration| Every Azure service will have some metrics to allow you to see how it is performing.|
|Logging|Configurable|Some services, such as hosting services, have logging to help you understand how your code or container is behaving. You may need to configure logging before you can see log files. |
|Custom logging|Configurable via code|From your own code, you can log to Azure Monitor, using Application Insights SDK for [server](/azure/azure-monitor/app/nodejs) and [client](/azure/azure-monitor/app/javascript?tabs=snippet) application. The code doesn't have to be hosted on Azure to log to Azure Monitor.| 
|Alerts|Configurable|Most services provide alerts so you can be notified when negative or quota-expiring behaviors happen. You will need to configure alerts.| 

## View metrics in Azure portal

View metrics for your resource on a scheduled basis in the [Azure portal](https://portal.azure.com) for each resource.

:::image type="content" source="../media/logging-metrics/view-resource-metrics-in-azure-portal.png" alt-text="Configure alerts for your resource in the Azure portal, with URL of `https://portal.azure.com`, for each resource. ":::


### Query your custom logs with Kusto query language

When you use the `context.log` in a Function app or `console.log` in a Web app, and you have Application Insights enabled, those custom logs are added to your Application Insights resource in the **Trace** table. If you prefix your custom log with a specific string, such as `JavaScript`, you can search the Trace table for any messages that contain that prefix when you want to reduce your log to just those custom entries, using the [Kusto query language](/azure/data-explorer/kusto/query/).

```kusto
traces
| where message contains "JavaScript"
```

:::image type="content" source="../media/logging-metrics/azure-function-app-application-insights-custom-log-kusto-query.png" alt-text="If you prefix your custom log with a specific string, such as `JavaScript`, you can search the Trace table for any messages that contain that prefix when you want to reduce your log to just those custom entries.":::


## View logging in Azure portal

Enable [Application Insights](/azure/azure-monitor/app/app-insights-overview) for your resource. This integration is usually available at resource creation time and also after the resource is created. The process creates a separate Application Insights resource for logging. 

:::image type="content" source="../media/logging-metrics/create-azure-app-service-with-logging.png" alt-text="View your HTTP endpoint from the service's Overview page on the Azure portal.":::

### View hosting logs in Azure portal

Hosting service such as Azure App Service and Azure Functions provide logs for deployment, startup and runtime. 

#### Configure web app log streaming

View log stream of hosted resources available in the resource's Monitoring section of the Azure portal. Configure them with the App service (Windows) log configuration.

:::image type="content" source="../media/logging-metrics/configue-azure-app-service-logs-in-azure-portal.png" alt-text="View log stream of hosted resources available in the resource's Monitoring section of the Azure portal.":::

#### View web app log streaming

For Azure Web apps, use the following table to learn more about how to stream logs:

|Method|Description|
|--|--|
|Azure CLI|[az webapp log tail](/cli/azure/webapp/log#az-webapp-log-tail)|
|[VSCode App service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)|Right-click on resource and select **Start streaming logs**|

#### View Function log streaming

For Azure Function apps, use the following table to learn more about how to stream logs:

|Method|Description|
|--|--|
|Azure CLI|[az webapp log tail --resource-group <RESOURCE_GROUP_NAME> --name <FUNCTION_APP_NAME>](/cli/azure/webapp/log#az-webapp-log-tail)|
|[VSCode Functions service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)|Right-click on resource and select **Start streaming logs**|

### Custom logging to Azure

Custom logging is automatically provided by Azure web apps and Azure functions, if you use the correct logging functions:

* Web apps use `console.log('your message here')`
* Function apps use `context.log('your message here')`

You can add richer custom logging with Azure Monitor [Application Insights](/azure/azure-monitor/app/app-insights-overview), which offers [Server](/azure/azure-monitor/app/nodejs) (Node.js) and [Client](/azure/azure-monitor/app/javascript) (browser) scenarios:

* [Add Application Insights SDK](/azure/azure-monitor/app/nodejs) to your source code.
* Server - log from Node.js with [Application Insights](/azure/azure-monitor/app/app-insights-overview) - [npm package](https://www.npmjs.com/package/applicationinsights)
* Client - log from your client code - [npm package](https://www.npmjs.com/package/@microsoft/applicationinsights-web)
* Containers and VMs - log from your [Kubernetes cluster](/azure/azure-monitor/insights/container-insights-overview) or [Azure Virtual machines](/azure/azure-monitor/insights/vminsights-overview)

### Local development with Application Insights

If you are trying out Application Insights by running code locally, which uses one of the Application Insights npm packages, make sure to call the `flush()` method so the logging is sent to Application Insights immediately. When you view the logs, remember that it can still take a couple of minutes before your custom logs are available in Application Insights.  


### View app failure data in Application Insights

View failures for Application Insights monitored resources.

:::image type="content" source="../media/logging-metrics/view-resource-failure-in-application-insights.png" alt-text="View failures for Application Insights monitored resources.":::

## View alerts in Azure portal

### Configure alerts to monitor your resource

Set alerts for your resource in the [Azure portal](https://portal.azure.com) for each resource. Alerts can include specific metrics, communication streams (such as email), and frequency. Common alerts to set are total:

* Requests
* Response time
* Http server errors (in Hosting environments)

:::image type="content" source="../media/logging-metrics/create-alert-for-http-server-errors-in-app-service.png" alt-text="Set common alerts for your resource such as requests, response time and http server errors (for your hosting environment resources).":::


## Next steps

* [Enable diagnostics logging for apps in Azure App Service](/azure/app-service/troubleshoot-diagnostic-logs)
* [Review Azure security logging and auditing options](/azure/security/fundamentals/log-audit)
* [Learn how to work with Azure platform logs](/azure/azure-monitor/platform/platform-logs-overview)
