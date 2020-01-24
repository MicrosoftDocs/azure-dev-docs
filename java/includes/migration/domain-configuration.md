---
author: edburns
ms.author: edburns
ms.date: 1/21/2020
---

### Domain configuration

The main configuration unit in WebLogic Server is the domain. As such, the *config.xml* file contains a wealth of configuration, which must be carefully considered for migration.  The file includes references to additional XML files that are stored in subdirectories.  Oracle advises you should normally use the Administration Console to configure WebLogic Server's manageable objects and services and allow WebLogic Server to maintain the config.xml file.  For more on domain configuration files, see [Domain Configuration Files](https://docs.oracle.com/en/middleware/fusion-middleware/weblogic-server/12.2.1.4/domcf/config_files.html#GUID-068FC395-4F1E-41E2-A7A5-52A8E973C0A0)

#### Inside your application

Inspect the *WEB-INF/weblogic.xml* file and/or the *WEB-INF/web.xml* file.

