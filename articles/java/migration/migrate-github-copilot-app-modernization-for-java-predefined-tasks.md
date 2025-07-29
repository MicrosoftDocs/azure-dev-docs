---
title: Predefined Formulas for GitHub Copilot App Modernization for Java
titleSuffix: Azure
description: Provides an overview of predefined formulas.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: overview
ms.date: 06/30/2025
ms.custom: devx-track-java
ms.service: azure-java
---

# Predefined formulas for GitHub Copilot App Modernization for Java

This article describes the predefined formulas available for GitHub Copilot App Modernization for Java.

Predefined formulas capture industry best practices for using Azure services. Currently, App Modernization for Java offers predefined formulas that cover common migration scenarios. These formulas address the following subjects, and more:

- Secret management
- Message queue integration
- Monitoring
- Identity management

> [!NOTE]
> This list will grow based on customer feedback and evolving cloud needs.

The following video demonstrates using GitHub Copilot App Modernization for Java to apply a predefined formula to migrate a Java project to Azure:

<br>

> [!VIDEO https://www.youtube.com/embed/6dgqToLNa58]

## Formula list

App Modernization for Java currently supports the following predefined formulas:

- Spring RabbitMQ to Azure Service Bus

  This formula converts an application that uses Spring messaging frameworks - including Spring Advanced Message Queuing Protocol (AMQP) and Spring Java Message Service (JMS) - with RabbitMQ, changing it to use the managed service Azure Service Bus instead. The message queue interaction logic is adapted to the Azure Service Bus equivalent, preserving the messaging patterns and semantics while enabling secure authentication mechanisms by default.

- Managed Identities for Database migration to Azure

  The Azure database offerings - Azure SQL Server, Azure Database for MySQL, Azure Database for PostgreSQL, Azure Cosmos DB for Cassandra API, and Azure Cosmos DB for MongoDB - support secure sign-in using Managed Identity. When you migrate an application from a local database to a managed Azure cloud database, this formula helps you prepare your codebase for Managed Identity authentication to the database.

- Managed Identities for Credential Migration on Azure

  Authentication using connection strings introduces security vulnerabilities and maintenance overhead. This formula transforms your Java applications to use Azure's Managed Identity authentication for messaging services like Azure Event Hubs and Azure Service Bus. By integrating with Microsoft Identity client libraries, your code no longer needs to store sensitive connection strings or shared access signatures in configuration files.

- Amazon Web Services (AWS) S3 to Azure Storage Blob

  When you migrate your service from AWS to Azure, you can transition from AWS S3 to Azure Storage Blob. This formula helps you convert the code logic that interacts with AWS S3 into code logic that operates with Azure Storage Blob, while maintaining the same semantics.

- Logging to local file

  Azure hosting services integrate with Azure Monitor by default, collecting log output to the console and enabling you to query and monitor them. At the same time, logging to files in a cloud environment isn't recommended because it requires extra log rotation and transfer. This formula helps you convert file-based logging in your application to console-based logging, making it ready for integration with Azure Monitor.

- Local file I/O to Azure Storage File share mounts

  Azure hosting services offer flexibility in provisioning, scaling, failover, and more. At the same time, the file system for a given application runtime is transient. If your application reads from or writes to a local file, this formula helps you identify such cases and convert them into unified mount path access. By doing so, you can mount an Azure Storage File share to the specified path, enabling your application to share and persist data across different replicas without concerns about relocation, failover, or similar issues.

- Java Mail to Azure Communication Service

  Migrating applications with Simple Mail Transfer Protocol (SMTP) dependencies can be challenging because not all Azure environments support outgoing requests on port 25. This formula helps convert an application that sends mail over SMTP to use Azure Communication Services, which is fully compatible with Azure hosting environments.

- Secrets and Certificate Management to Azure Key Vault

  This formula helps migrate sensitive security assets to Azure Key Vault. It supports both hardcoded secrets in your codebase and local TLS/mTLS certificates managed in Java KeyStores. For secrets, it identifies suspicious secret texts and converts them into logic that retrieves the data from Azure Key Vault. For certificates, it transitions your application from managing certificates locally to using Azure Key Vault's Java Cryptography Architecture (JCA) provider while maintaining the same functionality and security posture.

- User authentication to Microsoft Entra ID authentication

  Java applications often use LDAP-based authentication solutions that aren't easily migrated to Azure. This formula helps you transition your local user authentication mechanism to one that uses Microsoft Entra ID for authentication.

- SQL Dialect: Oracle to PostgreSQL

  When transitioning from Oracle to PostgreSQL, differences in SQL dialects can pose significant challenges. This formula converts Oracle-specific SQL queries, data types, and proprietary functions in your Java code to their PostgreSQL equivalents, ensuring a seamless integration with Azure Database for PostgreSQL.

- AWS Secret Manager to Azure Key Vault

  Moving from AWS Secret Manager to Azure Key Vault requires reconfiguring how your application handles sensitive information. This formula transforms all aspects of secret management in your code - from creation and retrieval to updating and deletion - and leverages Azure Key Vault's comprehensive security capabilities and authentication models.

- ActiveMQ to Azure Service Bus

  Applications built on Apache ActiveMQ can be modernized to leverage Azure's managed messaging service. This formula converts your ActiveMQ message producers, consumers, connection factories, and queue/topic interactions to their Azure Service Bus equivalents, implementing best practices for reliability and authentication in cloud environments.

- Amazon Web Services (AWS) Simple Queue Service (SQS) to Azure Service Bus

  Transitioning from AWS SQS to Azure Service Bus involves reimplementing queue operations and message handling patterns. This formula translates SQS-specific code constructs to their Azure Service Bus counterparts, preserving critical messaging semantics like at-least-once delivery, message batching, and visibility timeout behaviors while introducing Azure's enhanced security features.

## See also

[Quickstart: create and apply your own formulas](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-formula.md)
