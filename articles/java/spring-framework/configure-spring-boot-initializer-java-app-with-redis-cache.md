---
title: Use Azure Redis Cache in Spring
description: Configure a Spring Boot application created with the Spring Initializr to use the Redis in the cloud with Azure Cache for Redis.
author: KarlErickson
ms.author: karler
ms.reviewer: xiada
ms.date: 04/18/2025
ms.topic: how-to
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
zone_pivot_groups: redis-type
---

# Use Azure Redis Cache in Spring

[Azure Cache for Redis](/azure/azure-cache-for-redis/) provides an in-memory data store based on the Redis software. [Redis](https://redis.io/) improves the performance and scalability of an application that uses backend data stores heavily.

This tutorial demonstrates how to use a Redis cache to store and retrieve data in a Spring Boot application.

In this tutorial, we include two authentication methods: Microsoft Entra authentication and Redis authentication. The Passwordless tab shows the Microsoft Entra authentication and the Password tab shows the Redis authentication.

Microsoft Entra authentication is a mechanism for connecting to Azure Cache for Redis using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Microsoft services in a central location, which simplifies permission management.

Redis authentication uses passwords in Redis. If you choose to use passwords as credentials, you need to manage the passwords by yourself.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/).

- [Java Development Kit (JDK)](/java/azure/jdk/) version 17 or higher.

- [Apache Maven](http://maven.apache.org/), version 3.0 or higher.

- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.

- A Redis cache instance. If you don't have one, see [Quickstart: Create an open-source Redis cache](/azure/azure-cache-for-redis/quickstart-create-redis).

- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web**  and **Spring Data Reactive Redis** dependencies, and then select Java version 8 or higher.

## Caching Data to Azure Cache for Redis

With an Azure Cache for Redis instance, you can cache data using Spring Cloud Azure.

To install the Spring Cloud Azure Starter Data Redis with Lettuce module, add the following dependencies to your **pom.xml** file:

  ```xml
  <dependencies>
   <dependency>
     <groupId>com.azure.spring</groupId>
     <artifactId>spring-boot-starter-web</artifactId>
   </dependency>
   <dependency>
     <groupId>com.azure.spring</groupId>
     <artifactId>spring-cloud-azure-starter-data-redis-lettuce</artifactId>
   </dependency>
   <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
  </dependencies>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>5.22.0</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  ```

  > [!NOTE]
  > This Bill of Material (BOM) should be configured in the `<dependencyManagement>` section of your **pom.xml** file. This configuration ensures that all Spring Cloud Azure dependencies are using the same version. For more information about the version used for this BOM, see [Which Version of Spring Cloud Azure Should I Use](https://github.com/Azure/azure-sdk-for-java/wiki/Spring-Versions-Mapping#which-version-of-spring-cloud-azure-should-i-use).

### Code the application

To use a Redis cache to store and retrieve data, configure the application by using the following steps:

#### [Microsoft Entra ID authentication (recommended)](#tab/entraid)

1. Configure Redis cache credentials in the **application.properties** configuration file, as shown in the following example.

   ::: zone pivot="azure-managed-redis"

     ```properties
     spring.data.redis.host=<your-redis-name>.redis.cache.windows.net
     spring.data.redis.port=10000
     spring.data.redis.username=<your-redis-username>
     spring.data.redis.ssl.enabled=true
     spring.data.redis.azure.passwordless-enabled=true
     ```

   ::: zone-end

   ::: zone pivot="azure-cache-redis"

     ```properties
     spring.data.redis.host=<your-redis-name>.redis.cache.windows.net
     spring.data.redis.port=6380
     spring.data.redis.username=<your-redis-username>
     spring.data.redis.ssl.enabled=true
     spring.data.redis.azure.passwordless-enabled=true
     ```

   ::: zone-end

   > [!NOTE]
   > To get the value for `username`, follow the instructions in the [Enable Microsoft Entra ID authentication on your cache](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication#enable-microsoft-entra-id-authentication-on-your-cache) section of [Use Microsoft Entra ID for cache authentication](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication), and copy the **username** value.

1. Edit the startup class file to show the following content. This code stores and retrieves data.

   ```java
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.data.redis.core.StringRedisTemplate;
   import org.springframework.data.redis.core.ValueOperations;

   @SpringBootApplication
   public class DemoCacheApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(DemoCacheApplication.class);

       @Autowired
       private StringRedisTemplate template;

       public static void main(String[] args) {
           SpringApplication.run(DemoCacheApplication.class, args);
       }

       @Override
       public void run(String... args) {
           ValueOperations<String, String> ops = this.template.opsForValue();
           String key = "testkey";
           if(!this.template.hasKey(key)){
               ops.set(key, "Hello World");
               LOGGER.info("Add a key is done");
           }
           LOGGER.info("Return the value from the cache: {}", ops.get(key));
       }

   }
   ```

#### [Access key authentication](#tab/accesskey)

1. Configure Redis cache credentials in the **application.properties** configuration file, as shown in the following example.


   ::: zone pivot="azure-managed-redis"

     ```properties
     spring.data.redis.host=<your-redis-name>.redis.cache.windows.net
     spring.data.redis.port=10000
     spring.data.redis.password=<your-redis-password>
     spring.data.redis.ssl.enabled=true
     ```

   ::: zone-end

   ::: zone pivot="azure-cache-redis"

     ```properties
     spring.data.redis.host=<your-redis-name>.redis.cache.windows.net
     spring.data.redis.port=6380
     spring.data.redis.password=<your-redis-password>
     spring.data.redis.ssl.enabled=true
     ```

   ::: zone-end


1. Edit the startup class file to show the following content. This code stores and retrieves data.

   ```java
   import org.slf4j.Logger;
   import org.slf4j.LoggerFactory;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.boot.CommandLineRunner;
   import org.springframework.boot.SpringApplication;
   import org.springframework.boot.autoconfigure.SpringBootApplication;
   import org.springframework.data.redis.core.StringRedisTemplate;
   import org.springframework.data.redis.core.ValueOperations;

   @SpringBootApplication
   public class DemoCacheApplication implements CommandLineRunner {

       private static final Logger LOGGER = LoggerFactory.getLogger(DemoCacheApplication.class);

       @Autowired
       private StringRedisTemplate template;

       public static void main(String[] args) {
           SpringApplication.run(DemoCacheApplication.class, args);
       }

       @Override
       public void run(String... args) {
           ValueOperations<String, String> ops = this.template.opsForValue();
           String key = "testkey";
           if(!this.template.hasKey(key)){
               ops.set(key, "Hello World");
               LOGGER.info("Add a key is done");
           }
           LOGGER.info("Return the value from the cache: {}", ops.get(key));
       }

   }
   ```

---

Then, start the application. The application retrieves data from your Redis cache. You should see logs similar to the following example:

```output
Add a key is done
Return the value from the cache: Hello World
```

[!INCLUDE [deploy-to-azure-spring-apps](includes/deploy-to-azure-spring-apps.md)]

## Next steps

To learn more about Spring and Azure, continue to the Spring on Azure documentation center.

> [!div class="nextstepaction"]
> [Azure for Spring developers](../spring/index.yml)
> [Spring Cloud Azure Cache for Redis samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/cache)
