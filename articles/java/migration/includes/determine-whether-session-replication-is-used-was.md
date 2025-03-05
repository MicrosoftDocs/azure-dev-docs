---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 04/03/2023
---

### Determine whether session replication is used

If your application relies on session replication, you have the following options:

* For [HTTP sessions](https://www.ibm.com/docs/en/was/9.0.5?topic=applications-configuring-http-sessions), according to the level of session management, you can use memory or a database to collect session data.
* For [Distributed sessions](https://www.ibm.com/docs/en/was/9.0.5?topic=sessions-distributed), you can save sessions in a database using database session persistence.
* For [Dynamic cache](https://www.ibm.com/docs/en/was/9.0.5?topic=extensions-introduction-dynamic-cache), you can manage session data in memory-to-memory replication or a database.
* Refactor your application to use a database for session management.
* Refactor your application to externalize the session to Azure Redis Service. For more information, see [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-overview).

For all of these options, it's a good idea to master how WAS does HTTP Session State Replication. For more information, see [Administering session beans](https://www.ibm.com/docs/en/was/9.0.5?topic=applications-administering-session-beans) in the IBM documentation.
