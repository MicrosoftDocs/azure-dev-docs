---
author: KarlErickson
ms.author: karler
ms.reviewer: haiche
ms.date: 05/31/2023
---

### Determine whether session replication is used

If your application relies on session replication, you have the following options:

* For [HTTP sessions](https://www.ibm.com/docs/en/was/9.0.5?topic=applications-configuring-http-sessions), according to the level of session management, you can use cache or a database to collect session data.
* For [Distributed sessions](https://www.ibm.com/docs/en/was/9.0.5?topic=sessions-distributed), you can save sessions in a database using database session persistence.
* For [Dynamic cache](https://www.ibm.com/docs/en/was/9.0.5?topic=extensions-introduction-dynamic-cache), you can manage session data in cache or a database.
* You can refactor your application to use a database for session management.
* You can refactor your application to externalize the session to Azure Redis Service. For more information, see [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-overview).

For all of these options, it's a good idea to master how Liberty does HTTP Session State Replication. The following documents help you understand how to manage HTTP Sessions in Liberty:

* [Configuring Liberty session persistence to a database](https://www.ibm.com/docs/was-liberty/base?topic=manually-configuring-liberty-session-persistence-database)
* [Configuring Liberty session persistence with JCache](https://www.ibm.com/docs/was-liberty/base?topic=manually-configuring-liberty-session-persistence-jcache)
