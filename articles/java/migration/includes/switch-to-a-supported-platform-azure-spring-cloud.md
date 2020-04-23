---
author: yevster
ms.author: yebronsh
ms.date: 1/22/2020
---

#### Switch to a supported platform

Azure Spring Cloud offers specific versions of Java and specific versions of Spring Boot and Spring Cloud. To ensure compatibility, migrate your application to one of the supported versions of Java in its current environment before you proceed with any of the remaining steps. Be sure to fully test the resulting configuration. Use the latest stable release of your Linux distribution in such tests.

> [!NOTE]
> This validation is especially important if your current server is running on an unsupported JDK (such as Oracle JDK or IBM OpenJ9).

To obtain your current Java version, sign in to your production server and run the following command:

```bash
java -version
```

See [Prepare a Java Spring application for deployment in Azure Spring Cloud](/azure/spring-cloud/spring-cloud-tutorial-prepare-app-deployment) for supported versions of Java, Spring Boot, and Spring Cloud, as well instructions for updating.
