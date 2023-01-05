---
title: Spring Boot Starters for Azure
description: This article describes the various Spring Boot Starters that are available for Azure.
documentationcenter: java
ms.date: 12/07/2022
ms.service: azure-java
ms.tgt_pltfrm: multiple
ms.topic: article
ms.custom: devx-track-java, spring-cloud-azure
---

# Spring Boot Starters for Azure

This article describes the various Spring Boot Starters for the [Spring Initializr] that provide Java developers with integration features for working with Microsoft Azure.

>[!div class="mx-imgBorder"]
![Configure Azure Spring Boot Starters with Initializr][configure-azure-spring-boot-starters-with-initializr]

The following Spring Boot Starters are currently available for Azure:

* **[Azure Support](#azure-support)**

   Provides auto-configuration support for Azure Services; e.g. Service Bus, Storage, Active Directory, etc.

* **[Azure Active Directory](#azure-active-directory)**

   Provides integration support for Spring Security with Azure Active Directory for authentication.

* **[Azure Key Vault Secrets](#azure-key-vault-secrets)**

   Provides Spring value annotation support for integration with Azure Key Vault Secrets.

* **[Azure Storage](#azure-storage)**

   Provides Spring Boot support for Azure Storage services.

<a name="azure-support"></a>
## Azure Support

This Spring Boot Starter provides auto-configuration support for Azure Services; for example: Service Bus, Storage, Active Directory, Azure Cosmos DB, Key Vault, etc.

For examples of how to use the various Azure features that are provided by this starter, see the following:

* The [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples) repo on GitHub.

When you add this starter to a Spring Boot project, the following changes are made to the *pom.xml* file:

* The following property is added to `<properties>` element:

   ```xml
   <properties>
      <!-- Other properties will be listed here -->
      <java.version>1.8</java.version>
      <version.spring.cloud.azure>4.5.0</version.spring.cloud.azure>
   </properties>
   ```

* The default `spring-boot-starter` dependency is replaced with the following:

    ```xml
    <dependencies>
        <dependency>
            <groupId>com.azure.spring</groupId>
            <artifactId>spring-cloud-azure-starter</artifactId>
        </dependency>
    </dependencies>
    ```

* The following section is added to the file:

   ```xml
   <dependencyManagement>
      <dependencies>
         <dependency>
            <groupId>com.azure.spring</groupId>
            <artifactId>spring-cloud-azure-dependencies</artifactId>
            <version>${version.spring.cloud.azure}</version>
            <type>pom</type>
            <scope>import</scope>
         </dependency>
      </dependencies>
   </dependencyManagement>
   ```

<a name="azure-active-directory"></a>
## Azure Active Directory

This Spring Boot Starter provides auto-configuration support for Spring Security in order to provide integration with Azure Active Directory for authentication.

For examples of how to use the Azure Active Directory features that are provided by this starter, see the following:

* The [spring-cloud-azure-starter-active-directory samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.5.0/aad/spring-cloud-azure-starter-active-directory) repo on GitHub.

When you add this starter to a Spring Boot project, the following changes are made to the *pom.xml* file:

* The following property is added to `<properties>` element:

   ```xml
   <properties>
      <!-- Other properties will be listed here -->
      <java.version>1.8</java.version>
      <version.spring.cloud.azure>4.5.0</version.spring.cloud.azure>
   </properties>
   ```

* The default `spring-boot-starter` dependency is replaced with the following:

    ```xml
    <dependencies>
        <dependency>
            <groupId>com.azure.spring</groupId>
            <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
        </dependency>
    </dependencies>
    ```

* The following section is added to the file:

   ```xml
   <dependencyManagement>
      <dependencies>
         <dependency>
            <groupId>com.azure.spring</groupId>
            <artifactId>spring-cloud-azure-dependencies</artifactId>
            <version>${version.spring.cloud.azure}</version>
            <type>pom</type>
            <scope>import</scope>
         </dependency>
      </dependencies>
   </dependencyManagement>
   ```

## Azure Key Vault Secrets

To manage secrets stored in [Azure Key Vault Secrets](/azure/developer/key-vault/secrets/) a in Spring Boot application, Spring Cloud Azure provides the following features:

* An [Azure Key Vault Secrets client](/azure/key-vault/secrets/quick-create-java) as a [bean](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-definition) in a [Spring IOC container](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans). For more information, see the [secret-client](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/keyvault/spring-cloud-azure-starter-keyvault-secrets/secret-client) sample project.
* The ability to retrieve secrets from Azure Key Vault Secrets and store these secrets in [Spring PropertySource](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-property-source-abstraction). You can retrieve the secrets by using the [@Value](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-value-annotations) annotation. For more information, see the [property-source](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/keyvault/spring-cloud-azure-starter-keyvault-secrets/property-source) sample project.

When you add this starter to a Spring Boot project, the following changes are made to the *pom.xml* file:

* The following property is added to `<properties>` element:

   ```xml
   <properties>
      <!-- Other properties will be listed here -->
      <java.version>1.8</java.version>
      <version.spring.cloud.azure>4.5.0</version.spring.cloud.azure>
   </properties>
   ```

* The default `spring-boot-starter` dependency is replaced with the following:

    ```xml
    <dependencies>
        <dependency>
            <groupId>com.azure.spring</groupId>
            <artifactId>spring-cloud-azure-starter-keyvault-secrets</artifactId>
        </dependency>
    </dependencies>
    ```

* The following section is added to the file:

   ```xml
   <dependencyManagement>
      <dependencies>
         <dependency>
            <groupId>com.azure.spring</groupId>
            <artifactId>spring-cloud-azure-dependencies</artifactId>
            <version>${version.spring.cloud.azure}</version>
            <type>pom</type>
            <scope>import</scope>
         </dependency>
      </dependencies>
   </dependencyManagement>
   ```

<a name="azure-storage"></a>
## Azure Storage

This Spring Boot Starter provides Spring Boot integration support for Azure Storage services.

For examples of how to use the Azure Storage features that are provided by this starter, see the following:

* [How to use the Spring Boot Starter for Azure Storage](configure-spring-boot-starter-java-app-with-azure-storage.md)
* [spring-cloud-azure-starter-integration-storage-queue samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/spring-cloud-azure_4.5.0/storage/spring-cloud-azure-starter-integration-storage-queue)

When you add this starter to a Spring Boot project, the following changes are made to the *pom.xml* file:

* The following property is added to `<properties>` element:

   ```xml
   <properties>
      <!-- Other properties will be listed here -->
      <java.version>1.8</java.version>
      <version.spring.cloud.azure>4.5.0</version.spring.cloud.azure>
   </properties>
   ```

* The default `spring-boot-starter` dependency is replaced with the following:

    ```xml
    <dependencies>
        <dependency>
            <groupId>com.azure.spring</groupId>
            <artifactId>spring-cloud-azure-starter-integration-storage-queue</artifactId>
        </dependency>
    </dependencies>
    ```

* The following section is added to the file:

   ```xml
   <dependencyManagement>
      <dependencies>
         <dependency>
            <groupId>com.azure.spring</groupId>
            <artifactId>spring-cloud-azure-dependencies</artifactId>
            <version>${version.spring.cloud.azure}</version>
            <type>pom</type>
            <scope>import</scope>
         </dependency>
      </dependencies>
   </dependencyManagement>
   ```

## Application Insights

Azure Monitor Application Insights can help you understand how your app is performing and how it's being used. Application Insights uses the Java agent to enable the application monitor. There are no code changes needed, and you can enable the Java agent with just a couple of configuration changes. For instructions and more information, see [Java codeless application monitoring Azure Monitor Application Insights](/azure/azure-monitor/app/java-in-process-agent#configuration-options).

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

### Additional Resources

For more information about using [Spring Boot] applications on Azure, see [Spring on Azure].

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

For help with getting started with your own Spring Boot applications, see [Spring Initializr](https://start.spring.io/).

<!-- URL List -->

[Azure for Java Developers]: ../index.yml
[Working with Azure DevOps and Java]: /azure/devops/
[Spring Boot]: https://spring.io/projects/spring-boot/
[Spring on Azure]: ./index.yml
[Spring Framework]: https://spring.io/
[Spring Initializr]: https://start.spring.io/

<!-- IMG List -->

[configure-azure-spring-boot-starters-with-initializr]: media/spring-initializer/2.7.1/mvn-java8.png
