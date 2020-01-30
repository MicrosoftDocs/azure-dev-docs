---
title: Spring Data Azure Cosmos DB developer's guide
description: This guide describes what you should be aware of when you use the Spring Data Azure Cosmos DB SDK.
author: kushagraThapar
ms.author: kuthapar
ms.topic: conceptual
ms.date: 1/9/2019
---

# Spring Data Azure Cosmos DB developer's guide

[Spring Data for Azure Cosmos DB](https://github.com/microsoft/spring-data-cosmosdb) is based on the Spring Data framework and provides initial Spring Data support for [Azure Cosmos DB](/azure/cosmos-db/introduction) using the SQL API. Azure Cosmos DB is a globally distributed database service that allows developers to work with data using a variety of standard APIs, such as SQL, MongoDB, Cassandra, Graph, and Table. Currently, Spring Data for Azure Cosmos DB supports only the SQL API, but the other APIs are planned.

This topic covers the features of the Spring Data Cosmos DB SDK and describes common issues, workarounds, and diagnostic steps.

Start with this list:

- Review the [available features](#available-features), and follow the [best practices](#best-practices).
- Go through [Common issues and workarounds](#common-issues-and-workarounds) section in this article.
- Take a look at [how to troubleshoot](#how-to-troubleshoot) section and troubleshoot the problem.
- Look at the SDK, which is available [open source on GitHub](https://github.com/microsoft/spring-data-cosmosdb). It has an [issues section](https://github.com/microsoft/spring-data-cosmosdb/issues), which is actively monitored. Check to see if any similar issue with a workaround has already been filed.
- Refer to [releases](https://github.com/microsoft/spring-data-cosmosdb/releases) to make sure if the problem is already a fixed bug in another version.
- If you don't find a solution, then file a [GitHub issue](https://github.com/microsoft/spring-data-cosmosdb/issues).

## Available features

The following sections describe the features currently available.

### CrudRepository and ReactiveCrudRepository support

Spring Data supports both `CrudRepository` (`CosmosRepository`) and `ReactiveCrudRepository` (`ReactiveCosmosRepository`) API implementations.

```java
//  To extend CosmosRepository
@Repository
public interface SampleRepository extends CosmosRepository<SampleEntity, String> {
    List<SampleEntity> findByName(String name);
}

//  To extend ReactiveCosmosRepository
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

You can define entities by adding the `@Document` annotation and specifying properties related to the collection, such as the collection name, request units, time to live, and auto-create collection flag.

There are two ways to map a field in a domain class to the `id` field of an Azure Cosmos DB document:

- Annotate the field with `@Id`.
- Set the name of the field to `id`.

The following code shows an example using `@Id`.

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

- Custom collection Name.
    By default, the collection name will be the class name of the user-domain class. To customize it, add the `@Document(collection="myCustomCollectionName")` annotation to the domain class. The collection field also supports SpEL expressions (for example, `collection = "${dynamic.collection.name}"` or `collection = "#{@someBean.getCollectionName()}"`) in order to provide collection names programmatically via configuration properties.
- Custom IndexingPolicy
    By default, `IndexingPolicy` will be set by the Azure service. To customize it, add the annotation `@DocumentIndexingPolicy` to the domain class. This annotation has four attributes to customize:

  ```java
  boolean automatic;     // Indicates whether the indexing policy is automatic.
  IndexingMode mode;     // The indexing policy mode; the options are Consistent, Lazy, or None.
  String[] includePaths; // Included paths for indexing.
  String[] excludePaths; // Excluded paths for indexing.
  ```

- Supports [Azure Cosmos DB partition](/azure/cosmos-db/partition-data). To specify a field of domain class to be partition key field, just annotate it with `@PartitionKey`. When you do CRUD operation, pls specify your partition value. For more sample on partition CRUD, pls refer to [test here](https://github.com/microsoft/spring-data-cosmosdb/blob/master/src/test/java/com/microsoft/azure/spring/data/cosmosdb/repository/integration/AddressRepositoryIT.java)
- Supports [Spring Data custom query](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.query-methods.details) find operation, e.g., `findByAFieldAndBField`

## Best practices

The following sections describe best practices when using the SDK.

### Configuring the application

- Extend `AbstractCosmosConfiguration` to set up the application's configuration (Cosmosdb key, url, database name, etc.)
- Should be annotated with `@Configuration` annotation.
- Depending upon repository usage, specify `@EnableCosmosRepositories` or `@EnableReactiveCosmosRepositories` annotation.
- Both of these annotations can be used simultaneously as well.
- CosmosKeyCredential feature provides capability to rotate keys on the fly. You can switch keys using `switchToSecondaryKey()`, as shown in the following example:

  ```java
  @Configuration
  @EnableCosmosRepositories
  @Slf4j
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
  
      public CosmosDBConfig getConfig() {
          this.cosmosKeyCredential = new CosmosKeyCredential(key);
          CosmosDbConfig cosmosdbConfig = CosmosDBConfig.builder(uri,
              this.cosmosKeyCredential, dbName).build();
          cosmosdbConfig.setPopulateQueryMetrics(populateQueryMetrics);
          cosmosdbConfig.setResponseDiagnosticsProcessor(new   ResponseDiagnosticsProcessorImplementation());
          return cosmosdbConfig;
      }
  
      public void switchToSecondaryKey() {
          this.cosmosKeyCredential.key(secondaryKey);
      }
  }
  ```

- Customizing configuration to tweak connection mode, max connection pool size, request timeout, etc.

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

- Spring-data-cosmosdb SDK v2.2.x supports Response Diagnostics String and Query Metrics.
- Set `populateQueryMetrics` flag to true in application.properties to enable query metrics.
- In addition to setting the flag, implement `ResponseDiagnosticsProcessor` to log diagnostics information, as shown in the following example.

  ```java
  @Configuration
  @EnableCosmosRepositories
  @Slf4j
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
  }
  ```

### Pagination and sorting

The spring-data-cosmosdb SDK supports [Spring Data paging and sorting](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.special-parameters). 

Based on available RUs on the database account, Cosmos DB can return documents less than or equal to the requested size.

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

- All the APIs return `CosmosDBAccessException`, which exposes `cosmosClientException` through getter.
- The Cosmos DB SDK throws `CosmosClientException`, which you can use to implement any retriable logic on the client-side.
- Common retriable exceptions are `Resource already exists`, `Request rate too large`, `Request timeout exception`, etc.

### API or query slowness

If you experience high latencies on APIs or Query executions, try logging diagnostics strings and query metrics. Refer to [Enable Diagnostics and Query Metrics](#enable-diagnostics-and-query-metrics) to enable and log diagnostics strings and query metrics. Check for CPU usage, network bandwidth, and I/O disk space, which can be the root causes of client-side slowness.

### Bug fixes

Refer to [releases](https://github.com/microsoft/spring-data-cosmosdb/releases) to check for any bug fixes and new features.
