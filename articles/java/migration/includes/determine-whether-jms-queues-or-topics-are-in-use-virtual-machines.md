---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Determine whether JMS Queues or Topics are in use

If your application is using JMS Queues or Topics, you'll need to migrate them to an externally-hosted JMS server. Azure Service Bus and the Advanced Message Queuing Protocol can be a great migration strategy for those using JMS. For more information, see [Use the Java Message Service (JMS) with Azure Service Bus and AMQP 1.0](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp).

If JMS persistent stores have been configured, you must capture their configuration and apply it after the migration.

If you are using Oracle Message Broker, you can migrate this software to Azure virtual machines and use it as-is.
