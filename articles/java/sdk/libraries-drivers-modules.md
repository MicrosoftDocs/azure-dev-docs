---
title: Java libraries, drivers, and Spring modules for Azure
description: Links to the Java libraries, drivers, Spring modules, and related articles available for use with Azure.
ms.date: 06/02/2025
ms.topic: article
ms.custom: devx-track-java, devx-track-extended-java
---

# Java libraries, drivers, and Spring modules for Azure

This article provides links to the Java libraries, drivers, Spring modules, and related articles available for use with Azure.

Microsoft’s goal is to empower every developer to achieve more, and our commitment to Java developers is no exception. Java and Spring developers want to use idiomatic libraries to simplify connections to their preferred cloud services. These libraries, drivers, and modules let you easily interact with Azure services across data, messaging, cache, storage, eventing, directory, and secrets management. Use the following table to find the right library, driver, or module and guides to get started.

<!-- In raw Markdown, this table is best viewed with word-wrap turned off. -->

| Category     | Azure service              | Java library or driver                             | Java getting started                                                                               | Spring module                                                                                                                | Spring getting started                                                                                                                           |
|--------------|----------------------------|----------------------------------------------------|----------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Data         | SQL database               | [SQL Database JDBC driver]                         | [Use Java and JDBC with Azure SQL Database]                                                        | Spring Data: <br> • [JDBC] <br> • [JPA] <br> • [R2DBC]                                                                       | Use Spring Data with Azure SQL Database: <br> • [JDBC][JDBC SQL] <br> • [JPA][JPA SQL] <br> • [R2DBC][R2DBC SQL]                                 |
| Data         | MySQL                      | [MySQL JDBC driver]                                | [Quickstart: Use Java and JDBC with Azure Database for MySQL]                                      | Spring Data: <br> • [JDBC] <br> • [JPA] <br> • [R2DBC]                                                                       | Use Spring Data with Azure Database for MySQL: <br> • [JDBC][JDBC MySQL] <br> • [JPA][JPA MySQL] <br> • [R2DBC][R2DBC MySQL]                     |
| Data         | PostgreSQL                 | [PostgreSQL JDBC driver]                           | [Quickstart: Use Java and JDBC with Azure Database for PostgreSQL Flexible Server]                 | Spring Data: <br> • [JDBC] <br> • [JPA] <br> • [R2DBC]                                                                       | Use Spring Data with Azure Database for PostgreSQL: <br> • [JDBC][JDBC PostgreSQL] <br> • [JPA][JPA PostgreSQL] <br> • [R2DBC][R2DBC PostgreSQL] |
| Data         | MariaDB                    | [MariaDB driver]                                   | [MariaDB drivers and management tools compatible with Azure Database for MariaDB]                  | Spring Data: <br> • [JDBC] <br> • [JPA] <br> • [R2DBC]                                                                       | Use Spring Data with Azure Database for MySQL: <br> • [JDBC][JDBC MySQL] <br> • [JPA][JPA MySQL] <br> • [R2DBC][R2DBC MySQL]                     |
| Data         | Azure Cosmos DB - SQL            | [Maven Repository: com.azure » azure-cosmos]       | [Quickstart: Build a Java app to manage Azure Cosmos DB for NoSQL data]                              | [Spring Data Azure Cosmos DB]                                                                                                      | [How to use the Spring Boot Starter with Azure Cosmos DB for NoSQL]                                                                            |
| Data         | Azure Cosmos DB - MongoDB        | [MongoDB Java Drivers]                             | [Quickstart: Create a console app with Java and Azure Cosmos DB for MongoDB]                | [Spring Data MongoDB]                                                                                                        | [How to use Spring Data with Azure Cosmos DB for MongoDB]                                                                                        |
| Data         | Azure Cosmos DB - Cassandra      | [Datastax Java Driver for Apache Cassandra]        | [Quickstart: Build a Java app to manage Azure Cosmos DB for Apache Cassandra data (v4 Driver)]            | [Spring Data Apache Cassandra]                                                                                           | [How to use Spring Data with Azure Cosmos DB for Apache Cassandra]                                                                               |
| Data         | Azure Cosmos DB for Apache Gremlin        | [Gremlin Java Driver]                              | [Quickstart: Build a graph database with the Java SDK and Azure Cosmos DB for Apache Gremlin]         |                                                                                                                              | [Quickstart: Build a graph database with the Java SDK and Azure Cosmos DB for Apache Gremlin]                                                       |
| Cache        | Redis                      | [JEDIS client]                                     | [Quickstart: Use Azure Cache for Redis in Java]                                                    | • [Spring Data Redis] <br> • [Reference] <br> • [Spring Cloud Azure Redis support]                                           | [Configure a Spring Boot Initializer app to use Redis in the cloud with Azure Redis Cache]                                                       |
| Cache        | Redis                      | [LETTUCE client]                                   | [Best Practices for using Azure Cache for Redis with Lettuce]                                      | • [Spring Data Redis] <br> • [Reference] <br> • [Spring Cloud Azure Redis support]                                           | [Configure a Spring Boot Initializer app to use Redis in the cloud with Azure Redis Cache]                                                       |
| Storage      | Azure Storage              | [Maven Repository: com.azure » azure-storage-blob] | [Quickstart: Manage blobs with Java v12 SDK]                                                       | [Spring Cloud Azure resource handing]                                                                                        | [How to use the Spring Boot Starter for Azure Storage]                                                                                           |
| Messaging    | Service Bus                | [JMS + AMQP]                                       | [Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic] | • [Spring AMQP] <br> • [Spring Cloud Azure JMS support]                                                                      | [How to use Spring Boot Starter for Azure Service Bus JMS]                                                                                       |
| Messaging    | Service Bus                | [Azure Service Bus client library for Java]        | [Azure Service Bus Samples client library for Java]                                                | • [Spring AMQP] <br> • [Spring integration with Azure Service Bus] <br> • [Spring Cloud Stream Binder for Azure Service Bus] | [How to use Spring Cloud Azure Stream Binder for Azure Service Bus]                                                                              |
| Eventing     | Event Hubs                 | [Kafka]                                            | [Send and Receive Messages in Java using Azure Event Hubs for Apache Kafka Ecosystems]             | • [Spring for Apache Kafka] <br> • [Spring Cloud Azure Kafka support]                                                        | [How to use the Spring Boot Starter for Apache Kafka with Azure Event Hubs]                                                                      |
| Eventing     | Event Hubs                 | [Azure Event Hubs libraries for Java]              | [Use Java to send events to or receive events from Azure Event Hubs]                               | [Spring Cloud Stream Binder for Event Hubs]                                                                                  | [How to create a Spring Cloud Stream Binder application with Azure Event Hubs]                                                                   |
| Directory    | Microsoft Entra ID     | [MSAL]                                             | [Enable Java Servlet apps to sign in users on Microsoft Entra ID]                                            | [Microsoft Entra Spring Boot Starter]                                                                                               | [Enable Spring Boot Web apps to sign in users on Microsoft Entra ID]                                                                                       |
| Directory    | Azure Active Directory B2C | [MSAL]                                             | [Enable Java Servlet apps to sign in users on Azure AD B2C]                                        | [Azure AD B2C Spring Boot Starter]                                                                                           | [Enable Spring Boot Web apps to sign in users on Azure AD B2C]                                                                                   |
| Secrets      | Key Vault                  | [Key Vault Secrets]                                | [Manage secrets using Key Vault]                                                                   | [Key Vault Secrets Spring Boot Starter]                                                                                      | [Manage secrets for Spring Boot apps]                                                                                                            |
| Certificates | Key Vault                  | [Key Vault Certificates JCA]                       |                                                                                                    | [Key Vault Certificates Spring Boot Starter]                                                                                 | [Manage certificates for Spring Boot apps]                                                                                                       |

