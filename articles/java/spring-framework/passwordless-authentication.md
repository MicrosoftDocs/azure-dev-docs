---
title: Passwordless Authentication with Spring Cloud Azure
description: Describes how to use passwordless authentication to securely connect your Spring Cloud Azure applications to Azure services.
ms.date: 01/20/2026
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: reference
ms.custom: devx-track-java
---

# Passwordless authentication with Spring Cloud Azure

This article introduces the [Azure Identity Extensions](/java/api/overview/azure/identity-extensions-readme) and explains how to implement passwordless authentication to securely connect your Spring Cloud Azure applications to Azure services. By eliminating the need to store credentials in your application code, configuration files, or environment variables, you can both enhance security and streamline configuration.

## Core features

### Azure Identity Extensions

Azure Identity Extensions is built on top of the Azure Identity library and simplifies the authentication to Microsoft Entra ID and other Azure services. It provides a common template framework for users to obtain a token from Microsoft Entra ID using various credential types, including:

- `ClientSecretCredential`
- `ClientCertificateCredential`
- `ManagedIdentityCredential`
- `DefaultAzureCredential`

After you acquire the token, it serves as a substitute for a traditional password. The extensions also include the following plugins to facilitate database authentication using Microsoft Entra ID:

- `AzureMysqlAuthenticationPlugin`
- `AzurePostgresqlAuthenticationPlugin`

### Spring Boot Integration

Spring Cloud Azure builds upon Azure Identity Extensions to offer a higher-level, more convenient implementation that lets developers concentrate on business logic rather than on manual authentication setups. The following autoconfigured beans simplify integration:

- [AzureJdbcAutoConfiguration](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/spring/spring-cloud-azure-autoconfigure/src/main/java/com/azure/spring/cloud/autoconfigure/implementation/jdbc/AzureJdbcAutoConfiguration.java)
- [AzureRedisCredentials](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/spring/spring-cloud-azure-autoconfigure/src/main/java/com/azure/spring/cloud/autoconfigure/implementation/data/redis/lettuce/AzureRedisCredentials.java)
- [ServiceBusJmsConnectionFactoryFactory](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/spring/spring-cloud-azure-autoconfigure/src/main/java/com/azure/spring/cloud/autoconfigure/implementation/jms/ServiceBusJmsConnectionFactoryFactory.java)

### Implementation guides

#### Connect to MySQL

Spring Cloud Azure uses the [AzureMysqlAuthenticationPlugin](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity-extensions/src/main/java/com/azure/identity/extensions/jdbc/mysql/AzureMysqlAuthenticationPlugin.java) to convert a Microsoft Entra token into a MySQL-compatible password. For more information, see [Spring Cloud Azure MySQL support](mysql-support.md) and the [sample repository](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/mysql/spring-cloud-azure-starter-jdbc-mysql/spring-cloud-azure-mysql-sample).

#### Connect to PostgreSQL

For PostgreSQL, Spring Cloud Azure uses the [AzurePostgresqlAuthenticationPlugin](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity-extensions/src/main/java/com/azure/identity/extensions/jdbc/postgresql/AzurePostgresqlAuthenticationPlugin.java) to translate a Microsoft Entra token into a password recognized by PostgreSQL. For more information, see [Spring Cloud Azure PostgreSQL support](postgresql-support.md) and the [sample repository](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/postgresql/spring-cloud-azure-starter-jdbc-postgresql/spring-cloud-azure-postgresql-sample).

#### Connect to Redis

To enable passwordless authentication for Redis, Spring Cloud Azure uses [AzureAuthenticationTemplate](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity-extensions/src/main/java/com/azure/identity/extensions/implementation/template/AzureAuthenticationTemplate.java) to convert a Microsoft Entra token into a valid Redis credential. For more information, see [Spring Cloud Azure Redis support](redis-support.md) and the [sample repository](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/cache/spring-cloud-azure-redis-sample-passwordless).

#### Connect to Azure Service Bus JMS

For Azure Service Bus JMS, Spring Cloud Azure uses [TokenCredentialProviderOptions](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity-extensions/src/main/java/com/azure/identity/extensions/implementation/credential/TokenCredentialProviderOptions.java) to transfer a Microsoft Entra token into Azure Service Bus JMS credential. For more information, see [Use Azure Service Bus with JMS](spring-jms-support.md) and the [sample repository](https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/servicebus/spring-cloud-azure-starter-servicebus-jms/servicebus-jms-dlq-queue).
