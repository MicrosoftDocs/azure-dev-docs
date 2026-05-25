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

### Authentication

- **User authentication to Microsoft Entra ID authentication** Java applications often use LDAP-based authentication solutions that aren't easily migrated to Azure. This task helps you transition your local user authentication mechanism to one that uses Microsoft Entra ID for authentication.

### Build tools

- **Ant project to Maven project** This task helps migrate your project build configuration from Apache Ant to Maven, enabling better dependency management and alignment with modern Java build practices on Azure.
- **Eclipse project to Maven project** This task converts Eclipse-specific project configurations and build settings to Maven, streamlining your migration to Azure-compatible build infrastructure.

### Cache

- **Other cache solutions to Azure Managed Cache** This task helps you migrate from alternative caching solutions to Azure Managed Cache for Redis, improving performance and reducing operational overhead.

### Database

- **IBM DB2 to Azure PostgreSQL** When transitioning from IBM DB2, this task converts your database schemas, queries, and data access code to work with Azure Database for PostgreSQL, handling dialect differences and compatibility issues.
- **IBM DB2 to Azure SQL** This task transforms IBM DB2-specific SQL, stored procedures, and data structures to Azure SQL Database equivalents, ensuring smooth migration and optimal performance.
- **Informix to PostgreSQL** This task helps convert Informix databases and application code to PostgreSQL, addressing SQL dialect differences and ensuring compatibility with Azure Database for PostgreSQL.
- **SQL Dialect: Oracle to PostgreSQL** When you transition from Oracle to PostgreSQL, differences in SQL dialects can pose significant challenges. This task converts Oracle-specific SQL queries, data types, and proprietary functions in your Java code to their PostgreSQL equivalents, ensuring a seamless integration with Azure Database for PostgreSQL.
- **Sybase ASE to Azure SQL Database** This task transforms Sybase ASE-specific SQL queries, stored procedures, and schema definitions to Azure SQL Database, handling compatibility issues and optimizing performance.

### Email

- **javax.email send to Azure Communication Service Email** Migrating applications with SMTP dependencies can be challenging because not all Azure environments support outgoing requests on port 25. This task helps convert an application that uses javax.mail to send emails to use Azure Communication Services, which is fully compatible with Azure hosting environments.

### Java API for XML (JAX)

- **JAX-RPC to JAX-WS** This task helps you modernize legacy JAX-RPC-based web services by converting them to the newer JAX-WS standard, improving interoperability and security.

### Managed Identities

