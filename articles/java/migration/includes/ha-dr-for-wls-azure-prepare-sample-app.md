---
author: KarlErickson
ms.author: haiche
ms.date: 3/1/2024
---

Build and package a sample CRUD Java/JakartaEE EE application that is deployed and running on WLS clusters for failover test later.

The app uses WebLogic Server [JDBC session persistence](https://github.com/Azure-Samples/azure-cafe/blob/main/weblogic-cafe/src/main/webapp/WEB-INF/weblogic.xml#L8) to store HTTP session data. The datasource *jdbc/WebLogicCafeDB* stores the session data to enable failover and load balancing across a cluster of WebLogic Servers. It configures [persistence schema](https://github.com/Azure-Samples/azure-cafe/blob/main/weblogic-cafe/src/main/resources/META-INF/persistence.xml#L7) to persist application data *coffee* in the same datasource *jdbc/WebLogicCafeDB*.

Use the following steps to build and package the sample:

1. Check out the repository by using `git clone https://github.com/Azure-Samples/azure-cafe.git`.
1. Navigate to the path where the repository was downloaded by using `cd azure-cafe`.
1. Check out the tag corresponding to this article by using `git checkout 20231206`. If you see a message about `Detached HEAD`, it's safe to ignore.
1. Change to its subdirectory *weblogic-cafe* by using `cd weblogic-cafe`
1. Compile and package the sample application by using `mvn clean package`.

The package should be successfully generated and located at *\<parent-path-to-your-local-clone>/azure-cafe/weblogic-cafe/target/weblogic-cafe.war*. If you don't see the package, you must troubleshoot and resolve the issue before you continue.