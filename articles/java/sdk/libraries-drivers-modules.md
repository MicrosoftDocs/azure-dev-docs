---
title: Java libraries, drivers, and Spring modules for Azure
description: Links to the Java libraries, drivers, Spring modules, and related articles available for use with Azure.
ms.date: 09/03/2026
ms.topic: concept-article
ms.custom: devx-track-java, devx-track-extended-java
---

# Java libraries, drivers, and Spring modules for Azure

This article provides links to the Java libraries, drivers, Spring modules, and related articles available for use with Azure.

Microsoft's goal is to empower every developer to achieve more, and our commitment to Java developers is no exception. Java and Spring developers want to use idiomatic libraries to simplify connections to their preferred cloud services. These libraries, drivers, and modules let you easily interact with Azure services across data, messaging, cache, storage, eventing, directory, and secrets management. Use the following table to find the right library, driver, or module and guides to get started.

<!-- In raw Markdown, this table is best viewed with word-wrap turned off. -->

| Category     | Azure service                        | Java library or driver                             | Java getting started                                                                                    | Spring module                                                                                                                | Spring getting started                                                                                                                           |
|--------------|--------------------------------------|----------------------------------------------------|---------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Data         | Azure SQL Database                   | [SQL Database JDBC driver]                         | [Use Java and JDBC with Azure SQL Database]                                                             | Spring Data: <br> * [JDBC] <br> * [JPA] <br> * [R2DBC]                                                                       | Use Spring Data with Azure SQL Database: <br> * [JDBC][JDBC SQL] <br> * [JPA][JPA SQL] <br> * [R2DBC][R2DBC SQL]                                 |
| Data         | Azure Database for MySQL             | [MySQL JDBC driver]                                | [Use Java and JDBC with Azure Database for MySQL Flexible Server]                                       | Spring Data: <br> * [JDBC] <br> * [JPA] <br> * [R2DBC]                                                                       | Use Spring Data with Azure Database for MySQL: <br> * [JDBC][JDBC MySQL] <br> * [JPA][JPA MySQL] <br> * [R2DBC][R2DBC MySQL]                     |
| Data         | Azure Database for PostgreSQL        | [PostgreSQL JDBC driver]                           | [Quickstart: Use Java and JDBC with Azure Database for PostgreSQL Flexible Server]                      | Spring Data: <br> * [JDBC] <br> * [JPA] <br> * [R2DBC]                                                                       | Use Spring Data with Azure Database for PostgreSQL: <br> * [JDBC][JDBC PostgreSQL] <br> * [JPA][JPA PostgreSQL] <br> * [R2DBC][R2DBC PostgreSQL] |
| Data         | Azure Cosmos DB for NoSQL            | [Maven Repository: com.azure » azure-cosmos]       | [Quickstart: Use Azure Cosmos DB for NoSQL with Azure SDK for Java]                                     | [Spring Data Azure Cosmos DB]                                                                                                | [How to use the Spring Boot Starter with Azure Cosmos DB for NoSQL]                                                                              |
| Data         | Azure Cosmos DB for MongoDB          | [MongoDB Java Drivers]                             | [Connect a MongoDB application to Azure Cosmos DB for MongoDB]                                          | [Spring Data MongoDB]                                                                                                        | [How to use Spring Data with Azure Cosmos DB for MongoDB]                                                                                        |
| Data         | Azure Cosmos DB for Apache Cassandra | [Apache Cassandra Java Driver]                     | [Quickstart: Java library for Azure Cosmos DB for Apache Cassandra]                                     | [Spring Data Apache Cassandra]                                                                                               | [How to use Spring Data with Azure Cosmos DB for Apache Cassandra]                                                                               |
| Data         | Azure Cosmos DB for Apache Gremlin   | [Gremlin Java Driver]                              | [Quickstart: Traverse vertices and edges with the console]                                              |                                                                                                                              |                                                                                                                                                  |
| Config       | Azure App Configuration              | [com.azure:azure-data-appconfiguration]            | [Quickstart: Create a Java Spring app with Azure App Configuration]                                     | [Spring Cloud Azure App Configuration support]                                                                               | [Quickstart: Create a Java Spring app with Azure App Configuration]                                                                              |
| Cache        | Azure Cache for Redis                | [Lettuce client]                                   | [Best Practices for using Azure Cache for Redis with Lettuce]                                           | * [Spring Data Redis] <br> * [Reference] <br> * [Spring Cloud Azure Redis support]                                           | [Configure a Spring Boot Initializer app to use Redis in the cloud with Azure Cache for Redis]                                                   |
| Cache        | Azure Cache for Redis                | [Jedis client]                                     | [Quickstart: Use Azure Cache for Redis in Java]                                                         | * [Spring Data Redis] <br> * [Reference] <br> * [Spring Cloud Azure Redis support]                                           | [Configure a Spring Boot Initializer app to use Redis in the cloud with Azure Cache for Redis]                                                   |
| Cache        | Azure Managed Redis                  | [Jedis client]                                     | [Quickstart: Use Azure Managed Redis in Java]                                                           |                                                                                                                              |                                                                                                                                                  |
| Storage      | Azure Storage Blob                   | [Maven Repository: com.azure » azure-storage-blob] | [Quickstart: Manage blobs with Java v12 SDK]                                                            | [Spring Cloud Azure resource handling]                                                                                       | [How to use the Spring Boot Starter for Azure Storage]                                                                                           |
| Storage      | Azure Storage Queue                  | [Azure Storage Queue client library for Java]      | [Quickstart: Azure Queue Storage client library for Java]                                               | [Spring Cloud Azure Storage Queue support]                                                                                   | [How to use Storage Queue in Spring applications]                                                                                                |
| Storage      | Azure Storage File Share             | [Azure File Share client library for Java]         | [Develop for Azure Files with Java]                                                                     | [Spring Cloud Azure Storage File Share configuration properties]                                                             |                                                                                                                                                  |
| Messaging    | Service Bus                          | [JMS + AMQP]                                       | [Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic]      | * [Spring AMQP] <br> * [Spring Cloud Azure JMS support]                                                                      | [How to use Spring Boot Starter for Azure Service Bus JMS]                                                                                       |
| Messaging    | Service Bus                          | [Azure Service Bus client library for Java]        | [Azure Service Bus Samples client library for Java]                                                     | * [Spring AMQP] <br> * [Spring integration with Azure Service Bus] <br> * [Spring Cloud Stream Binder for Azure Service Bus] | [How to use Spring Cloud Azure Stream Binder for Azure Service Bus]                                                                              |
| Eventing     | Event Hubs                           | [Kafka]                                            | [Send and Receive Messages in Java using Azure Event Hubs for Apache Kafka Ecosystems]                  | * [Spring for Apache Kafka] <br> * [Spring Cloud Azure Kafka support]                                                        | [How to use the Spring Boot Starter for Apache Kafka with Azure Event Hubs]                                                                      |
| Eventing     | Event Hubs                           | [Azure Event Hubs libraries for Java]              | [Use Java to send events to or receive events from Azure Event Hubs]                                    | [Spring Cloud Stream Binder for Event Hubs]                                                                                  | [How to create a Spring Cloud Stream Binder application with Azure Event Hubs]                                                                   |
| Eventing     | Event Grid                           | [Azure Event Grid client library for Java]         |                                                                                                         |                                                                                                                              | [Configure a Spring Boot Initializer app to use Event Grid]                                                                                      |
| Directory    | Microsoft Entra ID                   | [MSAL]                                             | [Enable Java Servlet apps to sign in users on Microsoft Entra ID]                                       | [Microsoft Entra Spring Boot Starter]                                                                                        | [Enable Spring Boot Web apps to sign in users on Microsoft Entra ID]                                                                             |
| Directory    | Microsoft Entra External ID          | [MSAL]                                             | [Quickstart: Get started with Microsoft Entra External ID]                                              |                                                                                                                              |                                                                                                                                                  |
| Secrets      | Key Vault                            | [Key Vault Secrets]                                | [Manage secrets using Key Vault]                                                                        | [Key Vault Secrets Spring Boot Starter]                                                                                      | [Manage secrets for Spring Boot apps]                                                                                                            |
| Certificates | Key Vault                            | [Key Vault Certificates JCA]                       | [Quickstart: Azure Key Vault Certificate client library for Java]                                       | [Key Vault Certificates Spring Boot Starter]                                                                                 | [Manage certificates for Spring Boot apps]                                                                                                       |
| AI           | Azure OpenAI                         | [com.azure:azure-ai-openai]                        | * [Azure AI for Java developers] <br> * [Get Started with the Chat Using Your Own Data Sample for Java] | [Spring AI OpenAI Chat]                                                                                                      | [Spring AI OpenAI Chat]                                                                                                                          |

