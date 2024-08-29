---
author: KarlErickson
ms.author: karler
ms.date: 7/21/2020
---

#### Determine whether your application relies on scheduled jobs

Ephemeral application such as Unix cron jobs or short-live applications based on Spring Batch framework should run as a job on Azure Container Apps. For details, see [Jobs in Azure Container Apps](/azure/container-apps/jobs). If your application is a long-running application and executes tasks regularly using a scheduling framework such as Quartz or Spring Batch, Azure Container Apps can host that application. However, the application must handle scaling appropriately to avoid race conditions where the same application instances are executed more than once per scheduled period during scale-out or rolling upgrade.

Inventory any scheduled tasks running on the production servers, inside or outside your application code.
