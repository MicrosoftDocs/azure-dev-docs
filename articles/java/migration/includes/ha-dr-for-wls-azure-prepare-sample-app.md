---
author: KarlErickson
ms.author: haiche
ms.date: 04/29/2024
---

In this section, you build and package a sample CRUD Java/JakartaEE application that you later deploy and run on WLS clusters for failover testing.

The app uses WebLogic Server [JDBC session persistence](https://github.com/Azure-Samples/azure-cafe/blob/main/weblogic-cafe/src/main/webapp/WEB-INF/weblogic.xml#L8) to store HTTP session data. The datasource `jdbc/WebLogicCafeDB` stores the session data to enable failover and load balancing across a cluster of WebLogic Servers. It configures a [persistence schema](https://github.com/Azure-Samples/azure-cafe/blob/main/weblogic-cafe/src/main/resources/META-INF/persistence.xml#L7) to persist application data `coffee` in the same datasource `jdbc/WebLogicCafeDB`.

Use the following steps to build and package the sample:

1. Use the following commands to clone the sample repository and check out the tag corresponding to this article:

   ```bash
   git clone https://github.com/Azure-Samples/azure-cafe.git
   cd azure-cafe
   git checkout 20231206
   ```

   If you see a message about `Detached HEAD`, it's safe to ignore.

1. Use the following commands to navigate to the sample directory, and then compile and package the sample:

   ```bash
   cd weblogic-cafe
   mvn clean package
   ```

When the package is successfully generated, you can find it at **\<parent-path-to-your-local-clone>/azure-cafe/weblogic-cafe/target/weblogic-cafe.war**. If you don't see the package, you must troubleshoot and resolve the issue before you continue.
