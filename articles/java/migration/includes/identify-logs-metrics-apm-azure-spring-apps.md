---
author: KarlErickson
ms.author: karler
ms.date: 4/15/2020
---

#### Identify log aggregation solutions

Identify any log aggregation solutions in use by the applications you're migrating. You need to configure diagnostic settings in migration to make logged events available for consumption. For more information, see the [Ensure console logging and configure diagnostic settings](#ensure-console-logging-and-configure-diagnostic-settings) section.

#### Identify application performance management (APM) agents

Identify any application performance monitoring agents in use with your applications. Azure Spring Apps supports integration with Application Insights, New Relic, Elastic APM, Dynatrace, and AppDynamics. If the application is using a supported APM, configure the integration in migration. If the application isn't using a supported APM, consider using Application Insights instead. For more information, see the [Migration](#configure-application-performance-management-apm-integrations) section.
