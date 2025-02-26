---
author: KarlErickson
ms.author: karler
ms.reviewer: zhihaoguo
ms.date: 11/28/2024
---

In this tutorial, you set up an HA/DR solution consisting of an active-passive application infrastructure tier with an active-passive database tier, and in which both tiers span two geographically different sites. At the first site, both the application infrastructure tier and the database tier are active. At the second site, the secondary domain is restored with Azure Site Recovery service, and the secondary database is on standby.