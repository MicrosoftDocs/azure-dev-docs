---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 04/03/2023
---

### Inventory JNDI resources

Inventory all JNDI resources. For example, datasources such as databases may have an associated JNDI name that allows JPA to correctly bind instances of `EntityManager` to a particular database. For more information on JNDI resources and databases, see [WebSphere Data Sources](https://www.ibm.com/docs/en/was-nd/9.0.5?topic=concepts-data-sources) in the IBM documentation. Other JNDI-related resources, such as JMS message brokers, may require migration or reconfiguration. For more information on JMS configuration, see [Using JMS resources](https://www.ibm.com/docs/en/was/9.0.5?topic=applications-using-jms-resources).
