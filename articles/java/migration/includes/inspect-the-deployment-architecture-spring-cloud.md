---
author: yevster
ms.author: yebronsh
ms.date: 5/4/2020
---

### Inspect the deployment architecture

#### Document hardware requirements for each service

For each of your Spring Cloud services (not including the configuration server, registry, or gateway), document the following information:

* The number of instances running.
* The number of CPUs allocated to each instance.
* The amount of RAM allocated to each instance.

#### Document geo-replication/distribution

Determine whether the Spring Cloud applications are currently distributed among several regions or data centers. Document the uptime requirements/SLA for the applications you're migrating.

#### Identify clients that bypass the service registry

Identify any client applications that invoke any of the services to be migrated without using the Spring Cloud Service Registry. After the migration, such invocations will no longer be possible. Update such clients to use [Spring Cloud OpenFeign](https://spring.io/projects/spring-cloud-openfeign) before migration.