- **Managed Identity for Azure Cache for Redis (Micronaut)** This task helps [Micronaut](https://micronaut.io/) applications adopt Managed Identity authentication for Azure Cache for Redis, improving security and eliminating the need for connection string management.
- **Managed Identity for Azure Event Hub** This task helps you migrate Event Hub authentication in your Java applications from connection strings to Managed Identity, improving security posture.
- **Managed Identity for Azure Service Bus** This task converts your Java applications from connection string-based authentication to use Managed Identity for Azure Service Bus, enhancing security and reducing credential management complexity.
- **Managed Identity for Azure SQL** This task helps migrate your Java applications from SQL authentication using connection strings to Managed Identity authentication, enhancing security, and reducing credential management complexity.
- **Managed Identity for Cassandra** This task converts your Java applications to use Managed Identity authentication for Azure Cosmos DB Cassandra API, eliminating the need for connection string-based authentication.
- **Managed Identity for MariaDB** This task helps you transition your Java applications to use Managed Identity authentication for Azure Database for MariaDB, improving security and credential handling.
- **Managed Identity for MongoDB** This task enables your Java applications to authenticate with Azure Cosmos DB for MongoDB using Managed Identity, replacing connection string-based authentication.
- **Managed Identity for MySQL** This task converts your Java applications to use Managed Identity authentication for Azure Database for MySQL, enhancing security and reducing credential exposure.
- **Managed Identity for PostgreSQL** This task helps migrate your Java applications to Managed Identity authentication for Azure Database for PostgreSQL, improving security posture and credential management.

### Message Queue

- **ActiveMQ to Azure Service Bus** Applications built on Apache ActiveMQ can be modernized to use Azure's managed messaging service. This task converts your ActiveMQ message producers, consumers, connection factories, and queue/topic interactions to Azure Service Bus. It follows best practices for cloud reliability and secure authentication.
- **Amazon Web Services (AWS) Simple Queue Service (SQS) to Azure Service Bus** Transitioning from AWS SQS to Azure Service Bus involves reimplementing queue operations and message handling patterns. This task translates SQS-specific code constructs to their Azure Service Bus counterparts, preserving critical messaging semantics like at-least-once delivery, message batching, and visibility timeout behaviors while introducing Azure's enhanced security features.
- **Confluent Cloud Kafka** This task helps migrate applications using Confluent Cloud Kafka to Azure Event Hubs, handling configuration and client code conversion.
- **Java EE AMQP RabbitMQ to Service Bus** This task helps Java EE applications using AMQP with RabbitMQ migrate to Azure Service Bus, ensuring compatibility with enterprise messaging patterns.
- **Kafka to Azure Event Hubs** This task helps you migrate from Apache Kafka to Azure Event Hubs, converting producer and consumer code while maintaining your messaging semantics and event processing patterns.
- **Spring JMS RabbitMQ to Service Bus** This task specifically handles Spring JMS-based RabbitMQ applications, converting message listeners, connection factories, and queue configurations to Azure Service Bus equivalents.
- **Spring RabbitMQ to Azure Service Bus** This task converts an application that uses Spring messaging frameworks - including Spring Advanced Message Queuing Protocol (AMQP) and Spring Java Message Service (JMS) - with RabbitMQ, changing it to use the managed service Azure Service Bus instead. The message queue interaction logic is adapted to the Azure Service Bus equivalent, preserving the messaging patterns and semantics while enabling secure authentication mechanisms by default.

### Security

- **AWS Secret Manager to Azure Key Vault** Moving from AWS Secret Manager to Azure Key Vault requires reconfiguring how your application handles sensitive information. This task transforms all aspects of secret management in your code - from creation and retrieval to updating and deletion - and uses Azure Key Vault's comprehensive security capabilities and authentication models.
- **Cryptography operations to Azure Key Vault** This task helps you migrate cryptographic operations performed locally to use Azure Key Vault's cryptographic services, centralizing key management and improving security.
- **Plaintext credential to Azure Key Vault** This task identifies hardcoded credentials and secrets in your Java application and migrates them to Azure Key Vault, improving security and reducing credential exposure risks.
- **Secrets and Certificate Management to Azure Key Vault** This task helps migrate sensitive security assets to Azure Key Vault. It supports both hardcoded secrets in your codebase and local TLS/mTLS certificates managed in Java KeyStores. For secrets, it identifies suspicious secret texts and converts them into logic that retrieves the data from Azure Key Vault. For certificates, it transitions your application from managing certificates locally to using Azure Key Vault's Java Cryptography Architecture (JCA) provider while maintaining the same functionality and security posture.

### Storage

- **Amazon Web Services (AWS) S3 to Azure Storage Blob** When you migrate your service from AWS to Azure, you can transition from AWS S3 to Azure Storage Blob. This task helps you convert the code logic that interacts with AWS S3 into code logic that operates with Azure Storage Blob, while maintaining the same semantics.
- **Local files to mounted Azure Storage** Azure hosting services offer flexibility in provisioning, scaling, failover, and more. At the same time, the file system for a given application runtime is transient. If your application reads from or writes to a local file, this task helps you identify such cases and convert them into unified mount path access. By doing so, you can mount an Azure Storage File share to the specified path, enabling your application to share and persist data across different replicas without concerns about relocation, failover, or similar issues.
- **Log to console** Azure hosting services integrate with Azure Monitor by default, collecting log output to the console and enabling you to query and monitor them. At the same time, logging to files in a cloud environment isn't recommended because it requires extra log rotation and transfer. This task helps you convert file-based logging in your application to console-based logging, making it ready for integration with Azure Monitor.

## See also

[Quickstart: create and apply your own skills](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md)
