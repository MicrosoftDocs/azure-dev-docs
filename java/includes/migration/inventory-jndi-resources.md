---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Inventory JNDI resources

Inventory all JNDI resources. For example, datasources such as databases may have an associated JNDI name that allows JPA to correctly bind instances of `EntityManager` to a particular database. For more on JNDI resources and databases, [see the Oracle documentation](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/intro/jdbc.html#GUID-640046E8-418B-4FB9-8200-9D9E63DBF3CA). Other JNDI-related resources, such as JMS message brokers, may require migration or reconfiguration. For more information on JMS configuration, see [JMS Configuration Resources](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/jmsad/overview.html#GUID-7847DC24-31D4-4509-A1F4-3E772F436EC7).
