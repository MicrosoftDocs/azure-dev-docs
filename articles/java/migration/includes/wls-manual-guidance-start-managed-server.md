---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 12/09/2022
---

1. Sign in to the Administration Console portal with your admin account and password. The URL is `http://<adminvm-private-ip>:7001/console/`. In this example, the admin account and password are `weblogic/Secret123456`. You'll find the state of managed servers are **Shutdown**.
1. Under the **Domain Structure**, select **Environments**, **Servers**, and **Control**, select `msp1` and `msp2`, and then select **Start**.
1. You may be be prompted to confirm starting the servers. If so, select **Yes**. You'll see the message "A request has been sent to the Node Manager to start the selected servers."
1. You can select the "refresh" icon at the top of the table to start or stop the dynamic refresh of the data in that table. This icon is shown in the next screenshot.
1. You'll find the servers are up soon.

:::image type="content" source="../media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-start-servers.png" alt-text="Screenshot of Oracle Configuration Wizard - Start Servers." lightbox="../media/migrate-weblogic-to-vm-manually/wls14c-configuration-domain-start-servers.png":::
