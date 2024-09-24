---
title: Spring Cloud Azure Redis support
description: This article describes how Spring Cloud Azure and Azure Redis can be used together.
ms.date: 04/06/2023
author: KarlErickson
ms.author: hangwan
ms.topic: reference
ms.custom: devx-track-java, devx-track-extended-java
---

# Spring Cloud Azure Redis support

**This article applies to:** ✔️ Version 4.19.0 ✔️ Version 5.16.0

This article describes how you can use Spring Cloud Azure and Spring Data Redis together and provide various types of credentials for authentication to Azure Cache for Redis.

[Azure Cache for Redis](/azure/azure-cache-for-redis/) provides an in-memory data store based on the Redis software. [Redis](https://redis.io/) improves the performance and scalability of an application that uses backend data stores heavily.

## Supported Redis versions

For supported versions, see [Current versions](/azure/azure-cache-for-redis/cache-how-to-upgrade#current-versions).

## Core features

### Passwordless connection

Passwordless connection uses Microsoft Entra authentication for connecting to Azure services without storing any credentials in the application, its configuration files, or in environment variables. Microsoft Entra authentication is a mechanism for connecting to Azure Cache for Redis using identities defined in Microsoft Entra ID. With Microsoft Entra authentication, you can manage cache identities and other Microsoft services in a central location, which simplifies permission management.

## How it works

Spring Cloud Azure first builds one of the following types of credentials depending on the application authentication configuration:

- `ClientSecretCredential`
- `ClientCertificateCredential`
- `UsernamePasswordCredential`
- `ManagedIdentityCredential`

If none of these types of credentials are found, the credential chain via `DefaultTokenCredential` is used to obtain credentials from application properties, environment variables, managed identity, or IDEs. For more information, see [Spring Cloud Azure authentication](authentication.md).

## Configuration

#### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

Configurable properties when using Redis support:

> [!div class="mx-tdBreakAll"]
> | Property                                             | Description                                  | Default Value | Required |
> |------------------------------------------------------|----------------------------------------------|---------------|----------|
> | **spring.cloud.azure.redis**.enabled                 | Whether an Azure Cache for Redis is enabled. | true          | No       |
> | **spring.cloud.azure.redis**.name                    | Azure Cache for Redis instance name.         |               | Yes      |
> | **spring.cloud.azure.redis**.resource.resource-group | The resource group of Azure Cache for Redis. |               | Yes      |
> | **spring.cloud.azure**.profile.subscription-id       | The subscription ID.                         |               | Yes      |
> | **spring.redis.azure**.passwordless-enabled | Whether to enable passwordless for Azure Cache for Redis. | false        | No      |

#### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

Configurable properties when using Redis support:

> [!div class="mx-tdBreakAll"]
> | Property                                             | Description                                  | Default Value | Required |
> |------------------------------------------------------|----------------------------------------------|---------------|----------|
> | **spring.cloud.azure.redis**.enabled                 | Whether an Azure Cache for Redis is enabled. | true          | No       |
> | **spring.cloud.azure.redis**.name                    | Azure Cache for Redis instance name.         |               | Yes      |
> | **spring.cloud.azure.redis**.resource.resource-group | The resource group of Azure Cache for Redis. |               | Yes      |
> | **spring.cloud.azure**.profile.subscription-id       | The subscription ID.                         |               | Yes      |
> | **spring.data.redis.azure**.passwordless-enabled | Whether to enable passwordless for Azure Cache for Redis. | false      | No      |

---

## Basic usage

The following sections show the classic Spring Boot application usage scenarios.

### Connect to Azure Cache for Redis with passwordless

#### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

1. Add the following dependency to your project. This automatically includes the `spring-boot-starter` dependency in your project transitively.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter-redis</artifactId>
   </dependency>
   ```

   > [!NOTE]
   > Passwordless connections have been supported since version `4.6.0`.
   >
   > Remember to add the BOM `spring-cloud-azure-dependencies` along with the above dependency. For more information, see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

1. Configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     redis:
       host: ${AZURE_CACHE_REDIS_HOST}
       username: ${AZURE_CACHE_REDIS_USERNAME}
       port: 6380
       ssl: true
       azure:
         passwordless-enabled: true
   ```

   > [!IMPORTANT]
   > Passwordless connection uses Microsoft Entra authentication. To use Microsoft Entra authentication, you should enable Microsoft Entra Authentication and select `user(managed identity/service principal)` to assign `Data Owner Access Policy`.
   >
   > For more information and to get the value for `username`, see the [Enable Microsoft Entra ID authentication on your cache](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication#enable-microsoft-entra-id-authentication-on-your-cache) section of [Use Microsoft Entra ID for cache authentication](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication).

#### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

1. Add the following dependency to your project. This automatically includes the `spring-boot-starter` dependency in your project transitively.

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter-data-redis-lettuce</artifactId>
   </dependency>
   ```

   > [!NOTE]
   > Passwordless connections have been supported since version `5.16.0`.
   >
   > Remember to add the BOM `spring-cloud-azure-dependencies` along with the above dependency. For more information, see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

1. Configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     data:
       redis:
         host: ${AZURE_CACHE_REDIS_HOST}
         username: ${AZURE_CACHE_REDIS_USERNAME}
         port: 6380
         ssl:
           enabled: true
         azure:
           passwordless-enabled: true
   ```

   > [!IMPORTANT]
   > Passwordless connection uses Microsoft Entra authentication. To use Microsoft Entra authentication, you should enable Microsoft Entra Authentication and select `user(managed identity/service principal)` to assign `Data Owner Access Policy`.
   >
   > For more information and to get the value for `username`, see the [Enable Microsoft Entra ID authentication on your cache](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication#enable-microsoft-entra-id-authentication-on-your-cache) section of [Use Microsoft Entra ID for cache authentication](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication).

---

### Connect to Azure Cache for Redis with Managed Identity

1. To use the managed identity, you need enable the managed identity for your service and [enable Microsoft Entra authentication on your cache](/azure/azure-cache-for-redis/cache-azure-active-directory-for-authentication#enable-microsoft-entra-authentication-on-your-cache).

1. Then add the following properties in your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         credential:
           managed-identity-enabled: true
   ```

   > [!IMPORTANT]
   > The `redis.username` should change to the managed identity object (principal) ID.
   > If you are using user-assigned managed identity, also need to add property `spring.cloud.azure.credential.client-id` with your user-assigned managed identity client id.

### Connect to Azure Cache for Redis via Azure Resource Manager

Use the following steps to connect to Azure Cache for Redis:

#### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

1. Add the following dependency to your project. This automatically includes the `spring-boot-starter` dependency in your project transitively.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter</artifactId>
   </dependency>
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-resourcemanager</artifactId>
   </dependency>
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
   ```

   > [!NOTE]
   > Remember to add the BOM `spring-cloud-azure-dependencies` along with the above dependency. For more information, see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

#### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

1. Add the following dependency to your project. This automatically includes the `spring-boot-starter` dependency in your project transitively.

   ```xml
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-starter-data-redis-lettuce</artifactId>
   </dependency>
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-cloud-azure-resourcemanager</artifactId>
   </dependency>
   <dependency>
       <groupId>com.azure.spring</groupId>
       <artifactId>spring-boot-starter-data-redis</artifactId>
   </dependency>
   ```

   > [!NOTE]
   > Remember to add the BOM `spring-cloud-azure-dependencies` along with the above dependency. For more information, see the [Getting started](developer-guide-overview.md#getting-started) section of the [Spring Cloud Azure developer guide](developer-guide-overview.md).

---

2. Configure the following properties in your *application.yml* file:

   ```yaml
   spring:
     cloud:
       azure:
         profile:
           subscription-id: ${AZURE_SUBSCRIPTION_ID}
         redis:
           name: ${AZURE_CACHE_REDIS_NAME}
           resource:
             resource-group: ${AZURE_RESOURCE_GROUP}
   ```

### Samples

#### [Spring Cloud Azure 4.x](#tab/SpringCloudAzure4x)

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/cache/spring2-sample/spring-cloud-azure-starter) repository on GitHub.

#### [Spring Cloud Azure 5.x](#tab/SpringCloudAzure5x)

See the [azure-spring-boot-samples](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/cache/spring3-sample) repository on GitHub.

---
