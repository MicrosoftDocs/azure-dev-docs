---
author: KarlErickson
ms.author: karler
ms.date: 1/22/2020
---

#### Switch to a supported platform

If you create your Dockerfile manually and deploy containerized application to Azure Container Apps, you take full control over your deployment including JRE/JDK versions. 

For deployment from artifacts, Azure Container Apps also offers specific versions of Java (8, 11, 17, and 21) and specific versions of Spring Boot and Spring Cloud components. To ensure compatibility, first migrate your application to one of the supported versions of Java in its current environment, then proceed with the remaining migration steps. Be sure to fully test the resulting configuration. Use the latest stable release of your Linux distribution in such tests.

[!INCLUDE [note-obtain-your-current-java-version](note-obtain-your-current-java-version.md)]

For supported versions of Java, Spring Boot, and Spring Cloud, as well instructions for updating, see [Java on Azure Container Apps overview](/azure/container-apps/java-overview).