[SQL Database JDBC driver]: /java/api/overview/azure/sql
[MySQL JDBC driver]: https://dev.mysql.com/downloads/connector/j/
[PostgreSQL JDBC driver]: https://jdbc.postgresql.org/download/
[MariaDB driver]: https://downloads.mariadb.org/connector-java/
[Maven Repository: com.azure » azure-cosmos]: https://mvnrepository.com/artifact/com.azure/azure-cosmos
[MongoDB Java Drivers]: https://mongodb.github.io/mongo-java-driver/
[Datastax Java Driver for Apache Cassandra]: https://github.com/datastax/java-driver/tree/4.x
[Gremlin Java Driver]: https://mvnrepository.com/artifact/org.apache.tinkerpop/gremlin-driver
[JEDIS client]: https://github.com/redis/jedis
[LETTUCE client]: https://github.com/redis/lettuce
[Maven Repository: com.azure » azure-storage-blob]: https://mvnrepository.com/artifact/com.azure/azure-storage-blob
[JMS + AMQP]: /azure/service-bus-messaging/how-to-use-java-message-service-20#downloading-the-java-message-service-jms-client-library
[Azure Service Bus client library for Java]: /java/api/overview/azure/messaging-servicebus-readme
[Kafka]: https://kafka.apache.org/10/documentation.html
[Azure Event Hubs libraries for Java]: /java/api/overview/azure/eventhub
[MSAL]: https://github.com/AzureAD/microsoft-authentication-library-for-java
[Key Vault Secrets]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/keyvault/azure-security-keyvault-secrets
[Key Vault Certificates JCA]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/keyvault/azure-security-keyvault-jca
[Use Java and JDBC with Azure SQL Database]: /azure/azure-sql/database/connect-query-java
[Quickstart: Use Java and JDBC with Azure Database for MySQL]: /azure/mysql/connect-java
[Quickstart: Use Java and JDBC with Azure Database for PostgreSQL Flexible Server]: /azure/postgresql/flexible-server/connect-java
[MariaDB drivers and management tools compatible with Azure Database for MariaDB]: /azure/mariadb/concepts-compatibility
[Quickstart: Build a Java app to manage Azure Cosmos DB for NoSQL data]: /azure/cosmos-db/sql/create-sql-api-java
[Quickstart: Create a console app with Java and Azure Cosmos DB for MongoDB]: /azure/cosmos-db/mongodb/create-mongodb-java
[Quickstart: Build a Java app to manage Azure Cosmos DB for Apache Cassandra data (v4 Driver)]: /azure/cosmos-db/cassandra/manage-data-java-v4-sdk
[Quickstart: Build a graph database with the Java SDK and Azure Cosmos DB for Apache Gremlin]: /azure/cosmos-db/graph/create-graph-java
[Quickstart: Use Azure Cache for Redis in Java]: /azure/azure-cache-for-redis/cache-java-get-started
[Best Practices for using Azure Cache for Redis with Lettuce]: https://github.com/Azure/AzureCacheForRedis/blob/main/Lettuce%20Best%20Practices.md
[Quickstart: Manage blobs with Java v12 SDK]: /azure/storage/blobs/storage-quickstart-blobs-java
[Spring Cloud Azure resource handing]: ../spring-framework/resource-handling.md
[Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic]: /azure/service-bus-messaging/service-bus-java-how-to-use-topics-subscriptions
[Azure Service Bus Samples client library for Java]: https://github.com/Azure/azure-sdk-for-java/tree/azure-messaging-servicebus_7.4.1/sdk/servicebus/azure-messaging-servicebus/src/samples
[Spring integration with Azure Service Bus]: ../spring-framework/spring-integration-support.md#spring-integration-with-azure-service-bus
[Spring Cloud Stream Binder for Azure Service Bus]: ../spring-framework/spring-cloud-stream-support.md#spring-cloud-stream-binder-for-azure-service-bus
[Send and Receive Messages in Java using Azure Event Hubs for Apache Kafka Ecosystems]: https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/java
[Use Java to send events to or receive events from Azure Event Hubs]: /azure/event-hubs/event-hubs-java-get-started-send
[Enable Java Servlet apps to sign in users on Microsoft Entra ID]: https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/3-java-servlet-web-app/1-Authentication/sign-in#readme
[Enable Java Servlet apps to sign in users on Azure AD B2C]: https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/3-java-servlet-web-app/1-Authentication/sign-in-b2c#readme
[Manage secrets using Key Vault]: /azure/key-vault/secrets/quick-create-java
[JDBC]: https://spring.io/projects/spring-data-jdbc
[JPA]: https://spring.io/projects/spring-data-jpa
[R2DBC]: https://spring.io/projects/spring-data-r2dbc
[Spring Data Azure Cosmos DB]: ../spring-framework/how-to-guides-spring-data-cosmosdb.md
[Spring Data MongoDB]: https://spring.io/projects/spring-data-mongodb
[Spring Data Apache Cassandra]: https://spring.io/projects/spring-data-cassandra
[Spring Data Redis]: https://spring.io/projects/spring-data-redis
[Reference]: https://docs.spring.io/spring-data/data-redis/docs/current-SNAPSHOT/reference/html/#redis:requirements
[Spring Cloud Azure Redis support]: ../spring-framework/redis-support.md
[Spring AMQP]: https://spring.io/projects/spring-amqp
[Spring Cloud Azure JMS support]: ../spring-framework/spring-jms-support.md
[Spring for Apache Kafka]: https://spring.io/projects/spring-kafka
[Spring Cloud Azure Kafka support]: ../spring-framework/kafka-support.md
[Spring Cloud Stream Binder for Event Hubs]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-stream-binder-eventhubs
[Microsoft Entra Spring Boot Starter]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory
[Azure AD B2C Spring Boot Starter]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory-b2c
[Key Vault Secrets Spring Boot Starter]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-keyvault-secrets
[Key Vault Certificates Spring Boot Starter]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-keyvault-certificates
[JDBC SQL]: ../spring-framework/configure-spring-data-jdbc-with-azure-sql-server.md
[JPA SQL]: ../spring-framework/configure-spring-data-jpa-with-azure-sql-server.md
[R2DBC SQL]: ../spring-framework/configure-spring-data-r2dbc-with-azure-sql-server.md
[JDBC MySQL]: ../spring-framework/configure-spring-data-jdbc-with-azure-mysql.md
[JPA MySQL]: ../spring-framework/configure-spring-data-jpa-with-azure-mysql.md
[R2DBC MySQL]: ../spring-framework/configure-spring-data-r2dbc-with-azure-mysql.md
[JDBC PostgreSQL]: ../spring-framework/configure-spring-data-jdbc-with-azure-postgresql.md
[JPA PostgreSQL]: ../spring-framework/configure-spring-data-jpa-with-azure-postgresql.md
[R2DBC PostgreSQL]: ../spring-framework/configure-spring-data-r2dbc-with-azure-postgresql.md
[How to use the Spring Boot Starter with Azure Cosmos DB for NoSQL]: ../spring-framework/configure-spring-boot-starter-java-app-with-cosmos-db.md
[How to use Spring Data with Azure Cosmos DB for MongoDB]: ../spring-framework/configure-spring-data-mongodb-with-cosmos-db.md
[How to use Spring Data with Azure Cosmos DB for Apache Cassandra]: ../spring-framework/configure-spring-data-apache-cassandra-with-cosmos-db.md
[Configure a Spring Boot Initializer app to use Redis in the cloud with Azure Redis Cache]: ../spring-framework/configure-spring-boot-initializer-java-app-with-redis-cache.md
[How to use the Spring Boot Starter for Azure Storage]: ../spring-framework/configure-spring-boot-starter-java-app-with-azure-storage.md
[How to use Spring Boot Starter for Azure Service Bus JMS]: ../spring-framework/configure-spring-boot-starter-java-app-with-azure-service-bus.md
[How to use Spring Cloud Azure Stream Binder for Azure Service Bus]: ../spring-framework/configure-spring-cloud-stream-binder-java-app-with-service-bus.md
[How to use the Spring Boot Starter for Apache Kafka with Azure Event Hubs]: ../spring-framework/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub.md
[How to create a Spring Cloud Stream Binder application with Azure Event Hubs]: ../spring-framework/configure-spring-cloud-stream-binder-java-app-azure-event-hub.md
[Enable Spring Boot Web apps to sign in users on Microsoft Entra ID]: https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4-spring-web-app/1-Authentication/sign-in#readme
[Enable Spring Boot Web apps to sign in users on Azure AD B2C]: https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4-spring-web-app/1-Authentication/sign-in-b2c#readme
[Manage secrets for Spring Boot apps]: ../spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault.md
[Manage certificates for Spring Boot apps]: ../spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault-certificates.md

## Next steps

For all other libraries, see [Azure SDK for Java libraries](./azure-sdk-library-package-index.md).
