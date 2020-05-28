---
author: yevster
ms.author: yebronsh
ms.date: 5/28/2020
---

#### Identify local state

On PAAS environments, no application is guaranteed to be running exactly once at any given time. Even if you configure an application to run in a single instance, a duplicate instance can be created if:

* The application must be relocated to a physical host due to failure or system update
* The application is being updated

In any of these cases, the original instance will remain running until the new instance has finished starting up. This has potentially significant implications for your application:

* No [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) can be guaranteed to be truly single.
* Any data that has not been persisted to outside storage will likely be lost far sooner than it would on a single physical server or VM.

Before migrating to Azure Spring Cloud, ensure that your code does not contain local state that may not be lost or duplicated.
