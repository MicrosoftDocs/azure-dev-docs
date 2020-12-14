---
title: Spring Boot Starters for Azure
description: This article describes the various Spring Boot Starters that are available for Azure.
documentationcenter: java
ms.date: 09/29/2020
ms.service: multiple
ms.tgt_pltfrm: multiple
ms.topic: article
ms.custom: devx-track-java
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

* **[Azure Key Vault](#azure-key-vault)**

   Provides Spring value annotation support for integration with Azure Key Vault Secrets.

* **[Azure Storage](#azure-storage)**

   Provides Spring Boot support for Azure Storage services.
   
   > [!NOTE]
   >
   > The new version of the Spring Boot Starter for Azure Storage doesn't currently support adding an Azure storage dependency from within Spring Initializr. However, you can add the dependency by modifying the *pom.xml* file after the project is generated.
   > 

<a name="azure-support"></a>
## Azure Support

This Spring Boot Starter provides auto-configuration support for Azure Services; for example: Service Bus, Storage, Active Directory, Cosmos DB, Key Vault, etc.

For examples of how to use the various Azure features that are provided by this starter, see the following:

* <https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-samples>

When you add this starter to a Spring Boot project, the following changes are made to the *pom.xml* file:

* The following property is added to `<properties>` element:

   ```xml
   <properties>
      <!-- Other properties will be listed here -->
      <java.version>1.8</java.version>
      <azure.version>2.3.5</azure.version>
   </properties>
   ```

* The default `spring-boot-starter` dependency is replaced with the following:

    ```xml
    <dependencies>
        <dependency>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>azure-spring-boot-starter</artifactId>
        </dependency>
    
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>
    ```

* The following section is added to the file:

   ```xml
   <dependencyManagement>
      <dependencies>
         <dependency>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>azure-spring-boot-bom</artifactId>
            <version>${azure.version}</version>
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

* <https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-samples/>

When you add this starter to a Spring Boot project, the following changes are made to the *pom.xml* file:

* The following property is added to `<properties>` element:

   ```xml
   <properties>
      <!-- Other properties will be listed here -->
      <java.version>1.8</java.version>
      <azure.version>2.3.5</azure.version>
   </properties>
   ```

* The default `spring-boot-starter` dependency is replaced with the following:

    ```xml
    <dependencies>
        <dependency>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>azure-active-directory-spring-boot-starter</artifactId>
        </dependency>
    
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>
    ```

* The following section is added to the file:

   ```xml
   <dependencyManagement>
      <dependencies>
         <dependency>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>azure-spring-boot-bom</artifactId>
            <version>${azure.version}</version>
            <type>pom</type>
            <scope>import</scope>
         </dependency>
      </dependencies>
   </dependencyManagement>
   ```

<a name="azure-key-vault"></a>
## Azure Key Vault

This Spring Boot Starter provides Spring value annotation support for integration with Azure Key Vault Secrets.

For examples of how to use the Azure Key Vault features that are provided by this starter, see the following:

* <https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-samples/azure-spring-boot-sample-keyvault-secrets>

When you add this starter to a Spring Boot project, the following changes are made to the *pom.xml* file:

* The following property is added to `<properties>` element:

   ```xml
   <properties>
      <!-- Other properties will be listed here -->
      <java.version>1.8</java.version>
      <azure.version>2.3.5</azure.version>
   </properties>
   ```

* The default `spring-boot-starter` dependency is replaced with the following:

    ```xml
    <dependencies>
        <dependency>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>azure-keyvault-secrets-spring-boot-starter</artifactId>
        </dependency>
    
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>
    ```

* The following section is added to the file:

   ```xml
   <dependencyManagement>
      <dependencies>
         <dependency>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>azure-spring-boot-bom</artifactId>
            <version>${azure.version}</version>
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
* <https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/spring/azure-spring-boot-samples/azure-spring-cloud-sample-storage-queue-operation>

When you add this starter to a Spring Boot project, the following changes are made to the *pom.xml* file:

* The following property is added to `<properties>` element:

   ```xml
   <properties>
      <!-- Other properties will be listed here -->
      <java.version>1.8</java.version>
      <azure.version>2.3.5</azure.version>
   </properties>
   ```

* The default `spring-boot-starter` dependency is replaced with the following:

    ```xml
    <dependencies>
        <dependency>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>spring-starter-azure-storage</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>
    ```

* The following section is added to the file:

   ```xml
   <dependencyManagement>
      <dependencies>
         <dependency>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>azure-spring-boot-bom</artifactId>
            <version>${azure.version}</version>
            <type>pom</type>
            <scope>import</scope>
         </dependency>
      </dependencies>
   </dependencyManagement>
   ```

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Spring on Azure](./index.yml)

### Additional Resources

For more information about using [Spring Boot] applications on Azure, see [Spring on Azure].

For more information about using Azure with Java, see the [Azure for Java Developers] and the [Working with Azure DevOps and Java].

For help with getting started with your own Spring Boot applications, see the **Spring Initializr** at https://start.spring.io/.

<!-- URL List -->

[Azure for Java Developers]: ../index.yml
[Working with Azure DevOps and Java]: /azure/devops/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring on Azure]: ./index.yml
[Spring Framework]: https://spring.io/
[Spring Initializr]: https://start.spring.io/

<!-- IMG List -->

[configure-azure-spring-boot-starters-with-initializr]: media/spring-boot-starters-for-azure/configure-azure-spring-boot-starters-with-initializr.png
