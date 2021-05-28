---
author: VaijanathB
ms.author: vaangadi
ms.date: 05/27/2020
---

### Validate that the supported Java version works correctly

JBoss EAP on Azure App Service runs on Java 8 and 11, so you'll need to confirm that your application uses Java 8 or 11. If it uses an earlier version of Java, consider upgrading to Java 8 or 11. (JBoss EAP on App Service will support newer versions of Java, such as java 17, as they become available.)

[!INCLUDE [note-obtain-your-current-java-version](note-obtain-your-current-java-version.md)]

For guidance on what version of JDK to use to run JBoss EAP, see [Supported Configurations](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.2/html/7.2.0_release_notes/supported_configs) in the JBoss EAP documentation.
