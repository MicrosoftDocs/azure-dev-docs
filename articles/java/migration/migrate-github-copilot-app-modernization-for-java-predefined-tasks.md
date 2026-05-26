---
title: Predefined Tasks for GitHub Copilot Modernization for Java Developers
titleSuffix: Azure
description: Provides an overview of predefined tasks.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: overview
ms.date: 01/13/2026
ms.custom: devx-track-java
ms.subservice: migration-copilot
ms.collection: ce-skilling-ai-copilot
ms.update-cycle: 180-days
---

# Predefined tasks for GitHub Copilot modernization for Java developers

This article describes the predefined tasks available to Java developers for GitHub Copilot modernization.

Predefined tasks capture industry best practices for using Azure services. Currently, GitHub Copilot modernization offers predefined tasks that cover common migration scenarios. These tasks address the following subjects, and more:

- Secret management
- Message queue integration
- Monitoring
- Identity management

> [!NOTE]
> This list grows based on customer feedback and evolving cloud needs.

The following video demonstrates using GitHub Copilot modernization to apply a predefined task to migrate a Java project to Azure:

<br>

> [!VIDEO https://www.youtube.com/embed/6dgqToLNa58]

## Task list

GitHub Copilot modernization currently supports the following predefined tasks:

- Spring RabbitMQ to Azure Service Bus

  This task converts an application that uses Spring messaging frameworks - including Spring Advanced Message Queuing Protocol (AMQP) and Spring Java Message Service (JMS) - with RabbitMQ, changing it to use the managed service Azure Service Bus instead. The message queue interaction logic is adapted to the Azure Service Bus equivalent, preserving the messaging patterns and semantics while enabling secure authentication mechanisms by default.

- Java EE / Jakarta EE RabbitMQ (AMQP) to Azure Service Bus

  Java EE and Jakarta EE applications that talk to RabbitMQ over AMQP can be migrated to Azure Service Bus. This task replaces the RabbitMQ AMQP client dependencies with the Azure Service Bus SDK, refactors publishers, consumers, connection factories, and channel management, maps RabbitMQ exchanges and queues to Service Bus topics and subscriptions, and converts message acknowledgment patterns such as `basicAck` to the corresponding `complete`/`abandon` calls - while leaving message content and business logic unchanged.

- Managed Identities for Database migration to Azure

  The Azure database offerings - Azure SQL Server, Azure Database for MySQL, Azure Database for PostgreSQL, Azure Cosmos DB for Cassandra API, and Azure Cosmos DB for MongoDB - support secure sign-in using Managed Identity. When you migrate an application from a local database to a managed Azure cloud database, this task helps you prepare your codebase for Managed Identity authentication to the database.

- Managed Identities for Credential Migration on Azure

  Authentication using connection strings introduces security vulnerabilities and maintenance overhead. This task transforms your Java applications to use Azure's Managed Identity authentication for messaging services like Azure Event Hubs and Azure Service Bus. When you integrate with Microsoft Identity client libraries, your code no longer needs to store sensitive connection strings or shared access signatures in configuration files.

- Managed Identity for Azure Cache for Redis in Micronaut projects

  Micronaut applications that connect to Azure Cache for Redis or Azure Managed Redis can replace password-based access with Microsoft Entra ID managed identity. This task adds the `com.azure:azure-identity` dependency, updates the Redis configuration so the username becomes the managed identity's object ID and the URI points to the Azure Redis endpoint, and introduces an `AzureRedisCredentialsConfiguration` that plugs a `DefaultAzureCredential`-based `RedisCredentialsProvider` into Micronaut's Lettuce integration - while preserving existing features such as connection pooling, master-replica setup, and multi-server configuration.

- Amazon Web Services (AWS) S3 to Azure Storage Blob

  When you migrate your service from AWS to Azure, you can transition from AWS S3 to Azure Storage Blob. This task helps you convert the code logic that interacts with AWS S3 into code logic that operates with Azure Storage Blob, while maintaining the same semantics.

- Logging to local file

  Azure hosting services integrate with Azure Monitor by default, collecting log output to the console and enabling you to query and monitor them. At the same time, logging to files in a cloud environment isn't recommended because it requires extra log rotation and transfer. This task helps you convert file-based logging in your application to console-based logging, making it ready for integration with Azure Monitor.

- Local file I/O to Azure Storage File share mounts

  Azure hosting services offer flexibility in provisioning, scaling, failover, and more. At the same time, the file system for a given application runtime is transient. If your application reads from or writes to a local file, this task helps you identify such cases and convert them into unified mount path access. By doing so, you can mount an Azure Storage File share to the specified path, enabling your application to share and persist data across different replicas without concerns about relocation, failover, or similar issues.

- Java Mail to Azure Communication Service

  Migrating applications with Simple Mail Transfer Protocol (SMTP) dependencies can be challenging because not all Azure environments support outgoing requests on port 25. This task helps convert an application that sends mail over SMTP to use Azure Communication Services, which is fully compatible with Azure hosting environments.

- Secrets and Certificate Management to Azure Key Vault

  This task helps migrate sensitive security assets to Azure Key Vault. It supports both hardcoded secrets in your codebase and local TLS/mTLS certificates managed in Java KeyStores. For secrets, it identifies suspicious secret texts and converts them into logic that retrieves the data from Azure Key Vault. For certificates, it transitions your application from managing certificates locally to using Azure Key Vault's Java Cryptography Architecture (JCA) provider while maintaining the same functionality and security posture.

- Cryptography operations to Azure Key Vault

  Java applications that perform cryptographic operations locally with `javax.crypto.Cipher` and `java.security.Signature` can be centralized on Azure Key Vault. This task adds the `com.azure:azure-security-keyvault-keys` and `com.azure:azure-identity` dependencies, replaces `Cipher` and `Signature` calls with the equivalent Azure Key Vault `CryptographyClient` operations, and initializes the client with `DefaultAzureCredential` instead of a connection string - so keys never leave Azure Key Vault while the application's behavior stays the same.

- User authentication to Microsoft Entra ID authentication

  Java applications often use LDAP-based authentication solutions that aren't easily migrated to Azure. This task helps you transition your local user authentication mechanism to one that uses Microsoft Entra ID for authentication.

- SQL Dialect: Oracle to PostgreSQL

  When you transition from Oracle to PostgreSQL, differences in SQL dialects can pose significant challenges. This task converts Oracle-specific SQL queries, data types, and proprietary functions in your Java code to their PostgreSQL equivalents, ensuring a seamless integration with Azure Database for PostgreSQL.

- IBM Db2 to Azure Database for PostgreSQL

  Java applications backed by IBM Db2 can be migrated to Azure Database for PostgreSQL to take advantage of a fully managed open-source database. This task swaps the Db2 JDBC driver and dependencies for PostgreSQL ones, configures passwordless connections using Microsoft Entra ID and managed identity (through `spring-cloud-azure-starter-jdbc-postgresql` for Spring Boot or `azure-identity-extensions` for other Java projects), normalizes identifiers and SQL keyword casing, and converts Db2-specific SQL and types to PostgreSQL equivalents.

- IBM Db2 to Azure SQL Database

  When you move IBM Db2 workloads to Azure SQL Database, both the connection layer and the SQL dialect need updating. This task replaces the Db2 driver with the Microsoft JDBC driver for SQL Server, enables passwordless authentication using `ActiveDirectoryMSI` and the `spring-cloud-azure-starter` for Spring Boot (or the `msiClientId` connection string parameter for other Java projects), and converts Db2-specific SQL constructs - such as `FETCH FIRST`, `||` string concatenation, `QUARTER`, `BEGIN ATOMIC`, and `PERCENTILE_CONT` - into their T-SQL equivalents.

- Informix to Azure Database for PostgreSQL

  Informix-based Java applications can be modernized by moving to Azure Database for PostgreSQL. This task replaces the Informix JDBC driver and dependencies with PostgreSQL ones, enables passwordless connections through Microsoft Entra ID and managed identity (using `spring-cloud-azure-starter-jdbc-postgresql` for Spring Boot or `azure-identity-extensions` for other Java projects), and converts Informix-specific SQL syntax, data types, and proprietary functions into their PostgreSQL equivalents.

- Sybase ASE to Azure SQL Database

  Java applications running on Sybase Adaptive Server Enterprise can be migrated to Azure SQL Database for a fully managed cloud experience. This task replaces Sybase-specific drivers (such as `jconn3.jar` and `jconn4.jar`) and dependencies with the Microsoft JDBC driver, configures passwordless authentication using a user-assigned managed identity, inspects `.sql` files and Java code for Sybase ASE syntax, and updates the code to modern T-SQL idioms - including `TRY`/`CATCH` error handling, `EXEC` for system stored procedures, and `DATETIME2`-style data types.

- AWS Secret Manager to Azure Key Vault

  Moving from AWS Secret Manager to Azure Key Vault requires reconfiguring how your application handles sensitive information. This task transforms all aspects of secret management in your code - from creation and retrieval to updating and deletion - and uses Azure Key Vault's comprehensive security capabilities and authentication models.

- ActiveMQ to Azure Service Bus

  Applications built on Apache ActiveMQ can be modernized to use Azure's managed messaging service. This task converts your ActiveMQ message producers, consumers, connection factories, and queue/topic interactions to their Azure Service Bus equivalents, implementing best practices for reliability and authentication in cloud environments.

- Amazon Web Services (AWS) Simple Queue Service (SQS) to Azure Service Bus

  Transitioning from AWS SQS to Azure Service Bus involves reimplementing queue operations and message handling patterns. This task translates SQS-specific code constructs to their Azure Service Bus counterparts, preserving critical messaging semantics like at-least-once delivery, message batching, and visibility timeout behaviors while introducing Azure's enhanced security features.

- Ant project to Maven project

  Apache Ant projects use `build.xml` scripts and bundled local jars, which complicate dependency management and integration with modern Java tooling. This task converts your Ant-based Java project to Maven by generating a `pom.xml` from `build.xml`, mapping bundled jars to Maven Central coordinates (or `system` scope when no equivalent exists), restructuring the directory layout to Maven's standard convention, and updating CI/CD configurations to use Maven commands - all while preserving your source code unchanged.

- Eclipse project to Maven project

  Eclipse IDE projects rely on `.project` and `.classpath` files, which tightly couple the build to the IDE and make headless CI builds difficult. This task converts your Eclipse-based Java project to Maven by generating a `pom.xml` from the Eclipse configuration, translating `.classpath` library entries (including JRE container and user libraries) into Maven `<dependency>` declarations, restructuring source folders into Maven's standard directory layout, and handling both standard Java and Dynamic Web Project (WAR) packaging - so your project can build consistently from any environment.

- Cache solutions to Azure Managed Redis

  Legacy Java caching libraries - including Apache Commons JCS, DynaCache, JCache, OSCache, ShiftOne, Oracle Coherence, and embedded caches - don't integrate natively with Azure and lack centralized scaling and security. This task replaces the old caching library dependencies and API calls with Redis equivalents, and configures the application to connect to Azure Managed Redis (or the retiring Azure Cache for Redis) using passwordless Microsoft Entra ID authentication. It covers Spring Boot applications through the Spring Cloud Azure starters, and non-Spring applications through Jedis or Lettuce with `DefaultAzureCredential`-based token refresh.

- Apache Kafka to Azure Event Hubs

  Java applications that use Apache Kafka can move to Azure Event Hubs for Kafka without rewriting their producer or consumer code. This task adds the `spring-cloud-azure-starter` for Spring projects, updates the Kafka `bootstrap-servers` (or `bootstrap.servers`) configuration to the Event Hubs namespace endpoint on port `9093`, and enables passwordless authentication with managed identity so the application can stream events securely against Azure Event Hubs.

- Apache Kafka to Confluent Cloud with Microsoft Entra ID authentication

  When you move from self-hosted Apache Kafka to Apache Kafka on Confluent Cloud, you can also adopt passwordless authentication backed by Microsoft Entra ID. This task adds the `com.azure:azure-identity` dependency, introduces a custom `OAuthBearerLoginCallbackHandler` that uses `DefaultAzureCredential` to fetch tokens for the Confluent Cloud `sasl.oauthbearer.token.resource`, and updates Kafka configuration files (`.properties` or YAML) so producers and consumers connect to the Confluent Cloud endpoint using SASL OAuth bearer instead of static credentials.

## See also

[Quickstart: create and apply your own skills](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md)
