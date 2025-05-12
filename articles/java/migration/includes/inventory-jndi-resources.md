---
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.date: 09/09/2024
---

### Inventory JNDI resources

Inventory all JNDI resources. For example, datasources such as databases may have an associated JNDI name that allows JPA to correctly bind instances of `EntityManager` to a particular database. For more information on JNDI resources and databases, see [WebLogic Server Data Sources](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/jdbca/configure-database-connectivity.html) in the Oracle documentation. Other JNDI-related resources, such as JMS message brokers, may require migration or reconfiguration. For more information on JMS configuration see [Understanding JMS Resource Configuration](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/jmsad/overview.html).
