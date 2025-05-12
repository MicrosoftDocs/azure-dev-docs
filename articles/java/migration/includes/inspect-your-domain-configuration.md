---
author: KarlErickson
ms.author: karler
ms.reviewer: edburns
ms.date: 1/21/2020
---

### Inspect your domain configuration

The main configuration unit in WebLogic Server is the domain. As such, the **config.xml** file contains a wealth of configuration that you must carefully consider for migration. The file includes references to additional XML files that are stored in subdirectories. Oracle advises that you should normally use the **Administration Console** to configure WebLogic Server's manageable objects and services and allow WebLogic Server to maintain the **config.xml** file. For more information, see [Domain Configuration Files](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/14.1.2/domcf/config_files.html).

#### Inside your application

Inspect the **WEB-INF/weblogic.xml** file and/or the **WEB-INF/web.xml** file. Look for configuration that would be more appropriate to externalize outside of the application.
