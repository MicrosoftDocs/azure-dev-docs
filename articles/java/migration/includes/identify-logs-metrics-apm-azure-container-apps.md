---
author: KarlErickson
ms.author: karler
ms.date: 9/30/2024
---

#### Identify log aggregation solutions

Identify any log aggregation solutions in use by the applications you're migrating. You need to configure diagnostic settings in migration to make logged events available for consumption. For more information, see [Ensure console logging and configure diagnostic settings](#ensure-console-logging-and-configure-diagnostic-settings) section.

#### Identify application performance management (APM) agents

Identify any application performance management agents used by your applications. Azure Containers Apps doesn't offer built-in support for APM integration. You need to prepare your container image or integrate APM tool directly into your code. If you want to measure your application's performance but haven't integrated any APM yet, consider using Azure Application Insights. For more information, see the [Migration](#configure-application-performance-management-apm-integrations) section.
