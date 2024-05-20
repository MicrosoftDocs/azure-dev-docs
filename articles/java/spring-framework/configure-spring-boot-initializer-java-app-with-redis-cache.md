---
title: use Azure Redis Cache in Spring
description: Configure a Spring Boot application created with the Spring Initializr to use the Redis in the cloud with Azure Cache for Redis.
author: KarlErickson
ms.author: hangwan
ms.date: 10/13/2020
ms.topic: conceptual
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Use Azure Redis Cache in Spring

[Azure Cache for Redis](/azure/azure-cache-for-redis/) provides an in-memory data store based on the Redis software. [Redis](https://redis.io/) improves the performance and scalability of an application that uses backend data stores heavily.

This tutorial demonstrates how to use a Redis cache to store and retrieve data in a Spring Boot application.

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/).

- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or higher.

- [Apache Maven](http://maven.apache.org/), version 3.0 or higher.

- [cURL](https://curl.se/) or a similar HTTP utility to test functionality.

- A Redis cache instance. If you don't have one, see [Quickstart: Create an open-source Redis cache](/azure/azure-cache-for-redis/quickstart-create-redis).

- A Spring Boot application. If you don't have one, create a Maven project with the [Spring Initializr](https://start.spring.io/). Be sure to select **Maven Project** and, under **Dependencies**, add the **Spring Web**  and **Spring Data Reactive Redis** dependencies, and then select Java version 8 or higher.

## Code the application

To use a Redis cache to store and retrieve data, configure the application by using the following steps.

1. Configure Redis cache credentials in the *application.properties* configuration file, as shown in the following example.

   ```properties
   # Specify the DNS URI of your Redis cache.
   spring.data.redis.host=<your-redis-name>.redis.cache.windows.net

   # Specify the port for your Redis cache.
   spring.data.redis.port=6379

   # Specify the access key for your Redis cache.
   spring.data.redis.password=<your-redis-access-key>
   ```

   > [!NOTE]
   > If you were using a different Redis client like Jedis that enables SSL, you would specify that you want to use SSL in your *application.properties* file and use port 6380. For example:
   >
   > ```properties
   > # Specify the DNS URI of your Redis cache.
   > spring.data.redis.host=<your-redis-name>.redis.cache.windows.net
   > # Specify the access key for your Redis cache.
   > spring.data.redis.password=<your-redis-access-key>
   > # Specify that you want to use SSL.
   > spring.data.redis.ssl.enabled=true
   > # Specify the SSL port for your Redis cache.
   > spring.data.redis.port=6380
   > ```
   >
   > For more information, see [Quickstart: Use Azure Cache for Redis in Java](/azure/redis-cache/cache-java-get-started).

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

1. Start the application. The application will retrieve data from your Redis cache. You'll see logs similar to the following example:

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
