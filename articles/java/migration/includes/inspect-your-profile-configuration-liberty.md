---
author: KarlErickson
ms.author: haiche
ms.date: 05/31/2023
---

### Inspect your profile configuration

The main configuration unit in WAS is the profile. As such, the **resources.xml** file contains a wealth of configuration that you must carefully consider for migration. The file includes references to other XML files that are stored in subdirectories. For more information, see [Managing profiles on distributed and IBM i operating systems](https://www.ibm.com/docs/was-nd/9.0.5?topic=environment-managing-profiles-distributed-i-operating-systems).

#### Inside your application

Inspect the **deployment.xml** file and/or the **WEB-INF/web.xml** file.
