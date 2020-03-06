---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Determine whether JMS Queues or Topics are in use

If your application is using JMS Queues or Topics, you'll need to migrate them to an externally-hosted JMS server (for example, to Azure Service Bus; see [Use Service Bus as a message broker](/azure/app-service/containers/configure-language-java#use-service-bus-as-a-message-broker)).

If JMS persistent stores have been configured, you must capture their configuration and apply it after the migration.
