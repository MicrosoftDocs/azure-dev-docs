---
title: JavaScript Logging, metrics, alerts in Azure
description: Learn about logging options in Azure.
ms.topic: how-to
ms.date: 11/28/2022
ms.custom: devx-track-js
---

# Logging, metrics, and alerts in Azure

To understand how your Azure service is performing, you need to understand which logging, metrics, and alerts are available and how to use them.

## Questions about your resources

Use the following table to understand what information you can learn about your Azure resources and why you should use logging, metrics, and alerts.

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
      Hosting services such as Azure App Service and Azure Functions provide several forms of feedback to answer questions such as:

        * Was my application (or container) deployed successfully? 
        * Did my application (or container) start successfully?
        * Is my application (or container) running successfully?
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
      **Azure service**
    :::column-end:::
    :::column span="2":::
      Azure offers metrics for services, so you can get answers to questions such as:

        * How busy is the service?
        * What errors is the service producing?
        * Is my service so busy it isn't able to keep up with demand?
        * Have I reached the transaction quota for my pricing tier?
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
      **Azure SDK**
    :::column-end:::
    :::column span="2":::
      The Azure SDK provides access to Azure from many programming languages. The SDKs provides logging to allow you to ask questions such as:

        * What is the SDK itself doing?
        * What is my code doing?
    :::column-end:::
:::row-end:::
:::row:::
    :::column:::
      **Your code or container**
    :::column-end:::
    :::column span="2":::
      To understand how your own code or container is working, integrate Application Insights from [Azure Monitor](/azure/azure-monitor/overview). You can use Application Insights to capture logs across services for a single application to ask questions such as:

        * What exceptions is your code throwing?
        * What events is your code triggering?
        * How is your code interacting with dependencies?
    :::column-end:::
:::row-end:::

## Features of logging, metrics, and alerts

|Type|Availability|Description|
|--|--|--|
|Metrics|Provided without configuration| Start with metrics because every Azure service has some metrics so you can see how it's performing.|
|Alerts|Configurable|Configure alerts to be notified when negative or quota-expiring behaviors happen.|
|Logging|Configurable|Some services, such as hosting services, have logging to help you understand how your code or container is behaving. You might need to configure logging before you can open log files. |
|Custom logging|Configurable via code|From your own code, you can log to Azure Monitor by using the Application Insights SDK for [server](/azure/azure-monitor/app/nodejs) and [client](/azure/azure-monitor/app/javascript?tabs=snippet) applications. The code doesn't have to be hosted on Azure to log to Azure Monitor.|

## View metrics in the Azure portal

