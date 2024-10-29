---
author: KarlErickson
ms.author: karler
ms.date: 5/28/2020
---

#### Identify local state

On PaaS environments, no application is guaranteed to be running exactly once at any given time. Even if you configure an application to run in a single instance, a duplicate instance can be created in the following cases:

* The application must be relocated to a physical host due to failure or system update.
* The application is being updated.

In any of these cases, the original instance remains running until the new instance has finished starting up. This pattern can have the following potentially significant implications for your application:

* No [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) can be guaranteed to be truly single.
* Any data not persisted to outside storage will likely be lost sooner than it would be on a single physical server or VM.

Before migrating to Azure Container Apps, ensure that your code doesn't contain local state that must not be lost or duplicated. If local state exists, change the code to store that state outside the application. Cloud-ready applications typically store application state in locations such as the following options:

* [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-java-get-started)
* [Azure Cosmos DB](/azure/cosmos-db/create-sql-api-java)
* Another external database, such as [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview), [Azure Database for MySQL](/azure/mysql/overview), or [Azure Database for PostgreSQL](/azure/postgresql/overview).
* [Azure Storage](/azure/storage/blobs), used for storing unstructured data or even serialized objects.