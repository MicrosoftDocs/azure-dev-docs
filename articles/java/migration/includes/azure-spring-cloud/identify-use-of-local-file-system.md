---
author: yevster
ms.author: yebronsh
ms.date: 4/15/2020
---

#### Identify use of local file system

Find any instances where your services write to and/or read from the local file system. Identify where short-term/temporary files are written and read and where long-lived files are written and read.

> [!NOTE]
> Azure Spring Cloud provides 5GB of temporary storage per Azure Spring Cloud instance, mounted in `/tmp`. If temporary files are written in excess of that limit or into a different location, code changes will be required.

[!INCLUDE [static-content](includes/migration/static-content.md)]

[!INCLUDE [azure-spring-cloud/switch-to-a-supported-platform](includes/migration/azure-spring-cloud/switch-to-a-supported-platform.md)]