---
title: Spring Data Azure Cosmos DB developer's guide
description: This guide describes what you should be aware of when you use the Spring Data Azure Cosmos DB SDK.
author: kushagraThapar
ms.author: kuthapar
ms.topic: conceptual
ms.date: 1/9/2019
ms.custom: devx-track-java
---

# Spring Data Azure Cosmos DB developer's guide

This topic describes the features of [Spring Data Cosmos DB](https://github.com/microsoft/spring-data-cosmosdb) using the SQL API. This topic also includes guidance on common issues, workarounds, and diagnostic steps.

[Azure Cosmos DB](/azure/cosmos-db/introduction) is a globally distributed database service that allows developers to work with data using a variety of standard APIs. The Spring Data Cosmos DB SDK is based on the [Spring Data](https://spring.io/projects/spring-data) framework and provides integration with Azure Cosmos DB using the SQL API. You can find information on the support for other APIs in the following topics:

- [How to use Spring Data MongoDB API with Azure Cosmos DB](./configure-spring-data-mongodb-with-cosmos-db.md)
- [How to use Spring Data Apache Cassandra API with Azure Cosmos DB](./configure-spring-data-apache-cassandra-with-cosmos-db.md)
- [How to use the Spring Data Gremlin Starter with the Azure Cosmos DB SQL API](./configure-spring-data-gremlin-java-app-with-cosmos-db.md)

The Spring Data Cosmos DB SDK is available as open source on GitHub in the [spring-data-cosmosdb](https://github.com/microsoft/spring-data-cosmosdb) repository. This repo has an active [Issues](https://github.com/microsoft/spring-data-cosmosdb/issues) list where you can file bugs or check for workarounds on issues that have already been filed. You can also check the [Releases](https://github.com/microsoft/spring-data-cosmosdb/releases) list to see if an issue has been fixed in a more recent version. The Spring Data Cosmos DB SDK version 2.2.x release train supports spring-data-commons version 2.2.0.RELEASE, whereas the version 2.1.x release train of the SDK supports spring-data-common version 2.1.0.RELEASE.

## Available features

The following sections describe the features currently available.

### CrudRepository and ReactiveCrudRepository support

The Spring Data Cosmos DB SDK provides the `CosmosRepository` and `ReactiveCosmosRepository` interfaces, which extend the Spring Data `CrudRepository` and `ReactiveCrudRepository` interfaces.

The following example shows how to extend these interfaces.

```java
@Repository
public interface SampleRepository extends CosmosRepository<SampleEntity, String> {
    List<SampleEntity> findByName(String name);
}

@Repository
public interface ReactiveSampleRepository extends ReactiveCosmosRepository<SampleEntity, String> {
    Flux<SampleEntity> findByName(String name);
}
```

Depending upon the usage, you need to enable both of the repositories separately in the `Configuration` class. For example:

```java
@Configuration
@PropertySource(value = {"classpath:application.properties"})
@EnableCosmosRepositories
@EnableReactiveCosmosRepositories
public class TestRepositoryConfig extends AbstractCosmosConfiguration {
    ...
}
```

### Define a simple entity

You can define entities by adding the `@Document` annotation and specifying properties related to the collection, such as the collection name, request units (RUs), time to live, and auto-create collection flag.

By default, the collection name will be the class name of the user-domain class. To customize it, add the `@Document(collection="myCustomCollectionName")` annotation to the domain class. The collection field also supports [Spring Expression Language](https://docs.spring.io/spring/docs/3.0.x/reference/expressions.html) (SpEL) expressions, so you can provide collection names programmatically via configuration properties. For example, you can use expressions such as `collection = "${dynamic.collection.name}"` and `collection = "#{@someBean.getCollectionName()}"`.

There are two ways to map a field in a domain class to the `id` field of an Azure Cosmos DB document:

- Annotate the field with `@Id`.
- Set the name of the field to `id`.

The following example shows the use of the `@Document` and `@Id` annotations.

```java
@Document(collection = "myCollection")
class MyDocument {

    @Id
    private String myId;

    @PartitionKey
    private String data;

    @Version
    private String _etag;
}
```

By default, `IndexingPolicy` is set by the Azure service. To customize it, add the annotation `@DocumentIndexingPolicy` to the domain class. This annotation has four attributes:

```java
boolean automatic;     // Indicates whether the indexing policy is automatic.
IndexingMode mode;     // The indexing policy mode; the options are Consistent, Lazy, or None.
String[] includePaths; // Included paths for indexing.
String[] excludePaths; // Excluded paths for indexing.
```

The SDK also supports partitioning. For more information, see [Partitioning and horizontal scaling in Azure Cosmos DB](/azure/cosmos-db/partition-data). To specify a field of a domain class to be partition key field, annotate it with `@PartitionKey`. Then, when you perform CRUD operations, specify your partition value.

The following example shows how to use the `@PartitionKey` annotation when performing CRUD operations.

```java
@Document(ru = "400")
public class Address {
    @Id
    String postalCode;

    @PartitionKey
    String city;

    String street;
    String country;
    String phoneNumber;

    ...
}

class AddressService {

    @Autowired
    AddressRepository repository;

    final Address newAddress = new Address("12345", "Seattle");

    // There's no need to specify a partition key in the save operation.
    repository.save(updatedAddress);

    // Provide a partition key when performing a find-by-id operation.
    final Optional<Address> addressById = repository.findById("12345", new PartitionKey("city"));

    final Address foundAddress = addressById.get();

    // Provide a partition key when performing a delete-by-id operation.
    repository.deleteById(foundAddress.getPostalCode(), new PartitionKey(foundAddress.getCity())); 
}
```

The SDK also supports Spring Data custom query find operations, such as `findByAFieldAndBField`. For more information, see [Defining Query Methods](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.query-methods.details) in the Spring documentation.

## Best practices

The following sections describe best practices when using the SDK.

### Configuring the application

Use the following steps to configure the application:

1. Extend the `AbstractCosmosConfiguration` class to set up the application's configuration (Cosmos DB key, URL, database name, and so on).
1. Add the `@Configuration` annotation.
1. Depending on your repository usage, add one or both of the `@EnableCosmosRepositories` and `@EnableReactiveCosmosRepositories` annotations.

The `CosmosKeyCredential` feature enables you to rotate keys on the fly. You can switch keys using the `switchToSecondaryKey` method.

The following example code shows an application configuration and demonstrates the use of `switchToSecondaryKey`.

```java
@Configuration
@EnableCosmosRepositories
public class AppConfiguration extends AbstractCosmosConfiguration {

    @Value("${azure.cosmosdb.uri}")
    private String uri;

    @Value("${azure.cosmosdb.key}")
    private String key;

    @Value("${azure.cosmosdb.secondaryKey}")
    private String secondaryKey;

    @Value("${azure.cosmosdb.database}")
    private String dbName;

    @Value("${azure.cosmosdb.populateQueryMetrics}")
    private boolean populateQueryMetrics;

    private CosmosKeyCredential cosmosKeyCredential;

    @Bean
    public CosmosDBConfig getConfig() {
        this.cosmosKeyCredential = new CosmosKeyCredential(key);
        CosmosDbConfig cosmosdbConfig = CosmosDBConfig.builder(uri,
            this.cosmosKeyCredential, dbName).build();
        cosmosdbConfig.setPopulateQueryMetrics(populateQueryMetrics);
        cosmosdbConfig.setResponseDiagnosticsProcessor(new ResponseDiagnosticsProcessorImplementation());
        return cosmosdbConfig;
    }

    public void switchToSecondaryKey() {
        this.cosmosKeyCredential.key(secondaryKey);
    }
}
```

You can also customize the configuration to change the connection mode, maximum connection pool size, request timeout, and so on, as shown in the following example.

```java
public CosmosDBConfig getConfig() {

    this.cosmosKeyCredential = new CosmosKeyCredential(key);
    ConnectionPolicy customizedConnectionPolicy = new ConnectionPolicy();

    // Set the connection mode to Direct (TCP).
    customizedConnectionPolicy.setConnectionMode(ConnectionMode.DIRECT);

    // Set the maximum number of HTTP/TCP connections to 1000 per application.
    customizedConnectionPolicy.setMaxPoolSize(1000);

    // Set the request timeout to 10 seconds.
    customizedConnectionPolicy.requestTimeoutInMillis(10000);

    // Set the idle connection timeout to two minutes.
    customizedConnectionPolicy.idleConnectionTimeoutInMillis(120000);
    CosmosDBConfig cosmosDbConfig = CosmosDBConfig.builder(uri,   this.cosmosKeyCredential, dbName)
                                                  .connectionPolicy  (customizedConnectionPolic  y)
                                                  .build();
    return cosmosDbConfig;
}
```

### Response diagnostics and query metrics

Version 2.2.x of the Spring Data Cosmos DB SDK supports response diagnostics string and query metrics.

To enable query metrics, set the `populateQueryMetrics` flag to **true** in the `application.properties` file. Then, extend the `ResponseDiagnosticsProcessor` interface and implement the `processResponseDiagnostics` method to log the diagnostics information. Finally, pass an instance of your implementation to the `CosmosDbConfig.setResponseDiagnosticsProcessor` method. The following code shows an example implementation.

```java
@Configuration
@EnableCosmosRepositories
public class AppConfiguration extends AbstractCosmosConfiguration {

    ...

    @Value("${azure.cosmosdb.populateQueryMetrics}")
    private boolean populateQueryMetrics;

    private static class ResponseDiagnosticsProcessorImplementation implements ResponseDiagnosticsProcessor {

        @Override
        public void processResponseDiagnostics(@Nullable ResponseDiagnostics responseDiagnostics) {
            log.info("Response Diagnostics {}", responseDiagnostics);
        }
    }

    @Bean
    public CosmosDBConfig getConfig() {
        this.cosmosKeyCredential = new CosmosKeyCredential(key);
        CosmosDbConfig cosmosdbConfig = CosmosDBConfig.builder(uri, this.cosmosKeyCredential, dbName).build();
        cosmosdbConfig.setPopulateQueryMetrics(populateQueryMetrics);
        cosmosdbConfig.setResponseDiagnosticsProcessor(new ResponseDiagnosticsProcessorImplementation());
        return cosmosdbConfig;
    }
}
```

### Pagination and sorting

The Spring Data Cosmos DB SDK supports Spring Data paging and sorting. For more information, see [Special parameter handling](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.special-parameters) in the Spring documentation.

Based on the available request units (RUs) on the database account, Cosmos DB can return documents less than or equal to the requested size. For more information, see [Request Units in Azure Cosmos DB](/azure/cosmos-db/request-units).

You shouldn't rely on the `totalPageSize` value because the number of returned documents in each iteration is variable. Instead, you should iterate over a `Pageable` object as shown in the following example.

```java
final Sort sort = Sort.by(Sort.Direction.DESC, "name");
final CosmosPageRequest pageRequest = new CosmosPageRequest(0, pageSize,   null, sort);
Page<T> page = tRepository.findAll(pageRequest);
List<T> pageContent = page.getContent();
while(page.hasNext()) {
    Pageable nextPageable = page.nextPageable();
    page = repository.findAll(nextPageable);
    pageContent = page.getContent();
}
```

## Common issues and workarounds

The following sections describe issues you should be aware of when using the Spring Data Cosmos DB SDK.

### Getting the correct Cosmos DB configuration

Extending the `AbstractCosmosConfiguration` interface can be tricky because of various annotations and configurations present in the class. The most common issue is with the `Enable Repositories` annotation.

If the repositories extend `CosmosRepository`, be sure to add the annotation `@EnableCosmosRepositories`. If the repositories extend `ReactiveCosmosRepository`, be sure to add the annotation `@EnableReactiveCosmosRepositories`. The following example demonstrates the use of these annotations.

```java
@Configuration
@PropertySource(value = {"classpath:application.properties"})
@EnableCosmosRepositories
@EnableReactiveCosmosRepositories
public class TestRepositoryConfig extends AbstractCosmosConfiguration {
    ...
}
```

While creating or customizing a `CosmosDBConfig` bean, be sure to use the `CosmosKeyCredential` object instead of using the key directly.

The `CosmosKeyCredential` feature enables you to rotate keys on the fly. You can switch keys using the `switchToSecondaryKey` method.

The `CosmosKeyCredential` should be a singleton object because the Cosmos DB SDK uses the same object internally to detect changes in the key value inside this object.

### Custom query execution

The query annotation feature is not yet supported by the Spring Data Cosmos DB SDK. Until then, you can execute custom and complex queries directly on the `cosmosClient` bean exposed by the Spring application context.

The following code shows a simple example of how to execute offset and limit queries using the `cosmosClient` bean.

```java
final FeedOptions feedOptions = new FeedOptions();

// Enable cross-partition queries.
feedOptions.enableCrossPartitionQuery(true);

// Set the page size.
feedOptions.maxItemCount(20);

// Set the number of parallel operations on the client-side SDK when executing parallel queries.
feedOptions.maxDegreeOfParallelism(2);

// Populate query metrics from Cosmos DB.
feedOptions.populateQueryMetrics(true);

final String query = "SELECT * from c OFFSET " + skipCount + " LIMIT " + takeCount;

final CosmosClient cosmosClient = applicationContext.getBean(CosmosClient.class);

Flux<FeedResponse<CosmosItemProperties>> feedResponseFlux =
    cosmosClient.getDatabase(databaseId)
                .getContainer(collectionId)
                .queryItems(query, feedOptions);
    feedResponseFlux.subscribeOn(Schedulers.parallel())
                    .flatMap(feedResponse -> {
                        List<CosmosItemProperties> results =
                        feedResponseFlux.results();
                        log.info("Results are {}", results);
                        return feedResponse;
                    })
                    .subscribe();
```

### Enable diagnostics and query metrics

When debugging, it's helpful to have the response diagnostics string and query metrics from the Cosmos DB SDK. The Cosmos DB SDK logs the response diagnostics string on the client side. The back end logs the query metrics and provides them to the Cosmos DB SDK.

The `ResponseDiagnosticsProcessor.processResponseDiagnostics` method gets called after every API call in the Spring Data Cosmos DB SDK. Therefore, it's important that your implementation ensures high performance by being bug-free and avoiding complexity. For example, you shouldn't log the complete set of diagnostics information in this method because the amount of information involved would create a significant performance cost. You should also use the `Debug` logging level to avoid affecting the application performance.

The following code shows an example of how to implement the `ResponseDiagnosticsProcessor` interface.

```java
private static class ResponseDiagnosticsProcessorImplementation implements ResponseDiagnosticsProcessor {

    @Override
    public void processResponseDiagnostics(@Nullable ResponseDiagnostics responseDiagnostics) {

        // To log everything:
        if (log.isDebugEnabled()) {
            log.debug("Response diagnostics {}", responseDiagnostics);
        }

        // To log Cosmos DB response diagnostics:
        if (responseDiagnostics != null && log.isDebugEnabled()) {
            CosmosResponseDiagnostics cosmosResponseDiagnostics = responseDiagnostics.getCosmosResponseDiagnostics();
            log.debug("Cosmos DB response diagnostics {}", cosmosResponseDiagnostics);
        }

        // To log just the request latency:
        if (responseDiagnostics != null && log.isDebugEnabled()) {
            CosmosResponseDiagnostics cosmosResponseDiagnostics = responseDiagnostics.getCosmosResponseDiagnostics();
            log.debug("Request latency {}", cosmosResponseDiagnostics.requestLatency());
        }

        // To log query metrics:
        if (responseDiagnostics != null && log.isDebugEnabled()) {
            FeedResponseDiagnostics feedResponseDiagnostics =
                responseDiagnostics.getFeedResponseDiagnostics();
            log.debug("Query metrics {}", feedResponseDiagnostics);
        }
    }
}
```

## How to troubleshoot

The following sections describe ways of troubleshooting common issues.

### Connection issues

If you experience connection issues, be sure all the required annotations in the configuration class are present and correct, as described in the [Getting the correct Cosmos DB configuration](#getting-the-correct-cosmos-db-configuration) section.

### API exceptions

Version 2.2.1 of the Spring Data Cosmos DB SDK provides the following improvements to exception handling:

- All the APIs throw `CosmosDBAccessException`, which exposes a `cosmosClientException` field through a getter.
- The Cosmos DB SDK throws `CosmosClientException`, which you can use to implement any retry logic on the client-side.
- Common exceptions to retry are ones with the messages `Resource already exists`, `Request rate too large`, `Request timeout exception`, and so on.

### API or query slowness

If you experience high latencies on APIs or query executions, try logging diagnostics strings and query metrics as described in the [Enable Diagnostics and Query Metrics](#enable-diagnostics-and-query-metrics) section. Check for CPU usage, network bandwidth, and I/O disk space, which can be the root causes of client-side slowness.