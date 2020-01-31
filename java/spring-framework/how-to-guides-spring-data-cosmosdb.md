---
title: Spring Data Azure Cosmos DB developer's guide
description: This guide describes what you should be aware of when you use the Spring Data Azure Cosmos DB SDK.
author: kushagraThapar
ms.author: kuthapar
ms.topic: conceptual
ms.date: 1/9/2019
---

# Spring Data Azure Cosmos DB developer's guide

This topic describes the features of [Spring Data Cosmos DB](https://github.com/microsoft/spring-data-cosmosdb) using the SQL API. This topic also includes guidance on common issues, workarounds, and diagnostic steps.

[Azure Cosmos DB](/azure/cosmos-db/introduction) is a globally distributed database service that allows developers to work with data using a variety of standard APIs. The Spring Data Cosmos DB SDK is based on the [Spring Data](https://spring.io/projects/spring-data) framework and provides integration with Azure Cosmos DB using the SQL API. You can find information on the support for other APIs in the following topics:

- [How to use Spring Data MongoDB API with Azure Cosmos DB](/azure/java/spring-framework/configure-spring-data-mongodb-with-cosmos-db)
- [How to use Spring Data Apache Cassandra API with Azure Cosmos DB](/azure/java/spring-framework/configure-spring-data-apache-cassandra-with-cosmos-db)
- [How to use the Spring Data Gremlin Starter with the Azure Cosmos DB SQL API](/azure/java/spring-framework/configure-spring-data-gremlin-java-app-with-cosmos-db)

The Spring Data Cosmos DB SDK is available as open source on GitHub in the [spring-data-cosmosdb](https://github.com/microsoft/spring-data-cosmosdb) repository. This repo has an active [Issues](https://github.com/microsoft/spring-data-cosmosdb/issues) list where you can file bugs or check for workarounds on issues that have already been filed. You can also check the [Releases](https://github.com/microsoft/spring-data-cosmosdb/releases) list to see if an issue has been fixed in a more recent version.

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

By default, the collection name will be the class name of the user-domain class. To customize it, add the `@Document(collection="myCustomCollectionName")` annotation to the domain class. The collection field also supports [Spring Expression Language](https://docs.spring.io/spring/docs/3.0.x/reference/expressions.html) (SpEL) expressions in order to provide collection names programmatically via configuration properties. For example, you can use expressions such as `collection = "${dynamic.collection.name}"` and `collection = "#{@someBean.getCollectionName()}"`.

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

    final Address newAddress = new Address("12345", "city");

    //  There's no need to specify a partition key in the save operation.
    repository.save(updatedAddress);

    //  Provide a partition key when performing a find-by-id operation.
    final Optional<Address> addressById = repository.findById("12345", new PartitionKey("city"));

    final Address foundAddress = addressById.get();

    //  Provide a partition key when performing a delete-by-id operation.
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

The `CosmosKeyCredential` feature provides the capability to rotate keys on the fly. You can switch keys using the `switchToSecondaryKey` method, as shown in the following example:

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

    //  Connection mode is Direct mode (TCP)
    customizedConnectionPolicy.setConnectionMode(ConnectionMode.DIRECT);

    //  Max http / tcp connections 1000 per application
    customizedConnectionPolicy.setMaxPoolSize(1000);

    //  Request timeout to 10 seconds.
    customizedConnectionPolicy.requestTimeoutInMillis(10000);

    //  Idle connection timeout to 2 minutes
    customizedConnectionPolicy.idleConnectionTimeoutInMillis(120000);
    CosmosDBConfig cosmosDbConfig = CosmosDBConfig.builder(uri,   this.cosmosKeyCredential, dbName)
                                                  .connectionPolicy  (customizedConnectionPolic  y)
                                                  .build();
    return cosmosDbConfig;
}
```

### Response diagnostics and query metrics

The Spring Data Cosmos DB SDK v2.2.x supports response diagnostics string and query metrics.

To enable query metrics, set the `populateQueryMetrics` flag to **true** in the `application.properties` file. Then, extend the `ResponseDiagnosticsProcessor` interface and implement the `processResponseDiagnostics` method to log the diagnostics information.

<!-- TODO need to rewrite the following sentence -->

Implemented `ResponseDiagnosticsProcessor` needs to be set in cosmosDbConfig using `setResponseDiagnosticsProcessor` API.

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

Based on available request units (RUs) on the database account, Cosmos DB can return documents less than or equal to the requested size. For more information, see [Request Units in Azure Cosmos DB](/azure/cosmos-db/request-units).

Due to the variable number of returned documents in every iteration, you should not rely on the `totalPageSize` value. Instead, you should iterate over `pageable` as shown in the following example.

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

### Getting correct CosmosDB configuration

Extending `AbstractCosmosConfiguration` can be tricky because of various annotations and configurations present in the class. The most common issue is with the `Enable Repositories` annotation.

If the repositories extend `CosmosRepository`, be sure to add the annotation `@EnableCosmosRepositories`.

If the repositories extend `ReactiveCosmosRepository`, be sure to add the annotation `@EnableReactiveCosmosRepositories`

The following code shows an example using these annotations.

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

The `CosmosKeyCredential` feature provides the capability to rotate keys on the fly. You can switch keys using the `switchToSecondaryKey` method.

The `CosmosKeyCredential` should be a singleton object because the Cosmos DB SDK uses the same object internally to detect changes in the key value inside this object.

### Custom query execution

The query annotation feature is not yet supported by spring-data-cosmosdb SDK. Until then, you can execute custom and complex queries directly on the `cosmosClient` bean exposed by the Spring application context.

The following code shows a simple example oF how to execute offset and limit queries using the `cosmosClient` bean.

```java
final FeedOptions feedOptions = new FeedOptions();

//  cross partition query
feedOptions.enableCrossPartitionQuery(true);

//  page size
feedOptions.maxItemCount(20);

//  number of parallel operations on client-side SDK when executing parallel queries
feedOptions.maxDegreeOfParallelism(2);

//  populate query metrics from cosmosdb
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

When debugging, it is helpful to have the diagnostics string and query metrics from the CosmosDB SDK.

Response diagnostics strings are logged by the CosmosDB SDK whereas query metrics are logged by the backend and are provided to CosmosDB SDK through `Query Response`.

The `ResponseDiagnosticsProcessor.processResponseDiagnostics` method gets called after every API call in the spring-data-cosmosdb SDK. Be sure to have a bug-free implementation of this interface. It is important to have a simple and optimal implementation because it can affect application performance if you implement it with too much complexity.

Logging complete diagnostics can be costly as it contains numerous information, therefore should not be logged for all API calls.

You should use the `Debug` logging level so it doesn't affect the application performance.

The following code shows an example of how to implement the `ResponseDiagnosticsProcessor` interface.

```java
private static class ResponseDiagnosticsProcessorImplementation implements ResponseDiagnosticsProcessor {

    @Override
    public void processResponseDiagnostics(@Nullable ResponseDiagnostics responseDiagnostics) {

        //  To log everything
        if (log.isDebugEnabled()) {
            log.debug("Response Diagnostics {}", responseDiagnostics);
        }

        //  To log cosmos response diagnostics
        if (responseDiagnostics != null && log.isDebugEnabled()) {
            CosmosResponseDiagnostics cosmosResponseDiagnostics = responseDiagnostics.getCosmosResponseDiagnostics();
            log.debug("Cosmos Response Diagnostics {}", cosmosResponseDiagnostics);
        }

        //  To log just request latency
        if (responseDiagnostics != null && log.isDebugEnabled()) {
            CosmosResponseDiagnostics cosmosResponseDiagnostics = responseDiagnostics.getCosmosResponseDiagnostics();
            log.debug("Request latency {}", cosmosResponseDiagnostics.requestLatency());
        }

        //  To log query metrics
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

If you experience connection issues, be sure all the required annotations in the configuration class are present and correct. Refer to [Getting correct CosmosDB configuration](#getting-correct-cosmosdb-configuration) to verify the annotations.

### API exceptions

Version 2.2.1 of the spring-data-cosmosdb SDK provides the following improvements to exception handling:

- All the APIs throw `CosmosDBAccessException`, which exposes the field `cosmosClientException` through the get method.
- The Cosmos DB SDK throws `CosmosClientException`, which you can use to implement any retry logic on the client-side.
- Common exceptions to retry are ones with the messages `Resource already exists`, `Request rate too large`, `Request timeout exception`, and so on.

### API or query slowness

If you experience high latencies on APIs or query executions, try logging diagnostics strings and query metrics as described in the [Enable Diagnostics and Query Metrics](#enable-diagnostics-and-query-metrics) section. Check for CPU usage, network bandwidth, and I/O disk space, which can be the root causes of client-side slowness.
