---
title: Predefined Formulas for GitHub Copilot App Modernization for Java (Preview)
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

# Predefined formulas for GitHub Copilot app modernization for Java (preview)

This article describes the predefined formulas available for GitHub Copilot app modernization for Java (preview).

Predefined formulas capture industry best practices for using Azure services. Currently, app modernization for Java (preview) offers predefined formulas that cover common migration scenarios. These formulas address the following subjects, and more:

- Secret management
- Message queue integration
- Monitoring
- Identity management

> [!NOTE]
> This list will grow based on customer feedback and evolving cloud needs.

## Formula list

App modernization for Java (preview) currently supports the following predefined formulas:

- Spring Advanced Message Queuing Protocol (AMQP) for RabbitMQ to Azure Service Bus

  This formula converts an application that uses Spring AMQP to connect to RabbitMQ, changing it to use the managed service Azure Service Bus instead. The message queue interaction logic is adapted to the Azure Service Bus equivalent, and the secure authentication mechanism is enabled by default.

- Managed Identities for Database migration to Azure

  The Azure database offerings - Azure SQL Server, Azure Database for MySQL, and Azure Database for PostgreSQL - support secure Managed Identity-based sign in. When you migrate an application from a local database to a managed Azure cloud database, this formula helps you prepare your codebase for Managed Identity authentication to the database.

- Azure Web Services (AWS) S3 to Azure Storage Blob

  When you migrate your service from AWS to Azure, you can transition from AWS S3 to Azure Storage Blob. This formula helps you convert the code logic that interacts with AWS S3 into code logic that operates with Azure Storage Blob, while maintaining the same semantics.

- Logging to local file

  Azure hosting services integrate with Azure Monitor by default, collecting log output to the console and enabling you to query and monitor them. At the same time, logging to files in a cloud environment isn't recommended because it requires extra log rotation and transfer. This formula helps you convert file-based logging in your application to console-based logging, making it ready for integration with Azure Monitor.

- Local file I/O to Azure Storage File share mounts

  Azure hosting services offer flexibility in provisioning, scaling, failover, and more. At the same time, the file system for a given application runtime is transient. If your application reads from or writes to a local file, this formula helps you identify such cases and convert them into unified mount path access. By doing so, you can mount an Azure Storage File share to the specified path, enabling your application to share and persist data across different replicas without concerns about relocation, failover, or similar issues.

- Java Mail to Azure Communication Service

  Migrating applications with Simple Mail Transfer Protocol (SMTP) dependencies can be challenging because not all Azure environments support outgoing requests on port 25. This formula helps convert an application that sends mail over SMTP to use Azure Communication Services, which is fully compatible with Azure hosting environments.

- Hardcoded secret to Azure Key Vault

  Leaving secrets and sensitive data in the codebase is considered poor practice. This formula helps you identify suspicious secret texts and convert them into logic that retrieves the data from Azure Key Vault.

- User authentication to Microsoft Entra ID authentication

  Java applications often use LDAP-based authentication solutions that aren't easily migrated to Azure. This formula helps you transition your local user authentication mechanism to one that uses Microsoft Entra ID for authentication.

## See also

[Quickstart: create and apply your own formulas](migrate-github-copilot-app-modernization-for-java-quickstart-create-and-apply-your-own-formula.md)
