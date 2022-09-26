---
title: Passwordless connections for Azure services
description: Describes the security challenges with passwords and introduces passwordless connections for Azure services.
ms.topic: overview
ms.date: 09/26/2022
ms.author: asirveda
author: KarlErickson
ms.service: azure
---

# Passwordless connections for Azure services

> [!NOTE]
> Passwordless connections is a language-agnostic feature spanning multiple Azure services. Although the current documentation focuses on a few languages and services, we're currently in the process of producing additional documentation for other languages and services.

This article describes the security challenges with passwords and introduces passwordless connections for Azure services.

## Security challenges with passwords

Passwords should be used with caution, and developers must never place passwords in an unsecure location. Many applications connect to backend data, cache, messaging, and eventing services using usernames and passwords. If exposed, these credentials could be used to gain unauthorized access to sensitive information such as a sales catalog that you built for an upcoming campaign, or customer data that must be private.

Embedding passwords in an application itself presents a huge security risk for many reasons, including discovery through a code repository. Many developers externalize such passwords using environment variables so that applications can load them from different environments. However, this only shifts the risk from the code itself to an execution environment. Anyone who gains access to the environment can steal passwords, which in turn, increases your data exfiltration risk.

Many companies have strict security requirements to connect to Azure services without exposing passwords to developers, operators, or anyone else. They often use a vault to store and load passwords into applications, and they further reduce the risk by adding password-rotation requirements and procedures. This approach, in turn, increases the operational complexity and, at times, leads to application connection outages.

## Passwordless connections and Zero Trust

You can now use passwordless connections in your apps to connect to Azure-based services without any need to rotate passwords. All you need is configuration - no new code is required.

Zero Trust uses the principle of "never trust, always verify, and credential-free". This means securing all communications by trusting machines or users only after verifying identity and prior to granting them access to backend services.

The recommended authentication option for secure, passwordless connections is to use managed identities and Azure role-based access control (RBAC) in combination. With this approach, you don't have to manually track and manage many different secrets for managed identities because these tasks are securely handled internally by Azure.

You can configure passwordless connections to Azure services using Service Connector or you can configure them manually. Service Connector enables managed identities in app hosting services like Azure Spring Apps, App Service, and Azure Container Apps. Service Connector configures backend services with passwordless connections using managed identities and Azure RBAC, and hydrates applications with necessary connection information.

If you inspect the running environment of an application configured for passwordless connections, you can see the full connection string. The connection string carries, for example, a database server address, a database name, and an instruction to delegate authentication to a Microsoft Azure authentication plugin.

The following video illustrates passwordless connections from apps to Azure services, using Java applications as an example. Similar coverage for other languages is forthcoming.

<br>

> [!VIDEO https://www.youtube.com/embed/X6nR3AjIwJw]

## Use passwordless connections

For a more detailed explanation of passwordless connections, see the developer guide [Configure passwordless connections between multiple Azure apps and services](/azure/storage/common/multiple-identity-scenarios?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json).

For help on migrating your applications to use passwordless connections, see the following articles:

- [SQL](../java/spring-framework/migrate-sql-database-to-passwordless-connection.md?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
- [MySQL](../java/spring-framework/migrate-mysql-to-passwordless-connection.md?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
- [PostgreSQL](../java/spring-framework/migrate-postgresql-to-passwordless-connection.md?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
- [Storage](/azure/storage/common/migrate-azure-credentials?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
- [Kafka](../java/spring-framework/migrate-kafka-to-passwordless-connection.md?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)

For additional help on configuring your applications to use passwordless connections, see the following articles:

- Java with JDBC:
  - [SQL](../java/spring-framework/deploy-passwordless-spring-database-app.md?tabs=sqlserver&toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
  - [MySQL](../java/spring-framework/configure-spring-data-jdbc-with-azure-mysql.md?tabs=passwordless&toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
  - [PostgreSQL](../java/spring-framework/configure-spring-data-jdbc-with-azure-postgresql.md?tabs=passwordless&toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
- Java with JPA:
  - [SQL](../java/spring-framework/deploy-passwordless-spring-database-app.md?tabs=sqlserver&toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
  - [MySQL](../java/spring-framework/configure-spring-data-jpa-with-azure-mysql.md?tabs=passwordless&toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
  - [PostgreSQL](../java/spring-framework/configure-spring-data-jpa-with-azure-postgresql.md?tabs=passwordless&toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
- [Java with Kafka](../java/spring-framework/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub.md?tabs=passwordless&toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
- [.NET with Storage](/azure/storage/common/multiple-identity-scenarios?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)

For hands-on demonstrations, see the following quickstarts and tutorials:

- Java:
  - [Java JDBC with MySQL](/azure/mysql/single-server/connect-java?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
  - [Java JDBC with PostgreSQL](/azure/postgresql/single-server/connect-java?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
  - [Azure Spring Apps](../java/spring-framework/deploy-passwordless-spring-database-app.md?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
  - [Azure Spring Apps with PostgreSQL](/azure/spring-apps/how-to-bind-postgres?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
  - [App Service with PostgreSQL](/azure/app-service/tutorial-java-tomcat-connect-managed-identity-postgresql-database?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
  - [Container Apps with PostgreSQL](/azure/container-apps/tutorial-java-quarkus-connect-managed-identity-postgresql-database?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
- [.NET with Blob Storage](/azure/storage/blobs/storage-quickstart-blobs-dotnet?toc=/azure/developer/intro/toc.json&bc=/azure/developer/intro/breadcrumb/toc.json)
