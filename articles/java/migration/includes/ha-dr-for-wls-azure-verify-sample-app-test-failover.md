---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 04/29/2024
---

Finally, use the following steps to verify the sample app after the endpoint `myFailoverEndpoint` is in the **Online** state:

1. Switch to the browser tab of your Traffic Manager, then refresh the page until you see that the **Monitor status** value of the endpoint `myFailoverEndpoint` enters the **Online** state.
1. Switch to the browser tab of the sample app and refresh the page. You should see the same data persisted in the application data table and the session table displayed in the UI, as shown in the following screenshot:

   :::image type="content" source="../media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png" alt-text="Screenshot of the sample application UI after failover." lightbox="../media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png":::

   If you don't observe this behavior, it might be because the Traffic Manager is taking time to update DNS to point to the failover site. The problem could also be that your browser cached the DNS name resolution result that points to the failed site. Wait for a while and refresh the page again.

> [!NOTE]
> A production-ready HA/DR solution would account for continually copying the WLS configuration from the primary to the secondary clusters on a regular schedule. For information on how to do this, see the references to the Oracle documentation at the end of this article.

To automate the failover, consider using alerts on Traffic Manager metrics and Azure Automation. For more information, see the [Alerts on Traffic Manager metrics](/azure/traffic-manager/traffic-manager-metrics-alerts#alerts-on-traffic-manager-metrics) section of [Traffic Manager metrics and alerts](/azure/traffic-manager/traffic-manager-metrics-alerts) and [Use an alert to trigger an Azure Automation runbook](/azure/automation/automation-create-alert-triggered-runbook).
