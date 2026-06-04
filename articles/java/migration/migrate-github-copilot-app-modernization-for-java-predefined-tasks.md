---
title: Predefined Tasks for GitHub Copilot Modernization for Java Developers
titleSuffix: Azure
description: Provides an overview of predefined tasks.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: overview
ms.date: 06/02/2026
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

## Task list

GitHub Copilot modernization currently supports the following predefined tasks:

- RabbitMQ to Azure Service Bus

  These tasks convert Java applications that use RabbitMQ - through Spring Advanced Message Queuing Protocol (AMQP), Spring Java Message Service (JMS), or Java EE / Jakarta EE over AMQP - to use the managed service Azure Service Bus instead, preserving the messaging patterns and semantics while enabling secure authentication by default.

- Managed Identities for Database migration to Azure

    The Azure database offerings - Azure SQL Server, Azure Database for MySQL, Azure Database for PostgreSQL, Azure Cosmos DB for Cassandra API, and Azure Cosmos DB for MongoDB - support secure sign-in using Managed Identity. When you migrate an application from a local database to a managed Azure cloud database, this task helps you prepare your codebase for Managed Identity authentication to the database.

- Managed Identities for Credential Migration on Azure

  Authentication using connection strings introduces security vulnerabilities and maintenance overhead. This task transforms your Java applications to use Azure's Managed Identity authentication for messaging services like Azure Event Hubs and Azure Service Bus. When you integrate with Microsoft Identity client libraries, your code no longer needs to store sensitive connection strings or shared access signatures in configuration files.

- Amazon Web Services (AWS) S3 to Azure Storage Blob

  When you migrate your service from AWS to Azure, you can transition from AWS S3 to Azure Storage Blob. This task helps you convert the code logic that interacts with AWS S3 into code logic that operates with Azure Storage Blob, while maintaining the same semantics.

  This migration knowledge was developed in collaboration with the Azure Storage team, drawing on their deep expertise in Blob Storage APIs, authentication patterns, and platform-specific behaviors to ensure the guidance reflects production-grade best practices. 

- Logging to local file

  Azure hosting services integrate with Azure Monitor by default, collecting log output to the console and enabling you to query and monitor them. At the same time, logging to files in a cloud environment isn't recommended because it requires extra log rotation and transfer. This task helps you convert file-based logging in your application to console-based logging, making it ready for integration with Azure Monitor.

- Local file I/O to Azure Storage File share mounts

  Azure hosting services offer flexibility in provisioning, scaling, failover, and more. At the same time, the file system for a given application runtime is transient. If your application reads from or writes to a local file, this task helps you identify such cases and convert them into unified mount path access. By doing so, you can mount an Azure Storage File share to the specified path, enabling your application to share and persist data across different replicas without concerns about relocation, failover, or similar issues.

- Java Mail to Azure Communication Services

  Migrating applications with Simple Mail Transfer Protocol (SMTP) dependencies can be challenging because not all Azure environments support outgoing requests on port 25. This task helps convert an application that sends mail over SMTP to use Azure Communication Services, which is fully compatible with Azure hosting environments.

- Secrets and Certificate Management to Azure Key Vault

  This task helps migrate sensitive security assets to Azure Key Vault. It supports both hardcoded secrets in your codebase and local TLS/mTLS certificates managed in Java KeyStores. For secrets, it identifies suspicious secret texts and converts them into logic that retrieves the data from Azure Key Vault. For certificates, it transitions your application from managing certificates locally to using Azure Key Vault's Java Cryptography Architecture (JCA) provider while maintaining the same functionality and security posture.

- Cryptography operations to Azure Key Vault

  Java applications that perform cryptographic operations locally manage keys outside of a centralized, auditable service. This task migrates local cryptography logic to Azure Key Vault so that signing, verification, encryption, and decryption operations run against keys that never leave the vault, while preserving the application's existing behavior.

- User authentication to Microsoft Entra ID authentication

  Java applications often use LDAP-based authentication solutions that aren't easily migrated to Azure. This task helps you transition your local user authentication mechanism to one that uses Microsoft Entra ID for authentication.

- Databases products to Azure database offerings

  Java applications running on on-premises databases - including Oracle, IBM Db2, Informix, and Sybase Adaptive Server Enterprise (ASE) - can be migrated to Azure Database for PostgreSQL or Azure SQL Database for a fully managed cloud experience. These tasks update the application so that it connects to the target Azure database with passwordless Microsoft Entra ID authentication and reconcile source-specific SQL syntax, data types, and functions with the target dialect, so the application keeps the same behavior on Azure.

- AWS Secret Manager to Azure Key Vault

  Moving from AWS Secret Manager to Azure Key Vault requires reconfiguring how your application handles sensitive information. This task transforms all aspects of secret management in your code - from creation and retrieval to updating and deletion - and uses Azure Key Vault's comprehensive security capabilities and authentication models.

- ActiveMQ to Azure Service Bus

  Applications built on Apache ActiveMQ can be modernized to use Azure's managed messaging service. This task converts your ActiveMQ message producers, consumers, connection factories, and queue/topic interactions to their Azure Service Bus equivalents, implementing best practices for reliability and authentication in cloud environments.

- Amazon Web Services (AWS) Simple Queue Service (SQS) to Azure Service Bus

  Transitioning from AWS SQS to Azure Service Bus involves reimplementing queue operations and message handling patterns. This task translates SQS-specific code constructs to their Azure Service Bus counterparts, preserving critical messaging semantics like at-least-once delivery, message batching, and visibility timeout behaviors while introducing Azure's enhanced security features.

- Ant / Eclipse project to Maven project

  Java projects built with Apache Ant or as Eclipse IDE projects depend on imperative scripts or IDE-specific metadata, which complicates dependency management and makes automated, headless builds difficult. These tasks convert your Ant or Eclipse project to a Maven project that builds consistently from any environment, with dependencies resolved through Maven and the project layout aligned with Maven conventions, while keeping your source code unchanged.

- Cache solutions to Azure Managed Redis

    Applications often rely on various caching solutions - from in-memory libraries to distributed systems (such as Infinispan, SwarmCache, and Memcached) - that lack seamless Azure integration and centralized scalability or security. This task modernizes the caching layer by migrating these implementations to Azure Managed Redis (or the retiring Azure Cache for Redis), enabling cloud-native scalability, unified management, and improved security with passwordless Microsoft Entra ID authentication, while preserving existing caching behavior.

## See also

[Quickstart: create and apply your own skills](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-task.md)
