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

- Other databases to Azure databases

  When you transition between database engines, differences in SQL dialects, stored procedures, proprietary functions, and data types can pose significant challenges. This task converts engine-specific SQL and data access code in your Java application to the equivalents on Azure databases, ensuring seamless integration with Azure SQL Database or Azure Database for PostgreSQL. Supported source-to-target combinations include Oracle to Azure Database for PostgreSQL, IBM DB2 to Azure SQL Database or Azure Database for PostgreSQL, Informix to Azure Database for PostgreSQL, and Sybase ASE to Azure SQL Database.

- Other cache solutions to Azure Managed Redis

  This task helps you migrate from alternative caching solutions to Azure Managed Redis, improving performance and reducing operational overhead while aligning with Azure-native best practices.

- Other messaging solutions to Azure Service Bus

  Applications built on other messaging systems can be modernized to use Azure's managed messaging service. This task converts message producers, consumers, connection factories, and queue/topic interactions to their Azure Service Bus equivalents, preserving critical messaging semantics like at-least-once delivery, message batching, and visibility timeout behaviors while implementing best practices for reliability and secure authentication in cloud environments. Supported sources include Spring messaging frameworks with RabbitMQ (Spring AMQP and Spring JMS), Apache ActiveMQ, Java EE AMQP with RabbitMQ, and AWS Simple Queue Service (SQS).

- Apache Kafka to Azure Event Hubs

  This task helps you migrate from Apache Kafka—including Confluent Cloud Kafka deployments—to Azure Event Hubs. It converts producer and consumer code, along with related configuration, while maintaining your messaging semantics and event processing patterns.

- Amazon Web Services (AWS) S3 to Azure Storage Blob

  When you migrate your service from AWS to Azure, you can transition from AWS S3 to Azure Storage Blob. This task helps you convert the code logic that interacts with AWS S3 into code logic that operates with Azure Storage Blob, while maintaining the same semantics.

  This migration knowledge was developed in collaboration with the Azure Storage team, leveraging their deep expertise in Blob Storage APIs, authentication patterns, and platform-specific behaviors to ensure the guidance reflects production-grade best practices. Key enhancements include behavioral-fidelity rules that prevent silent data loss during conversion, correct handling of immutability/Object Lock semantics, blob version deletion edge cases, and SAS token generation with token-based authentication — areas where S3 and Azure Blob Storage diverge in ways that are not obvious from API signatures alone.

- Migrate to Azure Key Vault for managing secrets, certificates, and cryptography operations

  This task helps you migrate sensitive security assets and operations to Azure Key Vault. It supports hardcoded plaintext credentials and secrets in your codebase, local TLS/mTLS certificates managed in Java KeyStores, secrets stored in AWS Secrets Manager, and cryptographic operations performed locally. For secrets, it identifies suspicious secret texts and converts them into logic that retrieves the data from Azure Key Vault. For certificates, it transitions your application from managing certificates locally to using Azure Key Vault's Java Cryptography Architecture (JCA) provider. For AWS Secrets Manager, it transforms all aspects of secret management—from creation and retrieval to updating and deletion—using Azure Key Vault's comprehensive security capabilities and authentication models. For cryptography, it centralizes key management by using Azure Key Vault's cryptographic services, improving the security posture of your Java application while maintaining the same functionality.

- Local file I/O to Azure Storage File share mounts

  Azure hosting services offer flexibility in provisioning, scaling, failover, and more. At the same time, the file system for a given application runtime is transient. If your application reads from or writes to a local file, this task helps you identify such cases and convert them into unified mount path access. By doing so, you can mount an Azure Storage File share to the specified path, enabling your application to share and persist data across different replicas without concerns about relocation, failover, or similar issues.

- User authentication to Microsoft Entra ID authentication

  Java applications often use LDAP-based authentication solutions that aren't easily migrated to Azure. This task helps you transition your local user authentication mechanism to one that uses Microsoft Entra ID for authentication.

- Use passwordless connections for Azure services

  Authentication using connection strings or database passwords introduces security vulnerabilities and maintenance overhead. This task transforms your Java applications to use Azure's Managed Identity authentication, eliminating the need to store sensitive connection strings, shared access signatures, or database credentials in configuration files. Supported services include Azure SQL Server, Azure Database for MySQL, Azure Database for PostgreSQL, Azure Database for MariaDB, Azure Cosmos DB for Cassandra API, Azure Cosmos DB for MongoDB, Azure Event Hubs, Azure Service Bus, and Azure Cache for Redis (including Micronaut applications).

- Ant or Eclipse project to Maven project

  This task migrates your project build configuration from Apache Ant or Eclipse-specific project settings to Maven, enabling better dependency management and aligning your codebase with modern Java build practices on Azure.

- Logging to local file

  Azure hosting services integrate with Azure Monitor by default, collecting log output to the console and enabling you to query and monitor them. At the same time, logging to files in a cloud environment isn't recommended because it requires extra log rotation and transfer. This task helps you convert file-based logging in your application to console-based logging, making it ready for integration with Azure Monitor.

- Java Mail to Azure Communication Services

  Migrating applications with Simple Mail Transfer Protocol (SMTP) dependencies can be challenging because not all Azure environments support outgoing requests on port 25. This task helps convert an application that sends mail over SMTP—including applications using `javax.mail`—to use Azure Communication Services, which is fully compatible with Azure hosting environments.

## See also

[Quickstart: create and apply your own skills](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md)
