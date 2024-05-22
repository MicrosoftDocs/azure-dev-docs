---
author: KarlErickson
ms.author: haiche
ms.date: 04/29/2024
---

Since the primary cluster is up and running, it acts as the active cluster and handles all user requests routed by your Traffic Manager profile.

Open the DNS name of your Azure Traffic Manager profile in a new tab of the browser, appending the context root */weblogic-cafe* of the deployed app - for example, `http://tmprofile-ejb120623.trafficmanager.net/weblogic-cafe`. Create a new coffee with name and price - for example, *Coffee 1* with price *10*. This entry is persisted into both the application data table and the session table of the database. The UI that you see should be similar to the following screenshot:

:::image type="content" source="../media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png" alt-text="Screenshot of the sample application UI." lightbox="../media/migrate-weblogic-to-vms-with-ha-dr/sample-app-ui.png":::

If your UI doesn't look similar, troubleshoot and resolve the problem before you continue.

Keep the page open so you can use it for failover testing later.