[SQL Database JDBC driver]: /java/api/overview/azure/sql
[MySQL JDBC driver]: https://dev.mysql.com/downloads/connector/j/
[PostgreSQL JDBC driver]: https://jdbc.postgresql.org/download/
[Maven Repository: com.azure » azure-cosmos]: https://mvnrepository.com/artifact/com.azure/azure-cosmos
[MongoDB Java Drivers]: https://mongodb.github.io/mongo-java-driver/
[Apache Cassandra Java Driver]: https://github.com/apache/cassandra-java-driver/tree/4.x
[Gremlin Java Driver]: https://mvnrepository.com/artifact/org.apache.tinkerpop/gremlin-driver
[com.azure:azure-data-appconfiguration]: /java/api/overview/azure/data-appconfiguration-readme
[Lettuce client]: https://github.com/redis/lettuce
[Jedis client]: https://github.com/redis/jedis
[Maven Repository: com.azure » azure-storage-blob]: https://mvnrepository.com/artifact/com.azure/azure-storage-blob
[Azure Storage Queue client library for Java]: /java/api/overview/azure/storage-queue-readme
[Azure File Share client library for Java]: /java/api/overview/azure/storage-file-share-readme
[JMS + AMQP]: /azure/service-bus-messaging/how-to-use-java-message-service-20#downloading-the-java-message-service-jms-client-library
[Azure Service Bus client library for Java]: /java/api/overview/azure/messaging-servicebus-readme
[Kafka]: https://kafka.apache.org/documentation/
[Azure Event Hubs libraries for Java]: /java/api/overview/azure/event-hubs
[Azure Event Grid client library for Java]: /java/api/overview/azure/messaging-eventgrid-readme
[MSAL]: https://github.com/AzureAD/microsoft-authentication-library-for-java
[Key Vault Secrets]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/keyvault/azure-security-keyvault-secrets
[Key Vault Certificates JCA]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/keyvault/azure-security-keyvault-jca
[com.azure:azure-ai-openai]: /java/api/overview/azure/ai-openai-readme
[Use Java and JDBC with Azure SQL Database]: /azure/azure-sql/database/connect-query-java
[Use Java and JDBC with Azure Database for MySQL Flexible Server]: /azure/mysql/flexible-server/connect-java
[Quickstart: Use Java and JDBC with Azure Database for PostgreSQL Flexible Server]: /azure/postgresql/connectivity/connect-java
[Quickstart: Use Azure Cosmos DB for NoSQL with Azure SDK for Java]: /azure/cosmos-db/quickstart-java
[Connect a MongoDB application to Azure Cosmos DB for MongoDB]: /azure/cosmos-db/mongodb/connect-account
[Quickstart: Java library for Azure Cosmos DB for Apache Cassandra]: /azure/cosmos-db/cassandra/quickstart-java
[Quickstart: Traverse vertices and edges with the console]: /azure/cosmos-db/gremlin/quickstart-console
[Quickstart: Create a Java Spring app with Azure App Configuration]: /azure/azure-app-configuration/quickstart-java-spring-app
[Best Practices for using Azure Cache for Redis with Lettuce]: https://github.com/Azure/AzureCacheForRedis/blob/main/Lettuce%20Best%20Practices.md
[Quickstart: Use Azure Cache for Redis in Java]: /samples/azure-samples/azure-cache-redis-samples/quickstart-use-azure-cache-for-redis-in-java/
[Quickstart: Use Azure Managed Redis in Java]: /azure/redis/java-get-started
[Quickstart: Manage blobs with Java v12 SDK]: /azure/storage/blobs/storage-quickstart-blobs-java
[Quickstart: Azure Queue Storage client library for Java]: /azure/storage/queues/storage-quickstart-queues-java
[Develop for Azure Files with Java]: /azure/storage/files/storage-java-how-to-use-file-storage
[Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic]: /azure/service-bus-messaging/service-bus-java-how-to-use-topics-subscriptions
[Azure Service Bus Samples client library for Java]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/servicebus/azure-messaging-servicebus/src/samples
[Send and Receive Messages in Java using Azure Event Hubs for Apache Kafka Ecosystems]: https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/quickstart/java
[Use Java to send events to or receive events from Azure Event Hubs]: /azure/event-hubs/event-hubs-java-get-started-send
[Enable Java Servlet apps to sign in users on Microsoft Entra ID]: https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/3-java-servlet-web-app/1-Authentication/sign-in#readme
[Quickstart: Get started with Microsoft Entra External ID]: /entra/external-id/customers/quickstart-get-started-guide
[Manage secrets using Key Vault]: /azure/key-vault/secrets/quick-create-java
[Quickstart: Azure Key Vault Certificate client library for Java]: /azure/key-vault/certificates/quick-create-java
[Azure AI for Java developers]: ../ai/azure-ai-for-java-developers.md
[Get Started with the Chat Using Your Own Data Sample for Java]: ../ai/get-started-app-chat-template.md
[JDBC]: https://spring.io/projects/spring-data-relational/
[JPA]: https://spring.io/projects/spring-data-jpa
[R2DBC]: https://spring.io/projects/spring-data-r2dbc
[Spring Data Azure Cosmos DB]: ../spring-framework/how-to-guides-spring-data-cosmosdb.md
[Spring Data MongoDB]: https://spring.io/projects/spring-data-mongodb
[Spring Data Apache Cassandra]: https://spring.io/projects/spring-data-cassandra
[Spring Data Redis]: https://spring.io/projects/spring-data-redis
[Reference]: https://docs.spring.io/spring-data/redis/reference/redis.html
[Spring Cloud Azure Redis support]: ../spring-framework/redis-support.md
[Spring Cloud Azure resource handling]: ../spring-framework/resource-handling.md
[Spring Cloud Azure Storage Queue support]: ../spring-framework/spring-messaging-storage-queue-support.md
[Spring Cloud Azure Storage File Share configuration properties]: ../spring-framework/configuration-properties-azure-storage-file-share.md
[Spring AMQP]: https://spring.io/projects/spring-amqp
[Spring Cloud Azure JMS support]: ../spring-framework/spring-jms-support.md
[Spring integration with Azure Service Bus]: ../spring-framework/spring-integration-support.md#spring-integration-with-azure-service-bus
[Spring Cloud Stream Binder for Azure Service Bus]: ../spring-framework/spring-cloud-stream-support.md#spring-cloud-stream-binder-for-azure-service-bus
[Spring for Apache Kafka]: https://spring.io/projects/spring-kafka
[Spring Cloud Azure Kafka support]: ../spring-framework/kafka-support.md
[Spring Cloud Stream Binder for Event Hubs]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-stream-binder-eventhubs
[Microsoft Entra Spring Boot Starter]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-active-directory
[Key Vault Secrets Spring Boot Starter]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-keyvault-secrets
[Key Vault Certificates Spring Boot Starter]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/spring-cloud-azure-starter-keyvault-certificates
[Spring Cloud Azure App Configuration support]: ../spring-framework/app-configuration-support.md
[Spring AI OpenAI Chat]: https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html
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
[Configure a Spring Boot Initializer app to use Redis in the cloud with Azure Cache for Redis]: ../spring-framework/configure-spring-boot-initializer-java-app-with-redis-cache.md
[How to use the Spring Boot Starter for Azure Storage]: ../spring-framework/configure-spring-boot-starter-java-app-with-azure-storage.md
[How to use Storage Queue in Spring applications]: ../spring-framework/using-storage-queue-in-spring-applications.md
[How to use Spring Boot Starter for Azure Service Bus JMS]: ../spring-framework/configure-spring-boot-starter-java-app-with-azure-service-bus.md
[How to use Spring Cloud Azure Stream Binder for Azure Service Bus]: ../spring-framework/configure-spring-cloud-stream-binder-java-app-with-service-bus.md
[How to use the Spring Boot Starter for Apache Kafka with Azure Event Hubs]: ../spring-framework/configure-spring-cloud-stream-binder-java-app-kafka-azure-event-hub.md
[How to create a Spring Cloud Stream Binder application with Azure Event Hubs]: ../spring-framework/configure-spring-cloud-stream-binder-java-app-azure-event-hub.md
[Configure a Spring Boot Initializer app to use Event Grid]: ../spring-framework/configure-spring-boot-initializer-java-app-with-event-grid.md
[Enable Spring Boot Web apps to sign in users on Microsoft Entra ID]: https://github.com/Azure-Samples/ms-identity-msal-java-samples/tree/main/4-spring-web-app/1-Authentication/sign-in#readme
[Manage secrets for Spring Boot apps]: ../spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault.md
[Manage certificates for Spring Boot apps]: ../spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault-certificates.md

## Next steps

For all other libraries, see [Azure SDK for Java libraries](./azure-sdk-library-package-index.md).