To view metrics for your resource on a scheduled basis, open the [Azure portal](https://portal.azure.com) and go to **Monitoring** > **Metrics**.

:::image type="content" source="../media/logging-metrics/view-resource-metrics-in-azure-portal.png" alt-text="Screenshot that shows selections for viewing metrics for Cognitive Services in the Azure portal. ":::

## View alerts in the Azure portal

Set alerts for your resources in the [Azure portal](https://portal.azure.com). Alerts can include specific metrics, communication streams (such as email), and frequency. Common alerts to set are total:

* Requests
* Response time
* HTTP server errors (in hosting environments)

:::image type="content" source="../media/logging-metrics/create-alert-for-http-server-errors-in-app-service.png" alt-text="Screenshot of the Azure portal that shows the pane for configuring signal logic for HTTP server errors.":::

## View hosted service logs in the Azure portal

You can configure hosted applications and containers to log information about:

* Deployment
* Startup
* Runtime

Turn on these logs to understand how your hosted application behaves. These logs are probably the first place you'll learn that your deployment failed or your startup configuration is incorrectly configured or missing dependencies.

## Log to stdout and stderr

Azure web apps and Azure functions automatically provide custom logging to standard output (`stdout`) and standard error (`stderr`), if you use the correct logging functions:

* Web apps use `console.log('your message here')`.
* Function apps use `context.log('your message here')`.

## Add custom logging

You can add richer custom logging by using [Application Insights](/azure/azure-monitor/app/app-insights-overview) in Azure Monitor. Application Insights offers [server](/azure/azure-monitor/app/nodejs) (Node.js) and [client](/azure/azure-monitor/app/javascript) (browser) scenarios:

* Add the Application Insights SDK to your source code.
* Log from Node.js by using an [npm package](https://www.npmjs.com/package/applicationinsights).
* Log from your client code by using an [npm package](https://www.npmjs.com/package/@microsoft/applicationinsights-web).
* Log from your [Kubernetes cluster](/azure/azure-monitor/insights/container-insights-overview) or [Azure virtual machine](/azure/azure-monitor/insights/vminsights-overview).

## Turn on application logging by using Application Insights

For application logging, Application Insights can provide:

* Standard logging in the Azure service and in your source code, depending on the initialization.
* Custom logging from your deployment pipeline and in your source code.

## Turn on application logging for App Service

To turn on application host logging in the Azure portal:

1. Go to **Monitoring** > **App Service logs**, and then turn on **Application logging** for the file system.
1. Configure the **Quota (MB)** value. The default value is **35**.
1. Set the **Retention Period (Days)** value to a default, such as **3** or **7**.
1. Select **Save** to begin capturing host logs.

## View application logs for App Service

When you turn on application logs, the logs are stored in the **Logs** folder of your web app host. View the logs from either the Azure portal or the Visual Studio Code extension for App Service.

Log file name formats include:

* Deployment: `{DATE-TIME}_{RANDOM-CHARS}_{docker}.log`
* Startup and runtime: `{DATE-TIME}_{RANDOM-CHARS}_default_docker.log`

## Stream logs for App Service

For App Service, use the following table to learn more about how to stream logs:

|Method|Description|
|--|--|
|Azure CLI|Run [az webapp log tail](/cli/azure/webapp/log#az-webapp-log-tail).|
|[App Service extension in Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice)|Right-click the resource, and then select **Start streaming logs**.|

## Turn on application logging for Azure Functions (plan)

See the [earlier steps to turn on host logging for App Service](#turn-on-application-logging-for-app-service).

## Turn on application logging for Azure Functions (consumption)

With a consumption-based function app, if you use logging provided by the context object in your source code, those logs appear under each function's **Monitor** section. The Azure portal also gives you the option to stream the logs as requests come into the function.

## Query your Application Insights logs by using Kusto Query Language

When you use `context.log` in a function app or `console.log` in a web app, and you have Application Insights turned on, those custom logs are added to your Application Insights resource in the **Trace** table. If you prefix your custom log with a specific string, such as `JavaScript`, you can search the **Trace** table for any messages that contain that prefix when you want to reduce your log to just those custom entries, by using the [Kusto query language](/azure/data-explorer/kusto/query/).

```kusto
traces
| where message contains "JavaScript"
```

:::image type="content" source="../media/logging-metrics/azure-function-app-application-insights-custom-log-kusto-query.png" alt-text="Screenshot that shows a custom log with a prefix string.":::

## Develop locally with Application Insights

If you're trying out Application Insights by running code locally, and that code uses one of the Application Insights npm packages, be sure to call the `flush()` method so the logging is sent to Application Insights immediately. When you view the logs, remember that it can still take a couple of minutes before your custom logs are available in Application Insights.  

## View app failure data in Application Insights

To view failures for Application Insights monitored resources, use the **Failures** pane.

:::image type="content" source="../media/logging-metrics/view-resource-failure-in-application-insights.png" alt-text="Screenshot of the pane for viewing failures for Application Insights monitored resources.":::

## Related content

* [Enable diagnostics logging for apps in Azure App Service](/azure/app-service/troubleshoot-diagnostic-logs)
* [Review Azure security logging and auditing options](/azure/security/fundamentals/log-audit)
* [Learn how to work with Azure platform logs](/azure/azure-monitor/platform/platform-logs-overview)
