---
title: Azure Cosmos DB dev guide
description: This guide describes the features, issues, workarounds, and diagnostic steps to be aware of when you use the Spring Data Azure Cosmos DB SDK.
author: KarlErickson
ms.author: karler
ms.reviewer: seal
ms.topic: article
ms.date: 08/28/2024
ms.custom: devx-track-java, spring-cloud-azure, devx-track-extended-java
---

# Azure Cosmos DB dev guide

Azure Spring Data for Azure Cosmos DB provides Spring Data support for [Azure Cosmos DB for NoSQL][sql_api_query]. [Azure Cosmos DB][cosmos_introduction] is a globally distributed database service that allows developers to work with data using various standard APIs, such as SQL, MongoDB, Cassandra, Graph, and Table.

This guide will walk you through the concepts of Azure Spring Data Azure Cosmos DB SDK, supported features, troubleshooting, and known issues. For more information on below concepts and code samples, see the [Spring Data for Azure Cosmos DB SDK readme][azure-spring-data-cosmos-sdk-readme].

## Version support policy

### Spring Boot version support

This project supports multiple Spring Boot versions. For more information, see [Spring Boot Support Policy][spring-boot-support-policy]. Maven users can inherit from the `spring-boot-starter-parent` project to obtain a dependency management section to let Spring manage the versions for dependencies. For more information, see [Spring Boot Version Support][spring-boot-version-support].

### Spring Data version support

This project supports different spring-data-commons versions. For more information, see [Spring Data Version Support][spring-data-version-support].

### Which version of Azure Spring Data Azure Cosmos DB to use

Azure Spring Data Azure Cosmos DB library supports multiple versions of Spring Boot / Spring Cloud. For more information on which version of Azure Spring Data Azure Cosmos DB to use with Spring Boot / Spring Cloud version, see [Which Version of Azure Spring Data for Azure Cosmos DB should I use?][spring-data-cosmos-sdk-version-mapping].

## Get started

### Include the package

If you're using Maven, add the following dependency.

