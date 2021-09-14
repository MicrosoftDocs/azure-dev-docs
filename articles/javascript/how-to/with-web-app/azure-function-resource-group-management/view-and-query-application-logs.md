---
title: Query Azure Function logs
description: Learn how to view and query Azure Function app logs in the Azure portal.
ms.topic: how-to
ms.date: 09/16/2021
ms.custom: devx-track-js
---

# 5. View and query your Function app logs

In this article of the series, you view and query Azure Function app logs in the Azure portal.

## Query your Azure Function logs

Use the Azure portal to view and query your function logs. 

1. In VS Code, select the Azure logo to open the **Azure Explorer**, then under **Functions**, right-click on your function app, then select **Open in Portal**.

    This opens the Azure portal to your Azure Function.

1. Select **Application Insights** from the Settings, then select **View Application Insights data**.

    :::image type="content" source="../../../media/azure-function-resource-group-management/azure-portal-function-application-insights-link.png" alt-text="Browser screenshot showing menu choices. Select **Application Insights** from the Settings, then select **View Application Insights data**.":::

    This link takes you to your separate metrics resource created for you when you created your Azure Function with VS Code.

1. Select **Logs** in the Monitoring section. If a **Queries** pop-up window appears, select the **X** in the top-right corner of the pop-up to close it. 
1. In the **Schema and Filter** pane, on the **Tables** tab, double-click the **traces** table. 

    This enters the [Kusto query](/azure/data-explorer/kusto/query/), `traces` into the query window. 
1. Edit the query to search for API calls:

    ```kusto
    traces 
    | where message startswith "Executing "
    ```

1. Select **Run**.

    If the log doesn't display any results, it may be because there is a few minutes delay between the HTTP request to the Azure Function and the log availability in Kusto. Wait a few minutes and run the query again.

    :::image type="content" source="../../../media/azure-function-resource-group-management/azure-portal-application-insights-query-function-execution-log-trace.png" alt-text="Browser screenshot showing Azure portal Kusto query result for Trace table." lightbox="../../../media/azure-function-resource-group-management/azure-portal-application-insights-query-function-execution-log-trace.png":::

    Because you added an Application Insights resource when you created the Azure Function app, you didn't need to do anything extra to get this logging information:

    * The Function app added Application Insights _for you_.
    * The Query tool is included in the Azure portal.
    * You can click on `traces` instead of having to learn to write a [Kusto query](/azure/data-explorer/kusto/concepts/) to get even the minimum information from your logs.

## Next steps

* [Clean up resources](clean-up-resources.md)