---
title: Predefined Formulas for GitHub Copilot App Modernization for Java
titleSuffix: Azure
description: Provides an overview of predefined formulas.
author: KarlErickson
ms.author: karler
ms.reviewer: xiading
ms.topic: overview
ms.date: 05/19/2025
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

  This formula converts an application that uses Spring messaging frameworks (including Spring AMQP and Spring JMS) with RabbitMQ, changing it to use the managed service Azure Service Bus instead. The message queue interaction logic is adapted to the Azure Service Bus equivalent, preserving the messaging patterns and semantics while enabling secure authentication mechanisms by default.

- Managed Identities for Database migration to Azure

  The Azure database offerings - Azure SQL Server, Azure Database for MySQL, Azure Database for PostgreSQL, Azure Cosmos DB for Cassandra API, and Azure Cosmos DB for MongoDB - support secure Managed Identity-based sign in. When you migrate an application from a local database to a managed Azure cloud database, this formula helps you prepare your codebase for Managed Identity authentication to the database.

- Managed Identities for Credential Migration on Azure

  This formula helps migrate Java applications from connection string-based authentication to secure Managed Identity authentication for Azure services including Azure Event Hubs and Azure Service Bus. It updates your code to use the Microsoft Identity client libraries, eliminating the need to store connection strings or shared access signatures in your application configuration.

- Amazon Web Services (AWS) S3 to Azure Storage Blob

  When you migrate your service from AWS to Azure, you can transition from AWS S3 to Azure Storage Blob. This formula helps you convert the code logic that interacts with AWS S3 into code logic that operates with Azure Storage Blob, while maintaining the same semantics.

- Logging to local file

  Azure hosting services integrate with Azure Monitor by default, collecting log output to the console and enabling you to query and monitor them. At the same time, logging to files in a cloud environment isn't recommended because it requires extra log rotation and transfer. This formula helps you convert file-based logging in your application to console-based logging, making it ready for integration with Azure Monitor.

- Local file I/O to Azure Storage File share mounts

  Azure hosting services offer flexibility in provisioning, scaling, failover, and more. At the same time, the file system for a given application runtime is transient. If your application reads from or writes to a local file, this formula helps you identify such cases and convert them into unified mount path access. By doing so, you can mount an Azure Storage File share to the specified path, enabling your application to share and persist data across different replicas without concerns about relocation, failover, or similar issues.

- Java Mail to Azure Communication Service

  Migrating applications with Simple Mail Transfer Protocol (SMTP) dependencies can be challenging because not all Azure environments support outgoing requests on port 25. This formula helps convert an application that sends mail over SMTP to use Azure Communication Services, which is fully compatible with Azure hosting environments.

- Secrets and Certificate Management to Azure Key Vault

  This formula helps migrate sensitive security assets to Azure Key Vault. It supports both hardcoded secrets in your codebase and local TLS/MTLS certificates managed in Java KeyStores. For secrets, it identifies suspicious secret texts and converts them into logic that retrieves the data from Azure Key Vault. For certificates, it transitions your application from managing certificates locally to using Azure Key Vault's Java Cryptography Architecture (JCA) provider while maintaining the same functionality and security posture.

- User authentication to Microsoft Entra ID authentication

  Java applications often use LDAP-based authentication solutions that aren't easily migrated to Azure. This formula helps you transition your local user authentication mechanism to one that uses Microsoft Entra ID for authentication.

- SQL Dialect: Oracle to PostgreSQL

  This formula helps migrate Java applications from Oracle database dependencies to PostgreSQL compatibility. It handles the conversion of SQL queries, data types, and database-specific functions to ensure your application works seamlessly with Azure Database for PostgreSQL.

- AWS Secret Manager to Azure Key Vault

  When migrating from AWS to Azure, this formula helps convert code that interacts with AWS Secret Manager to use Azure Key Vault instead. It transforms all secret management operations including creation, retrieval, updating, and deletion while adapting to Azure's comprehensive secret management capabilities.

- ActiveMQ to Azure Service Bus

  This formula assists in migrating Java applications from Apache ActiveMQ to Azure Service Bus. It converts message producer and consumer code, connection management, and queue/topic interactions to use the Azure Service Bus client libraries and authentication mechanisms.

- Amazon Web Services (AWS) Simple Queue Service (SQS) to Azure Service Bus

  This formula facilitates the migration from AWS SQS to Azure Service Bus by converting queue operations, message handling, and authentication to use Azure Service Bus equivalents. The formula ensures that message processing semantics are preserved during the migration.

## See also

[Quickstart: create and apply your own formulas](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-formula.md)
