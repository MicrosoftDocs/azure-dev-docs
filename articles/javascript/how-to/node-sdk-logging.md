---
title: Logging, metrics, telemetry in Azure
description: Learn about logging options in Azure
ms.topic: how-to
ms.date: 05/05/2021
ms.custom: devx-track-js
---

# Logging, metrics, and telemetry in Azure 

There are several options for logging, metrics, and telemetry when using Azure. Review the options to find the tool or service you are looking for:

* Azure Resource metrics - when you use Azure services, Azure monitors your individual resources and collects metrics.  
* [Custom logging](#custom-logging-to-azure) - when your application (on-prem, cloud, or hybrid), needs to log information.

[Azure Monitor](/azure/azure-monitor/overview) maximizes the availability and performance of your applications and services by delivering a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments.

## Turn on Azure resource monitoring in the Azure portal

Enable [Application Insights](/azure/azure-monitor/app/app-insights-overview) for your resource. This integration is usually available at resource creation time and after the resource is created. The process creates a separate Application Insights resource for logging.

:::image type="content" source="../media/logging-metrics/create-azure-app-service-with-logging.png" alt-text="View your HTTP endpoint from the service's Overview page on the Azure portal.":::

## View web app metrics data

View metrics for your resource on a scheduled basis in the [Azure portal](https://portal.azure.com) for each resource. 

:::image type="content" source="../media/logging-metrics/view-resource-metrics-in-azure-portal.png" alt-text="Configure alerts for your resource in the Azure portal, with URL of `https://portal.azure.com`, for each resource. ":::

## View web app failure data

View failures for Application Insights monitored resources.     

:::image type="content" source="../media/logging-metrics/view-resource-failure-in-application-insights.png" alt-text="View failures for Application Insights monitored resources.":::

## Set alerts to monitor your resource 

Set alerts for your resource in the [Azure portal](https://portal.azure.com) for each resource. Alerts can include specific metrics, communication streams (such as email), and frequency. Common alerts to set are total:

* Requests 
* Response time
* Http server errors (in Hosting environments)

:::image type="content" source="../media/logging-metrics/create-alert-for-http-server-errors-in-app-service.png" alt-text="Set common alerts for your resource such as requests, response time and http server errors (for your hosting environment resources).":::

## Custom logging to Azure

Custom logging is automatically provided by Azure web apps and Azure functions, if you use the correct logging functions:

* Web apps use `console.log('your message here')`
* Function apps use `context.log('your message here')`

You can add richer custom logging with Azure Monitor's [Application Insights](/azure/azure-monitor/app/app-insights-overview), which offers [Server](/azure/azure-monitor/app/nodejs) (Node.js) and [Client](/azure/azure-monitor/app/javascript) (browser) scenarios:

* [Add Application Insights SDK](/azure/azure-monitor/app/nodejs) to your source code.
* Server - log from Node.js with [Application Insights](/azure/azure-monitor/app/app-insights-overview) - [npm package](https://www.npmjs.com/package/applicationinsights)
* Client - log from your client code - [npm package](https://www.npmjs.com/package/@microsoft/applicationinsights-web)
* Containers and VMs - log from your [Kubernetes cluster](/azure/azure-monitor/insights/container-insights-overview) or [Azure Virtual machines](/azure/azure-monitor/insights/vminsights-overview)

## Local development with Application Insights

If you are trying out Application Insights by running code locally, which uses one of the Application Insights npm packages, make sure to call the `flush()` method so the logging is sent to Application Insights immediately. When you view the logs, remember that it can still take a couple of minutes before your custom logs are available in Application Insights.  

## Query your custom logs with Kusto query language

When you use the `context.log` in a Function app or `console.log` in a Web app, and you have Application Insights enabled, those custom logs are added to your Application Insights resource in the **Trace** table. If you prefix your custom log with a specific string, such as `JavaScript`, you can search the Trace table for any messages that contain that prefix when you want to reduce your log to just those custom entries, using the [Kusto query language](/azure/data-explorer/kusto/query/). 

```kusto
traces
| where message contains "JavaScript"
```

:::image type="content" source="../media/logging-metrics/azure-function-app-application-insights-custom-log-kusto-query.png" alt-text="If you prefix your custom log with a specific string, such as `JavaScript`, you can search the Trace table for any messages that contain that prefix when you want to reduce your log to just those custom entries.":::

## Configure web app log streaming

View log stream of hosted resources available in the resource's Monitoring section of the Azure portal. Configure them with the App service log configuration. 

:::image type="content" source="../media/logging-metrics/configue-azure-app-service-logs-in-azure-portal.png" alt-text="View log stream of hosted resources available in the resource's Monitoring section of the Azure portal.":::

## View web app log streaming

For Azure Web apps, use the following table to learn more about how to stream logs:

|Method|Description|
|--|--|
|Azure CLI|[az webapp log tail](/cli/azure/webapp/log#az_webapp_log_tail)|
|[VSCode App service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)|Right-click on resource and select **Start streaming logs**| 


## View Function log streaming

For Azure Function apps, use the following table to learn more about how to stream logs:

|Method|Description|
|--|--|
|[VSCode Functions service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)|Right-click on resource and select **Start streaming logs**| 
 

## Next steps

- [Enable diagnostics logging for apps in Azure App Service](/azure/app-service/troubleshoot-diagnostic-logs)
- [Review Azure security logging and auditing options](/azure/security/fundamentals/log-audit)
- [Learn how to work with Azure platform logs](/azure/azure-monitor/platform/platform-logs-overview)