---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 09/20/2024
---

### Determine whether Java Message Service (JMS) Queues or Topics are in use

If your application is using JMS Queues or Topics, you need to migrate them to an externally hosted JMS server. One strategy for those using JMS is to use Azure Service Bus and the Advanced Message Queuing Protocol. For more information, see [Use Java Message Service 1.1 with Azure Service Bus standard and AMQP 1.0](/azure/service-bus-messaging/service-bus-java-how-to-use-jms-api-amqp).

If you've configured JMS persistent stores, you must capture their configuration and apply it after the migration.

If you're using IBM MQ, you can migrate this software to Azure Virtual Machines and use it as-is.

Microsoft has a solution to integrate IBM MQ with Logic Apps. For more information, see [Connect to an IBM MQ server from a workflow in Azure Logic Apps](/azure/connectors/connectors-create-api-mq).
