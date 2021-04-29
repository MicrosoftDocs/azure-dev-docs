---
author: yevster
ms.author: yebronsh
ms.date: 4/15/2020
---

#### Identify external caches

Identify any external caches in use. Frequently, Redis is used via Spring Data Redis. For configuration information, see the [Spring Data Redis](https://spring.io/projects/spring-data-redis) documentation.

Determine whether session data is being cached via [Spring Session](https://spring.io/projects/spring-session) by searching for the respective configuration (in [Java](https://docs.spring.io/spring-session/docs/current/reference/html5/#httpsession-redis-jc) or [XML](https://docs.spring.io/spring-session/docs/current/reference/html5/#httpsession-redis-xml)).
