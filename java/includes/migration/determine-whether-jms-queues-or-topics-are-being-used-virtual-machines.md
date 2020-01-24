---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Determine whether JMS Queues or Topics are being used

If your application is using JMS Queues or Topics, you'll need to migrate them to an externally hosted JMS server.  Azure Service Bus and the Advanced Message Queuing Protocol can be a great migration strategy for those using JMS.  See the documentation on [Azure Service Bus](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp).

If JMS persistent stores have been configured, their configuration must be captured and applied after the migration.

If you are using Oracle Message Broker, this software can be migrated to Azure virtual machines and used as-is.