[//]: # ({x-version-update-start;com.azure:azure-spring-data-cosmos;current})
```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-spring-data-cosmos</artifactId>
    <version>LATEST</version>
</dependency>
```
[//]: # ({x-version-update-end})

### Prerequisites

- [Java Development Kit (JDK)][jdk_link], version 8 or higher.
- An active Azure account. If you don't have one, you can sign up for a [free account][azure_subscription]. Alternatively, you can use the [Azure Cosmos DB Emulator][local_emulator] for development and testing. As emulator https certificate is self-signed, you need to import its certificate to java trusted cert store, [explained here][local_emulator_export_ssl_certificates]
- (Optional) SLF4J is a logging facade.
- (Optional) [SLF4J binding](https://www.slf4j.org/manual.html) is used to associate a specific logging framework with SLF4J.
- (Optional) [Maven][maven_link]

SLF4J is only needed if you plan to use logging, also download an SLF4J binding, which will link the SLF4J API with the logging implementation of your choice. For more information, see the [SLF4J user manual](https://www.slf4j.org/manual.html).

### Set up and customize the configuration class

In order to set up the configuration class, you need to extend `AbstractCosmosConfiguration`. For more information, see [Setup Configuration Class][setup-configuration-class].

You can customize underlying `CosmosAsyncClient` used by Azure Spring Data Azure Cosmos DB SDK by providing `DirectConnectionConfig` or `GatewayConnectionConfig` or both and provide them to `CosmosClientBuilder`. For complete sample, visit [customizing configuration section][customizing-configuration].

### Entity setup

You can define a simple entity as item in Azure Cosmos DB. You can define entities by adding the `@Container` annotation and specifying properties related to the container. For more information, see [Define an entity][define-an-entity].

Container annotation supports specifying the container name, [request units](/azure/cosmos-db/request-units) (RUs), time to live, [creating containers with autoscale throughput][creating-containers-with-autoscale-throughput], [nested partition key support][nested-partition-key-support], and other container properties.

### Repository setup

Azure Spring Data Azure Cosmos DB supports `ReactiveCrudRepository` (async APIs) and `CrudRepository` (sync APIs), which provide the following basic CRUD functionality:

- save
- findAll
- findOne by ID
- deleteAll
- delete by ID
- delete entity

You can extend `CosmosRepository` (for sync API support) or `ReactiveCosmosRepository` (for async API support) to set up Spring Data repositories for your application. For more information, see [Create repositories][create-repositories].

Azure Spring Data Azure Cosmos DB supports specifying annotated queries in the repositories using `@Query`. For more information, see [QueryAnnotation : Using annotated queries in repositories][query-annotation-code-snippet].

### Spring Data Annotations

#### Spring Data [@Id annotation][spring_data_commons_id_annotation]

There are multiple ways to map a field in domain class to `id`. For more information, see the [spring data ID annotation code section][spring-data-id-annotation].

#### ID auto generation

Azure Spring Data Azure Cosmos DB supports auto generation of IDs using the @GeneratedValue annotation. For more information, see the [ID auto generation section][id-auto-generation].

#### SpEL expression and custom container name

By default, the container name will be the class name of the user domain class. To customize, add the `@Container(containerName="myCustomContainerName")` annotation to the domain class. For more information, see the [SpEL expression and custom container name section][spel-expression-and-custom-container-name].

#### Custom IndexingPolicy

By default, `IndexingPolicy` will be set by Azure service. To customize, add the annotation `@CosmosIndexingPolicy` to the domain class. For more information, see the [indexing policy section][indexing-policy].

#### Unique key policy

Azure Spring Data Azure Cosmos DB supports setting `UniqueKeyPolicy` on the container by adding the annotation `@CosmosUniqueKeyPolicy` to the domain class. For more information, see the [unique key policy section][unique-key-policy].

### Azure Cosmos DB Partition

`Azure-spring-data-cosmos` supports [Azure Cosmos DB partitions][azure_cosmos_db_partition].

To specify a field of the domain class to be a partition key field, just annotate it with `@PartitionKey`.

When you perform CRUD operation, specify your partition value.

For more information, see the [test here section][address_repository_it_test].

### Optimistic Locking

`Azure-spring-data-cosmos` supports Optimistic Locking for specific containers, which means upserts/deletes by item will fail with an exception in case the item is modified by another process in the meantime. For more information, see the [optimistic locking section][optimistic-locking].

### Spring Data custom query, pageable and sorting

`Azure-spring-data-cosmos` supports [Spring Data custom queries][spring_data_custom_query], for example, a find operation such as `findByAFieldAndBField`. It also supports [Spring Data Pageable, Slice and Sort][spring-data-pageable-slice-sort]. For more information, see the [query, pageable and sorting section][spring-data-custom-query-pageable-and-sorting].

### Using Azure Cosmos DB Java SDK through Spring Data Cosmos

`Azure-spring-data-cosmos` supports using `Azure Cosmos DB Java SDK`. Users can get `CosmosClient` or `CosmosAsyncClient` bean through `ApplicationContext` and execute any operations supported by Azure Cosmos DB Java SDK. For more information, see the [using Azure Cosmos Client through Spring Data Cosmos section][using-azure-cosmos-db-java-sdk-through-spring-data-cosmos].

### Spring Data REST

`Azure-spring-data-cosmos` supports [Spring Data REST](https://spring.io/projects/spring-data-rest/). For more information, see the [Azure Spring Data Azure Cosmos DB REST API section][spring-boot-starter-data-rest].

### Auditing

`Azure-spring-data-cosmos` supports auditing fields on database entities using standard spring-data annotations. For more information, see the [Spring Data Azure Cosmos DB auditing section][spring-data-cosmos-auditing].

### Multi-database configuration

`Azure-spring-data-cosmos` supports multi-database configuration, including "multiple database accounts" and "single account, with multiple databases". For a complete code snippet, see the [multi database configuration section][multi-database-configuration].

## Troubleshooting

### General

If you encounter any bug, file an issue [here](https://github.com/Azure/azure-sdk-for-java/issues/new).

To suggest a new feature or changes that could be made, file an issue the same way you would for a bug.

### Enable Client Logging

`Azure-spring-data-cosmos` uses SLF4j as the logging facade that supports logging into popular logging frameworks such as log4j and logback. For more information, see the [enable client logging section][enable-client-logging].

## Examples

For a complete sample project, see the [sample project][samples].

### Multi-database accounts

For a complete sample project, see the [Multi-database sample project][sample-for-multi-database].

### Single account with Multi-database

For a complete sample project, see the [Single account with Multi-database sample project][sample-for-multi-database-single-account].

## Next steps

- [Read more about Azure spring data Azure Cosmos DB][azure_spring_data_cosmos_docs].
- [Read more about Azure Cosmos DB Service][cosmos_docs]
- [See the Azure Spring Data Azure Cosmos DB Samples][azure-spring-data-cosmos-samples]
- [See the Spring MVC with Azure Cosmos DB Sample][spring-mvc-with-azure-cosmosdb-samples]

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
[Contributor License Agreement (CLA)][cla] declaring that you have the right to, and actually do, grant us the rights
to use your contribution.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide a CLA and decorate
the PR appropriately - for example, label, comment. Simply follow the instructions provided by the bot. You'll only need to
do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct][coc]. For more information, see the [Code of Conduct FAQ][coc_faq]
or contact [opencode@microsoft.com][coc_contact] with any other questions or comments.

<!-- LINKS -->
[source_code]: src
[cosmos_introduction]: /azure/cosmos-db/
[cosmos_docs]: /azure/cosmos-db/introduction
[jdk]: /java/azure/jdk/
[maven]: https://maven.apache.org/
[cla]: https://cla.microsoft.com
[coc]: https://opensource.microsoft.com/codeofconduct/
[coc_faq]: https://opensource.microsoft.com/codeofconduct/faq/
[coc_contact]: mailto:opencode@microsoft.com
[azure_subscription]: https://azure.microsoft.com/free/
[samples]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/src/samples/java/com/azure/spring/data/cosmos
[sample-for-multi-database]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/cosmos/azure-spring-data-cosmos/cosmos-multi-database-multi-account
[sample-for-multi-database-single-account]: https://github.com/Azure-Samples/azure-spring-boot-samples/tree/main/cosmos/azure-spring-data-cosmos/cosmos-multi-database-single-account
[sql_api_query]: /azure/cosmos-db/sql-api-sql-query
[local_emulator]: /azure/cosmos-db/local-emulator
[local_emulator_export_ssl_certificates]: /azure/cosmos-db/local-emulator-export-ssl-certificates
[spring_data_commons_id_annotation]: https://github.com/spring-projects/spring-data-commons/blob/main/src/main/java/org/springframework/data/annotation/Id.java
[azure_cosmos_db_partition]: /azure/cosmos-db/partition-data
[address_repository_it_test]: https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/spring/azure-spring-data-cosmos/src/test/java/com/azure/spring/data/cosmos/repository/integration/AddressRepositoryIT.java
[azure_spring_data_cosmos_docs]: /azure/cosmos-db/sql-api-sdk-java-spring-v3
[spring_data_custom_query]: https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.query-methods.details
[sql_queries_in_cosmos]: /azure/cosmos-db/tutorial-query-sql-api
[sql_queries_getting_started]: /azure/cosmos-db/sql-query-getting-started
[jdk_link]: /java/azure/jdk/
[maven_link]: https://maven.apache.org/
[autoscale-throughput]: /azure/cosmos-db/provision-throughput-autoscale
[unique-keys]: /azure/cosmos-db/unique-keys
[spring-boot-support-policy]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos#spring-boot-support-policy
[spring-boot-version-support]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos#spring-boot-version-support
[spring-data-version-support]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos#spring-data-version-support
[spring-data-cosmos-sdk-version-mapping]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#which-version-of-azure-spring-data-cosmos-should-i-use
[setup-configuration-class]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos#setup-configuration-class
[customizing-configuration]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos#customizing-configuration
[azure-spring-data-cosmos-sdk-readme]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md
[define-an-entity]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#define-an-entity
[creating-containers-with-autoscale-throughput]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#creating-containers-with-autoscale-throughput
[nested-partition-key-support]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#nested-partition-key-support
[create-repositories]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#create-repositories
[query-annotation-code-snippet]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#queryannotation--using-annotated-queries-in-repositories
[spring-data-id-annotation]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#spring-data-id-annotation
[spring_data_commons_id_annotation]: https://github.com/spring-projects/spring-data-commons/blob/main/src/main/java/org/springframework/data/annotation/Id.java
[id-auto-generation]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#id-auto-generation
[spel-expression-and-custom-container-name]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#spel-expression-and-custom-container-name
[indexing-policy]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#indexing-policy
[unique-key-policy]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#unique-key-policy
[optimistic-locking]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#optimistic-locking
[spring-data-pageable-slice-sort]: https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.special-parameters
[spring-data-custom-query-pageable-and-sorting]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#spring-data-custom-query-pageable-and-sorting
[using-azure-cosmos-db-java-sdk-through-spring-data-cosmos]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#using-azure-cosmos-db-java-sdk-through-spring-data-cosmos
[spring-boot-starter-data-rest]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#spring-boot-starter-data-rest
[spring-data-cosmos-auditing]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#auditing
[multi-database-configuration]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#multi-database-configuration
[enable-client-logging]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring/azure-spring-data-cosmos/README.md#enable-client-logging
[azure-spring-data-cosmos-samples]: https://github.com/Azure-Samples/azure-spring-data-cosmos-java-sql-api-samples
[spring-mvc-with-azure-cosmosdb-samples]: https://github.com/Azure-Samples/azure-spring-mvc-cosmos-db-java-sql-api-samples
